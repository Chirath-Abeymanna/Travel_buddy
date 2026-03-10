'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { ImagePlus, MapPin, DollarSign, AlignLeft, Send } from 'lucide-react';

export default function CreateListing() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    imageUrl: '',
    description: '',
    price: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.message || 'Failed to create listing');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass dark:glass-dark rounded-3xl p-8 md:p-12 animate-fade-in-up border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Post an Experience</h1>
          <p className="text-slate-500 dark:text-slate-400">Share your incredible journey or local expertise with the world.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g. Sunset Boat Tour in Bali"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-slate-400" /> Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g. Bali, Indonesia"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <DollarSign className="w-4 h-4 mr-1 text-slate-400" /> Price (USD)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="0.00 (Optional)"
                min="0"
                step="0.01"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <ImagePlus className="w-4 h-4 mr-1 text-slate-400" /> Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="https://example.com/beautiful-sunset.jpg"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <AlignLeft className="w-4 h-4 mr-1 text-slate-400" /> Description
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Describe what makes this experience special..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3.5 rounded-xl text-white font-medium premium-gradient hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Experience
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
