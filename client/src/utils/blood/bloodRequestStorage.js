// client/src/utils/blood/bloodRequestStorage.js

// Manages browser storage for guest device and blood request tokens.
// Keeps persistence details outside blood request hooks and components.

const DEVICE_ID_STORAGE_KEY = "medisync_blood_request_device_id";
const MANAGEMENT_TOKEN_PREFIX = "medisync_blood_request_token_";

// Retrieve an existing device ID or generate and persist one.
export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  // Generate a new UUID when no device ID exists.
  if (!deviceId) {
    deviceId = crypto.randomUUID();

    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }

  return deviceId;
}

// Retrieve a saved management token for a request.
export function getManagementToken(requestId) {
  if (!requestId) {
    return null;
  }

  return localStorage.getItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}

// Save a guest management token for a request.
export function saveManagementToken(requestId, token) {
  if (!requestId || !token) {
    return;
  }

  localStorage.setItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`, token);
}

// Remove a saved guest management token.
export function removeManagementToken(requestId) {
  if (!requestId) {
    return;
  }

  localStorage.removeItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}
