// server/models/Profile.js

import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]+$/;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const relations = [
  "Son",
  "Daughter",
  "Husband",
  "Wife",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Best Friend",
  "Friend",
  "Doctor",
  "Personal Health Assistant",
  "Other",
];

const chronicIllnesses = [
  "Diabetes (ডায়াবেটিস)",
  "Hypertension / High BP (উচ্চ রক্তচাপ)",
  "Heart Disease (হৃদরোগ)",
  "Kidney Disease (কিডনি সমস্যা)",
  "Asthma / Breathing Problem (হাঁপানি / অ্যাজমা)",
  "Thyroid (থাইরয়েড)",
  "Gastric / Acidity (গ্যাস্ট্রিক / আলসার)",
  "Hepatitis / Liver Disease (হেপাটাইটিস / লিভার)",
  "Tuberculosis / TB (যক্ষ্মা)",
  "Arthritis / Joint Pain (বাতব্যথা)",
];

const emergencyContactSchema = new mongoose.Schema(
  {
    relation: {
      type: String,
      required: true,
      trim: true,
      enum: relations,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
      validate: {
        validator: function (value) {
          return !value || phoneRegex.test(value);
        },
        message: "Please provide a valid phone number.",
      },
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: 254,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address.",
      },
    },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePhotoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    height: {
      feet: {
        type: Number,
        default: null,
        min: 1,
        max: 9,
        validate: {
          validator: Number.isInteger,
          message: "Height in feet must be a whole number.",
        },
      },

      inches: {
        type: Number,
        default: null,
        min: 0,
        max: 11,
        validate: {
          validator: Number.isInteger,
          message: "Height in inches must be a whole number.",
        },
      },
    },

    bloodGroup: {
      type: String,
      enum: ["", ...bloodGroups],
      default: "",
    },

    allergies: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    chronicIllnesses: {
      type: [String],
      default: [],
      validate: {
        validator: function (items) {
          return (
            items.length <= 10 &&
            items.every(
              (item) =>
                typeof item === "string" &&
                item.trim().length > 0 &&
                item.trim().length <= 100,
            )
          );
        },
        message: "Invalid chronic illness data.",
      },
    },

    surgeries: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
      validate: {
        validator: function (contacts) {
          return contacts.length <= 3;
        },
        message: "You can add a maximum of 3 emergency contacts.",
      },
    },

    bloodDonorStatus: {
      type: String,
      enum: ["", "yes", "no", "willingly"],
      default: "",
    },

    bloodDonationCompensation: {
      type: String,
      enum: ["", "500", "none"],
      default: "",
    },

    lastBloodDonation: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value <= new Date();
        },
        message: "Last blood donation cannot be in the future.",
      },
    },

    bloodDonationContactNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
      validate: {
        validator: function (value) {
          return !value || phoneRegex.test(value);
        },
        message: "Please provide a valid blood donation contact number.",
      },
    },

    location: {
      streetAddress: {
        type: String,
        default: "",
        trim: true,
        maxlength: 300,
      },

      district: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      upazila: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },
    },
  },
  { timestamps: true },
);

profileSchema.pre("validate", function () {
  // Height must be completely empty or completely filled.
  const hasFeet = this.height?.feet !== null && this.height?.feet !== undefined;
  const hasInches =
    this.height?.inches !== null && this.height?.inches !== undefined;

  if (hasFeet !== hasInches) {
    this.invalidate("height", "Please provide both feet and inches.");
  }

  // Validate emergency contacts.
  for (const contact of this.emergencyContacts || []) {
    const hasPhone = Boolean(contact.phone?.trim());
    const hasEmail = Boolean(contact.email?.trim());

    if (!hasPhone && !hasEmail) {
      this.invalidate(
        "emergencyContacts",
        "Each emergency contact must have a phone number or email address.",
      );
    }
  }

  const isDonor =
    this.bloodDonorStatus === "yes" || this.bloodDonorStatus === "willingly";

  if (isDonor && !this.bloodDonationContactNumber?.trim()) {
    this.invalidate(
      "bloodDonationContactNumber",
      "A contact number is required when you are available to donate blood.",
    );
  }

  if (isDonor) {
    if (!this.location?.district) {
      this.invalidate("location.district", "Please select your district.");
    }

    if (!this.location?.upazila) {
      this.invalidate("location.upazila", "Please select your upazila.");
    }
  }

  if (this.bloodDonationCompensation && !isDonor) {
    this.invalidate(
      "bloodDonationCompensation",
      "Blood donation compensation can only be selected for available donors.",
    );
  }
});

export default mongoose.model("Profile", profileSchema);
