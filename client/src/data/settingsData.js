// client/src/data/settingsData.js

// Provides static option lists and dynamic year selections used across setting forms.

// Common chronic condition choices
export const illnessOptions = [
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

// Supported blood group selections
export const bloodGroups = [
  "",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

// Standard relationship types for emergency contacts
export const relationOptions = [
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

// Months mapping for blood donation date inputs
export const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Current calendar year context
const currentYear = new Date().getFullYear();

// Generated list of past 100 years
export const years = Array.from(
  { length: 100 },
  (_, index) => currentYear - index,
);
