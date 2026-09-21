const DEVICE_ID_STORAGE_KEY = "medisync_blood_request_device_id";

const MANAGEMENT_TOKEN_PREFIX = "medisync_blood_request_token_";

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();

    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }

  return deviceId;
}

export function getManagementToken(requestId) {
  return localStorage.getItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}

export function saveManagementToken(requestId, token) {
  if (!requestId || !token) {
    return;
  }

  localStorage.setItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`, token);
}

export function removeManagementToken(requestId) {
  if (!requestId) {
    return;
  }

  localStorage.removeItem(`${MANAGEMENT_TOKEN_PREFIX}${requestId}`);
}
