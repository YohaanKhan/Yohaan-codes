import Fuse from "fuse.js"
import type { Pattern } from "./types"

export function search(patterns: Pattern[], query: string): Pattern[] {
  if (!query) return patterns;
  
  const fuse = new Fuse(patterns, {
    keys: ["name", "tags", "summary", "subquestions.title"],
    threshold: 0.3,
  });

  const results = fuse.search(query);
  return results.map(result => result.item);
}
