"use client";

import { useSearch } from "@/lib/hooks/useSearch";
import { SEARCH_CATEGORIES, UI_CONFIG } from "@/lib/constants";
import { SearchItem } from "@/lib/types";

export function SearchUI() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    results,
    isLoading,
    error,
    hasResults,
    showNoResults,
  } = useSearch({ debounceDelay: UI_CONFIG.debounceDelay });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <SearchHeader />
      <SearchForm
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />
      <SearchStatus
        isLoading={isLoading}
        error={error}
        resultsCount={results.length}
        hasQuery={!!query.trim() || !!category}
      />
      <SearchResults results={results} showNoResults={showNoResults} />
    </div>
  );
}

function SearchHeader() {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">Task A: Search</h2>
        <p className="text-xs text-slate-400">
          Query an in-memory JSON dataset with lightweight ranking and category filters.
        </p>
      </div>
    </div>
  );
}

interface SearchFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

function SearchForm({ query, onQueryChange, category, onCategoryChange }: SearchFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex-1 text-xs font-medium text-slate-200">
          Search query
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search for agents, dashboards, vector tools..."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
        <label className="text-xs font-medium text-slate-200 sm:w-48">
          Category
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          >
            {SEARCH_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

interface SearchStatusProps {
  isLoading: boolean;
  error: string | null;
  resultsCount: number;
  hasQuery: boolean;
}

function SearchStatus({ isLoading, error, resultsCount, hasQuery }: SearchStatusProps) {
  const getStatusText = () => {
    if (isLoading) return "Searching…";
    if (resultsCount > 0) return `${resultsCount} result${resultsCount === 1 ? "" : "s"}`;
    if (hasQuery) return "No results";
    return "Type to start searching";
  };

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
      <span>{getStatusText()}</span>
      {error && <span className="text-rose-400">{error}</span>}
    </div>
  );
}

interface SearchResultsProps {
  results: SearchItem[];
  showNoResults: boolean;
}

function SearchResults({ results, showNoResults }: SearchResultsProps) {
  return (
    <div className="mt-4 space-y-3">
      {results.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
      {showNoResults && <NoResultsMessage />}
    </div>
  );
}

function SearchResultCard({ item }: { item: SearchItem }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-emerald-500/60 hover:bg-slate-900">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{item.title}</h3>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
          {item.category}
        </span>
      </div>
      <p className="text-xs text-slate-300">{item.description}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-200"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
        {item.content}
      </p>
    </article>
  );
}

function NoResultsMessage() {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 p-4 text-xs text-slate-300">
      No matches found for the current query and filters.
    </div>
  );
}
