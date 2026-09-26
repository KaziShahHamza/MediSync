// server/utils/aiChatContext.js

// Builds normalized profile, lifestyle, health, doctor, and conversation context.
// Keeps AI prompt preparation independent from Gemini execution.

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

// Normalizes missing context values to the existing fallback string.
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

// Builds the doctor section without introducing unrelated information.
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

// Combines synchronized data into the context consumed by the AI prompt.
export function buildAIContext(aiChatData) {
  return {
    profile: buildProfileContext(aiChatData.profile),
    lifestyle: buildLifestyleContext(aiChatData.lifestyle),
    health: buildHealthContext(aiChatData.health),
    doctors: buildDoctorContext(aiChatData.doctors),
  };
}

// Converts stored messages into Gemini conversation-history format.
export function buildConversationHistory(messages = []) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

// Finds doctors whose specialties match the requested specialties.
export function findMatchingDoctors(doctors = [], specialties = []) {
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

export { calculateAge };
