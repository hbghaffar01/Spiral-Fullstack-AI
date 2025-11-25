import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { ScrapeResponse } from "../types";

export class ScraperService {
  private readonly timeout = 8000;
  private readonly maxRedirects = 5;
  private readonly userAgent = "Spiralyze-Micro-Scraper/1.0 (+technical-assessment)";

  async scrape(url: string): Promise<ScrapeResponse> {
    this.validateUrl(url);

    try {
      const html = await this.fetchHtml(url);
      return this.extractMetadata(html);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private validateUrl(url: string): void {
    if (!url || typeof url !== "string") {
      throw new ValidationError("URL is required", 400);
    }

    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new ValidationError("Only http and https URLs are supported", 400);
      }
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError("Invalid URL format", 400);
    }
  }

  private async fetchHtml(url: string): Promise<string> {
    const response = await axios.get<string>(url, {
      timeout: this.timeout,
      maxRedirects: this.maxRedirects,
      headers: {
        "User-Agent": this.userAgent,
      },
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new HttpError(`Upstream responded with status ${response.status}`, 502);
    }

    const contentType = String(response.headers["content-type"] || "").toLowerCase();
    if (!contentType.includes("text/html")) {
      throw new HttpError("URL did not return HTML content", 415);
    }

    return response.data;
  }

  private extractMetadata(html: string): ScrapeResponse {
    const $ = cheerio.load(html);

    return {
      title: this.extractTitle($),
      description: this.extractDescription($),
      h1: this.extractH1($),
    };
  }

  private extractTitle($: cheerio.CheerioAPI): string | null {
    const title = $("title").first().text().trim();
    return title || null;
  }

  private extractDescription($: cheerio.CheerioAPI): string | null {
    const selectors = [
      'meta[name="description"]',
      'meta[name="Description"]',
      'meta[property="og:description"]',
    ];

    for (const selector of selectors) {
      const content = $(selector).attr("content")?.trim();
      if (content) return content;
    }

    return null;
  }

  private extractH1($: cheerio.CheerioAPI): string | null {
    const h1 = $("h1").first().text().trim();
    return h1 || null;
  }

  private handleError(error: unknown): Error {
    if (error instanceof ValidationError || error instanceof HttpError) {
      return error;
    }

    const axiosError = error as AxiosError;

    if (axiosError.code === "ECONNABORTED") {
      return new HttpError("Request to target URL timed out", 504);
    }

    const message = axiosError.message || "Unknown error while scraping";
    return new HttpError(message, 500);
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const scraperService = new ScraperService();
