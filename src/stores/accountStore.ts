import { createStore } from "zustand/vanilla";
import Cookies from "js-cookie";

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  image?: string;
  token: string;
  addedAt: string;
}

export type AccountState = {
  accounts: StoredAccount[];
  upsertAccount: (acc: StoredAccount) => void;
  removeAccount: (id: string) => void;
  getActiveAccount: () => StoredAccount | null;
};

// Kunci JWT di browser (F12 -> Application -> Local Storage)
const KEY = "_JaPa_accounts";

const loadAccounts = (): StoredAccount[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (a): a is StoredAccount =>
        !!a && typeof a.id === "string" && typeof a.email === "string" && typeof a.token === "string"
    );
  } catch {
    return [];
  }
};

const saveAccounts = (list: StoredAccount[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
};

// Menggunakan createStore vanilla sesuai dengan arsitektur PreferencesStore Anda
export const createAccountStore = (init?: Partial<AccountState>) =>
  createStore<AccountState>()((set, get) => ({
    accounts: init?.accounts ?? loadAccounts(),
    
    upsertAccount: (acc) =>
      set((state) => {
        const list = [...state.accounts];
        const idx = list.findIndex(
          (a) => a.id === acc.id || a.email.toLowerCase() === acc.email.toLowerCase()
        );
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...acc, addedAt: list[idx].addedAt || acc.addedAt };
        } else {
          list.push(acc);
        }
        saveAccounts(list);
        return { accounts: list };
      }),
      
    removeAccount: (id) =>
      set((state) => {
        const list = state.accounts.filter((a) => a.id !== id);
        saveAccounts(list);
        return { accounts: list };
      }),
      
    getActiveAccount: () => {
      const token = Cookies.get("_auth_token");
      if (!token) return null;
      return get().accounts.find((a) => a.token === token) ?? null;
    },
  }));