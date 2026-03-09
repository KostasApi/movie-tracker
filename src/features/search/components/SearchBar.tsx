'use client';

import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState(query);

  // Sync input when URL query changes (e.g. navigating home clears ?q)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search movies & TV shows..."
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
