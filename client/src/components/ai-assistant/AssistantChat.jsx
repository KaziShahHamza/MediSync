// client/src/components/ai-assistant/AssistantChat.jsx

// Renders the active assistant conversation and message composer.
// Displays errors, loading states, messages, suggestions, and conversation limits.
// Keeps conversation presentation separate from page-level assistant state management.

import { X } from "lucide-react";

import { DEFAULT_MESSAGE_LIMIT } from "../../utils/chatbotHelpers";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatEmptyState from "./ChatEmptyState";

export default function AssistantChat({
  currentChat,
  loadingChat = false,
  loadingChats = false,
  sending = false,
  error = "",
  errorDismissed = false,
  setErrorDismissed,
  conversationLimitReached = false,
  currentUserMessageCount = 0,
  suggestedPrompt = "",
  messagesContainerRef,
  onSuggestion,
  onSendMessage,
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      {/* Displays assistant errors when present. */}
      {error && !errorDismissed && (
        <div className="flex shrink-0 items-start gap-3 border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
          <p className="min-w-0 flex-1 leading-5">{error}</p>

          <button
            type="button"
            onClick={() => setErrorDismissed(true)}
            className="shrink-0 rounded-md p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
            aria-label="Dismiss error"
            title="Dismiss"
          >
            <X size={16} />
          </button>
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

              {/* Shows the assistant typing state directly below the optimistic user message. */}
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
          <ChatEmptyState onSuggestion={onSuggestion} />
        )}
      </div>

      {/* Provides the fixed message composer at the bottom of the workspace. */}
      <div className="shrink-0 border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[680px] px-4 py-3 sm:px-6 sm:py-4">
          {conversationLimitReached && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center">
              <p className="text-xs font-medium text-amber-800">
                This chat has reached its {DEFAULT_MESSAGE_LIMIT}-message limit.
              </p>

              <p className="mt-0.5 text-[11px] text-amber-700">
                Create a new chat to continue your conversation.
              </p>
            </div>
          )}

          <p className="mb-1 text-center text-[11px] leading-4 text-slate-400">
            {conversationLimitReached
              ? "Create a new chat to continue."
              : `${currentUserMessageCount}/${DEFAULT_MESSAGE_LIMIT} messages used in this chat.`}
          </p>

          <ChatInput
            disabled={!currentChat || loadingChat || conversationLimitReached}
            loading={sending}
            initialContent={suggestedPrompt}
            onSend={onSendMessage}
          />

          <p className="mt-1 text-center text-[11px] leading-4 text-red-400">
            MediSync Health Assistant provides general health information and is
            not an alternative for a doctor.
          </p>
        </div>
      </div>
    </section>
  );
}
