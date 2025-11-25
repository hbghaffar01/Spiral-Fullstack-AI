import { Category } from "./types";

export const SEARCH_CATEGORIES: Category[] = [
  { label: "All", value: "" },
  { label: "Product", value: "product" },
  { label: "Agent", value: "agent" },
  { label: "Search", value: "search" },
  { label: "Marketing", value: "marketing" },
  { label: "Support", value: "support" },
] as const;

export const UI_CONFIG = {
  debounceDelay: 250,
} as const;
