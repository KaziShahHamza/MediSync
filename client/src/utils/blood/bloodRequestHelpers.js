// client/src/utils/blood/bloodRequestHelpers.js

// Provides relative time and expiration formatting for blood requests.
// Keeps date presentation logic separate from blood request components.

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  // Format elapsed time using the most appropriate unit.
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

export function formatExpiry(dateString) {
  const expiresAt = new Date(dateString);

  if (Number.isNaN(expiresAt.getTime())) {
    return "Expired";
  }

  const diff = expiresAt.getTime() - Date.now();

  // Return an expiration label based on remaining time.
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
