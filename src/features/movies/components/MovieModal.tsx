'use client';

import { useRouter } from 'next/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface MovieModalProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

export function MovieModal({ title, href, children }: MovieModalProps) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto px-4 sm:max-w-2xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
        {/* Plain <a> to bypass intercepting route and load the full detail page */}
        <a
          href={href}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          View full page
          <ExternalLinkIcon className="size-3.5" />
        </a>
      </DialogContent>
    </Dialog>
  );
}
