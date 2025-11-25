import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import { Item } from "../types";
import data from "../../data.json";

class VectorService {
  private collection: Collection | null = null;
  private readonly chromaUrl = process.env.CHROMA_URL || "http://localhost:8000";
  private readonly apiKey = process.env.OPENAI_API_KEY || "demo-key-for-testing";

  async initialize(): Promise<boolean> {
    try {
      const client = new ChromaClient({
        path: this.chromaUrl,
      });

      const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: this.apiKey,
        openai_model: "text-embedding-ada-002",
      });

      await this.deleteExistingCollection(client);

      this.collection = await client.createCollection({
        name: "products",
        embeddingFunction: embedder,
      });

      await this.indexData();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async deleteExistingCollection(client: ChromaClient): Promise<void> {
    try {
      await client.deleteCollection({ name: "products" });
    } catch(error) {
      console.log("Error deleting existing collection:", error);
      
    }
  }

  private async indexData(): Promise<void> {
    if (!this.collection) return;

    const items = data as Item[];
    
    const documents = items.map((item) =>
      this.createDocument(item)
    );

    const metadatas = items.map((item) =>
      this.createMetadata(item)
    );

    const ids = items.map((item) => item.id.toString());

    await this.collection.add({
      documents,
      metadatas,
      ids,
    });
  }

  private createDocument(item: Item): string {
    return [
      item.title,
      item.description,
      item.content,
      ...item.tags,
      item.category,
    ].join(" ");
  }

  private createMetadata(item: Item): Record<string, any> {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: JSON.stringify(item.tags),
      content: item.content,
    };
  }

  async search(query: string, category?: string): Promise<Item[] | null> {
    if (!this.collection) {
      return null;
    }

    try {
      const filter = category ? { category: { $eq: category } } : undefined;

      const results = await this.collection.query({
        queryTexts: [query],
        nResults: 10,
        where: filter,
      });

      if (!results.metadatas[0]) {
        return [];
      }

      return this.parseResults(results);
    } catch (error) {
      return null;
    }
  }

  private parseResults(results: any): Item[] {
    return results.metadatas[0].map((meta: any, idx: number) => ({
      id: meta.id,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      tags: JSON.parse(meta.tags),
      content: meta.content,
      score: results.distances?.[0]?.[idx] || 0,
    }));
  }
}

export const vectorService = new VectorService();

export async function initVectorDB(): Promise<boolean> {
  return vectorService.initialize();
}

export async function vectorSearch(
  query: string,
  category?: string
): Promise<Item[] | null> {
  return vectorService.search(query, category);
}
