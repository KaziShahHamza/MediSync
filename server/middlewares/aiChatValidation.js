// server/middlewares/aiChatValidation.js

// Validates AI chat message content and image attachments.
// Keeps request validation outside the chat controller.

export function validateAIChatMessage(req, res, next) {
  const { content, imageUrls = [] } = req.body;

  const message = typeof content === "string" ? content.trim() : "";

  // Require either text content or at least one image.
  if (!message && imageUrls.length === 0) {
    return res.status(400).json({
      message: "Message or image is required.",
    });
  }

  // Ensure image attachments use the expected array format.
  if (!Array.isArray(imageUrls)) {
    return res.status(400).json({
      message: "imageUrls must be an array.",
    });
  }

  // Preserve the existing two-image attachment limit.
  if (imageUrls.length > 2) {
    return res.status(400).json({
      message: "A maximum of 2 images can be attached to one message.",
    });
  }

  // Continue only after all message constraints pass.
  next();
}
