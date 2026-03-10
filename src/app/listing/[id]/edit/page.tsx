'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { MapPin, DollarSign, AlignLeft, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import SplashScreen from '@/components/SplashScreen';
import Link from 'next/link';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    imageUrl: '',
    description: '',
    price: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${SERVER}/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        // Ownership guard
        if (!user || data.author._id !== user._id) {
          toast.error('Not authorised', { description: "You don't own this listing." });
          router.push('/');
          return;
        }
        setFormData({
          title: data.title,
          location: data.location,
          imageUrl: data.imageUrl,
          description: data.description,
          price: data.price?.toString() ?? '',
        });
        setLoading(false);
      })
      .catch(() => router.push('/'));
  }, [id, token, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Image required', { description: 'Please upload an image.' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Updated!', { description: 'Your experience has been saved.' });
        router.push(`/listing/${id}`);
      } else {
        toast.error('Failed to save', { description: data.message });
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/listing/${id}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to listing
      </Link>

      <div className="glass dark:glass-dark rounded-3xl p-8 md:p-12 animate-fade-in-up border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            Edit Experience
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Update the details of your listing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Experience Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                min="0"
                step="0.01"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Experience Image
              </label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(base64) => setFormData((prev) => ({ ...prev, imageUrl: base64 }))}
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
            <Button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-8 py-6 rounded-xl text-base"
            >
              {saving ? 'Saving…' : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
