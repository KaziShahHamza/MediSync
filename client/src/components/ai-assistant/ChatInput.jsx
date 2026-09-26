// client/src/components/ai-assistant/ChatInput.jsx

// Manages text entry, image selection, and message submission.
// Provides keyboard handling, textarea resizing, and attachment controls.

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";

export default function ChatInput({
  disabled = false,
  loading = false,
  onSend,
}) {
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Focus the message field whenever the input becomes available.
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  // Validates and sends the current message content.
  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (disabled || loading || (!trimmedContent && imageUrls.length === 0)) {
      return;
    }

    await onSend({
      content: trimmedContent,
      imageUrls,
    });

    setContent("");
    setImageUrls([]);

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
    setContent(event.target.value);

    event.target.style.height = "auto";

    event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
  };

  // Resets file selection until image upload support is connected.
  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    event.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-white shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
      {/* Display selected image previews when attachments exist. */}
      {imageUrls.length > 0 && (
        <div className="flex gap-2 px-3 pt-3">
          {imageUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative">
              <img
                src={url}
                alt={`Attachment ${index + 1}`}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setImageUrls((previous) =>
                    previous.filter((_, imageIndex) => imageIndex !== index),
                  )
                }
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Provide the primary message composition field. */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        rows={1}
        placeholder="Ask about your health..."
        className="block max-h-40 min-h-[52px] w-full resize-none border-0 bg-transparent px-4 py-3.5 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {/* Provide attachment and message submission controls. */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || loading}
            className="btn-icon text-slate-500 hover:text-blue-600"
            aria-label="Attach image"
            title="Attach image"
          >
            <ImagePlus size={19} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            disabled || loading || (!content.trim() && imageUrls.length === 0)
          }
          className="btn-primary flex h-10 w-10 items-center justify-center rounded-xl p-0 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send size={17} />
          )}
        </button>
      </div>
    </div>
  );
}
