// server/middlewares/aiChatValidation.js

// Validates AI chat message content before it reaches the controller.
// Rejects empty, oversized, executable, and HTML-like payloads.

const MAX_MESSAGE_LENGTH = 350;

const UNSAFE_PATTERNS = [
  /<\s*script\b/i,
  /<\s*\/\s*script\s*>/i,
  /javascript\s*:/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /<\s*form\b/i,
  /<\s*style\b/i,
  /on[a-z]+\s*=/i,
  /```[\s\S]*```/i,
];

// Validates and normalizes chat message content.
export function validateAIChatMessage(req, res, next) {
  const content =
    typeof req.body?.content === "string" ? req.body.content.trim() : "";

  if (!content) {
    return res.status(400).json({
      message: "Message is required.",
      code: "MESSAGE_REQUIRED",
    });
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      code: "MESSAGE_TOO_LONG",
    });
  }

  const containsUnsafePattern = UNSAFE_PATTERNS.some((pattern) =>
    pattern.test(content),
  );

  if (containsUnsafePattern) {
    return res.status(400).json({
      message: "Please send a normal text message without scripts or code.",
      code: "UNSAFE_MESSAGE",
    });
  }

  req.body.content = content;

  next();
}

export { MAX_MESSAGE_LENGTH };
