// client/src/utils/blood/bloodRequestHelpers.js

// Formats creation date string relative to current time
export function formatTimeAgo(dateString) {
  const date = new Date(dateString);

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);

  // Formats relative time elapsed
  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  return "Recently";
}

// Calculates remaining time until request expiration
export function formatExpiry(dateString) {
  const expiresAt = new Date(dateString);

  const diff = expiresAt.getTime() - Date.now();

  // Evaluates expiration threshold
  if (diff <= 0) {
    return "Expired";
  }

  const minutes = Math.ceil(diff / 60000);

  if (minutes < 60) {
    return `Expires in ${minutes} min`;
  }

  const hours = Math.ceil(minutes / 60);

  return `Expires in ${hours} hr`;
}
