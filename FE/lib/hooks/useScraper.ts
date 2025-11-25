import { useCallback, useState } from "react";
import { ScrapeResult } from "@/lib/types";
import { api } from "@/lib/api";

export function useScraper() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const scrape = useCallback(async (targetUrl?: string) => {
    const urlToScrape = (targetUrl ?? url).trim();
    
    if (!urlToScrape) {
      setError("URL is required");
      return;
    }

    setError(null);
    setResult(null);
    
    try {
      setIsLoading(true);
      const data = await api.scrape(urlToScrape);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred during scraping"
      );
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const reset = useCallback(() => {
    setUrl("");
    setError(null);
    setResult(null);
  }, []);

  return {
    url,
    setUrl,
    isLoading,
    error,
    result,
    scrape,
    reset,
    hasResult: !!result,
  };
}
