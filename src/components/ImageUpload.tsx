'use client';

import { useCallback, useState } from 'react';
import { ImagePlus, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface ImageUploadProps {
  value: string;           // the Cloudinary URL (or empty string)
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const uploadToCloudinary = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', { description: 'Please select an image file.' });
      return;
    }

    setUploading(true);

    // Convert file → base64 data URL, then send to backend
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const res = await fetch(`${SERVER}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (res.ok) {
          onChange(data.url);
          toast.success('Image uploaded!');
        } else {
          toast.error('Upload failed', { description: data.message });
        }
      } catch {
        toast.error('Upload failed', { description: 'Could not reach the server.' });
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      toast.error('Could not read the file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadToCloudinary(file);
  }, [token]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange('');
  };

  // Preview state — image already uploaded
  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group h-48">
        <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <label className="cursor-pointer bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-2">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Change'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="bg-white/90 dark:bg-slate-800/90 text-red-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-2 disabled:opacity-50"
          >
            <X className="w-4 h-4" /> Remove
          </button>
        </div>
      </div>
    );
  }

  // Drop zone
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all
        ${uploading ? 'border-primary bg-primary/5 cursor-wait' :
          dragging ? 'border-primary bg-primary/5 scale-[1.01] cursor-copy' :
          'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 hover:border-primary hover:bg-primary/5 cursor-pointer'
        }`}
    >
      <label className={`flex flex-col items-center gap-3 w-full h-full justify-center px-6 ${uploading ? 'cursor-wait' : 'cursor-pointer'}`}>
        <div className={`p-3 rounded-full transition-colors ${uploading || dragging ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
          {uploading
            ? <Loader2 className="w-7 h-7 text-primary animate-spin" />
            : <ImagePlus className={`w-7 h-7 transition-colors ${dragging ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
          }
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {uploading ? 'Uploading to Cloudinary…' : dragging ? 'Drop your image here' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PNG, JPG, WEBP, GIF — auto optimised</p>
        </div>
        {!uploading && (
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        )}
      </label>
    </div>
  );
}
