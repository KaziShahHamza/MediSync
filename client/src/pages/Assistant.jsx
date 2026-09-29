// client/src/pages/Assistant.jsx

// Renders the AI health assistant workspace and conversation interface.
// Initializes conversations and keeps the active conversation scrolled to the latest message.
// Connects chat actions to the assistant sidebar, messages, and composer.

import { useEffect, useRef, useState } from "react";

import { useChatbot } from "../context/ChatbotContext";

import AssistantSidebar from "../components/ai-assistant/AssistantSidebar";
import ChatMessage from "../components/ai-assistant/ChatMessage";
import ChatInput from "../components/ai-assistant/ChatInput";
import ChatEmptyState from "../components/ai-assistant/ChatEmptyState";

export default function Assistant() {
  const {
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
  } = useChatbot();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState("");

  const initializationRef = useRef(false);
  const messagesContainerRef = useRef(null);
  const previousChatIdRef = useRef(null);
  const previousMessageCountRef = useRef(0);

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

  // Keeps the conversation positioned at the latest message when a chat is opened.
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

  // Keeps the view at the bottom while the assistant response is being generated.
  useEffect(() => {
    if (!sending) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });
  }, [sending]);

  // Opens the selected conversation and closes the mobile sidebar.
  async function handleSelectChat(chatId) {
    setSuggestedPrompt("");

    await loadChat(chatId);

    setSidebarOpen(false);
  }

  // Creates a new conversation and closes the mobile sidebar.
  async function handleNewChat() {
    setSuggestedPrompt("");

    await createChat();

    setSidebarOpen(false);
  }

  // Places a predefined health question into the message composer.
  function handleSuggestion(prompt) {
    setSuggestedPrompt(prompt);
  }

  // Sends a text message through the active conversation.
  async function handleSendMessage({ content }) {
    await sendMessage({
      content,
    });

    setSuggestedPrompt("");
  }

  return (
    <main className="h-[calc(100vh-67px)] overflow-hidden bg-slate-50">
      <div className="mx-auto h-full w-full max-w-[1600px] overflow-hidden">
        <div className="flex h-full min-h-0 overflow-hidden bg-white">
          {/* Desktop assistant sidebar. */}
          <aside className="hidden w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-slate-50 lg:flex lg:flex-col">
            <AssistantSidebar
              chats={chats}
              currentChat={currentChat}
              loading={loadingChats}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={deleteChat}
            />
          </aside>

          {/* Mobile assistant sidebar overlay. */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close chat sidebar"
                className="absolute inset-0 bg-slate-900/30"
                onClick={() => setSidebarOpen(false)}
              />

              <aside className="relative flex h-full w-[85%] max-w-sm flex-col overflow-hidden bg-white shadow-xl">
                <AssistantSidebar
                  chats={chats}
                  currentChat={currentChat}
                  loading={loadingChats}
                  mobile
                  onSelectChat={handleSelectChat}
                  onNewChat={handleNewChat}
                  onDeleteChat={deleteChat}
                  onClose={() => setSidebarOpen(false)}
                />
              </aside>
            </div>
          )}

          {/* Main conversation area. */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
            {/* Displays assistant errors when present. */}
            {error && (
              <div className="shrink-0 border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
                {error}
              </div>
            )}

            {/* Displays the active conversation or empty state. */}
            <div
              ref={messagesContainerRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {loadingChat || loadingChats ? (
                <div className="flex h-full items-center justify-center px-6">
                  <div className="text-sm text-slate-500">
                    Loading conversation...
                  </div>
                </div>
              ) : currentChat?.messages?.length > 0 ? (
                <div className="mx-auto w-full max-w-[680px] px-4 py-6 sm:px-6 sm:py-8">
                  <div className="space-y-6">
                    {currentChat.messages.map((message) => (
                      <ChatMessage
                        key={message._id || message.createdAt}
                        message={message}
                      />
                    ))}

                    {sending && (
                      <ChatMessage
                        message={{
                          role: "assistant",
                          content: "",
                          createdAt: new Date().toISOString(),
                        }}
                        loading
                      />
                    )}
                  </div>
                </div>
              ) : (
                <ChatEmptyState onSuggestion={handleSuggestion} />
              )}
            </div>

            {/* Provides the fixed message composer at the bottom of the workspace. */}
            <div className="shrink-0 border-t border-slate-200 bg-white">
              <div className="mx-auto w-full max-w-[680px] px-4 py-3 sm:px-6 sm:py-4">
                <ChatInput
                  disabled={!currentChat || loadingChat}
                  loading={sending}
                  initialContent={suggestedPrompt}
                  onSend={handleSendMessage}
                />

                <p className="mt-2 text-center text-[11px] leading-4 text-red-400">
                  MediSync Health Assistant provides general health information
                  and is not an alternative for a doctor.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
