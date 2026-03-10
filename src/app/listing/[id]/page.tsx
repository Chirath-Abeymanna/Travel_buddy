'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Clock, DollarSign, User as UserIcon, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

type Listing = {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  price?: number;
  author: { firstName: string; lastName: string; _id: string };
  createdAt: string;
};

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const { token, user } = useAuth();

  useEffect(() => {
    fetch(`${SERVER}/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => router.push('/'));
  }, [id, router]);

  const isOwner = user && listing && listing.author._id === user._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Deleted!', { description: 'Your experience has been removed.' });
        router.push('/');
      } else {
        const d = await res.json();
        toast.error('Delete failed', { description: d.message });
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading || !listing) return <SplashScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Link>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2">
            <Link href={`/listing/${id}/edit`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white text-sm font-medium transition-all">
                <Pencil className="w-4 h-4" /> Edit
              </button>
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <div className="glass dark:glass-dark rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-200 dark:bg-slate-800">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/20">
                <MapPin className="w-4 h-4 mr-1.5" /> {listing.location}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                <DollarSign className="w-4 h-4" /> {listing.price ?? 'Free'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">{listing.title}</h1>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About this experience</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Hosted By</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold shadow-md">
                  {listing.author.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    {listing.author.firstName} {listing.author.lastName}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center mt-0.5">
                    <UserIcon className="w-3 h-3 mr-1" /> Host
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Details</h3>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Posted On</p>
                  <p className="text-sm text-slate-500">{formatDate(listing.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
