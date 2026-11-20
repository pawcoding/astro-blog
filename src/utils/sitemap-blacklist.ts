export function isBlacklisted(url: string): boolean {
  // Page only redirects to the latest post
  if (url.includes("posts/latest")) {
    return true;
  }

  return false;
}
