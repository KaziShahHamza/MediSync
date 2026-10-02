// client/src/hooks/useAssistant.js

// Coordinates assistant page state, conversation lifecycle, and UI actions.
// Handles chat initialization, selection, creation, suggestions, and message sending.
// Manages conversation scrolling and page-level assistant state.

import { useEffect, useRef, useState } from "react";

import { useChatbot } from "../context/ChatbotContext";

import {
  DEFAULT_MESSAGE_LIMIT,
  getUserMessageCount,
} from "../utils/chatbotHelpers";

export function useAssistant() {
  const {
    chats,
    currentChat,
    loadingChats,
    loadingChat,
    sending,
    error,
    chatUsage,
    canCreateChat,
    loadChats,
    loadChat,
    createChat,
    sendMessage,
    deleteChat,
  } = useChatbot();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState("");
  const [errorDismissed, setErrorDismissed] = useState(false);

  const initializationRef = useRef(false);
  const messagesContainerRef = useRef(null);
  const previousChatIdRef = useRef(null);
  const previousMessageCountRef = useRef(0);

  const dailyChatsCreated = chatUsage.dailyChatCount;
  const dailyChatLimit = chatUsage.dailyChatLimit;
  const dailyLimitReached = !canCreateChat;

  const currentUserMessageCount = getUserMessageCount(currentChat);

  const conversationLimitReached =
    currentUserMessageCount >= DEFAULT_MESSAGE_LIMIT;

  // Scrolls the conversation container to the latest message.
  function scrollToBottom(behavior = "auto") {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }

  // Loads or creates the active conversation when the assistant is opened.
  useEffect(() => {
    if (initializationRef.current || currentChat?._id) {
      return;
    }

    initializationRef.current = true;

    async function initializeAssistant() {
      const loadedChats = await loadChats();

      if (loadedChats.length > 0) {
        await loadChat(loadedChats[0]._id);
        return;
      }

      await createChat();
    }

    initializeAssistant();
  }, [currentChat?._id, loadChats, loadChat, createChat]);

  // Keeps the conversation positioned at the latest message when the chat or message list changes.
  useEffect(() => {
    const chatId = currentChat?._id;
    const messageCount = currentChat?.messages?.length || 0;

    if (!chatId || loadingChat) {
      return;
    }

    const chatChanged = previousChatIdRef.current !== chatId;
    const messagesChanged = previousMessageCountRef.current !== messageCount;

    if (chatChanged || messagesChanged) {
      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    }

    previousChatIdRef.current = chatId;
    previousMessageCountRef.current = messageCount;
  }, [currentChat, loadingChat]);

  // Keeps the conversation at the bottom while the assistant response is being generated.
  useEffect(() => {
    if (!sending) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });
  }, [sending]);

  // Reopens the error banner whenever a new error is received.
  useEffect(() => {
    if (error) {
      setErrorDismissed(false);
    }
  }, [error]);

  // Opens the selected conversation and closes the mobile sidebar.
  async function handleSelectChat(chatId) {
    setSuggestedPrompt("");

    await loadChat(chatId);

    setSidebarOpen(false);
  }

  // Creates a new conversation only when the server-backed daily quota allows it.
  async function handleNewChat() {
    if (dailyLimitReached) {
      return;
    }

    setSuggestedPrompt("");

    const createdChat = await createChat();

    if (createdChat) {
      setSidebarOpen(false);
    }
  }

  // Places a predefined health question into the message composer.
  function handleSuggestion(prompt) {
    if (conversationLimitReached || sending) {
      return;
    }

    setSuggestedPrompt(prompt);
  }

  // Sends a text message through the active conversation.
  async function handleSendMessage({ content }) {
    if (conversationLimitReached || sending) {
      return;
    }

    await sendMessage({
      content,
    });

    setSuggestedPrompt("");
  }

  return {
    chats,
    currentChat,
    loadingChats,
    loadingChat,
    sending,
    error,
    errorDismissed,

    sidebarOpen,
    suggestedPrompt,

    dailyChatsCreated,
    dailyChatLimit,

    currentUserMessageCount,
    conversationLimitReached,

    messagesContainerRef,

    setSidebarOpen,
    setErrorDismissed,

    handleSelectChat,
    handleNewChat,
    handleSuggestion,
    handleSendMessage,
    deleteChat,
  };
}
