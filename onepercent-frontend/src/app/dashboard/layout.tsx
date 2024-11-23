'use client';
import { useAuth } from '@/store/userAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Home } from 'lucide-react';
import { useEffect } from 'react';
import ProfileSection from '@/components/layout/profileSection';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home/login page if not authenticated
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              pathname === '/dashboard' ? 'bg-gray-700' : ''
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link
            href="/dashboard/chat"
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              pathname.includes('/dashboard/chat') ? 'bg-gray-700' : ''
            }`}
          >
            <MessageSquare size={20} />
            <span>Chat</span>
          </Link>
        </nav>
        {/* Profile Section */}
        <ProfileSection />
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
