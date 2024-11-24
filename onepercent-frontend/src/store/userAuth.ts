// src/store/userAuth.ts
import { create } from 'zustand';
import { User } from 'firebase/auth';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void; // Add a function to explicitly clear sessionId
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      sessionId: null,
      loading: true,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setSessionId: (sessionId) => set({ sessionId }),
      setLoading: (loading) => set({ loading }),
      clearSession: () => set({ sessionId: null }), // Clear sessionId explicitly
      logout: () =>
        set({ user: null, token: null, sessionId: null, loading: false }), // Clear all state
    }),
    {
      name: 'auth-storage', // Name of the persistent storage key
    }
  )
);
