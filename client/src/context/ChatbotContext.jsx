// client/src/context/ChatbotContext.jsx

// Manages AI assistant conversations, quotas, active chat state, and chat actions.
// Provides optimistic user-message rendering while the assistant response is generated.
// Connects the assistant UI to the authenticated text-only AI chat API.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ChatbotContext = createContext(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai`;

const DEFAULT_MESSAGE_LIMIT = 20;
const DEFAULT_DAILY_CHAT_LIMIT = 2;
const DEFAULT_TOTAL_CHAT_LIMIT = 10;

function getFriendlyChatError(data, status) {
  if (data?.code === "AI_TIMEOUT") {
    return "The response is taking longer than expected. Please try asking a shorter or more focused question.";
  }

  if (data?.code === "AI_RATE_LIMIT") {
    return "The assistant is temporarily busy. Please wait a moment and try again.";
  }

  if (data?.code === "AI_EMPTY_RESPONSE") {
    return "I couldn't generate a useful response. Please try rephrasing your question.";
  }

  if (status >= 500) {
    return "I couldn't generate a response right now. Please try again in a moment.";
  }

  return data?.message || "Something went wrong. Please try again.";
}

export function ChatbotProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [chatUsage, setChatUsage] = useState({
    dailyChatCount: 0,
    dailyChatLimit: DEFAULT_DAILY_CHAT_LIMIT,
    dailyChatsRemaining: DEFAULT_DAILY_CHAT_LIMIT,
    totalChatCount: 0,
    totalChatLimit: DEFAULT_TOTAL_CHAT_LIMIT,
  });

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

  // Creates a new conversation when the server quota allows it.
  const createChat = useCallback(async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(
          data.message || "Failed to create conversation.",
        );

        error.code = data.code;

        throw error;
      }

      setCurrentChat(data);

      setChats((previous) => [
        {
          ...data,
          userMessageCount: 0,
          messageLimit: DEFAULT_MESSAGE_LIMIT,
          reachedMessageLimit: false,
        },
        ...previous.filter((chat) => chat._id !== data._id),
      ]);

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
  }, [getAuthHeaders]);

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

      const currentUserMessageCount =
        typeof currentChat.userMessageCount === "number"
          ? currentChat.userMessageCount
          : currentChat.messages?.filter((message) => message.role === "user")
              .length || 0;

      if (currentUserMessageCount >= DEFAULT_MESSAGE_LIMIT) {
        const message =
          "This chat has reached its 20-message limit. Please create a new chat.";

        setError(message);

        const error = new Error(message);
        error.code = "CHAT_MESSAGE_LIMIT";

        return null;
      }

      const optimisticMessageId = `optimistic-${Date.now()}`;

      const optimisticMessage = {
        _id: optimisticMessageId,
        role: "user",
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      };

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
          const error = new Error(data.message || "Failed to send message.");

          error.code = data.code;

          throw error;
        }

        const updatedChat = data.chat;

        if (!updatedChat) {
          throw new Error("Invalid chat response from the server.");
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
              (message) => message._id !== optimisticMessageId,
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
    [currentChat, getAuthHeaders, sending],
  );

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
          throw new Error(data.message || "Failed to delete conversation.");
        }

        setChats((previous) => previous.filter((chat) => chat._id !== chatId));

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
    [currentChat, getAuthHeaders],
  );

  // Clears the active conversation without deleting it from the server.
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
  }, []);

  const currentChatMessageCount = useMemo(() => {
    if (!currentChat) {
      return 0;
    }

    if (typeof currentChat.userMessageCount === "number") {
      return currentChat.userMessageCount;
    }

    return (
      currentChat.messages?.filter((message) => message.role === "user")
        .length || 0
    );
  }, [currentChat]);

  const currentChatReachedLimit =
    currentChatMessageCount >= DEFAULT_MESSAGE_LIMIT;

  const canCreateChat = chatUsage.dailyChatsRemaining > 0;

  return (
    <ChatbotContext.Provider
      value={{
        chats,
        currentChat,
        loadingChats,
        loadingChat,
        sending,
        error,

        chatUsage,
        canCreateChat,
        currentChatMessageCount,
        currentChatReachedLimit,
        chatMessageLimit: DEFAULT_MESSAGE_LIMIT,

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
