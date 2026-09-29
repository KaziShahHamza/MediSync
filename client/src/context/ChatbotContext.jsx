// client/src/context/ChatbotContext.jsx

// Manages AI assistant conversations, active chat state, and chat actions.
// Connects the assistant UI to the authenticated text-only AI chat API.

import { createContext, useCallback, useContext, useState } from "react";

const ChatbotContext = createContext(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

export function ChatbotProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  // Loads the user's recent conversations and their stored message counts.
  const loadChats = useCallback(async () => {
    setLoadingChats(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/chats`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load conversations.");
      }

      const loadedChats = Array.isArray(data) ? data : [];

      setChats(loadedChats);

      return loadedChats;
    } catch (err) {
      setError(err.message || "Failed to load conversations.");
      return [];
    } finally {
      setLoadingChats(false);
    }
  }, [getAuthHeaders]);

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
          throw new Error(data.message || "Failed to load conversation.");
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
    [getAuthHeaders],
  );

  // Creates a new text conversation and makes it the active chat.
  const createChat = useCallback(async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create conversation.");
      }

      setCurrentChat(data);

      setChats((previous) => {
        const withoutDuplicate = previous.filter(
          (chat) => chat._id !== data._id,
        );

        return [
          {
            ...data,
            userMessageCount: 0,
          },
          ...withoutDuplicate,
        ];
      });

      return data;
    } catch (err) {
      setError(err.message || "Failed to create conversation.");
      return null;
    }
  }, [getAuthHeaders]);

  // Sends a text message through the active conversation.
  const sendMessage = useCallback(
    async ({ content }) => {
      if (!currentChat?._id) {
        return null;
      }

      const trimmedContent = content?.trim();

      if (!trimmedContent) {
        return null;
      }

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
          throw new Error(data.message || "Failed to send message.");
        }

        const updatedChat = data.chat;

        if (!updatedChat) {
          throw new Error("Invalid chat response from the server.");
        }

        setCurrentChat(updatedChat);

        // Prefer the count calculated by the backend.
        const userMessageCount =
          typeof data.userMessageCount === "number"
            ? data.userMessageCount
            : Array.isArray(updatedChat.messages)
              ? updatedChat.messages.filter(
                  (message) => message.role === "user",
                ).length
              : 0;

        // Move the updated conversation to the top of the sidebar.
        setChats((previous) => {
          const updatedSummary = {
            _id: updatedChat._id,
            title: updatedChat.title,
            createdAt: updatedChat.createdAt,
            updatedAt: updatedChat.updatedAt,
            userMessageCount,
          };

          const withoutCurrent = previous.filter(
            (chat) => chat._id !== updatedChat._id,
          );

          return [updatedSummary, ...withoutCurrent];
        });

        return updatedChat;
      } catch (err) {
        setError(err.message || "Failed to send message.");
        return null;
      } finally {
        setSending(false);
      }
    },
    [currentChat, getAuthHeaders],
  );

  // Deletes a conversation and clears it when it is currently selected.
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
          throw new Error(data.message || "Failed to delete conversation.");
        }

        setChats((previous) => previous.filter((chat) => chat._id !== chatId));

        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }

        return true;
      } catch (err) {
        setError(err.message || "Failed to delete chat.");
        return false;
      }
    },
    [currentChat, getAuthHeaders],
  );

  // Clears the active conversation without deleting it from the server.
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        chats,
        currentChat,
        loadingChats,
        loadingChat,
        sending,
        error,
        loadChats,
        loadChat,
        createChat,
        sendMessage,
        deleteChat,
        clearCurrentChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider.");
  }

  return context;
}