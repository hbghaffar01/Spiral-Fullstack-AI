import { useCallback, useEffect, useState } from "react";
import { SearchItem, SearchResponse } from "@/lib/types";
import { useDebounce } from "./useDebounce";
import { api } from "@/lib/api";

interface UseSearchOptions {
  debounceDelay?: number;
}

export function useSearch({ debounceDelay = 250 }: UseSearchOptions = {}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, debounceDelay);

  const search = useCallback(async (searchQuery: string, searchCategory: string) => {
    if (!searchQuery.trim() && !searchCategory) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await api.search({
        query: searchQuery,
        category: searchCategory,
        signal: controller.signal,
      });
      
      setResults(data.results);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      
      setError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred during search"
      );
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const performSearch = async () => {
      cleanup = await search(debouncedQuery, category);
    };
    
    performSearch();
    
    return () => cleanup?.();
  }, [debouncedQuery, category, search]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    isLoading,
    error,
    showNoResults: (query.trim() || category) && !isLoading && !error && !results.length,
  };
}
