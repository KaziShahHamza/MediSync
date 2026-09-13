import mongoose from "mongoose";

const aiChatDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    profile: {
      dob: {
        type: Date,
        default: null,
      },

      gender: {
        type: String,
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
    },

    lifestyle: {
      answers: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      categoryScores: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      totalScore: {
        type: Number,
        default: null,
      },

      grade: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      assessedAt: {
        type: Date,
        default: null,
      },
    },

    health: {
      latestWeight: {
        value: {
          type: Number,
          default: null,
        },
        recordedAt: {
          type: String,
          default: "",
        },
      },

      bmi: {
        value: {
          type: Number,
          default: null,
        },
        category: {
          type: String,
          default: "",
        },
      },

      bloodPressure: {
        high: {
          type: Number,
          default: null,
        },
        low: {
          type: Number,
          default: null,
        },
        recordedAt: {
          type: String,
          default: "",
        },
      },

      bloodSugar: {
        fasting: {
          glucose: {
            type: Number,
            default: null,
          },
          recordedAt: {
            type: String,
            default: "",
          },
        },

        postMeal: {
          glucose: {
            type: Number,
            default: null,
          },
          recordedAt: {
            type: String,
            default: "",
          },
        },

        random: {
          glucose: {
            type: Number,
            default: null,
          },
          recordedAt: {
            type: String,
            default: "",
          },
        },
      },
    },

    doctors: [
      {
        doctorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },

        name: {
          type: String,
          default: "",
        },

        specialities: {
          type: [String],
          default: [],
        },

        designation: {
          type: String,
          default: "",
        },

        primaryHospital: {
          type: String,
          default: "",
        },

        chambers: [
          {
            name: {
              type: String,
              default: "",
            },

            address: {
              type: String,
              default: "",
            },

            phone: {
              type: String,
              default: "",
            },

            visitingDays: {
              type: [String],
              default: [],
            },

            visitingTime: {
              startHour: {
                type: Number,
                default: null,
              },

              startPeriod: {
                type: String,
                default: null,
              },

              endHour: {
                type: Number,
                default: null,
              },

              endPeriod: {
                type: String,
                default: null,
              },
            },
          },
        ],

        contactInfo: {
          phones: {
            type: [String],
            default: [],
          },

          emails: {
            type: [String],
            default: [],
          },
        },
      },
    ],

    contextVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AIChatData", aiChatDataSchema);