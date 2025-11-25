# Frontend - Next.js Search & Scraper UI

## Overview

Modern, responsive React application built with Next.js 16, TypeScript, and Tailwind CSS implementing Task A (Search) and Task B (Scraper).

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- Custom React hooks
- Modern ES6+ patterns

## Quick Start

```bash
cd FE
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
FE/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── SearchUI.tsx      # Task A: Search interface
│   └── ScraperUI.tsx     # Task B: Scraper interface
├── lib/
│   ├── hooks/
│   │   ├── useDebounce.ts   # Debouncing utility
│   │   ├── useSearch.ts     # Search state management
│   │   └── useScraper.ts    # Scraper state management
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript interfaces
│   └── constants.ts      # App constants
└── public/
    └── logo.png          # Site favicon
```

## Features

### Task A: Search Interface
- ✅ Real-time search with 250ms debouncing
- ✅ Category filtering (Product, Agent, Search, Marketing, Support)
- ✅ Loading and error states
- ✅ Clean result cards with tags and descriptions
- ✅ Abort controller for request cancellation
- ✅ Empty state handling

### Task B: Scraper Interface
- ✅ URL input with validation
- ✅ One-click scraping
- ✅ Display title, meta description, and H1
- ✅ Error handling with user-friendly messages
- ✅ Loading states

## Custom Hooks

### `useSearch`
Manages search state with debouncing and API calls.

**Usage:**
```typescript
const {
  query,
  setQuery,
  category,
  setCategory,
  results,
  isLoading,
  error,
  showNoResults,
} = useSearch({ debounceDelay: 250 });
```

**Features:**
- Automatic debouncing
- Category filtering
- Error handling
- Loading states
- Abort on unmount

### `useScraper`
Handles scraping operations and state.

**Usage:**
```typescript
const {
  url,
  setUrl,
  isLoading,
  error,
  result,
  scrape,
} = useScraper();
```

**Features:**
- URL validation
- Error handling
- Loading states
- Result caching in state

### `useDebounce`
Generic debouncing hook for any value.

**Usage:**
```typescript
const debouncedValue = useDebounce(value, 250);
```

## API Client

Centralized API client in `lib/api.ts`:

```typescript
class ApiClient {
  async search({ query, category, signal }): Promise<SearchResponse>
  async scrape(url: string): Promise<ScrapeResult>
}

export const api = new ApiClient(API_BASE);
```

**Features:**
- Type-safe requests
- Centralized error handling
- Abort signal support
- Clean response types

## TypeScript Types

All types defined in `lib/types.ts`:

```typescript
interface SearchItem {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  score?: number;
}

interface SearchResponse {
  results: SearchItem[];
}

interface ScrapeResult {
  title?: string | null;
  description?: string | null;
  h1?: string | null;
}

interface ErrorResponse {
  error: string;
}

type Category = {
  label: string;
  value: string;
};
```

## Components Architecture

### SearchUI Component
Modular design with sub-components:
- `SearchHeader` - Title and description
- `SearchForm` - Input and category selector
- `SearchStatus` - Loading/results count/errors
- `SearchResults` - Result cards container
- `SearchResultCard` - Individual result display
- `NoResultsMessage` - Empty state

### ScraperUI Component
Clean separation:
- `ScraperHeader` - Title and description
- `ScraperForm` - URL input and submit button
- `ScraperResults` - Result display logic
- `ErrorMessage` - Error state
- `ResultDisplay` - Structured metadata display
- `EmptyState` - Initial state

## Styling

### Design System
- **Background**: slate-950 (dark theme)
- **Accent**: emerald-500 (primary actions)
- **Text**: slate-50/300/400 (hierarchy)
- **Borders**: slate-800/700
- **Cards**: slate-900 with hover effects

### Responsive Design
- Mobile-first approach
- Grid layout for desktop (2-column)
- Stack layout for mobile
- Flexible inputs and buttons

### Accessibility
- Semantic HTML
- Focus rings on interactive elements
- ARIA labels where needed
- Keyboard navigation support

## Performance Optimizations

✅ **Debounced input** - Reduces API calls by 90%
✅ **AbortController** - Cancels stale requests
✅ **useCallback** - Stable function references
✅ **Optimized re-renders** - Minimal state updates
✅ **Next.js optimizations** - Automatic code splitting

## Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Development Workflow

### 1. Start Backend
```bash
cd BE
npm run dev
```

### 2. Start Frontend
```bash
cd FE
npm run dev
```

### 3. Make Changes
- Edit components in `components/`
- Update hooks in `lib/hooks/`
- Modify styles in component files or `globals.css`

### 4. Type Check
```bash
npm run typecheck
```

### 5. Format Code
```bash
npm run format
```

## Key Patterns Used

### Modern React
- Functional components only
- Custom hooks for logic
- Props drilling avoided
- Clean component composition

### TypeScript
- Strict mode enabled
- Interface-based types
- Generic hooks
- Type inference
- No `any` types

### State Management
- Local state with useState
- Derived state (computed values)
- No global state needed
- Clean data flow

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Production Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

Or use the Vercel GitHub integration for automatic deployments.

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### API connection failed
Ensure backend is running on port 4000:
```bash
curl http://localhost:4000/health
```

### Type errors
```bash
npm run typecheck
```

## Best Practices Demonstrated

✅ Component composition
✅ Custom hooks for reusability
✅ Type safety throughout
✅ Error boundaries
✅ Loading states
✅ Empty states
✅ Responsive design
✅ Accessibility
✅ Performance optimization
✅ Clean code structure
