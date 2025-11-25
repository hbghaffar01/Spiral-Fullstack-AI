# Backend - Full-Stack Search & Scraper API

## Features

- **Hybrid Search**: Vector embeddings (ChromaDB) + keyword search fallback
- **Web Scraping**: Extract metadata with timeout protection
- **Docker Support**: Complete containerized setup
- **Swagger Documentation**: Interactive API docs

## Tech Stack

- TypeScript + Express.js
- ChromaDB (vector database - optional)
- OpenAI embeddings (optional)
- Swagger/OpenAPI
- Docker & Docker Compose

## Quick Start

### Option 1: Basic Mode (Keyword Search Only)

```bash
npm install
npm run dev
```

Server will start at http://localhost:4000

### Option 2: With ChromaDB (Vector Search)

```bash
# Start ChromaDB + Backend with Docker
npm run docker:up

# Stop services
npm run docker:down
```

## API Endpoints

### Core APIs

- `GET /api/search?q=<query>&category=<filter>` - Search products
- `POST /api/scrape` - Scrape webpage metadata
- `GET /health` - Health check

### Documentation

- `GET /api-docs` - Interactive Swagger UI
- `GET /api-docs.json` - OpenAPI specification

## NPM Scripts

### Development

```bash
npm run dev          # Start with ts-node-dev
npm run build        # Compile TypeScript
npm start            # Run production build
```

### Docker

```bash
npm run docker:build # Build Docker images
npm run docker:up    # Start Backend + ChromaDB
npm run docker:down  # Stop all services
```

### Code Quality

```bash
npm run format       # Format code with Prettier
npm run typecheck    # Type checking with TypeScript
```

## Environment Variables

Create a `.env` file:

```env
# Server
PORT=4000
CLIENT_URL=http://localhost:3000

# ChromaDB (optional)
CHROMA_URL=http://localhost:8000

# OpenAI (optional for better embeddings)
OPENAI_API_KEY=
```

## Architecture

```
Request → Express Router → Controller
                             ↓
                    Service Layer (Search/Scraper)
                             ↓
                   Vector DB / Keyword Search
                             ↓
                         Response
```

## API Documentation

Access interactive Swagger docs at:
**http://localhost:4000/api-docs**

Test all endpoints directly from your browser!

---

## API Endpoints - cURL Examples

### 1. Search API (Task A)

**Basic search:**

```bash
curl --location 'http://localhost:4000/api/search?q=AI%20dashboard'
```

**Search with category filter:**

```bash
curl --location 'http://localhost:4000/api/search?q=agent&category=agent'
```

**Category only:**

```bash
curl --location 'http://localhost:4000/api/search?category=product'
```

**All categories:**

```bash
curl --location 'http://localhost:4000/api/search?q=vector'
```

---

### 2. Scraper API (Task B)

**Scrape example.com:**

```bash
curl --location 'http://localhost:4000/api/scrape' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://example.com"
}'
```

**Scrape Google:**

```bash
curl --location 'http://localhost:4000/api/scrape' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://www.google.com"
}'
```

**Scrape GitHub:**

```bash
curl --location 'http://localhost:4000/api/scrape' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://github.com"
}'
```

---

### 3. Health Check

```bash
curl --location 'http://localhost:4000/health'
```

---

### 4. OpenAPI Specification

**Get Swagger JSON:**

```bash
curl --location 'http://localhost:4000/api-docs.json'
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Spiralyze AI Assessment API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000"
    }
  ],
  "item": [
    {
      "name": "Search - Basic",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/search?q=AI dashboard",
          "host": ["{{baseUrl}}"],
          "path": ["api", "search"],
          "query": [{ "key": "q", "value": "AI dashboard" }]
        }
      }
    },
    {
      "name": "Search - With Category",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/search?q=agent&category=agent",
          "host": ["{{baseUrl}}"],
          "path": ["api", "search"],
          "query": [
            { "key": "q", "value": "agent" },
            { "key": "category", "value": "agent" }
          ]
        }
      }
    },
    {
      "name": "Scrape URL",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\\n    \\"url\\": \\"https://example.com\\"\\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/scrape",
          "host": ["{{baseUrl}}"],
          "path": ["api", "scrape"]
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    }
  ]
}
```
