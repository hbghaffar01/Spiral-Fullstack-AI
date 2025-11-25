export interface SearchItem {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  score?: number;
}

export interface SearchResponse {
  results: SearchItem[];
}

export interface ScrapeResult {
  title?: string | null;
  description?: string | null;
  h1?: string | null;
}

export interface ErrorResponse {
  error: string;
}

export type Category = {
  label: string;
  value: string;
};
