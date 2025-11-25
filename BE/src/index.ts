import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { searchController } from "./controllers/searchController";
import { scraperController } from "./controllers/scraperController";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { validateContentType } from "./middleware/validation";
import { initVectorDB } from "./services/vectorService";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Spiralyze AI API Docs",
}));

app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search products
 *     description: Search the product catalog with optional category filtering. Uses vector search if available, falls back to keyword search.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query string
 *         example: AI dashboard
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [product, agent, search, marketing, support]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       content:
 *                         type: string
 */
app.get("/api/search", searchController);

/**
 * @swagger
 * /api/scrape:
 *   post:
 *     summary: Scrape webpage metadata
 *     description: Extract title, meta description, and H1 from a given URL with timeout protection.
 *     tags: [Scraper]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Scraped metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   nullable: true
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 h1:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Invalid URL or missing URL
 *       415:
 *         description: URL did not return HTML content
 *       502:
 *         description: Upstream server error
 *       504:
 *         description: Request timeout
 */
app.post("/api/scrape", validateContentType("application/json"), scraperController);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check server health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (_req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await initVectorDB();
    
    app.listen(PORT, () => {
      console.log(`
🚀 Server: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api-docs
      `);
    });
  } catch (error) {
    process.exit(1);
  }
}

startServer();