// server/services/aiChatService.js

// Handles Gemini chat responses using the user's synchronized AI health context.
// Builds structured context and conversation history before calling Gemini.
// Keeps AI prompt instructions in the dedicated prompts folder.

import { GoogleGenAI } from "@google/genai";

import AIChatData from "../models/AIChatData.js";
import { syncAllAIChatData } from "./aiChatDataService.js";
import {
  SYSTEM_INSTRUCTION,
  buildContextPrompt,
} from "../prompts/aiChatPrompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

// Calculates the user's current age from the stored date of birth.
function calculateAge(dob) {
  if (!dob) return null;

  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

// Returns a consistent fallback for missing context values.
function formatValue(value, fallback = "Not available") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

// Builds the personal profile section used by the AI context.
function buildProfileContext(profile) {
  if (!profile) {
    return {
      available: false,
    };
  }

  return {
    available: true,

    dateOfBirth: profile.dob || null,

    age: calculateAge(profile.dob),

    gender: formatValue(profile.gender),

    height: profile.height
      ? {
          feet: profile.height.feet,
          inches: profile.height.inches,
        }
      : null,

    bloodGroup: formatValue(profile.bloodGroup),

    allergies: profile.allergies || "None recorded",

    chronicIllnesses:
      profile.chronicIllnesses?.length > 0 ? profile.chronicIllnesses : [],

    surgeries: profile.surgeries || "None recorded",

    emergencyContacts:
      profile.emergencyContacts?.map((contact) => ({
        relation: contact.relation || "",
        name: contact.name || "",
        phone: contact.phone || "",
      })) || [],

    bloodDonorStatus: formatValue(profile.bloodDonorStatus),

    lastBloodDonation: profile.lastBloodDonation || null,
  };
}

// Builds the lifestyle assessment section used by the AI context.
function buildLifestyleContext(lifestyle) {
  if (!lifestyle) {
    return {
      available: false,
    };
  }

  return {
    available: true,
    answers: lifestyle.answers || {},
    categoryScores: lifestyle.categoryScores || {},
    totalScore: lifestyle.totalScore,
    grade: lifestyle.grade || "",
    feedback: lifestyle.feedback || "",
    assessedAt: lifestyle.assessedAt || null,
  };
}

// Builds the health metrics section used by the AI context.
function buildHealthContext(health) {
  if (!health) {
    return {
      available: false,
    };
  }

  return {
    available: true,

    latestWeight: health.latestWeight || null,

    bmi: health.bmi || null,

    bloodPressure: health.bloodPressure || null,

    bloodSugar: {
      fasting: health.bloodSugar?.fasting || null,
      postMeal: health.bloodSugar?.postMeal || null,
      random: health.bloodSugar?.random || null,
    },
  };
}

// Builds the user's doctor context without introducing unrelated information.
function buildDoctorContext(doctors = []) {
  return doctors.map((doctor) => ({
    doctorId: doctor.doctorId,

    name: doctor.name,

    specialities: doctor.specialities || [],

    designation: doctor.designation || "",

    primaryHospital: doctor.primaryHospital || "",

    chambers: (doctor.chambers || []).map((chamber) => ({
      name: chamber.name || "",
      address: chamber.address || "",
      phone: chamber.phone || "",
      visitingDays: chamber.visitingDays || [],
      visitingTime: chamber.visitingTime || null,
    })),

    contactInfo: {
      phones: doctor.contactInfo?.phones || [],
      emails: doctor.contactInfo?.emails || [],
    },
  }));
}

// Combines all synchronized health data into the AI context object.
function buildAIContext(aiChatData) {
  return {
    profile: buildProfileContext(aiChatData.profile),

    lifestyle: buildLifestyleContext(aiChatData.lifestyle),

    health: buildHealthContext(aiChatData.health),

    doctors: buildDoctorContext(aiChatData.doctors),
  };
}

// Loads existing synchronized AI data or creates it when missing.
async function getOrCreateAIChatData(userId) {
  let aiChatData = await AIChatData.findOne({
    user: userId,
  }).lean();

  if (!aiChatData) {
    await syncAllAIChatData(userId);

    aiChatData = await AIChatData.findOne({
      user: userId,
    }).lean();
  }

  return aiChatData;
}

// Converts stored chat messages into Gemini conversation history format.
function buildConversationHistory(messages = []) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

// Finds stored doctors whose specialties match the requested specialties.
function findMatchingDoctors(doctors = [], specialties = []) {
  if (!specialties.length) {
    return [];
  }

  const normalizedSpecialties = specialties.map((specialty) =>
    specialty.toLowerCase().trim(),
  );

  return doctors.filter((doctor) =>
    (doctor.specialities || []).some((doctorSpecialty) => {
      const normalizedDoctorSpecialty = doctorSpecialty.toLowerCase().trim();

      return normalizedSpecialties.some(
        (specialty) =>
          normalizedDoctorSpecialty.includes(specialty) ||
          specialty.includes(normalizedDoctorSpecialty),
      );
    }),
  );
}

// Generates a Gemini response using the user's stored AI health context.
export async function generateChatResponse({ userId, chat, userMessage }) {
  const aiChatData = await getOrCreateAIChatData(userId);

  if (!aiChatData) {
    throw new Error("Unable to load AI health context.");
  }

  const aiContext = buildAIContext(aiChatData);

  const contextPrompt = buildContextPrompt(aiContext);

  const conversationHistory = buildConversationHistory(chat.messages);

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: contextPrompt,
        },
      ],
    },

    ...conversationHistory,

    {
      role: "user",
      parts: [
        {
          text: userMessage,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,

      temperature: 0.3,

      maxOutputTokens: 400,
    },
  });

  const text =
    response.text?.trim() ||
    "I'm sorry, but I couldn't generate a response right now.";

  return {
    text,
    doctors: [],
  };
}

export { calculateAge, buildAIContext, findMatchingDoctors };
