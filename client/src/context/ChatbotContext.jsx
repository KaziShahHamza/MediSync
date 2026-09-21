// client/src/context/ChatbotContext.jsx

import { createContext, useCallback, useContext, useState } from "react";

const ChatbotContext = createContext();

// const API_URL = "/api/ai";
const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

export function ChatbotProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  const loadChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      setError("");

      const response = await fetch(`${API_URL}/chats`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load chats.");
      }

      const data = await response.json();

      setChats(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load your chats.");
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const loadChat = useCallback(async (chatId) => {
    if (!chatId) return;

    try {
      setLoadingChat(true);
      setError("");

      const response = await fetch(`${API_URL}/chats/${chatId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load chat.");
      }

      const data = await response.json();

      setCurrentChat(data);

      return data;
    } catch (error) {
      console.error(error);
      setError("Unable to load this chat.");
    } finally {
      setLoadingChat(false);
    }
  }, []);

  const createChat = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat.");
      }

      const chat = await response.json();

      setCurrentChat(chat);

      setChats((previous) => [
        {
          _id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        },
        ...previous,
      ]);

      return chat;
    } catch (error) {
      console.error(error);
      setError("Unable to create a new chat.");
      return null;
    }
  }, []);

  const sendMessage = useCallback(
    async ({ content, imageUrls = [] }) => {
      if (!currentChat?._id) {
        return null;
      }

      const trimmedContent = typeof content === "string" ? content.trim() : "";

      if (!trimmedContent && imageUrls.length === 0) {
        return null;
      }

      try {
        setSending(true);
        setError("");

        const response = await fetch(
          `${API_URL}/chats/${currentChat._id}/messages`,
          {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              content: trimmedContent,
              imageUrls,
            }),
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(data?.message || "Failed to send message.");
        }

        const data = await response.json();

        setCurrentChat(data.chat);

        setChats((previous) =>
          previous
            .map((chat) =>
              chat._id === data.chat._id
                ? {
                    ...chat,
                    title: data.chat.title,
                    updatedAt: data.chat.updatedAt,
                  }
                : chat,
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
        );

        return data.message;
      } catch (error) {
        console.error(error);
        setError(error.message || "Unable to send your message.");

        return null;
      } finally {
        setSending(false);
      }
    },
    [currentChat],
  );

  const deleteChat = useCallback(
    async (chatId) => {
      if (!chatId) return false;

      try {
        setError("");

        const response = await fetch(`${API_URL}/chats/${chatId}`, {
          method: "DELETE",
          headers: getHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to delete chat.");
        }

        setChats((previous) => previous.filter((chat) => chat._id !== chatId));

        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }

        return true;
      } catch (error) {
        console.error(error);
        setError("Unable to delete this chat.");
        return false;
      }
    },
    [currentChat],
  );

  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
  }, []);

  const value = {
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
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbot must be used inside ChatbotProvider");
  }

  return context;
}
