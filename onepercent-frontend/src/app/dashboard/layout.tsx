'use client';

import { useAuth } from '@/store/userAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MessageSquare, Settings, LogOut, Cpu } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home/login page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md flex flex-col">
        <div className="p-8 flex items-center space-x-4">
          {/* User Image */}
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/029/872/599/small/illustration-of-people-running-in-solid-color-use-for-exercising-of-athletics-logo-vector.jpg"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow"
            alt="User Avatar"
          />
          {/* Welcome Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.displayName ? `Hello, ${user.displayName.split(' ')[0]}` : 'Hello, Hoyath'}
            </h2>
            <p className="text-sm text-gray-600">Athlete</p>
          </div>
        </div>

        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center px-6 py-3 rounded-lg transition hover:bg-gray-100 ${
                  pathname === '/dashboard' ? 'bg-gray-100' : ''
                }`}
              >
                <Home className="w-5 h-5 mr-3 text-blue-600" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/chat"
                className={`flex items-center px-6 py-3 rounded-lg transition hover:bg-gray-100 ${
                  pathname === '/dashboard/chat' ? 'bg-gray-100' : ''
                }`}
              >
                <Cpu className="w-5 h-5 mr-3 text-purple-600" />
                AI Companion
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className={`flex items-center px-6 py-3 rounded-lg transition hover:bg-gray-100 ${
                  pathname === '/dashboard/settings' ? 'bg-gray-100' : ''
                }`}
              >
                <Settings className="w-5 h-5 mr-3 text-gray-600" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-6">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 text-red-500 border border-red-500 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Banner */}
        <header className="bg-white text-gray-900 py-2 shadow-md relative overflow-hidden">
  <div className="max-w-screen-lg mx-auto text-center">
    {/* Title with Animation */}
    <h1 className="text-3xl font-extrabold tracking-wide relative z-10 animate-fade-in">
    ↿ Percent Athlete
    </h1>
    {/* Subheading with Subtle Motion */}
    <p className="mt-2 text-lg text-gray-500 relative z-10 animate-slide-in">
      "Unleash Your Potential with Every Step."
    </p>
    {/* User Info */}
    {user?.displayName && (
      <p className="mt-6 text-sm text-gray-400 relative z-10">
        Logged in as <strong className="text-gray-600">{user.displayName}</strong>
      </p>
    )}
  </div>

  {/* Animated Decorative Elements */}
  <div className="absolute inset-0 z-0">
    <div className="w-32 h-32 bg-blue-100 rounded-full blur-xl opacity-50 absolute top-10 left-20 animate-bounce-slow"></div>
    <div className="w-40 h-40 bg-purple-100 rounded-full blur-2xl opacity-50 absolute bottom-10 right-20 animate-bounce-slow delay-100"></div>
  </div>
</header>




        {/* Content */}
        <main className="flex-1 p-0 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
