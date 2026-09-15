// src/services/aiChatDataService.js

import Profile from "../models/Profile.js";
import LifestyleAssessment from "../models/LifestyleAssessment.js";
import HealthLog from "../models/HealthLog.js";
import Doctor from "../models/Doctor.js";
import AIChatData from "../models/AIChatData.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

/*
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */

function emptyHealthData() {
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

function emptyLifestyleData() {
  return {
    answers: {},
    categoryScores: {},
    totalScore: null,
    grade: "",
    feedback: "",
    assessedAt: null,
  };
}

function emptyProfileData() {
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

function emptyDoctorsData() {
  return [];
}

/*
 * ---------------------------------------------------------
 * Profile
 * ---------------------------------------------------------
 */

export async function syncProfileToAIChatData(userId) {
  const profile = await Profile.findOne({
    user: userId,
  }).lean();

  const profileData = profile
    ? {
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
      }
    : emptyProfileData();

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        profile: profileData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

/*
 * ---------------------------------------------------------
 * Lifestyle
 *
 * IMPORTANT:
 * We use LifestyleAssessment answers.
 *
 * Profile lifestyle fields are intentionally NOT used.
 * ---------------------------------------------------------
 */

export async function syncLifestyleToAIChatData(userId) {
  const latestAssessment = await LifestyleAssessment.findOne({
    user: userId,
  })
    .sort({
      assessedAt: -1,
    })
    .lean();

  const lifestyleData = latestAssessment
    ? {
        answers: latestAssessment.answers || {},

        categoryScores: latestAssessment.categoryScores || {},

        totalScore: latestAssessment.totalScore ?? null,

        grade: latestAssessment.grade || "",

        feedback: latestAssessment.feedback || "",

        assessedAt: latestAssessment.assessedAt || null,
      }
    : emptyLifestyleData();

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        lifestyle: lifestyleData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

/*
 * ---------------------------------------------------------
 * Health
 *
 * Health is rebuilt from HealthLog every time.
 *
 * This is important because if a HealthLog is deleted,
 * stale information must not remain in AIChatData.
 * ---------------------------------------------------------
 */

export async function syncHealthToAIChatData(userId) {
  const [profile, bloodPressure, fasting, postMeal, random, weight] =
    await Promise.all([
      Profile.findOne({
        user: userId,
      }).lean(),

      HealthLog.findOne({
        user: userId,
        type: "bp",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "fasting",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "postMeal",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "random",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "weight",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),
    ]);

  const healthData = emptyHealthData();

  /*
   * Latest weight
   */

  if (weight) {
    healthData.latestWeight = {
      value: weight.weight ?? null,
      recordedAt: weight.recordedAt || "",
    };
  }

  /*
   * BMI
   *
   * BMI is never stored in HealthLog.
   * It is calculated from Profile.height + latest weight.
   */

  if (weight?.weight && profile?.height?.feet) {
    const bmi = calculateBMI(weight.weight, profile.height);

    if (bmi !== null) {
      healthData.bmi = {
        value: bmi,
        category: getBMICategory(bmi) || "",
      };
    }
  }

  /*
   * Blood pressure
   */

  if (bloodPressure) {
    healthData.bloodPressure = {
      high: bloodPressure.High ?? null,
      low: bloodPressure.Low ?? null,
      recordedAt: bloodPressure.recordedAt || "",
    };
  }

  /*
   * Blood sugar
   */

  if (fasting) {
    healthData.bloodSugar.fasting = {
      glucose: fasting.glucose ?? null,
      recordedAt: fasting.recordedAt || "",
    };
  }

  if (postMeal) {
    healthData.bloodSugar.postMeal = {
      glucose: postMeal.glucose ?? null,
      recordedAt: postMeal.recordedAt || "",
    };
  }

  if (random) {
    healthData.bloodSugar.random = {
      glucose: random.glucose ?? null,
      recordedAt: random.recordedAt || "",
    };
  }

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        health: healthData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

/*
 * ---------------------------------------------------------
 * Doctors
 * ---------------------------------------------------------
 */

export async function syncDoctorsToAIChatData(userId) {
  const doctors = await Doctor.find({
    user: userId,
  }).lean();

  const doctorData = doctors.map((doctor) => ({
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

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        doctors: doctorData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

/*
 * ---------------------------------------------------------
 * Full synchronization
 *
 * Useful for:
 * - first-time setup
 * - recovery
 * - testing
 * - rebuilding the projection
 * ---------------------------------------------------------
 */

export async function syncAllAIChatData(userId) {
  const [profile, latestAssessment, health, doctors] = await Promise.all([
    Profile.findOne({
      user: userId,
    }).lean(),

    LifestyleAssessment.findOne({
      user: userId,
    })
      .sort({
        assessedAt: -1,
      })
      .lean(),

    Promise.all([
      HealthLog.findOne({
        user: userId,
        type: "bp",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "fasting",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "postMeal",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "diabetes",
        glucoseTiming: "random",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),

      HealthLog.findOne({
        user: userId,
        type: "weight",
      })
        .sort({
          recordedAt: -1,
          createdAt: -1,
        })
        .lean(),
    ]),

    Doctor.find({
      user: userId,
    }).lean(),
  ]);

  const [bloodPressure, fasting, postMeal, random, weight] = health;

  /*
   * Profile
   */

  const profileData = profile
    ? {
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
      }
    : emptyProfileData();

  /*
   * Lifestyle
   */

  const lifestyleData = latestAssessment
    ? {
        answers: latestAssessment.answers || {},

        categoryScores: latestAssessment.categoryScores || {},

        totalScore: latestAssessment.totalScore ?? null,

        grade: latestAssessment.grade || "",

        feedback: latestAssessment.feedback || "",

        assessedAt: latestAssessment.assessedAt || null,
      }
    : emptyLifestyleData();

  /*
   * Health
   */

  const healthData = emptyHealthData();

  if (weight) {
    healthData.latestWeight = {
      value: weight.weight ?? null,
      recordedAt: weight.recordedAt || "",
    };
  }

  if (weight?.weight && profile?.height?.feet) {
    const bmi = calculateBMI(weight.weight, profile.height);

    if (bmi !== null) {
      healthData.bmi = {
        value: bmi,
        category: getBMICategory(bmi) || "",
      };
    }
  }

  if (bloodPressure) {
    healthData.bloodPressure = {
      high: bloodPressure.High ?? null,
      low: bloodPressure.Low ?? null,
      recordedAt: bloodPressure.recordedAt || "",
    };
  }

  if (fasting) {
    healthData.bloodSugar.fasting = {
      glucose: fasting.glucose ?? null,
      recordedAt: fasting.recordedAt || "",
    };
  }

  if (postMeal) {
    healthData.bloodSugar.postMeal = {
      glucose: postMeal.glucose ?? null,
      recordedAt: postMeal.recordedAt || "",
    };
  }

  if (random) {
    healthData.bloodSugar.random = {
      glucose: random.glucose ?? null,
      recordedAt: random.recordedAt || "",
    };
  }

  /*
   * Doctors
   */

  const doctorData = doctors.map((doctor) => ({
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

  /*
   * Save the complete projection in one operation.
   */

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        profile: profileData,
        lifestyle: lifestyleData,
        health: healthData,
        doctors: doctorData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}
