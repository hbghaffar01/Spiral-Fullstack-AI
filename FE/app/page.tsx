import { SearchUI } from "@/components/SearchUI";
import { ScraperUI } from "@/components/ScraperUI";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
          <Header />
          <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            <ErrorBoundary>
              <SearchUI />
            </ErrorBoundary>
            <ErrorBoundary>
              <ScraperUI />
            </ErrorBoundary>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function Header() {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Full-Stack Technical Assessment
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Mini Search and Micro Scraper
      </h1>
      <p className="max-w-2xl text-sm text-slate-300">
        Task A: compact search over a local JSON dataset. Task B: scrape basic metadata from any
        public URL.
      </p>
    </header>
  );
}
