// server/services/aiChatStorageService.js

// Handles AI chat quotas, persistence, retrieval, messaging, and deletion.
// Enforces daily creation, conversation, and message limits at the server layer.

import AIChat, {
  AI_CHAT_LIMIT,
  AI_CHAT_DAILY_CREATE_LIMIT,
  AI_CHAT_MESSAGE_LIMIT,
} from "../models/AIChat.js";

import AIChatDailyUsage from "../models/AIChatDailyUsage.js";

import { generateChatResponse } from "./aiChatService.js";

const APP_TIME_ZONE = "Asia/Dhaka";

// Returns the application's current calendar date.
function getDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Returns today's persistent chat creation usage.
async function getDailyUsage(userId) {
  const dateKey = getDateKey();

  const usage = await AIChatDailyUsage.findOne({
    user: userId,
    dateKey,
  }).lean();

  const chatCount = usage?.chatCount || 0;

  return {
    dateKey,
    chatCount,
    limit: AI_CHAT_DAILY_CREATE_LIMIT,
    remaining: Math.max(AI_CHAT_DAILY_CREATE_LIMIT - chatCount, 0),
  };
}

// Atomically consumes one daily chat creation allowance.
async function consumeDailyChatCreation(userId) {
  const dateKey = getDateKey();

  try {
    const usage = await AIChatDailyUsage.findOneAndUpdate(
      {
        user: userId,
        dateKey,
        chatCount: {
          $lt: AI_CHAT_DAILY_CREATE_LIMIT,
        },
      },
      {
        $inc: {
          chatCount: 1,
        },
      },
      {
        new: true,
      },
    ).lean();

    if (usage) {
      return usage;
    }

    // Create the daily record when the user has not created a chat today.
    const created = await AIChatDailyUsage.create({
      user: userId,
      dateKey,
      chatCount: 1,
    });

    return created.toObject();
  } catch (error) {
    // A duplicate-key race means another request created the same daily
    // usage record first. Re-check the record before rejecting the request.
    if (error?.code === 11000) {
      const usage = await AIChatDailyUsage.findOne({
        user: userId,
        dateKey,
      }).lean();

      if (usage?.chatCount < AI_CHAT_DAILY_CREATE_LIMIT) {
        const updated = await AIChatDailyUsage.findOneAndUpdate(
          {
            user: userId,
            dateKey,
            chatCount: {
              $lt: AI_CHAT_DAILY_CREATE_LIMIT,
            },
          },
          {
            $inc: {
              chatCount: 1,
            },
          },
          {
            new: true,
          },
        ).lean();

        if (updated) {
          return updated;
        }
      }

      const limitError = new Error("Daily chat creation limit reached.");
      limitError.code = "DAILY_CHAT_LIMIT";
      throw limitError;
    }

    throw error;
  }
}

// Returns the user's latest conversations with message counts and limits.
export async function listAIChats(userId) {
  const [chats, dailyUsage, totalChatCount] = await Promise.all([
    AIChat.find({
      user: userId,
    })
      .sort({ updatedAt: -1 })
      .limit(AI_CHAT_LIMIT)
      .lean(),

    getDailyUsage(userId),

    AIChat.countDocuments({
      user: userId,
    }),
  ]);

  const mappedChats = chats.map((chat) => {
    const messages = Array.isArray(chat.messages) ? chat.messages : [];

    const userMessageCount = messages.filter(
      (message) => message.role === "user",
    ).length;

    return {
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      userMessageCount,
      messageLimit: AI_CHAT_MESSAGE_LIMIT,
      reachedMessageLimit: userMessageCount >= AI_CHAT_MESSAGE_LIMIT,
    };
  });

  return {
    chats: mappedChats,
    usage: {
      dailyChatCount: dailyUsage.chatCount,
      dailyChatLimit: dailyUsage.limit,
      dailyChatsRemaining: dailyUsage.remaining,
      totalChatCount,
      totalChatLimit: AI_CHAT_LIMIT,
    },
  };
}

// Returns one complete conversation owned by the authenticated user.
export async function findAIChat(userId, chatId) {
  return AIChat.findOne({
    _id: chatId,
    user: userId,
  }).lean();
}

// Creates a new AI conversation while enforcing all creation limits.
export async function createNewAIChat(userId) {
  const dailyUsage = await getDailyUsage(userId);

  if (dailyUsage.chatCount >= AI_CHAT_DAILY_CREATE_LIMIT) {
    const error = new Error("Daily chat creation limit reached.");
    error.code = "DAILY_CHAT_LIMIT";
    throw error;
  }

  const consumedUsage = await consumeDailyChatCreation(userId);

  if (consumedUsage.chatCount > AI_CHAT_DAILY_CREATE_LIMIT) {
    const error = new Error("Daily chat creation limit reached.");
    error.code = "DAILY_CHAT_LIMIT";
    throw error;
  }

  const chatCount = await AIChat.countDocuments({
    user: userId,
  });

  if (chatCount >= AI_CHAT_LIMIT) {
    const oldestChat = await AIChat.findOne({
      user: userId,
    })
      .sort({ createdAt: 1 })
      .select("_id")
      .lean();

    if (oldestChat) {
      await AIChat.deleteOne({
        _id: oldestChat._id,
        user: userId,
      });
    }
  }

  return AIChat.create({
    user: userId,
    title: "New Chat",
    messages: [],
  });
}

// Creates a user message and generates the corresponding assistant response.
export async function addAIChatMessage({ userId, chatId, content }) {
  const chat = await AIChat.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    return {
      notFound: true,
    };
  }

  const userMessageCount = chat.messages.filter(
    (message) => message.role === "user",
  ).length;

  if (userMessageCount >= AI_CHAT_MESSAGE_LIMIT) {
    const error = new Error(
      "This chat has reached its 20-message limit. Please create a new chat.",
    );

    error.code = "CHAT_MESSAGE_LIMIT";

    throw error;
  }

  const trimmedContent = content.trim();

  const assistantResponse = await generateChatResponse({
    userId,
    chat,
    userMessage: trimmedContent,
  });

  chat.messages.push({
    role: "user",
    content: trimmedContent,
  });

  chat.messages.push({
    role: "assistant",
    content: assistantResponse,
  });

  const updatedUserMessageCount = chat.messages.filter(
    (message) => message.role === "user",
  ).length;

  if (
    (!chat.title || chat.title === "New Chat") &&
    updatedUserMessageCount === 1
  ) {
    chat.title = trimmedContent.slice(0, 100) || "New Chat";
  }

  await chat.save();

  const savedChat = chat.toObject();

  return {
    chat: savedChat,
    message: assistantResponse,
    userMessageCount: updatedUserMessageCount,
    messageLimit: AI_CHAT_MESSAGE_LIMIT,
    reachedMessageLimit: updatedUserMessageCount >= AI_CHAT_MESSAGE_LIMIT,
  };
}

// Deletes a conversation owned by the authenticated user.
export async function deleteAIChatById(userId, chatId) {
  return AIChat.findOneAndDelete({
    _id: chatId,
    user: userId,
  });
}

export { AI_CHAT_LIMIT, AI_CHAT_DAILY_CREATE_LIMIT, AI_CHAT_MESSAGE_LIMIT };
