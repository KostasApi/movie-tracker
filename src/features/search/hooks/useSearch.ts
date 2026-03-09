'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useCallback } from 'react';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = searchParams.get('q') ?? '';

  const setQuery = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const trimmed = value.trim();
        if (trimmed) {
          router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        } else {
          router.push('/search');
        }
      }, 300);
    },
    [router],
  );

  return { query, setQuery };
}
