'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Compass, LogOut, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full z-50 glass dark:glass-dark transition-all duration-300 left-0 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gradient tracking-tight">WanderLuxe</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/create" 
                  className="hidden md:flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Create Listing</span>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-900">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold hidden md:block">{user.username}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 rounded-full font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-full font-medium text-white premium-gradient shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
