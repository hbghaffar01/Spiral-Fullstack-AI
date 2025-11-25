import { Item } from "../types";
import { vectorSearch } from "./vectorService";
import data from "../../data.json";

export class SearchService {
  private readonly data: Item[] = data as Item[];

  async search(query: string, category?: string): Promise<Item[]> {
    const normalizedQuery = query.trim();
    const normalizedCategory = category?.toLowerCase();

    if (!normalizedQuery && !normalizedCategory) {
      return [];
    }

    if (normalizedQuery) {
      const vectorResults = await vectorSearch(normalizedQuery, normalizedCategory);
      if (vectorResults) {
        return vectorResults;
      }
    }

    return this.keywordSearch(normalizedQuery, normalizedCategory);
  }

  private keywordSearch(query: string, category?: string): Item[] {
    let items = [...this.data];

    if (category) {
      items = items.filter(
        (item) => this.normalize(item.category) === category
      );
    }

    if (!query) {
      return items;
    }

    const tokens = this.tokenize(query);
    
    const scoredItems = items
      .map((item) => ({
        item,
        score: this.calculateScore(item, tokens),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);

    return scoredItems;
  }

  private normalize(text: unknown): string {
    return String(text ?? "").toLowerCase();
  }

  private tokenize(text: string): string[] {
    return this.normalize(text)
      .split(/\s+/)
      .filter(Boolean);
  }

  private calculateScore(item: Item, tokens: string[]): number {
    const searchableText = this.normalize(
      [item.title, item.description, item.content, item.category, ...item.tags].join(" ")
    );

    return tokens.reduce((score, token) => {
      if (!token) return score;
      const matches = searchableText.split(token).length - 1;
      return score + matches;
    }, 0);
  }
}

export const searchService = new SearchService();
