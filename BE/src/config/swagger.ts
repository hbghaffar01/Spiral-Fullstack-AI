import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spiralyze AI Assessment API",
      version: "1.0.0",
      description: `
## Full-Stack Technical Assessment API

This API provides two main features:

### Task A: Mini Full-Stack Search
A search endpoint that queries a local JSON dataset with:
- Keyword-based search with relevance scoring
- Optional vector search via ChromaDB
- Category filtering
- Redis caching for performance

### Task B: Micro Scraper
A web scraping endpoint that extracts:
- Page title
- Meta description
- Primary H1 heading
- With timeout protection and error handling
      `,
      contact: {
        name: "Haseeb",
        email: "haseeb@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Search",
        description: "Task A - Search operations on JSON dataset",
      },
      {
        name: "Scraper",
        description: "Task B - Web page metadata extraction",
      },
      {
        name: "Health",
        description: "Server health and status",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
