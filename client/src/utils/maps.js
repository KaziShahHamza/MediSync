// client/src/utils/maps.js

// Provides reusable helpers for opening Google Maps searches.
// Builds Google Maps search URLs without requesting or accessing user location.

// Build a Google Maps search URL for the provided search query.
export function buildGoogleMapsSearchUrl(query) {
  const encodedQuery = encodeURIComponent(query);

  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

// Open a Google Maps search in a new browser tab or window.
export function openGoogleMapsSearch(query) {
  const url = buildGoogleMapsSearchUrl(query);

  window.open(url, "_blank", "noopener,noreferrer");
}
