export function isBlacklisted(url: string): boolean {
  // Page only redirects to the latest post
  if (url.includes("posts/latest")) {
    return true;
  }

  // Do not include tags in the sitemap
  if (url.includes("tags/")) {
    return true;
  }

  return false;
}
