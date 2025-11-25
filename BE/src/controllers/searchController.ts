import { Request, Response } from "express";
import { SearchQuery, SearchResponse } from "../types";
import { searchService } from "../services/searchService";

export async function searchController(
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response<SearchResponse>
): Promise<void> {
  try {
    const query = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim().toLowerCase();

    const results = await searchService.search(query, category);
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ results: [] });
  }
}
