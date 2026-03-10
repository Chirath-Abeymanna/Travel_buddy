'use client';

import { useCallback, useState } from 'react';
import { ImagePlus, X, Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange('');
  };

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group h-48">
        <img
          src={value}
          alt="Upload preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <label className="cursor-pointer bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleRemove}
            className="bg-white/90 dark:bg-slate-800/90 text-red-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer
        ${dragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 hover:border-primary hover:bg-primary/5'
        }`}
    >
      <label className="flex flex-col items-center gap-3 cursor-pointer w-full h-full justify-center px-6">
        <div className={`p-3 rounded-full transition-colors ${dragging ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <ImagePlus className={`w-7 h-7 transition-colors ${dragging ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {dragging ? 'Drop your image here' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PNG, JPG, WEBP, GIF up to 10MB</p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
