export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

export interface SearchQuery {
  q?: string;
  category?: string;
}

export interface SearchResponse {
  results: Item[];
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  title: string | null;
  description: string | null;
  h1: string | null;
}

export interface ErrorResponse {
  error: string;
}
