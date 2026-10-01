// client/src/components/ai-assistant/AssistantSidebar.jsx

// Renders the conversation history sidebar for the health assistant.
// Handles conversation selection, creation, deletion, and mobile closing.
// Displays server-backed conversation counts and daily chat creation usage.

import { MessageSquare, Plus, Trash2, X } from "lucide-react";

// Formats the conversation's last activity date for compact sidebar display.
function formatChatDate(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

export default function AssistantSidebar({
  chats = [],
  currentChat,
  loading = false,
  mobile = false,
  dailyChatsCreated = 0,
  dailyChatLimit = 2,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClose,
}) {
  const dailyLimitReached = dailyChatsCreated >= dailyChatLimit;
  const remainingDailyChats = Math.max(dailyChatLimit - dailyChatsCreated, 0);

  // Handles chat deletion without triggering conversation selection.
  const handleDelete = async (event, chatId) => {
    event.stopPropagation();

    if (!onDeleteChat) return;

    await onDeleteChat(chatId);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Renders sidebar heading and mobile close control. */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:h-16">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Health Assistant
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Conversations · {chats.length} of 10
          </p>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close chat history"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Provides the action for starting a new conversation. */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          disabled={dailyLimitReached}
          className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="mt-2 text-center">
          {dailyLimitReached ? (
            <>
              <p className="text-[11px] font-medium text-amber-700">
                Daily chat limit reached
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                You can create up to {dailyChatLimit} new chats per day.
              </p>
            </>
          ) : dailyChatsCreated > 0 ? (
            <>
              <p className="text-[11px] font-medium text-slate-500">
                {dailyChatsCreated} of {dailyChatLimit} chats created today
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-amber-600">
                {remainingDailyChats === 1
                  ? "You have 1 new chat remaining today."
                  : `You have ${remainingDailyChats} new chats remaining today.`}
              </p>
            </>
          ) : (
            <p className="text-[10px] leading-4 text-slate-400">
              You can create up to {dailyChatLimit} new chats per day.
            </p>
          )}
        </div>
      </div>

      {/* Renders loading, empty, or available conversation states. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="space-y-2 px-2 py-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <MessageSquare size={22} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">No conversations yet.</p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Start a new chat to talk with the Health Assistant.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => {
              const active = currentChat?._id === chat._id;
              const messageCount = chat.userMessageCount ?? 0;
              const chatLimitReached = messageCount >= 20;

              return (
                <div
                  key={chat._id}
                  className={`group flex items-center gap-1 rounded-xl transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectChat(chat._id)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                  >
                    <MessageSquare
                      size={16}
                      className={`shrink-0 ${
                        active ? "text-blue-600" : "text-slate-400"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {chat.title || "New Chat"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {formatChatDate(chat.updatedAt)}
                        {" · "}
                        {messageCount}/20{" "}
                        {messageCount === 1 ? "message" : "messages"}
                      </p>

                      {chatLimitReached && (
                        <p className="mt-0.5 text-[10px] font-medium text-amber-600">
                          Chat limit reached
                        </p>
                      )}
                    </div>
                  </button>

                  {onDeleteChat && (
                    <button
                      type="button"
                      onClick={(event) => handleDelete(event, chat._id)}
                      className="mr-1 rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Delete ${chat.title || "chat"}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Keeps the emergency guidance visible below conversation history. */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="rounded-xl bg-slate-100 px-3 py-2.5">
          <p className="text-[11px] leading-4 text-slate-500">
            For emergencies or severe symptoms, seek immediate medical care.
          </p>
        </div>
      </div>
    </div>
  );
}
