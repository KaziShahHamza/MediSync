// client/src/pages/Assistant.jsx

// Renders the AI health assistant page and conversation interface.
// Connects chat state and actions to desktop and mobile assistant components.

import { useEffect, useState } from "react";
import { Menu, PanelLeft } from "lucide-react";

import { useChatbot } from "../context/ChatbotContext";

import AssistantSidebar from "../components/ai-assistant/AssistantSidebar";
import ChatMessage from "../components/ai-assistant/ChatMessage";
import ChatInput from "../components/ai-assistant/ChatInput";
import ChatEmptyState from "../components/ai-assistant/ChatEmptyState";

// Provides the main assistant conversation experience.
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

  // Loads available conversations when the page mounts.
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Opens the selected conversation and closes the mobile sidebar.
  async function handleSelectChat(chatId) {
    await loadChat(chatId);
    setSidebarOpen(false);
  }

  // Creates a new conversation and closes the mobile sidebar.
  async function handleNewChat() {
    await createChat();
    setSidebarOpen(false);
  }

  // Sends a user message with any selected image attachments.
  async function handleSendMessage({ content, imageUrls = [] }) {
    await sendMessage({
      content,
      imageUrls,
    });
  }

  return (
    <main className="page">
      <div className="container">
        <div className="flex h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop assistant sidebar. */}
          <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50 lg:flex lg:flex-col">
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

              <aside className="relative flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl">
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
          <section className="flex min-w-0 flex-1 flex-col bg-white">
            {/* Conversation header. */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="btn-icon lg:hidden"
                  aria-label="Open chat history"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                    {currentChat?.title || "Health Assistant"}
                  </h1>

                  <p className="hidden text-xs text-slate-500 sm:block">
                    AI health information assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:flex"
              >
                <PanelLeft size={17} />
                Chat history
              </button>
            </header>

            {/* Displays assistant errors when present. */}
            {error && (
              <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
                {error}
              </div>
            )}

            {/* Displays the active conversation or empty state. */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loadingChat ? (
                <div className="flex h-full items-center justify-center px-6">
                  <div className="text-sm text-slate-500">
                    Loading conversation...
                  </div>
                </div>
              ) : currentChat?.messages?.length > 0 ? (
                <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
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
                <ChatEmptyState onNewChat={handleNewChat} />
              )}
            </div>

            {/* Provides the message input area. */}
            <div className="shrink-0 border-t border-slate-200 bg-white">
              <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
                <ChatInput
                  disabled={!currentChat || sending}
                  loading={sending}
                  onSend={handleSendMessage}
                />

                <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
                  MediSync Health Assistant provides general health information
                  and is not a substitute for a doctor.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
