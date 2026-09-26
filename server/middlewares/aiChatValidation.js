// server/middlewares/aiChatValidation.js

// Validates AI chat messages and image attachment limits.
// Keeps request validation separate from controller logic.

export function validateAIChatMessage(req, res, next) {
  const { content, imageUrls = [] } = req.body;

  const message = typeof content === "string" ? content.trim() : "";

  // Require text content or at least one image.
  if (!message && imageUrls.length === 0) {
    return res.status(400).json({
      message: "Message or image is required.",
    });
  }

  // Ensure image attachments use an array.
  if (!Array.isArray(imageUrls)) {
    return res.status(400).json({
      message: "imageUrls must be an array.",
    });
  }

  // Limit each message to two image attachments.
  if (imageUrls.length > 2) {
    return res.status(400).json({
      message: "A maximum of 2 images can be attached to one message.",
    });
  }

  next();
}
