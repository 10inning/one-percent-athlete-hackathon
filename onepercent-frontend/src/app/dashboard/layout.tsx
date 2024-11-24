'use client';
import { useAuth } from '@/store/userAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Home, Settings, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import ProfileSection from '@/components/layout/profileSection';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth(); // Assuming you have a logout method
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home/login page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 flex items-center space-x-4">
        {/* User Image or Logo */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/029/872/599/small/illustration-of-people-running-in-solid-color-use-for-exercising-of-athletics-logo-vector.jpg"
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          alt="User Avatar"
        />
        {/* Text Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {user?.displayName
              ? `Welcome, ${user.displayName.split(" ")[0]}`
              : "Welcome, Athlete"}
          </h2>
          <p className="text-sm text-gray-500">Stay motivated, stay strong!</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul>
          <li>
            <Link
              href="/dashboard"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/chat"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              All You Need
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={logout}
        className="flex items-center px-6 py-3 text-red-600 hover:bg-red-100"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </aside>

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-white/80 via-blue-500/70 to-black/80 text-white text-center py-3 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to <span className="text-white">Athlete Edge</span>
        </h1>
        <p className="text-base mt-2 text-black/60">
          <em>Push beyond your limits. Achieve greatness.</em>
        </p>
        {user?.displayName && (
          <p className="mt-2 text-sm text-gray-200">
            Logged in as <strong>{user.displayName}</strong>
          </p>
        )}
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">{children}</main>
    </div>
  </div>
  );
}
