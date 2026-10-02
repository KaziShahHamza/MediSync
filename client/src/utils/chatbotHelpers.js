// client/src/utils/chatbotHelpers.js

// Defines shared AI chatbot limits and pure helper functions.
// Keeps validation, error mapping, and message-count logic outside React state management.
// Provides reusable helpers for chatbot context and action hooks.

export const DEFAULT_MESSAGE_LIMIT = 20;
export const DEFAULT_DAILY_CHAT_LIMIT = 2;
export const DEFAULT_TOTAL_CHAT_LIMIT = 10;

// Converts API errors into user-friendly assistant messages.
export function getFriendlyChatError(data, status) {
  if (data?.code === "DAILY_CHAT_LIMIT") {
    return "You've reached today's 2-chat limit. You can create a new conversation tomorrow.";
  }

  if (data?.code === "CHAT_MESSAGE_LIMIT") {
    return "This chat has reached its 20-message limit. Please create a new chat to continue.";
  }

  if (data?.code === "CHAT_MESSAGE_TOO_LONG") {
    return "Your message is too long. Please keep it within 350 characters.";
  }

  if (data?.code === "INVALID_CHAT_MESSAGE") {
    return "Please enter a valid health question.";
  }

  if (data?.code === "AI_TIMEOUT") {
    return "The response is taking longer than expected. Please try asking a shorter or more focused question.";
  }

  if (data?.code === "AI_RATE_LIMIT") {
    return "The assistant is temporarily busy. Please wait a moment and try again.";
  }

  if (data?.code === "AI_EMPTY_RESPONSE") {
    return "I couldn't generate a useful response. Please try rephrasing your question.";
  }

  if (data?.code === "AI_CONTEXT_UNAVAILABLE") {
    return "Your health information is temporarily unavailable. Please try again in a moment.";
  }

  if (data?.code === "AI_GENERATION_FAILED") {
    return "I couldn't answer that right now. Please try again in a moment.";
  }

  if (status >= 500) {
    return "I couldn't generate a response right now. Please try again in a moment.";
  }

  return data?.message || "Something went wrong. Please try again.";
}

// Returns the number of user messages in a conversation.
export function getUserMessageCount(chat) {
  if (!chat) {
    return 0;
  }

  if (typeof chat.userMessageCount === "number") {
    return chat.userMessageCount;
  }

  return (
    chat.messages?.filter((message) => message.role === "user").length || 0
  );
}

// Creates the temporary user message shown while the server generates a response.
export function createOptimisticMessage(content) {
  return {
    _id: `optimistic-${Date.now()}`,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
}

// Creates the initial daily and total chatbot usage state.
export function getInitialChatUsage() {
  return {
    dailyChatCount: 0,
    dailyChatLimit: DEFAULT_DAILY_CHAT_LIMIT,
    dailyChatsRemaining: DEFAULT_DAILY_CHAT_LIMIT,
    totalChatCount: 0,
    totalChatLimit: DEFAULT_TOTAL_CHAT_LIMIT,
  };
}

// Normalizes usage returned by the backend.
export function normalizeChatUsage(usage = {}) {
  return {
    dailyChatCount:
      typeof usage.dailyChatCount === "number" ? usage.dailyChatCount : 0,

    dailyChatLimit:
      typeof usage.dailyChatLimit === "number"
        ? usage.dailyChatLimit
        : DEFAULT_DAILY_CHAT_LIMIT,

    dailyChatsRemaining:
      typeof usage.dailyChatsRemaining === "number"
        ? usage.dailyChatsRemaining
        : DEFAULT_DAILY_CHAT_LIMIT,

    totalChatCount:
      typeof usage.totalChatCount === "number" ? usage.totalChatCount : 0,

    totalChatLimit:
      typeof usage.totalChatLimit === "number"
        ? usage.totalChatLimit
        : DEFAULT_TOTAL_CHAT_LIMIT,
  };
}
