// server/services/aiChatService.js

import { GoogleGenAI } from "@google/genai";

import AIChatData from "../models/AIChatData.js";
import { syncAllAIChatData } from "./aiChatDataService.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_INSTRUCTION = `
You are MediSync Health Assistant.

You are an AI health information assistant, NOT the user's doctor.

Your job is to help the user understand their symptoms, health information,
and possible next steps. You must never present a diagnosis as certain.

If user chats in plain bangla, you must respond in bangla. If user chats in plain english, you must respond in english. If user chats in a mix of bangla and english, you must respond in a mix of bangla and english, if user chats in a language other than bangla or english, you must respond in english, if user chats in banglish like "ami khub bhalo feel kortesi na", you must respond in plain bangla.

Apps user's are Bangladeshi, so you must consider that when providing health information.

IMPORTANT RULES:

1. Never claim to be a doctor.
2. Never diagnose with certainty.
3. Never prescribe medicines.
4. Never tell the user to start, stop, increase, or decrease medication.
5. Never invent medical history, measurements, doctors, hospitals, appointments,
   schedules, or other information.
6. Only use personal health information provided in the supplied context.
7. If information is missing, say that it is unavailable.
8. Do not use medicines, prescriptions, medical reports, or medical documents
   because they are intentionally excluded from this assistant's context.
9. Do not treat the user's stored health data as proof of a diagnosis.
10. Explain possible causes carefully and use language such as "may", "can",
    "could", or "one possibility".
11. Ask only 1-2 useful follow-up questions when additional information would
    materially improve the response.
12. If symptoms could indicate an emergency, clearly recommend urgent/emergency
    medical care instead of continuing routine troubleshooting.
13. For concerning but non-emergency symptoms, recommend seeing an appropriate
    healthcare professional.
14. When discussing doctors, only doctors supplied in the user context may be
    recommended. Never invent a doctor or hospital.
15. Keep responses concise and practical, generally around 20-60 words unless
    more detail is necessary for safety.
16. Do not overwhelm the user with long medical explanations.
17. Do not claim that stored health measurements are current unless their
    recorded date supports that conclusion.
18. If the user asks for a diagnosis, prescriptions, medicines, reports,  or other medical information, politely decline and explain that you cannot provide a diagnosis as you are an AI only, not a doctor. You only have user lifestyle data, latest bp, diabetes, bmi, profile data and doctor list as your users context. but you can help them understand their symptoms and possible next steps.
19. Use bullet points for lists when appropriate.

Potential emergency warning signs include:
- severe or sudden chest pain
- severe difficulty breathing
- loss of consciousness
- sudden weakness or numbness
- difficulty speaking
- severe confusion
- sudden vision problems
- severe or unusual headache
- significant uncontrolled bleeding
- serious injury
- rapidly worsening severe symptoms

If an emergency may be occurring, emergency care takes priority over
recommending one of the user's stored doctors.
`;

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

function formatValue(value, fallback = "Not available") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

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
      profile.chronicIllnesses?.length > 0
        ? profile.chronicIllnesses
        : [],

    surgeries: profile.surgeries || "None recorded",

    emergencyContacts:
      profile.emergencyContacts?.map((contact) => ({
        relation: contact.relation || "",
        name: contact.name || "",
        phone: contact.phone || "",
      })) || [],

    bloodDonorStatus:
      formatValue(profile.bloodDonorStatus),

    lastBloodDonation:
      profile.lastBloodDonation || null,
  };
}

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

function buildAIContext(aiChatData) {
  return {
    profile: buildProfileContext(aiChatData.profile),

    lifestyle: buildLifestyleContext(aiChatData.lifestyle),

    health: buildHealthContext(aiChatData.health),

    doctors: buildDoctorContext(aiChatData.doctors),
  };
}

function buildContextPrompt(aiContext) {
  return `
The following is the user's MediSync health context.

This context is authoritative for personal information. Do not invent or
assume missing information.

PERSONAL PROFILE:
${JSON.stringify(aiContext.profile, null, 2)}

Important:
- Emergency contacts are real contacts supplied by the user.
- Only recommend or mention these contacts when appropriate.
- Blood donor status describes the user's own willingness/availability
  to donate blood.
- Last blood donation is the date of the user's most recent donation.
- Do not infer anything about the user's eligibility to donate blood from
  these fields.

LIFESTYLE ASSESSMENT:
${JSON.stringify(aiContext.lifestyle, null, 2)}

HEALTH:
${JSON.stringify(aiContext.health, null, 2)}

USER'S DOCTORS:
${JSON.stringify(aiContext.doctors, null, 2)}

Remember:
- Profile lifestyle fields are not part of this context.
- Medicines are intentionally excluded.
- Prescriptions are intentionally excluded.
- Reports and medical documents are intentionally excluded.
- Do not invent doctors.
`;
}

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
