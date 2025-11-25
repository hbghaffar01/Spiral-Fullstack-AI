import { Request, Response } from "express";
import { ScrapeRequest, ScrapeResponse, ErrorResponse } from "../types";
import { scraperService, ValidationError, HttpError } from "../services/scraperService";

export async function scraperController(
  req: Request<{}, {}, ScrapeRequest>,
  res: Response<ScrapeResponse | ErrorResponse>
): Promise<void> {
  try {
    const url = String(req.body.url || "").trim();
    const result = await scraperService.scrape(url);
    
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
}

function handleError(
  error: unknown,
  res: Response<ErrorResponse>
): void {
  if (error instanceof ValidationError || error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  
  const message = error instanceof Error 
    ? error.message 
    : "An unexpected error occurred";
    
  res.status(500).json({ error: message });
}
