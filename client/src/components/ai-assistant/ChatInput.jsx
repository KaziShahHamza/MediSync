// client/src/components/ai-assistant/ChatInput.jsx

// Manages text entry and message submission for the health assistant.
// Provides keyboard handling, textarea resizing, autofocus, and loading states.

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({
  disabled = false,
  loading = false,
  initialContent = "",
  onSend,
}) {
  const [content, setContent] = useState(initialContent);

  const textareaRef = useRef(null);

  // Updates the composer when a predefined suggestion is selected.
  useEffect(() => {
    if (!initialContent) return;

    setContent(initialContent);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      textarea.focus();
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;

      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    });
  }, [initialContent]);

  // Focuses the message field whenever the input becomes available.
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  // Validates and sends the current message content.
  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (disabled || loading || !trimmedContent) {
      return;
    }

    await onSend({
      content: trimmedContent,
    });

    setContent("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Sends the message when Enter is pressed without Shift.
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // Updates content and dynamically adjusts textarea height.
  const handleInput = (event) => {
    const textarea = event.target;

    setContent(textarea.value);

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  };

  return (
    <div className="mx-auto w-full max-w-[680px] rounded-2xl border border-slate-300 bg-white shadow-sm transition-colors focus-within:border-blue-700">
      {/* Provides the primary message composition field. */}
      <div className="flex items-end gap-2 px-1.5">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          rows={1}
          placeholder="Ask about your health..."
          className="ai-chat-textarea block h-auto max-h-[100px] min-h-[44px] min-w-0 flex-1 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent px-1 py-1 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {/* Message submission button. */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || loading || !content.trim()}
          className="flex h-8 w-8 my-auto shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Send size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
