// ProfileSection.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/store/userAuth';
import { Edit3, LogOut } from 'lucide-react';

export default function ProfileSection() {
  const { user, logout } = useAuth();

  return (
    <div className="mt-auto p-4">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
          <img
            src={user?.photoURL || '/api/placeholder/80/80'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-base font-semibold">{user?.displayName || 'Athlete'}</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
        <div className="flex space-x-4 mt-3">
          <Link href="/dashboard/settings">
            <button className="text-gray-600 hover:text-black">
              <Edit3 size={18} />
            </button>
          </Link>
          <button
            className="text-gray-600 hover:text-black"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
