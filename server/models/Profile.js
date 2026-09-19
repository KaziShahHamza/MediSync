import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Profile photo
    profilePhotoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Personal information
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

    // Medical information
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

    // Emergency contacts
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

    // Blood donation
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

    // Present location
    location: {
      streetAddress: {
        type: String,
        default: "",
        trim: true,
        maxlength: 300,
      },

      // Keep these fields unchanged.
      // They are required for blood donor search.
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

  if (isDonor && !this.bloodDonationContactNumber?.trim()) {
    this.invalidate(
      "bloodDonationContactNumber",
      "A contact number is required when you are available to donate blood.",
    );
  }

  // Do NOT change this.
  // Blood donor search depends on district and upazila.
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