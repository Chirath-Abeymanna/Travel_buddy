'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Compass, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full z-50 bg-sky-50 border-b border-gray-300  transition-all duration-300 left-0 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black text-primary tracking-tight">Travel Buddy</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/create" className="hidden md:flex">
                  <Button variant="outline" className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add Experience</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-900">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold hidden md:block">{user.firstName} {user.lastName}</span>
                </div>
                <Button 
                  onClick={logout}
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="p-5 rounded-full cursor-pointer">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="p-5 rounded-full hover:bg-blue-600 cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
