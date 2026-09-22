// client/src/components/blood/ManagementTokenNotice.jsx
// Displays a unique management token code that allows non-authenticated users to modify or delete their blood request.

import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";

// Notification panel displaying private management token upon post creation
export default function ManagementTokenNotice({
  managementToken,
  copied,
  onCopy,
}) {
  // Hide component if no token exists
  if (!managementToken) return null;

  return (
    // Management token banner container
    <div className="alert alert-success mb-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            Your blood request was posted successfully.
          </p>

          <p className="mt-1 text-sm">
            Save this private management code. You can use it to edit or delete
            this request later.
          </p>

          {/* Token value display and copy action bar */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Token display element */}
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <ShieldCheck size={17} className="shrink-0 text-sky-600" />

              <code className="min-w-0 flex-1 break-all text-sm font-semibold text-slate-800">
                {managementToken}
              </code>
            </div>

            {/* Copy token to clipboard button */}
            <button
              type="button"
              onClick={onCopy}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Copy size={16} />

              {copied ? "Copied" : "Copy Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
