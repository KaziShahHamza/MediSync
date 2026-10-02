// client/src/hooks/useChatbotMessageActions.js

// Provides the AI assistant message-sending action.
// Handles optimistic user messages, server responses, and message-limit validation.
// Keeps message-generation logic separate from general chatbot actions.

import { useCallback } from "react";

import {
  DEFAULT_MESSAGE_LIMIT,
  createOptimisticMessage,
  getFriendlyChatError,
  getUserMessageCount,
} from "../utils/chatbotHelpers";

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

export default function useChatbotMessageActions({
  currentChat,
  sending,
  getAuthHeaders,
  setChats,
  setCurrentChat,
  setSending,
  setError,
}) {
  // Sends a text message and immediately displays the user's message while the response is generated.
  const sendMessage = useCallback(
    async ({ content }) => {
      if (!currentChat?._id || sending) {
        return null;
      }

      const trimmedContent = content?.trim();

      if (!trimmedContent) {
        return null;
      }

      const currentUserMessageCount = getUserMessageCount(currentChat);

      if (currentUserMessageCount >= DEFAULT_MESSAGE_LIMIT) {
        const message =
          "This chat has reached its 20-message limit. Please create a new chat.";

        setError(message);

        const error = new Error(message);
        error.code = "CHAT_MESSAGE_LIMIT";

        return null;
      }

      const optimisticMessage = createOptimisticMessage(trimmedContent);

      const optimisticUserMessageCount = currentUserMessageCount + 1;

      const optimisticChat = {
        ...currentChat,
        messages: [...(currentChat.messages || []), optimisticMessage],
        userMessageCount: optimisticUserMessageCount,
        messageLimit: DEFAULT_MESSAGE_LIMIT,
        reachedMessageLimit:
          optimisticUserMessageCount >= DEFAULT_MESSAGE_LIMIT,
      };

      // Immediately show the user's message before waiting for Gemini.
      setCurrentChat(optimisticChat);

      setSending(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/chats/${currentChat._id}/messages`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              content: trimmedContent,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(getFriendlyChatError(data, response.status));

          error.code = data.code;

          throw error;
        }

        const updatedChat = data.chat;

        if (!updatedChat) {
          const error = new Error(
            "I couldn't update the conversation right now.",
          );

          error.code = "CHAT_UPDATE_FAILED";

          throw error;
        }

        const userMessageCount =
          typeof data.userMessageCount === "number"
            ? data.userMessageCount
            : optimisticUserMessageCount;

        const reachedMessageLimit =
          data.reachedMessageLimit || userMessageCount >= DEFAULT_MESSAGE_LIMIT;

        // Replace the optimistic state with the authoritative server state.
        setCurrentChat({
          ...updatedChat,
          userMessageCount,
          messageLimit: data.messageLimit || DEFAULT_MESSAGE_LIMIT,
          reachedMessageLimit,
        });

        setChats((previous) => {
          const updatedSummary = {
            _id: updatedChat._id,
            title: updatedChat.title,
            createdAt: updatedChat.createdAt,
            updatedAt: updatedChat.updatedAt,
            userMessageCount,
            messageLimit: data.messageLimit || DEFAULT_MESSAGE_LIMIT,
            reachedMessageLimit,
          };

          const withoutCurrent = previous.filter(
            (chat) => chat._id !== updatedChat._id,
          );

          return [updatedSummary, ...withoutCurrent];
        });

        return updatedChat;
      } catch (err) {
        // Remove the optimistic message if the request fails.
        setCurrentChat((previous) => {
          if (!previous || previous._id !== currentChat._id) {
            return previous;
          }

          return {
            ...previous,
            messages: (previous.messages || []).filter(
              (message) => message._id !== optimisticMessage._id,
            ),
            userMessageCount: currentUserMessageCount,
            messageLimit: DEFAULT_MESSAGE_LIMIT,
            reachedMessageLimit:
              currentUserMessageCount >= DEFAULT_MESSAGE_LIMIT,
          };
        });

        setError(err.message || "Failed to send message.");

        return null;
      } finally {
        setSending(false);
      }
    },
    [
      currentChat,
      getAuthHeaders,
      sending,
      setChats,
      setCurrentChat,
      setError,
      setSending,
    ],
  );

  return {
    sendMessage,
  };
}
