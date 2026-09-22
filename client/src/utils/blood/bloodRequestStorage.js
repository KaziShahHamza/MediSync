// client/src/utils/blood/bloodRequestStorage.js

const DEVICE_ID_STORAGE_KEY = "medisync_blood_request_device_id";

const MANAGEMENT_TOKEN_PREFIX = "medisync_blood_request_token_";

// Retrieves existing device UUID or generates and persists a new one
export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  // Creates new UUID if missing from storage
  if (!deviceId) {
    deviceId = crypto.randomUUID();

    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }

  return deviceId;
}

// Retrieves saved guest management token for specific request ID
export function getManagementToken(requestId) {
  return localStorage.getItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}

// Stores guest management token associated with request ID
export function saveManagementToken(requestId, token) {
  if (!requestId || !token) {
    return;
  }

  localStorage.setItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`, token);
}

// Removes stored guest management token for specific request ID
export function removeManagementToken(requestId) {
  if (!requestId) {
    return;
  }

  localStorage.removeItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}
