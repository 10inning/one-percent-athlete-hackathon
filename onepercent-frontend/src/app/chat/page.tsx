'use client';
import { useAuth } from '@/store/userAuth';
import ChatInterface from '@/components/chat/ChatInterface';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-8rem)] p-6">
      <ChatInterface />
    </div>
  );
}
