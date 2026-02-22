import { create } from "zustand";
import { apiFetch } from "@/lib/api";

export interface AuthUser {
  email: string;
  displayName: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login(email: string, password: string): Promise<boolean>;
  register(email: string, password: string, displayName: string): Promise<boolean>;
  logout(): void;
  checkAuth(): Promise<void>;
  updateUser(user: AuthUser): void;
  clearError(): void;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth`;

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: loadFromStorage<string>("cl_token"),
  user: loadFromStorage<AuthUser>("cl_user"),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Invalid credentials");
      }

      const data = await res.json();
      const user: AuthUser = { email: data.email, displayName: data.displayName };

      if (typeof window !== "undefined") {
        localStorage.setItem("cl_token", JSON.stringify(data.token));
        localStorage.setItem("cl_user", JSON.stringify(user));
      }

      set({ token: data.token, user, isLoading: false });
      return true;
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : "Login failed" });
      return false;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Registration failed");
      }

      const data = await res.json();
      const user: AuthUser = { email: data.email, displayName: data.displayName };

      if (typeof window !== "undefined") {
        localStorage.setItem("cl_token", JSON.stringify(data.token));
        localStorage.setItem("cl_user", JSON.stringify(user));
      }

      set({ token: data.token, user, isLoading: false });
      return true;
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : "Registration failed" });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cl_token");
      localStorage.removeItem("cl_user");
    }
    set({ token: null, user: null, error: null });
  },

  checkAuth: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const res = await apiFetch("/auth/me");

      if (!res.ok) throw new Error("Session expired");

      const data = await res.json();
      const user: AuthUser = { email: data.email, displayName: data.displayName };

      if (typeof window !== "undefined") {
        localStorage.setItem("cl_user", JSON.stringify(user));
      }

      set({ user });
    } catch {
      // apiFetch already calls logout() and redirects on 401
    }
  },

  updateUser: (user: AuthUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cl_user", JSON.stringify(user));
    }
    set({ user });
  },

  clearError: () => set({ error: null }),
}));
