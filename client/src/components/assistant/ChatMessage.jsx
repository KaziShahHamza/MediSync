import { Bot, User } from "lucide-react";

function formatTime(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderText(text) {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, index) => (
    <span key={index}>
      {line}

      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function ChatMessage({
  message,
  loading = false,
}) {
  const isUser = message.role === "user";

  if (loading) {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Bot size={18} />
        </div>

        <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-slate-100 text-slate-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {isUser ? (
          <User size={18} />
        ) : (
          <Bot size={18} />
        )}
      </div>

      {/* Message */}
      <div
        className={`min-w-0 max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isUser
              ? "rounded-tr-md bg-blue-600 text-white"
              : "rounded-tl-md border border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {message.imageUrls?.length > 0 && (
            <div
              className={`mb-3 grid gap-2 ${
                message.imageUrls.length > 1
                  ? "grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {message.imageUrls.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="max-h-64 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="whitespace-pre-wrap break-words">
            {renderText(message.content)}
          </div>
        </div>

        {message.createdAt && (
          <p
            className={`mt-1 px-1 text-[10px] text-slate-400 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}