// client/src/hooks/useChatbotActions.js

// Provides general API actions for loading, creating, and deleting AI chats.
// Delegates message generation to the dedicated chatbot message action hook.
// Keeps general conversation management separate from message-generation logic.

import { useCallback } from "react";

import useChatbotMessageActions from "./useChatbotMessageActions";

import {
  DEFAULT_MESSAGE_LIMIT,
  DEFAULT_TOTAL_CHAT_LIMIT,
  getFriendlyChatError,
} from "../utils/chatbotHelpers";

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

export default function useChatbotActions({
  currentChat,
  sending,
  getAuthHeaders,
  setChats,
  setCurrentChat,
  setChatUsage,
  setLoadingChats,
  setLoadingChat,
  setSending,
  setError,
}) {
  // Loads conversations and the server-enforced chat usage state.
  const loadChats = useCallback(async () => {
    setLoadingChats(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/chats`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(getFriendlyChatError(data, response.status));

        error.code = data.code;

        throw error;
      }

      const loadedChats = Array.isArray(data.chats) ? data.chats : [];

      setChats(loadedChats);

      if (data.usage) {
        setChatUsage(data.usage);
      }

      return loadedChats;
    } catch (err) {
      setError(err.message || "Failed to load conversations.");

      return [];
    } finally {
      setLoadingChats(false);
    }
  }, [getAuthHeaders, setChats, setChatUsage, setLoadingChats, setError]);

  // Loads one conversation and makes it the active chat.
  const loadChat = useCallback(
    async (chatId) => {
      if (!chatId) {
        return null;
      }

      setLoadingChat(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/chats/${chatId}`, {
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(getFriendlyChatError(data, response.status));

          error.code = data.code;

          throw error;
        }

        setCurrentChat(data);

        return data;
      } catch (err) {
        setError(err.message || "Failed to load conversation.");

        return null;
      } finally {
        setLoadingChat(false);
      }
    },
    [getAuthHeaders, setCurrentChat, setLoadingChat, setError],
  );

  // Creates a new conversation while preserving persistent daily usage after deletion.
  const createChat = useCallback(async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(getFriendlyChatError(data, response.status));

        error.code = data.code;

        throw error;
      }

      setCurrentChat(data);

      setChats((previous) => {
        const updatedChats = [
          {
            ...data,
            userMessageCount: 0,
            messageLimit: DEFAULT_MESSAGE_LIMIT,
            reachedMessageLimit: false,
          },
          ...previous.filter((chat) => chat._id !== data._id),
        ];

        return updatedChats.slice(0, DEFAULT_TOTAL_CHAT_LIMIT);
      });

      // A successful server response consumes one daily chat creation allowance.
      setChatUsage((previous) => ({
        ...previous,
        dailyChatCount: Math.min(
          previous.dailyChatCount + 1,
          previous.dailyChatLimit,
        ),
        dailyChatsRemaining: Math.max(previous.dailyChatsRemaining - 1, 0),
        totalChatCount: Math.min(
          previous.totalChatCount + 1,
          previous.totalChatLimit,
        ),
      }));

      return data;
    } catch (err) {
      setError(err.message || "Failed to create chat.");

      return null;
    }
  }, [getAuthHeaders, setChats, setCurrentChat, setChatUsage, setError]);

  // Deletes a conversation without restoring its daily creation allowance.
  const deleteChat = useCallback(
    async (chatId) => {
      if (!chatId) {
        return false;
      }

      setError("");

      try {
        const response = await fetch(`${API_URL}/chats/${chatId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(getFriendlyChatError(data, response.status));

          error.code = data.code;

          throw error;
        }

        setChats((previous) => previous.filter((chat) => chat._id !== chatId));

        // Deleting a chat changes active chat count, not today's creation count.
        setChatUsage((previous) => ({
          ...previous,
          totalChatCount: Math.max(previous.totalChatCount - 1, 0),
        }));

        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }

        return true;
      } catch (err) {
        setError(err.message || "Failed to delete chat.");

        return false;
      }
    },
    [
      currentChat,
      getAuthHeaders,
      setChats,
      setChatUsage,
      setCurrentChat,
      setError,
    ],
  );

  // Clears the active conversation without deleting it from the server.
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
  }, [setCurrentChat]);

  const { sendMessage } = useChatbotMessageActions({
    currentChat,
    sending,
    getAuthHeaders,
    setChats,
    setCurrentChat,
    setSending,
    setError,
  });

  return {
    loadChats,
    loadChat,
    createChat,
    sendMessage,
    deleteChat,
    clearCurrentChat,
  };
}
