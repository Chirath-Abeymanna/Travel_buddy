'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'At least one number', test: (p: string) => /\d/.test(p) },
  { label: 'At least one symbol', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  { label: 'At least one uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
];

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordStrength = passwordRules.filter(r => r.test(password)).length;

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-400';
    if (passwordStrength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please make sure both password fields are identical.' });
      setLoading(false);
      return;
    }

    const failedRules = passwordRules.filter(r => !r.test(password));
    if (failedRules.length > 0) {
      toast.error('Password too weak', { description: `Must include: ${failedRules.map(r => r.label.toLowerCase()).join(', ')}` });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Account created!', { description: 'You can now log in with your new credentials.' });
        router.push('/login?registered=true');
      } else {
        toast.error('Registration failed', { description: data.message || 'Please check your details and try again.' });
      }
    } catch (err) {
      toast.error('Something went wrong', { description: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass dark:glass-dark rounded-3xl p-8 animate-fade-in-up border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Join Travel Buddy</h1>
          <p className="text-slate-500 dark:text-slate-400">Create an account to share experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="First name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Last name"
              />
            </div>
          </div>
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Create a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor() : 'bg-slate-200 dark:bg-slate-700'}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  passwordStrength <= 1 ? 'text-red-500' :
                  passwordStrength === 2 ? 'text-orange-400' :
                  passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {getStrengthLabel()}
                </p>
                <ul className="space-y-0.5">
                  {passwordRules.map(rule => (
                    <li key={rule.label} className={`text-xs flex items-center gap-1.5 ${rule.test(password) ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      <span>{rule.test(password) ? '✓' : '○'}</span>
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-xl text-base"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary dark:text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
