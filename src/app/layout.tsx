import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WanderLuxe - Travel Experiences',
  description: 'Discover and share amazing local travel experiences globally.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
