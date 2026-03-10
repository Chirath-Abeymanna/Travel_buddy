'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

type Listing = {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  price?: number;
  author: { username: string };
  createdAt: string;
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Discover Extraordinary <br />
          <span className="text-gradient">Local Experiences</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore the world through the eyes of locals. From pristine hidden beaches to exclusive culinary tours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing, i) => (
          <Link href={`/listing/${listing._id}`} key={listing._id} className="group">
            <div className="glass dark:glass-dark rounded-3xl overflow-hidden hover-bounce transition-all duration-300 flex flex-col h-full" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img 
                  src={listing.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80'} 
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold shadow-lg text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700">
                  ${listing.price || 'Free'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {listing.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">
                  {listing.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                      {listing.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">{listing.author?.username}</p>
                      <p className="text-xs text-slate-500">{timeAgo(listing.createdAt)}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex justify-center items-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600 dark:text-blue-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {listings.length === 0 && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <MapPin className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No experiences found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Be the first to share your amazing travel experience with the WandlerLuxe community.</p>
          <Link href="/create" className="inline-block mt-6 px-6 py-3 rounded-full font-medium text-white premium-gradient shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all">
            Create Listing
          </Link>
        </div>
      )}
    </div>
  );
}
