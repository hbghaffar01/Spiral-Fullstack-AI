import { SearchResponse, ScrapeResult, ErrorResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = (data as ErrorResponse)?.error ?? 
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  async search({
    query,
    category,
    signal,
  }: {
    query: string;
    category?: string;
    signal?: AbortSignal;
  }): Promise<SearchResponse> {
    const params = new URLSearchParams();
    
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);

    return this.request<SearchResponse>(
      `/api/search?${params.toString()}`,
      { signal }
    );
  }

  async scrape(url: string): Promise<ScrapeResult> {
    return this.request<ScrapeResult>("/api/scrape", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}

export const api = new ApiClient(API_BASE);
