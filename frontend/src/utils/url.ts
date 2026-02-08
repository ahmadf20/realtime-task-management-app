/**
 * URL utility functions for the application
 */

/**
 * Gets the current page number from the URL query parameters
 * @returns The page number from URL or defaults to 1
 */
export const getCurrentPageFromUrl = (): number => {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page") || "1", 10);
};
