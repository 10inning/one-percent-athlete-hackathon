// src/components/providers/FirebaseProvider.tsx
'use client';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/store/userAuth';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, setLoading } = useAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get a fresh token on auth state change
        const token = await user.getIdToken(true);
        setUser(user);
        setToken(token);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth-token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setToken, setLoading]);

  return <>{children}</>;
}