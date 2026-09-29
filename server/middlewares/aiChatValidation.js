// server/middlewares/aiChatValidation.js

// Validates AI chat message content before it reaches the controller.
// Keeps text validation separate from AI chat processing logic.

export function validateAIChatMessage(req, res, next) {
  const { content } = req.body;

  const message = typeof content === "string" ? content.trim() : "";

  // Require non-empty text content.
  if (!message) {
    return res.status(400).json({
      message: "Message is required.",
    });
  }

  next();
}
