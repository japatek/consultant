"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Small client-side cache for the bits of profile data the nav shows
 * (name + avatar). It is intentionally NOT the source of truth — the
 * database/session still owns that — it just lets `NavUser` / `UserMenu`
 * paint instantly from a browser-side cache instead of waiting on a
 * server round trip, and lets every mounted instance update the moment
 * the profile editor saves a change.
 */
export type CachedProfile = {
  email: string;
  name: string | null;
  image: string | null;
};

const STORAGE_KEY = "app:profile-cache";

let cache: CachedProfile | null | undefined = undefined;

function readStorage(): CachedProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === "string") {
      return parsed as CachedProfile;
    }
  } catch {
    // Corrupted value or storage unavailable (e.g. private browsing) —
    // fall back to whatever the caller passes in.
  }
  return null;
}

function getSnapshot(): CachedProfile | null {
  if (cache === undefined) {
    cache = readStorage();
  }
  return cache;
}

function getServerSnapshot(): CachedProfile | null {
  return null;
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key === STORAGE_KEY) {
    cache = readStorage();
    notify();
  }
}

function subscribe(listener: () => void): () => void {
  const isFirstListener = listeners.size === 0;
  listeners.add(listener);
  if (isFirstListener) {
    window.addEventListener("storage", handleStorageEvent);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

/** Call this right after a successful profile save (see `ProfileEditor`). */
export function setCachedProfile(profile: CachedProfile) {
  cache = profile;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Quota / private-mode errors: the in-memory cache still updates this
    // tab even if we can't persist it.
  }
  notify();
}

/** Call this on sign-out so the next person on this browser starts clean. */
export function clearCachedProfile() {
  cache = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  notify();
}

/**
 * Returns the cached name/image when available, otherwise the fallback
 * values passed in (from the session-derived prop). Seeds the cache the
 * first time it's empty, but — importantly — never overwrites an
 * existing cache just because the fallback is stale, so an in-flight
 * avatar update can't be clobbered by a slower server round trip
 * catching up.
 *
 * Takes primitives rather than a single object so the effect below can
 * depend on the actual values instead of an object reference that's
 * re-created on every parent render.
 */
export function useProfileCache(
  fallbackEmail: string,
  fallbackName: string | null,
  fallbackImage: string | null
): CachedProfile {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!snapshot) {
      setCachedProfile({ email: fallbackEmail, name: fallbackName, image: fallbackImage });
    }
  }, [snapshot, fallbackEmail, fallbackName, fallbackImage]);

  return (
    snapshot ?? { email: fallbackEmail, name: fallbackName, image: fallbackImage }
  );
}
