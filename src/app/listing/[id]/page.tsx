'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Clock, DollarSign, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
};

type Listing = {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  price?: number;
  author: { username: string, _id: string };
  createdAt: string;
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:5000/api/listings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        router.push('/');
      });
  }, [id, router]);

  if (loading || !listing) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </Link>

      <div className="glass dark:glass-dark rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-200 dark:bg-slate-800">
          <img 
            src={listing.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80'} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/20">
                <MapPin className="w-4 h-4 mr-1.5" />
                {listing.location}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full premium-gradient text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                <DollarSign className="w-4 h-4" />
                {listing.price ? listing.price : 'Free'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              {listing.title}
            </h1>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About this experience</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Hosted By</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {listing.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">{listing.author.username}</p>
                  <p className="text-sm text-slate-500 flex items-center mt-0.5">
                    <UserIcon className="w-3 h-3 mr-1" /> Host
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Details</h3>
               <div className="space-y-4">
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
    </div>
  );
}
