// client/src/components/assistant/ChatEmptyState.jsx

import {
  Activity,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const suggestions = [
  {
    icon: HeartPulse,
    title: "Understand symptoms",
    text: "Tell me about a symptom you're experiencing.",
  },
  {
    icon: Activity,
    title: "Health information",
    text: "Ask about your stored health measurements.",
  },
  {
    icon: ShieldCheck,
    title: "Know when to seek care",
    text: "Ask whether a symptom may need medical attention.",
  },
];

export default function ChatEmptyState({
  onNewChat,
}) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <MessageCircle size={27} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900 sm:text-2xl">
          How can I help you today?
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Talk with the MediSync Health Assistant about symptoms,
          health information, and when it may be appropriate to
          seek medical care.
        </p>

        {/* Suggestions */}
        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;

            return (
              <button
                key={suggestion.title}
                type="button"
                onClick={onNewChat}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <Icon
                  size={19}
                  className="text-blue-600"
                />

                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                  {suggestion.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {suggestion.text}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mx-auto mt-7 max-w-md text-xs leading-5 text-slate-400">
          This assistant provides general health information and
          does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}