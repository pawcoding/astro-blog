/**
 * Add keyboard listener to all feeds on the page even after transitions.
 */
document.addEventListener("astro:page-load", () => {
  const feeds = document.querySelectorAll('[role="feed"]');

  feeds.forEach((feed) => {
    feed.addEventListener("keydown", (event) => updateFeedFocus(event));
  });
});

/**
 * Handle keyboard events to update the focus according to the feed role.
 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/feed_role#keyboard_interactions
 */
function updateFeedFocus(event: Event) {
  // Should already be a keyboard event
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  // Extract the direction from the pressed key
  let direction: "prev" | "next";
  if (event.key === "ArrowUp") {
    event.preventDefault();
    direction = "prev";
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    direction = "next";
  } else {
    return;
  }

  // Calculate the position of the next focused article in the feed using aria-posinset
  const focusedArticle = document.activeElement?.closest("article");
  let newFocusPos = 0;

  if (focusedArticle) {
    const oldFocusPos = parseInt(
      focusedArticle.getAttribute("aria-posinset") || "0",
      10,
    );

    if (direction === "prev") {
      newFocusPos = Math.max(oldFocusPos - 1, 1);
    } else if (direction === "next") {
      const setSize = parseInt(
        focusedArticle.getAttribute("aria-setsize") || "0",
        10,
      );
      newFocusPos = Math.min(oldFocusPos + 1, setSize);
    }
  }

  // Try to focus the correct next article
  const feed = event.currentTarget as HTMLElement;
  const newFocusArticle = feed.querySelector(
    `article[aria-posinset="${newFocusPos}"] a`,
  ) as HTMLElement | null;
  newFocusArticle?.focus();
}
