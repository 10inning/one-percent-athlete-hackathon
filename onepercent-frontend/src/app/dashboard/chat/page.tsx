// app/dashboard/chat/page.tsx
'use client';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <ChatInterface />
    </div>
  );
}