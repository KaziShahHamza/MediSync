// client/src/context/ChatbotContext.jsx

// Manages AI assistant conversation state, quotas, and active chat state.
// Delegates asynchronous chat operations to the chatbot action hook.
// Keeps the existing useChatbot API unchanged for all consuming components.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import useChatbotActions from "../hooks/useChatbotActions";

import {
  DEFAULT_DAILY_CHAT_LIMIT,
  DEFAULT_MESSAGE_LIMIT,
  getInitialChatUsage,
  getUserMessageCount,
  normalizeChatUsage,
} from "../utils/chatbotHelpers";

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [chatUsage, setChatUsage] = useState(getInitialChatUsage());

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Provides authentication headers for chatbot API requests.
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const {
    loadChats,
    loadChat,
    createChat,
    sendMessage,
    deleteChat,
    clearCurrentChat,
  } = useChatbotActions({
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
  });

  const normalizedChatUsage = useMemo(
    () => normalizeChatUsage(chatUsage),
    [chatUsage],
  );

  const currentChatMessageCount = useMemo(
    () => getUserMessageCount(currentChat),
    [currentChat],
  );

  const currentChatReachedLimit =
    currentChatMessageCount >= DEFAULT_MESSAGE_LIMIT;

  // Uses persistent server-backed usage to determine whether another chat can be created.
  const canCreateChat = normalizedChatUsage.dailyChatsRemaining > 0;

  return (
    <ChatbotContext.Provider
      value={{
        chats,
        currentChat,

        loadingChats,
        loadingChat,
        sending,
        error,

        chatUsage: normalizedChatUsage,
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
