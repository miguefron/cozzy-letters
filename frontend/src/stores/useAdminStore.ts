import { create } from "zustand";
import { apiFetch } from "@/lib/api";

export interface AdminLetterRecipient {
  displayName: string;
  email: string;
  isRead: boolean;
}

export interface AdminLetter {
  id: number;
  title: string;
  content: string;
  senderName: string;
  senderEmail: string;
  signature?: string;
  recipientCount: number;
  recipients: AdminLetterRecipient[];
  createdAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  displayName: string;
  role: string;
  hasPassword: boolean;
  createdAt: string;
}

interface AdminState {
  letters: AdminLetter[];
  users: AdminUser[];
  isLoadingLetters: boolean;
  isLoadingUsers: boolean;
  error: string | null;
  fetchLetters(): Promise<void>;
  fetchUsers(): Promise<void>;
  deleteLetter(id: number): Promise<void>;
  deleteUser(id: number): Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  letters: [],
  users: [],
  isLoadingLetters: false,
  isLoadingUsers: false,
  error: null,

  fetchLetters: async () => {
    set({ isLoadingLetters: true, error: null });
    try {
      const res = await apiFetch("/admin/letters");
      if (!res.ok) throw new Error("Failed to fetch letters");
      const data = await res.json();
      set({ letters: data, isLoadingLetters: false });
    } catch (e) {
      set({
        isLoadingLetters: false,
        error: e instanceof Error ? e.message : "Failed to fetch letters",
      });
    }
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      const res = await apiFetch("/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      set({ users: data, isLoadingUsers: false });
    } catch (e) {
      set({
        isLoadingUsers: false,
        error: e instanceof Error ? e.message : "Failed to fetch users",
      });
    }
  },

  deleteLetter: async (id: number) => {
    try {
      const res = await apiFetch(`/admin/letters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete letter");
      set({ letters: get().letters.filter((l) => l.id !== id) });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to delete letter",
      });
    }
  },

  deleteUser: async (id: number) => {
    try {
      const res = await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      set({ users: get().users.filter((u) => u.id !== id) });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to delete user",
      });
    }
  },
}));
