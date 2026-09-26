// server/utils/aiChatDataHelpers.js

// Provides reusable empty AI health-data structures.
// Keeps AI projection defaults consistent across synchronization flows.

export function emptyHealthData() {
  return {
    latestWeight: {
      value: null,
      recordedAt: "",
    },

    bmi: {
      value: null,
      category: "",
    },

    bloodPressure: {
      high: null,
      low: null,
      recordedAt: "",
    },

    bloodSugar: {
      fasting: {
        glucose: null,
        recordedAt: "",
      },

      postMeal: {
        glucose: null,
        recordedAt: "",
      },

      random: {
        glucose: null,
        recordedAt: "",
      },
    },
  };
}

// Returns the default lifestyle projection.
export function emptyLifestyleData() {
  return {
    answers: {},
    categoryScores: {},
    totalScore: null,
    grade: "",
    feedback: "",
    assessedAt: null,
  };
}

// Returns the default profile projection.
export function emptyProfileData() {
  return {
    dob: null,

    gender: "",

    height: {
      feet: null,
      inches: null,
    },

    bloodGroup: "",

    allergies: "",

    chronicIllnesses: [],

    surgeries: "",

    emergencyContacts: [],

    bloodDonorStatus: "",

    lastBloodDonation: null,
  };
}

// Returns the default doctors projection.
export function emptyDoctorsData() {
  return [];
}

// Maps a stored profile into the AI projection format.
export function mapProfileData(profile) {
  if (!profile) {
    return emptyProfileData();
  }

  return {
    dob: profile.dob || null,

    gender: profile.gender || "",

    height: {
      feet: profile.height?.feet ?? null,
      inches: profile.height?.inches ?? null,
    },

    bloodGroup: profile.bloodGroup || "",

    allergies: profile.allergies || "",

    chronicIllnesses: profile.chronicIllnesses || [],

    surgeries: profile.surgeries || "",

    emergencyContacts: (profile.emergencyContacts || []).map((contact) => ({
      relation: contact.relation || "",
      name: contact.name || "",
      phone: contact.phone || "",
      email: contact.email || "",
    })),

    bloodDonorStatus: profile.bloodDonorStatus || "",

    lastBloodDonation: profile.lastBloodDonation || null,
  };
}

// Maps a lifestyle assessment into the AI projection format.
export function mapLifestyleData(latestAssessment) {
  if (!latestAssessment) {
    return emptyLifestyleData();
  }

  return {
    answers: latestAssessment.answers || {},
    categoryScores: latestAssessment.categoryScores || {},
    totalScore: latestAssessment.totalScore ?? null,
    grade: latestAssessment.grade || "",
    feedback: latestAssessment.feedback || "",
    assessedAt: latestAssessment.assessedAt || null,
  };
}

// Maps stored doctors into the AI projection format.
export function mapDoctorData(doctors = []) {
  return doctors.map((doctor) => ({
    doctorId: doctor._id,

    name: doctor.name || "",

    specialities: doctor.specialities || [],

    designation: doctor.designation || "",

    primaryHospital: doctor.primaryHospital || "",

    chambers: (doctor.chambers || []).map((chamber) => ({
      name: chamber.name || "",
      address: chamber.address || "",
      phone: chamber.phone || "",
      visitingDays: chamber.visitingDays || [],

      visitingTime: {
        startHour: chamber.visitingTime?.startHour ?? null,
        startPeriod: chamber.visitingTime?.startPeriod ?? null,
        endHour: chamber.visitingTime?.endHour ?? null,
        endPeriod: chamber.visitingTime?.endPeriod ?? null,
      },
    })),

    contactInfo: {
      phones: doctor.contactInfo?.phones || [],
      emails: doctor.contactInfo?.emails || [],
    },
  }));
}
