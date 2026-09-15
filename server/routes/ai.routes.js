// server/routes/ai.routes.js

import express from "express";
import auth from "../middleware/auth.js";
import AIReport from "../models/AIReport.js";
import { getAIHealthData } from "../services/dashboardService.js";
import { generateAIHealthSummary } from "../services/aiService.js";
import AIChat from "../models/AIChat.js";
import { generateChatResponse } from "../services/aiChatService.js";

const router = express.Router();

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const GENERATE_COOLDOWN_MS = 10 * 60 * 1000;

// Check if user has enough health data for AI analysis
function hasMeaningfulHealthData(data) {
  const hasProfileData =
    data.profile &&
    (data.profile.gender ||
      data.profile.height?.feet ||
      data.profile.height?.inches ||
      data.profile.allergies ||
      data.profile.chronicIllnesses?.length);

  return Boolean(
    data.bloodPressure ||
    data.diabetes ||
    data.weight ||
    data.bmi ||
    data.medicines.length ||
    hasProfileData,
  );
}

// GET AI summary
router.get("/summary", auth, async (req, res) => {
  try {
    const existingReport = await AIReport.findOne({
      user: req.userId,
    });

    // Return cached summary if it is less than 7 days old
    if (existingReport) {
      const reportIsFresh =
        Date.now() - new Date(existingReport.generatedAt).getTime() <
        WEEK_IN_MS;

      if (reportIsFresh) {
        return res.json({
          summary: existingReport.summary,
          generatedAt: existingReport.generatedAt,
          cached: true,
        });
      }
    }

    const healthData = await getAIHealthData(req.userId);

    // Don't call Gemini if user has no meaningful data
    if (!hasMeaningfulHealthData(healthData)) {
      return res.json({
        summary: null,
        generatedAt: null,
        cached: false,
        message: "Add health information to receive personalized AI insights.",
      });
    }

    // Generate new AI summary
    const summary = await generateAIHealthSummary(healthData);

    const report = await AIReport.findOneAndUpdate(
      {
        user: req.userId,
      },
      {
        summary,
        generatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      summary: report.summary,
      generatedAt: report.generatedAt,
      cached: false,
    });
  } catch (error) {
    console.error("Failed to get AI health summary:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
});

// POST manually generate a fresh summary
router.post("/summary/generate", auth, async (req, res) => {
  try {
    // Check existing report before generating
    const existingReport = await AIReport.findOne({
      user: req.userId,
    });

    // Prevent repeated manual AI requests within 10 minutes
    if (existingReport?.generatedAt) {
      const generatedAt = new Date(existingReport.generatedAt).getTime();

      const cooldownEndsAt = generatedAt + GENERATE_COOLDOWN_MS;

      const remainingTime = cooldownEndsAt - Date.now();

      if (remainingTime > 0) {
        const remainingSeconds = Math.ceil(remainingTime / 1000);

        return res.status(429).json({
          message: "Please wait before generating another AI summary.",
          remainingSeconds,
          cooldownEndsAt: new Date(cooldownEndsAt).toISOString(),
        });
      }
    }

    const healthData = await getAIHealthData(req.userId);

    // Don't call Gemini if user has no meaningful data
    if (!hasMeaningfulHealthData(healthData)) {
      return res.status(400).json({
        message: "Add health information before generating an AI summary.",
      });
    }

    const summary = await generateAIHealthSummary(healthData);

    const report = await AIReport.findOneAndUpdate(
      {
        user: req.userId,
      },
      {
        summary,
        generatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      summary: report.summary,
      generatedAt: report.generatedAt,
      cached: false,
    });
  } catch (error) {
    console.error("Manual AI summary generation failed:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
});

// Get recent chats
router.get("/chats", auth, async (req, res) => {
  try {
    const chats = await AIChat.find({
      user: req.userId,
    })
      .select("_id title createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    res.json(chats);
  } catch (error) {
    console.error("Failed to fetch AI chats:", error);
    res.status(500).json({
      message: "Failed to fetch chats.",
    });
  }
});

router.get("/chats/:chatId", auth, async (req, res) => {
  try {
    const chat = await AIChat.findOne({
      _id: req.params.chatId,
      user: req.userId,
    }).lean();

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("Failed to fetch AI chat:", error);

    res.status(500).json({
      message: "Failed to fetch chat.",
    });
  }
});

router.post("/chats", auth, async (req, res) => {
  try {
    const chatCount = await AIChat.countDocuments({
      user: req.userId,
    });

    if (chatCount >= 50) {
      const oldestChat = await AIChat.findOne({
        user: req.userId,
      }).sort({ updatedAt: 1 });

      if (oldestChat) {
        await AIChat.deleteOne({
          _id: oldestChat._id,
          user: req.userId,
        });
      }
    }

    const chat = await AIChat.create({
      user: req.userId,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("Failed to create AI chat:", error);

    res.status(500).json({
      message: "Failed to create chat.",
    });
  }
});

router.post("/chats/:chatId/messages", auth, async (req, res) => {
  try {
    const { content, imageUrls = [] } = req.body;

    const message = typeof content === "string" ? content.trim() : "";

    if (!message && imageUrls.length === 0) {
      return res.status(400).json({
        message: "Message or image is required.",
      });
    }

    if (!Array.isArray(imageUrls)) {
      return res.status(400).json({
        message: "imageUrls must be an array.",
      });
    }

    if (imageUrls.length > 2) {
      return res.status(400).json({
        message: "A maximum of 2 images can be attached to one message.",
      });
    }

    const chat = await AIChat.findOne({
      _id: req.params.chatId,
      user: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    const userMessage = {
      role: "user",
      content: message,
      imageUrls,
    };

    const aiResponse = await generateChatResponse({
      userId: req.userId,
      chat,
      userMessage: message,
    });

    chat.messages.push(userMessage);

    chat.messages.push({
      role: "assistant",
      content: aiResponse.text,
      imageUrls: [],
    });

    // Generate a useful title from the first user message.
    if (chat.title === "New Chat" && message) {
      chat.title = message.length > 60 ? `${message.slice(0, 57)}...` : message;
    }

    await chat.save();

    res.json({
      chat,
      message: {
        role: "assistant",
        content: aiResponse.text,
        imageUrls: [],
      },
    });
  } catch (error) {
    console.error("Failed to send AI chat message:", error);

    res.status(500).json({
      message: "Failed to generate assistant response.",
    });
  }
});

router.delete("/chats/:chatId", auth, async (req, res) => {
  try {
    const deletedChat = await AIChat.findOneAndDelete({
      _id: req.params.chatId,
      user: req.userId,
    });

    if (!deletedChat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    res.json({
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete AI chat:", error);

    res.status(500).json({
      message: "Failed to delete chat.",
    });
  }
});

export default router;
