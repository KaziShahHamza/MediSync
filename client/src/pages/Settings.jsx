// client/src/pages/Settings.jsx

import { useEffect, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import ProfileSection from "../components/profile/ProfileSection";
import ProfileInput from "../components/profile/ProfileInput";
import ProfileSelect from "../components/profile/ProfileSelect";
import { districtsData } from "../data/districtsData";
import { Camera, Trash2, Upload } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const illnessOptions = [
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

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const relationOptions = [
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Husband",
  "Wife",
  "Brother",
  "Sister",
  "Friend",
  "Doctor",
  "Personal Health Assistant",
  "Other",
];

const months = [
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

const currentYear = new Date().getFullYear();

const years = Array.from({ length: 100 }, (_, index) => currentYear - index);

const createEmptyContact = () => ({
  relation: "",
  name: "",
  phone: "",
  email: "",
});

const initialForm = {
  name: "",
  dob: "",
  gender: "",

  height: {
    feet: "",
    inches: "",
  },

  bloodGroup: "",

  location: {
    district: "",
    upazila: "",
    streetAddress: "",
  },

  allergies: "",
  chronicIllnesses: [],
  surgeries: "",

  emergencyContacts: [],

  bloodDonorStatus: "",
  bloodDonationCompensation: "",

  lastBloodDonation: {
    month: "",
    year: "",
  },

  bloodDonationContactNumber: "",
};

function getDonationMonthYear(value) {
  if (!value) {
    return {
      month: "",
      year: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "",
      year: "",
    };
  }

  return {
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear()),
  };
}

function buildDonationDate(month, year) {
  if (!month || !year) {
    return null;
  }

  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toISOString();
}

function getInitials(name) {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Settings() {
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile && !userInfo) return;

    const nextForm = {
      name: userInfo?.name || "",

      dob: profile?.dob
        ? new Date(profile.dob).toISOString().split("T")[0]
        : "",

      gender: profile?.gender || "",

      height: {
        feet: profile?.height?.feet ?? "",
        inches: profile?.height?.inches ?? "",
      },

      bloodGroup: profile?.bloodGroup || "",

      location: {
        district: profile?.location?.district || "",
        upazila: profile?.location?.upazila || "",
        streetAddress: profile?.location?.streetAddress || "",
      },

      allergies: profile?.allergies || "",

      chronicIllnesses: profile?.chronicIllnesses || [],

      surgeries: profile?.surgeries || "",

      emergencyContacts:
        profile?.emergencyContacts?.map((contact) => ({
          relation: contact.relation || "",
          name: contact.name || "",
          phone: contact.phone || "",
          email: contact.email || "",
        })) || [],

      bloodDonorStatus: profile?.bloodDonorStatus || "",

      bloodDonationCompensation: profile?.bloodDonationCompensation || "",

      lastBloodDonation: getDonationMonthYear(profile?.lastBloodDonation),

      bloodDonationContactNumber: profile?.bloodDonationContactNumber || "",
    };

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, userInfo]);

  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleHeightChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      height: {
        ...prev.height,
        [name]: value,
      },
    }));
  }

  function handleLocationChange(field, value) {
    setForm((prev) => {
      if (field === "district") {
        return {
          ...prev,
          location: {
            ...prev.location,
            district: value,
            upazila: "",
          },
        };
      }

      return {
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      };
    });
  }

  function toggleIllness(name) {
    setForm((prev) => {
      const exists = prev.chronicIllnesses.includes(name);

      return {
        ...prev,
        chronicIllnesses: exists
          ? prev.chronicIllnesses.filter((item) => item !== name)
          : [...prev.chronicIllnesses, name],
      };
    });
  }

  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, createEmptyContact()],
    }));
  }

  function removeEmergencyContact(index) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

  function handleEmergencyContactChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, contactIndex) =>
        contactIndex === index
          ? {
              ...contact,
              [field]: value,
            }
          : contact,
      ),
    }));
  }

  function handleDonationDateChange(field, value) {
    setForm((prev) => ({
      ...prev,
      lastBloodDonation: {
        ...prev.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  function validateForm() {
    for (const contact of form.emergencyContacts) {
      if (!contact.relation.trim()) {
        return "Please select a relation for every emergency contact.";
      }

      if (!contact.name.trim()) {
        return "Please enter the name of every emergency contact.";
      }

      if (!contact.phone.trim() && !contact.email.trim()) {
        return "Each emergency contact must have a phone number or email address.";
      }

      if (
        contact.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
      ) {
        return `Please enter a valid email for ${contact.name}.`;
      }
    }

    const { month, year } = form.lastBloodDonation;

    if ((month && !year) || (!month && year)) {
      return "Please select both the month and year of the last blood donation.";
    }

    if (month && year) {
      const selectedDate = new Date(Number(year), Number(month) - 1, 1);

      const now = new Date();

      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (selectedDate > currentMonth) {
        return "Last blood donation cannot be in the future.";
      }
    }

    return null;
  }

  // =========================
  // PROFILE PHOTO UPLOAD
  // =========================

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be smaller than 5 MB.");
      return;
    }

    setPhotoLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      formData.append("folder", "MediSync/profile-photos");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload profile photo.");
      }

      const uploadData = await uploadRes.json();

      const token = localStorage.getItem("token");

      const saveRes = await fetch(`${API_URL}/api/profile/photo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePhotoUrl: uploadData.secure_url,

          profilePhotoPublicId: uploadData.public_id,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.message || "Failed to save profile photo.");
      }

      setUserInfo(saveData.user);

      alert("Profile photo updated successfully.");
    } catch (err) {
      console.error("Profile photo upload failed:", err);

      alert(err.message || "Failed to update profile photo.");
    } finally {
      setPhotoLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // =========================
  // REMOVE PROFILE PHOTO
  // =========================

  async function handleRemovePhoto() {
    if (!userInfo?.profilePhotoUrl) {
      return;
    }

    const confirmed = window.confirm("Remove your profile photo?");

    if (!confirmed) return;

    setPhotoLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/profile/photo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove profile photo.");
      }

      setUserInfo(data.user);

      alert("Profile photo removed.");
    } catch (err) {
      console.error("Profile photo removal failed:", err);

      alert(err.message || "Failed to remove profile photo.");
    } finally {
      setPhotoLoading(false);
    }
  }

  // =========================
  // SAVE PROFILE
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);

    const token = localStorage.getItem("token");

    const method = profile ? "PUT" : "POST";

    const payload = {
      name: form.name,

      dob: form.dob || null,

      gender: form.gender,

      height: {
        feet: form.height.feet === "" ? null : Number(form.height.feet),

        inches: form.height.inches === "" ? null : Number(form.height.inches),
      },

      bloodGroup: form.bloodGroup,

      allergies: form.allergies,

      chronicIllnesses: form.chronicIllnesses,

      surgeries: form.surgeries,

      emergencyContacts: form.emergencyContacts.map((contact) => ({
        relation: contact.relation.trim(),

        name: contact.name.trim(),

        phone: contact.phone.trim(),

        email: contact.email.trim(),
      })),

      bloodDonorStatus: form.bloodDonorStatus,

      bloodDonationCompensation: form.bloodDonationCompensation,

      lastBloodDonation: buildDonationDate(
        form.lastBloodDonation.month,
        form.lastBloodDonation.year,
      ),

      location: {
        district: form.location.district,

        upazila: form.location.upazila,

        streetAddress: form.location.streetAddress.trim(),
      },

      bloodDonationContactNumber: form.bloodDonationContactNumber.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.profile) {
          setProfile(data.profile);
        } else {
          setProfile(data);
        }

        if (data.user) {
          setUserInfo(data.user);
        }

        await fetchProfile();

        alert("Profile saved successfully.");
      } else {
        alert(data.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error(err);

      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading settings...</p>
      </div>
    );
  }

  const hasPhoto = Boolean(userInfo?.profilePhotoUrl);

  return (
    <div className="continer-profile-setting-page py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="text-slate-500 mt-2">
          Update your personal and medical information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* =========================
            PROFILE PHOTO
        ========================== */}

        <ProfileSection
          title="Profile Photo"
          description="Add a photo so your profile is easier to recognize."
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {hasPhoto ? (
                <img
                  src={userInfo.profilePhotoUrl}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
                  <span className="text-3xl font-semibold text-slate-500">
                    {getInitials(userInfo?.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {hasPhoto ? <Camera size={17} /> : <Upload size={17} />}

                  {photoLoading
                    ? "Processing..."
                    : hasPhoto
                      ? "Change Photo"
                      : "Add Photo"}
                </button>

                {hasPhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={photoLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={17} />
                    Remove Photo
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <p className="text-sm text-slate-500">
                JPG, PNG or WebP. Maximum file size: 5 MB.
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* =========================
            PERSONAL INFORMATION
        ========================== */}

        <ProfileSection
          title="Personal Information"
          description="Basic details used for your health profile."
        >
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <ProfileInput
              label="Username"
              value={userInfo?.username || ""}
              disabled
            />

            <ProfileInput
              label="Email"
              value={userInfo?.email || ""}
              disabled
            />

            <ProfileInput
              label="Name"
              value={form.name}
              name="name"
              onChange={handleChange}
            />

            <ProfileInput
              label="Date of Birth"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />

            <ProfileSelect
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>
            </ProfileSelect>

            <div>
              <label className="block text-sm font-medium mb-2">Height</label>

              <div className="flex gap-3">
                <input
                  type="number"
                  name="feet"
                  placeholder="Feet"
                  min="0"
                  value={form.height.feet}
                  onChange={handleHeightChange}
                  className="input w-full"
                />

                <input
                  type="number"
                  name="inches"
                  placeholder="Inches"
                  min="0"
                  max="11"
                  value={form.height.inches}
                  onChange={handleHeightChange}
                  className="input w-full"
                />
              </div>
            </div>

            <ProfileSelect
              label="Blood Group"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group || "Select"}
                </option>
              ))}
            </ProfileSelect>

            {/* Street address */}
            <div className="col-span-2">
              <ProfileInput
                label="Street Address"
                name="streetAddress"
                value={form.location.streetAddress}
                onChange={(e) =>
                  handleLocationChange("streetAddress", e.target.value)
                }
                placeholder="House/Road, Area, Village, etc."
              />

              <p className="text-xs text-slate-500 mt-2">
                Your street address is private and will only be used in your
                emergency card.
              </p>
            </div>

            <ProfileSelect
              label="Upazila / Sub-district"
              value={form.location.upazila}
              onChange={(e) => handleLocationChange("upazila", e.target.value)}
              disabled={!form.location.district}
            >
              <option value="">
                {form.location.district
                  ? "Select upazila"
                  : "Select district first"}
              </option>

              {availableUpazilas.map((upazila) => (
                <option key={upazila} value={upazila}>
                  {upazila}
                </option>
              ))}
            </ProfileSelect>

            {/* Zila / Upazila */}
            <ProfileSelect
              label="District / Zila"
              value={form.location.district}
              onChange={(e) => handleLocationChange("district", e.target.value)}
            >
              <option value="">Select district</option>

              {districtsData.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
            </ProfileSelect>
          </div>
        </ProfileSection>

        {/* =========================
            MEDICAL INFORMATION
        ========================== */}

        <ProfileSection
          title="Medical Information"
          description="Important medical history."
        >
          <label className="block text-sm font-medium mb-3">
            Chronic Illnesses
          </label>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {illnessOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.chronicIllnesses.includes(item)}
                  onChange={() => toggleIllness(item)}
                  className="shrink-0 translate-y-px"
                />

                <span className="ml-2">{item}</span>
              </label>
            ))}
          </div>

          <label className="block text-sm font-medium mt-5">Allergies</label>

          <input
            type="text"
            name="allergies"
            placeholder="e.g., Dust, Cold, Egg, Fish"
            value={form.allergies}
            onChange={handleChange}
            className="input w-full mt-2"
          />

          <label className="block text-sm font-medium mt-5">Surgeries</label>

          <input
            type="text"
            name="surgeries"
            placeholder="e.g., Heart surgery (2020), Eye operation (2024)"
            value={form.surgeries}
            onChange={handleChange}
            className="input w-full mt-2"
          />
        </ProfileSection>

        {/* =========================
            EMERGENCY CONTACTS
        ========================== */}

        <ProfileSection
          title="Emergency Contacts"
          description="People who can be contacted when you need urgent support."
        >
          <div className="space-y-5">
            {form.emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-800">
                    Emergency Contact {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <ProfileSelect
                    label="Relation"
                    value={contact.relation}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        index,
                        "relation",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">Select relation</option>

                    {relationOptions.map((relation) => (
                      <option key={relation} value={relation}>
                        {relation}
                      </option>
                    ))}
                  </ProfileSelect>

                  <ProfileInput
                    label="Name"
                    value={contact.name}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        index,
                        "name",
                        e.target.value,
                      )
                    }
                  />

                  <ProfileInput
                    label="Phone Number"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        index,
                        "phone",
                        e.target.value,
                      )
                    }
                  />

                  <ProfileInput
                    label="Email"
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        index,
                        "email",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            ))}

            {form.emergencyContacts.length < 3 && (
              <button
                type="button"
                onClick={addEmergencyContact}
                className="btn-primary"
              >
                + Add Emergency Contact
              </button>
            )}

            <p className="text-sm text-slate-500">
              You can add up to 3 emergency contacts. Each contact must have a
              phone number or email address.
            </p>
          </div>
        </ProfileSection>

        {/* =========================
            BLOOD DONATION
        ========================== */}

        <ProfileSection
          title="Blood Donation"
          description="Manage your blood donation availability and contact information."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <ProfileSelect
              label="Are you willing to donate blood?"
              name="bloodDonorStatus"
              value={form.bloodDonorStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>

              <option value="yes">Yes, I am available to donate</option>

              <option value="no">No, I do not want to donate</option>

              <option value="willingly">
                Willingly, when someone needs blood
              </option>
            </ProfileSelect>

            <div>
              {/* Blood donation contact */}
              <ProfileInput
                label="Contact Number"
                type="tel"
                name="bloodDonationContactNumber"
                value={form.bloodDonationContactNumber}
                onChange={handleChange}
                placeholder="e.g. 017XXXXXXXX"
              />

              <p className="text-sm text-slate-500 mt-2">
                This number will be shown in the blood donors page.
              </p>
            </div>
          </div>

          {/* Last donation */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Last blood donation
            </label>

            <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
              <select
                value={form.lastBloodDonation.month}
                onChange={(e) =>
                  handleDonationDateChange("month", e.target.value)
                }
                className="input w-full"
              >
                <option value="">Select month</option>

                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <select
                value={form.lastBloodDonation.year}
                onChange={(e) =>
                  handleDonationDateChange("year", e.target.value)
                }
                className="input w-full"
              >
                <option value="">Select year</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <ProfileSelect
                label="Accepts honorarium/travel cost? (সম্মানী/গাড়ি ভাড়া)"
                name="bloodDonationCompensation"
                value={form.bloodDonationCompensation}
                onChange={handleChange}
                disabled={!["yes", "willingly"].includes(form.bloodDonorStatus)}
              >
                <option value="">Select</option>

                <option value="500">Yes</option>

                <option value="none">No</option>
              </ProfileSelect>
            </div>
          </div>
        </ProfileSection>

        {/* =========================
            SAVE
        ========================== */}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? "Saving..."
              : profile
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
