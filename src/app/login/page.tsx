'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Account created!', { description: 'You can now log in with your new account.' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success('Welcome back!', { description: `Logged in as ${data.user.firstName} ${data.user.lastName}` });
        router.push('/');
      } else {
        toast.error('Login failed', { description: data.message || 'Invalid credentials.' });
      }
    } catch (err) {
      toast.error('Something went wrong', { description: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass dark:glass-dark rounded-3xl p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400">Log in to discover experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="Enter your password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-xl shadow-lg shadow-orange-500/25 text-base"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary dark:text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
