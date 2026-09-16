// client/src/components/assistant/ChatMessage.jsx

import { Bot, User } from "lucide-react";
import { openEmergencyWhatsApp } from "../../utils/emergencyWhatsApp";

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

function renderText(text, isUser) {
  if (!text) return null;

  /*
   * Only assistant messages get clickable phone numbers.
   *
   * Supports common Bangladesh formats such as:
   * 01867052533
   * 01867 052533
   * +8801867052533
   * 8801867052533
   */
  if (isUser) {
    return text;
  }

  const phoneRegex =
    /(?:\+?880[\s-]?1[3-9][\s-]?\d{2}[\s-]?\d{6}|01[3-9][\s-]?\d{2}[\s-]?\d{6})/g;

  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(phoneRegex)) {
    const phone = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <button
        key={`${phone}-${start}`}
        type="button"
        onClick={() => openEmergencyWhatsApp(phone)}
        className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-700 hover:decoration-blue-500"
        title="Message this contact on WhatsApp"
      >
        {phone}
      </button>
    );

    lastIndex = start + phone.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
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
          <div className="whitespace-pre-wrap break-words">
            {renderText(message.content, isUser)}
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