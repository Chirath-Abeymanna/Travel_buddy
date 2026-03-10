'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = 'Delete Experience',
  description = 'Are you sure you want to delete this experience? This action cannot be undone.',
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className='border-gray-300'>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
