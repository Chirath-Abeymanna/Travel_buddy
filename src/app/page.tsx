'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const CARDS_PER_PAGE = 9;

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

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

function ListingCard({
  listing,
  showActions,
  token,
  onDeleted,
}: {
  listing: Listing;
  showActions: boolean;
  token: string | null;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/listings/${listing._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Deleted!', { description: 'Your experience has been removed.' });
        onDeleted(listing._id);
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

  return (
    <div className="glass dark:glass-dark rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full relative group">
      {/* Action buttons overlay — only on My Feed */}
      {showActions && (
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/listing/${listing._id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 text-primary rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Link>
                <button
            onClick={(e) => { e.preventDefault(); setConfirmOpen(true); }}
            disabled={deleting}
            className="bg-white dark:bg-slate-800 text-red-500 rounded-full p-2 shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
        </div>
      )}

      <Link href={`/listing/${listing._id}`} className="flex flex-col h-full">
        <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-800">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold shadow-lg text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700">
            {listing.price ? `$${listing.price}` : 'Free'}
          </div>
        </div>

        <div className="p-6 flex flex-col grow">
          <div className="flex items-center text-sm font-medium text-primary mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.location}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 grow">
            {listing.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {listing.author?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">
                  {listing.author?.firstName} {listing.author?.lastName}
                </p>
                <p className="text-xs text-slate-500">{timeAgo(listing.createdAt)}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex justify-center items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const [publicListings, setPublicListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<'public' | 'my'>('public');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [myLoading, setMyLoading] = useState(false);
  const { token, user, isRestored } = useAuth();

  // Reset page when tab or search changes
  useEffect(() => { setPage(1); }, [tab, search]);

  // Fetch public listings — no auth required
  useEffect(() => {
    if (!isRestored) return;
    const fetchPublic = async () => {
      try {
        const res = await fetch(`${SERVER}/api/listings`);
        if (res.ok) setPublicListings(await res.json());
      } catch (err) {
        console.error('Failed to fetch public listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublic();
  }, [isRestored]);

  // Fetch My Feed when tab switches or user logs in
  useEffect(() => {
    if (tab !== 'my' || !token) return;
    const fetchMy = async () => {
      setMyLoading(true);
      try {
        const res = await fetch(`${SERVER}/api/listings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setMyListings(await res.json());
      } catch (err) {
        console.error('Failed to fetch my listings:', err);
      } finally {
        setMyLoading(false);
      }
    };
    fetchMy();
  }, [tab, token]);

  const handleDeleted = (id: string) => {
    setMyListings((prev) => prev.filter((l) => l._id !== id));
    setPublicListings((prev) => prev.filter((l) => l._id !== id));
    setPage(1); // reset to first page after delete
  };

  if (loading) return <SplashScreen />;

  const activeListings = tab === 'public' ? publicListings : myListings;
  const showActions = tab === 'my';

  const filtered = search.trim()
    ? activeListings.filter((l) => {
        const q = search.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
        );
      })
    : activeListings;

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero header */}
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Discover Extraordinary <br />
          <span className="text-primary">Local Experiences</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore the world through the eyes of locals. From pristine hidden beaches to exclusive culinary tours.
        </p>
      </div>

      {/* Feed tabs — only shown when logged in */}
      {user && (
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-full gap-1">
            <button
              onClick={() => setTab('public')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === 'public'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
               Public Feed
            </button>
            <button
              onClick={() => setTab('my')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === 'my'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
               My Feed
            </button>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location or description…"
          className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* My Feed loading state */}
      {myLoading ? (
        <SplashScreen />
      ) : paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                showActions={showActions}
                token={token}
                onDeleted={handleDeleted}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                    p === page
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <MapPin className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
            {tab === 'my' ? "You haven't posted anything yet" : 'No experiences found'}
          </h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {tab === 'my'
              ? 'Share your first travel experience with the community.'
              : 'Be the first to share an amazing travel experience.'}
          </p>
          {user && (
            <Link href="/create" className="inline-block mt-6">
              <Button className="rounded-full px-6 py-5">Add Experience</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
