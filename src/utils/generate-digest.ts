import { hash } from "node:crypto";

/**
 * Generate digest using node crypto (not cryptographically secure)
 * with json stringified content
 */
export function generateDigest(content: unknown): string {
  return hash("sha1", JSON.stringify(content));
}
