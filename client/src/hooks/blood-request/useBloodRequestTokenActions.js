// client/src/hooks/blood-request/useBloodRequestTokenActions.js

// Manages blood request management-token state, verification, storage, and clipboard actions.

import { useState } from "react";

import { saveManagementToken } from "../../utils/blood/bloodRequestStorage";

const API_URL = import.meta.env.VITE_API_URL;

export default function useBloodRequestTokenActions({
  managementToken,
  setManagementToken,
  setCopied,
  onEditRequest,
  onDeleteRequest,
}) {
  const [managementTokenModalOpen, setManagementTokenModalOpen] =
    useState(false);

  const [managementTokenRequest, setManagementTokenRequest] = useState(null);

  const [managementTokenAction, setManagementTokenAction] = useState(null);

  const [managementTokenSubmitting, setManagementTokenSubmitting] =
    useState(false);

  const [managementTokenError, setManagementTokenError] = useState("");

  const openManagementTokenModal = (request, action) => {
    setManagementTokenRequest(request);
    setManagementTokenAction(action);
    setManagementTokenError("");
    setManagementTokenModalOpen(true);
  };

  const closeManagementTokenModal = () => {
    if (managementTokenSubmitting) return;

    setManagementTokenModalOpen(false);
    setManagementTokenRequest(null);
    setManagementTokenAction(null);
    setManagementTokenError("");
  };

  const handleManagementTokenSubmit = async (token) => {
    const normalizedToken = token.trim();

    if (!managementTokenRequest || !normalizedToken) {
      return;
    }

    try {
      setManagementTokenSubmitting(true);
      setManagementTokenError("");

      const response = await fetch(
        `${API_URL}/api/blood/requests/${managementTokenRequest.id}/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managementToken: normalizedToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid management token.");
      }

      saveManagementToken(managementTokenRequest.id, normalizedToken);

      setManagementToken(normalizedToken);

      const request = managementTokenRequest;
      const action = managementTokenAction;

      setManagementTokenModalOpen(false);
      setManagementTokenRequest(null);
      setManagementTokenAction(null);

      if (action === "edit") {
        onEditRequest(request, normalizedToken);
      }

      if (action === "delete") {
        await onDeleteRequest(request, normalizedToken);
      }
    } catch (err) {
      console.error("Blood request token verification failed:", err);

      setManagementTokenError(
        err.message || "Unable to verify management token.",
      );
    } finally {
      setManagementTokenSubmitting(false);
    }
  };

  const copyManagementToken = async () => {
    if (!managementToken) return;

    try {
      await navigator.clipboard.writeText(managementToken);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return {
    openManagementTokenModal,
    closeManagementTokenModal,
    handleManagementTokenSubmit,
    copyManagementToken,

    managementTokenModalOpen,
    managementTokenRequest,
    managementTokenAction,
    managementTokenSubmitting,
    managementTokenError,
  };
}
