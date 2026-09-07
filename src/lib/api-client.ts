/**
 * Thin fetch wrapper for client components calling our own route handlers
 * under app/api. One place to keep the "parse JSON, throw on !ok" boilerplate
 * instead of repeating it in every component that used to call a server
 * action directly.
 */
export async function apiRequest<T>(
  url: string,
  init?: { method?: string; body?: unknown; formData?: FormData }
): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? (init?.body || init?.formData ? "POST" : "GET"),
    headers: init?.formData ? undefined : { "Content-Type": "application/json" },
    body: init?.formData ?? (init?.body !== undefined ? JSON.stringify(init.body) : undefined),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && typeof data === "object" && "error" in data && String(data.error)) || res.statusText;
    throw new Error(message);
  }
  return data as T;
}
