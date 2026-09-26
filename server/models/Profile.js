// server/models/Profile.js

// Defines user profile, medical, location, and emergency contact data.
// Applies validation rules for contacts, blood donation, and donor location.

import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Defines reusable emergency contact fields and email validation.
const emergencyContactSchema = new mongoose.Schema(
  {
    relation: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
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

// Defines the complete user profile structure.
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

    dob: Date,

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    height: {
      feet: {
        type: Number,
        default: null,
      },

      inches: {
        type: Number,
        default: null,
      },
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    allergies: {
      type: String,
      default: "",
    },

    chronicIllnesses: {
      type: [String],
      default: [],
    },

    surgeries: {
      type: String,
      default: "",
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
      },

      upazila: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Validates emergency contacts and blood donor requirements.
profileSchema.pre("validate", function () {
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

  // Require a contact number for users available to donate.
  if (isDonor && !this.bloodDonationContactNumber?.trim()) {
    this.invalidate(
      "bloodDonationContactNumber",
      "A contact number is required when you are available to donate blood.",
    );
  }

  // Require donor location fields for blood search.
  if (isDonor) {
    if (!this.location?.district) {
      this.invalidate("location.district", "Please select your district.");
    }

    if (!this.location?.upazila) {
      this.invalidate("location.upazila", "Please select your upazila.");
    }
  }
});

export default mongoose.model("Profile", profileSchema);
