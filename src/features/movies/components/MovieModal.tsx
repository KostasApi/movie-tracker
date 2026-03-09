'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface MovieModalProps {
  title: string;
  children: React.ReactNode;
}

export function MovieModal({ title, children }: MovieModalProps) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto px-4 sm:max-w-2xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
