import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import { useProfile } from "../context/ProfileContext";
import ProfileSummary from "../components/profile/ProfileSummary";
import ProfileSection from "../components/profile/ProfileSection";
import ProfileInput from "../components/profile/ProfileInput";
import ProfileSelect from "../components/profile/ProfileSelect";

const illnessOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Kidney Disease",
  "Thyroid",
];

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  name: "",
  dob: "",
  gender: "",
  height: {
    feet: "",
    inches: "",
  },
  bloodGroup: "",
  allergies: "",
  chronicIllnesses: [],
  surgeries: "",
  smoking: "",
  alcohol: "",
  exercise: "",
  diet: "",
  emergencyContact: {
    name: "",
    phone: "",
  },
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { profile, userInfo, fetchProfile, setProfile, loading } = useProfile();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const nextForm = {
      name: userInfo?.name || "",
      dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
      gender: profile.gender || "",
      height: {
        feet: profile.height?.feet || "",
        inches: profile.height?.inches || "",
      },
      bloodGroup: profile.bloodGroup || "",
      allergies: profile.allergies || "",
      chronicIllnesses: profile.chronicIllnesses || [],
      surgeries: profile.surgeries || "",
      smoking: profile.smoking || "",
      alcohol: profile.alcohol || "",
      exercise: profile.exercise || "",
      diet: profile.diet || "",
      emergencyContact: {
        name: profile.emergencyContact?.name || "",
        phone: profile.emergencyContact?.phone || "",
      },
    };

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, userInfo]);

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

  function handleEmergencyChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
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

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const token = localStorage.getItem("token");
    const method = profile ? "PUT" : "POST";

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data);
        await fetchProfile();
        window.alert("Profile saved successfully.");
      } else {
        window.alert(data.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      window.alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="ms-page ms-profile-page">
        <div className="ms-container">
          <div className="ms-loading-state">
            <span className="ms-spinner" />
            <p>Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ms-page ms-profile-page">
      <div className="ms-container">
        <header className="ms-page-header ms-profile-header">
          <div className="ms-profile-heading">
            <div className="ms-profile-heading-icon">
              <UserRound size={22} strokeWidth={1.8} />
            </div>

            <div>
              <p className="ms-page-eyebrow">Personal health record</p>

              <h1 className="ms-page-title">My Profile</h1>

              <p className="ms-page-subtitle">
                Manage your personal, medical, lifestyle, and emergency
                information.
              </p>
            </div>
          </div>
        </header>

        <div className="ms-profile-layout">
          <ProfileSummary userInfo={userInfo} form={form} />

          <form className="ms-form ms-profile-form" onSubmit={handleSubmit}>
            <ProfileSection
              title="Personal Information"
              description="Basic details used for your health profile."
            >
              <div className="ms-profile-fields-grid">
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
                  name="name"
                  value={form.name}
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

                <div className="ms-field">
                  <label className="ms-label" htmlFor="profile-height-feet">
                    Height
                  </label>

                  <div className="ms-height-fields">
                    <div className="ms-height-field">
                      <input
                        id="profile-height-feet"
                        className="ms-input"
                        type="number"
                        name="feet"
                        min="0"
                        max="8"
                        placeholder="Feet"
                        value={form.height.feet}
                        onChange={handleHeightChange}
                      />

                      <span>ft</span>
                    </div>

                    <div className="ms-height-field">
                      <input
                        id="profile-height-inches"
                        className="ms-input"
                        type="number"
                        name="inches"
                        min="0"
                        max="11"
                        placeholder="Inches"
                        value={form.height.inches}
                        onChange={handleHeightChange}
                      />

                      <span>in</span>
                    </div>
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
              </div>
            </ProfileSection>

            <ProfileSection
              title="Medical Information"
              description="Important medical history that can help provide better health context."
            >
              <div className="ms-field">
                <span className="ms-label">Chronic Illnesses</span>

                <div className="ms-illness-grid">
                  {illnessOptions.map((item) => {
                    const checked = form.chronicIllnesses.includes(item);

                    return (
                      <label
                        key={item}
                        className={`ms-illness-option ${
                          checked ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleIllness(item)}
                        />

                        <span className="ms-custom-checkbox">
                          <span />
                        </span>

                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="ms-profile-textareas">
                <div className="ms-field">
                  <label className="ms-label" htmlFor="profile-allergies">
                    Allergies
                  </label>

                  <textarea
                    id="profile-allergies"
                    className="ms-input ms-textarea"
                    rows="3"
                    name="allergies"
                    placeholder="List any known allergies"
                    value={form.allergies}
                    onChange={handleChange}
                  />
                </div>

                <div className="ms-field">
                  <label className="ms-label" htmlFor="profile-surgeries">
                    Previous Surgeries
                  </label>

                  <textarea
                    id="profile-surgeries"
                    className="ms-input ms-textarea"
                    rows="3"
                    name="surgeries"
                    placeholder="List any previous surgeries"
                    value={form.surgeries}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Lifestyle"
              description="Daily habits and activities that form part of your health profile."
            >
              <div className="ms-profile-fields-grid">
                <ProfileSelect
                  label="Smoking"
                  name="smoking"
                  value={form.smoking}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Never">Never</option>
                  <option value="Former">Former</option>
                  <option value="Current">Current</option>
                </ProfileSelect>

                <ProfileSelect
                  label="Alcohol"
                  name="alcohol"
                  value={form.alcohol}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Frequently">Frequently</option>
                </ProfileSelect>

                <ProfileSelect
                  label="Exercise"
                  name="exercise"
                  value={form.exercise}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Never">Never</option>
                  <option value="1-2 Days">1-2 Days</option>
                  <option value="3-5 Days">3-5 Days</option>
                  <option value="Daily">Daily</option>
                </ProfileSelect>

                <ProfileSelect
                  label="Diet"
                  name="diet"
                  value={form.diet}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </ProfileSelect>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Emergency Contact"
              description="Someone who can be contacted in case of an emergency."
            >
              <div className="ms-profile-fields-grid">
                <ProfileInput
                  label="Contact Name"
                  name="name"
                  value={form.emergencyContact.name}
                  onChange={handleEmergencyChange}
                />

                <ProfileInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={form.emergencyContact.phone}
                  onChange={handleEmergencyChange}
                />
              </div>
            </ProfileSection>

            <div className="ms-profile-submit-row">
              <button
                type="submit"
                className="ms-btn ms-btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="ms-spinner" />
                    Saving...
                  </>
                ) : profile ? (
                  "Update Profile"
                ) : (
                  "Create Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
