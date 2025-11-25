"use client";

import { FormEvent } from "react";
import { useScraper } from "@/lib/hooks/useScraper";

export function ScraperUI() {
  const { url, setUrl, isLoading, error, result, scrape } = useScraper();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await scrape();
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex h-full flex-col">
        <ScraperHeader />
        <ScraperForm
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <ScraperResults error={error} result={result} />
      </div>
    </div>
  );
}

function ScraperHeader() {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          Task B: Micro Scraper
        </h2>
        <p className="text-xs text-slate-400">
          Fetch the title, meta description, and first h1 from a given URL.
        </p>
      </div>
    </div>
  );
}

interface ScraperFormProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

function ScraperForm({ url, onUrlChange, onSubmit, isLoading }: ScraperFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="text-xs font-medium text-slate-200">
        Target URL
        <input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Scraping…" : "Run scraper"}
      </button>
    </form>
  );
}

interface ScraperResultsProps {
  error: string | null;
  result: { title?: string | null; description?: string | null; h1?: string | null } | null;
}

function ScraperResults({ error, result }: ScraperResultsProps) {
  return (
    <div className="mt-4 flex-1 space-y-2 text-xs">
      {error && <ErrorMessage message={error} />}
      {result && <ResultDisplay result={result} />}
      {!error && !result && <EmptyState />}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-rose-100">
      {message}
    </div>
  );
}

interface ResultField {
  label: string;
  value: string | null | undefined;
}

function ResultDisplay({ result }: { result: ScraperResultsProps["result"] }) {
  if (!result) return null;

  const fields: ResultField[] = [
    { label: "Title", value: result.title },
    { label: "Meta description", value: result.description },
    { label: "Primary h1", value: result.h1 },
  ];

  return (
    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="text-xs text-slate-200">{value || "None found"}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-[11px] text-slate-400">
      Enter a URL and run the scraper to inspect its metadata.
    </p>
  );
}
