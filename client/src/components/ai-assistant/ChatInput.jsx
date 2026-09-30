// client/src/components/ai-assistant/ChatInput.jsx

// Manages text entry and message submission for the health assistant.
// Validates message content before submission and prevents unsafe payloads.
// Provides keyboard handling, textarea resizing, autofocus, and loading states.

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const MAX_MESSAGE_LENGTH = 350;

// Detects obvious HTML/script payloads and code-like input.
function containsUnsafeContent(value) {
  const normalized = value.toLowerCase();

  const unsafePatterns = [
    /<\s*script\b/i,
    /<\s*\/\s*script\s*>/i,
    /<\s*iframe\b/i,
    /<\s*object\b/i,
    /<\s*embed\b/i,
    /<\s*style\b/i,
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /on[a-z]+\s*=\s*["']/i,
    /<\s*[a-z][^>]*>/i,
    /```[\s\S]*```/i,
  ];

  return unsafePatterns.some((pattern) => pattern.test(normalized));
}

// Removes control characters while preserving normal whitespace and Unicode text.
function sanitizeInput(value) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, MAX_MESSAGE_LENGTH);
}

export default function ChatInput({
  disabled = false,
  loading = false,
  initialContent = "",
  onSend,
}) {
  const [content, setContent] = useState(initialContent);
  const [validationError, setValidationError] = useState("");

  const textareaRef = useRef(null);

  // Updates the composer when a predefined suggestion is selected.
  useEffect(() => {
    if (!initialContent) {
      return;
    }

    setContent(initialContent);
    setValidationError("");

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;

      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    });
  }, [initialContent]);

  // Clears validation feedback whenever the input becomes disabled.
  useEffect(() => {
    if (disabled) {
      setValidationError("");
    }
  }, [disabled]);

  // Focuses the message field whenever the input becomes available.
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  // Validates the current message before sending it to the context.
  const validateMessage = (value) => {
    const trimmedContent = value.trim();

    if (!trimmedContent) {
      return "Please enter a message.";
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    }

    if (containsUnsafeContent(trimmedContent)) {
      return "Please enter a normal health question. Scripts, HTML, and code are not allowed.";
    }

    return "";
  };

  // Validates and sends the current text message.
  const handleSubmit = async () => {
    if (disabled || loading) {
      return;
    }

    const trimmedContent = content.trim();
    const errorMessage = validateMessage(trimmedContent);

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    setValidationError("");

    try {
      await onSend({
        content: trimmedContent,
      });

      setContent("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch {
      // The chatbot context displays request errors.
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
    const nextValue = sanitizeInput(textarea.value);

    setContent(nextValue);

    if (validationError) {
      setValidationError("");
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  };

  const isSubmitDisabled =
    disabled || loading || !content.trim() || Boolean(validationError);

  return (
    <div>
      <div
        className={`mx-auto w-full max-w-[680px] rounded-2xl border bg-white shadow-sm transition-colors ${
          validationError
            ? "border-red-300 focus-within:border-red-400"
            : "border-slate-300 focus-within:border-blue-700"
        }`}
      >
        {/* Provides the text-only message composition field. */}
        <div className="flex items-end gap-2 px-1.5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Ask about your health..."
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "chat-input-error" : undefined}
            className="ai-chat-textarea block h-auto max-h-[100px] min-h-[44px] min-w-0 flex-1 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent px-1 py-1 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {/* Submits the current message. */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="my-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Displays client-side message validation feedback. */}
      {validationError && (
        <div
          id="chat-input-error"
          className="mx-auto mt-1.5 max-w-[680px] px-1 text-[11px] leading-4 text-red-600"
        >
          {validationError}
        </div>
      )}

      {/* Displays the current message length without creating additional UI noise. */}
      {!validationError && content.length > MAX_MESSAGE_LENGTH * 0.85 && (
        <p className="mx-auto mt-1 max-w-[680px] px-1 text-right text-[10px] text-slate-400">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}
