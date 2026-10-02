// client/src/pages/Assistant.jsx

// Renders the AI health assistant page and conversation workspace.
// Delegates assistant state and conversation behavior to the useAssistant hook.
// Keeps the page focused on layout and responsive sidebar composition.

import { useAssistant } from "../hooks/useAssistant";

import AssistantSidebar from "../components/ai-assistant/AssistantSidebar";
import AssistantChat from "../components/ai-assistant/AssistantChat";

export default function Assistant() {
  const {
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
  } = useAssistant();

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
              dailyChatsCreated={dailyChatsCreated}
              dailyChatLimit={dailyChatLimit}
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
                  dailyChatsCreated={dailyChatsCreated}
                  dailyChatLimit={dailyChatLimit}
                  onSelectChat={handleSelectChat}
                  onNewChat={handleNewChat}
                  onDeleteChat={deleteChat}
                  onClose={() => setSidebarOpen(false)}
                />
              </aside>
            </div>
          )}

          {/* Main assistant conversation. */}
          <AssistantChat
            currentChat={currentChat}
            loadingChat={loadingChat}
            loadingChats={loadingChats}
            sending={sending}
            error={error}
            errorDismissed={errorDismissed}
            setErrorDismissed={setErrorDismissed}
            conversationLimitReached={conversationLimitReached}
            currentUserMessageCount={currentUserMessageCount}
            suggestedPrompt={suggestedPrompt}
            messagesContainerRef={messagesContainerRef}
            onSuggestion={handleSuggestion}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </main>
  );
}
