'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
  const { query, setQuery } = useSearch();

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search movies & TV shows..."
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
