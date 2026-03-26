import { useEffect, useState } from 'react';
import { searchMemory, type MemorySearchResult } from '../services/memory.service';

export function useMemorySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MemorySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextResults = await searchMemory(query.trim(), { limit: 10 });
        if (!cancelled) {
          setResults(nextResults);
        }
      } catch (caught) {
        if (!cancelled) {
          setResults([]);
          setError(caught instanceof Error ? caught.message : 'Recherche memoire indisponible.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
