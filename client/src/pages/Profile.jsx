// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useProfile } from "../context/ProfileContext";

const illnessOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Kidney Disease",
  "Thyroid",
];

const bloodGroups = [
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

const initialForm = {
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

export default function Profile() {
  const {
    profile,
    userInfo,
    fetchProfile,
    setProfile,
    loading,
  } = useProfile();

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setForm({
      dob: profile.dob
        ? new Date(profile.dob).toISOString().split("T")[0]
        : "",

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
    });
  }, [profile]);

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
          ? prev.chronicIllnesses.filter((i) => i !== name)
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
      const res = await fetch("http://localhost:5000/api/profile", {
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
        fetchProfile();
        alert("Profile saved successfully.");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="container py-12">
        <p className="text-center text-slate-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-10">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-xl shadow p-8 space-y-8"
        >
          {/* PERSONAL */}

          <section>

            <h2 className="text-xl font-semibold mb-4">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-1">
                  Name
                </label>

                <input
                  value={userInfo?.name || ""}
                  disabled
                  className="input w-full bg-slate-100"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Email
                </label>

                <input
                  value={userInfo?.email || ""}
                  disabled
                  className="input w-full bg-slate-100"
                />
              </div>

              <div>

                <label className="block mb-1">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="input w-full"
                />

              </div>

              <div>

                <label className="block mb-1">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">
                    Select
                  </option>

                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>

                </select>

              </div>

              <div>

                <label className="block mb-1">
                  Height
                </label>

                <div className="flex gap-2">

                  <input
                    type="number"
                    name="feet"
                    placeholder="Feet"
                    value={form.height.feet}
                    onChange={handleHeightChange}
                    className="input w-full"
                  />

                  <input
                    type="number"
                    name="inches"
                    placeholder="Inches"
                    value={form.height.inches}
                    onChange={handleHeightChange}
                    className="input w-full"
                  />

                </div>

              </div>

              <div>

                <label className="block mb-1">
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="input w-full"
                >
                  {bloodGroups.map((group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group || "Select"}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </section>

          {/* MEDICAL */}

          <section>

            <h2 className="text-xl font-semibold mb-4">
              Medical Information
            </h2>

            <label className="block mb-2">
              Chronic Illnesses
            </label>

            <div className="grid md:grid-cols-2 gap-2">

              {illnessOptions.map((illness) => (

                <label
                  key={illness}
                  className="flex items-center gap-2"
                >

                  <input
                    type="checkbox"
                    checked={form.chronicIllnesses.includes(illness)}
                    onChange={() => toggleIllness(illness)}
                  />

                  {illness}

                </label>

              ))}

            </div>

            <div className="mt-5">

              <label className="block mb-1">
                Allergies
              </label>

              <textarea
                rows={3}
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                className="input w-full"
              />

            </div>

            <div className="mt-5">

              <label className="block mb-1">
                Surgeries
              </label>

              <textarea
                rows={3}
                name="surgeries"
                value={form.surgeries}
                onChange={handleChange}
                className="input w-full"
              />

            </div>

          </section>

                    {/* LIFESTYLE */}

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Lifestyle
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-1">
                  Smoking
                </label>

                <select
                  name="smoking"
                  value={form.smoking}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">Select</option>
                  <option>Never</option>
                  <option>Former</option>
                  <option>Current</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">
                  Alcohol
                </label>

                <select
                  name="alcohol"
                  value={form.alcohol}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">Select</option>
                  <option>Never</option>
                  <option>Occasionally</option>
                  <option>Frequently</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">
                  Exercise
                </label>

                <select
                  name="exercise"
                  value={form.exercise}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">Select</option>
                  <option>Never</option>
                  <option>1-2 Days</option>
                  <option>3-5 Days</option>
                  <option>Daily</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">
                  Diet
                </label>

                <select
                  name="diet"
                  value={form.diet}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">Select</option>
                  <option>Mixed</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                </select>
              </div>

            </div>
          </section>

          {/* EMERGENCY CONTACT */}

          <section>

            <h2 className="text-xl font-semibold mb-4">
              Emergency Contact
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-1">
                  Contact Name
                </label>

                <input
                  name="name"
                  value={form.emergencyContact.name}
                  onChange={handleEmergencyChange}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.emergencyContact.phone}
                  onChange={handleEmergencyChange}
                  className="input w-full"
                />
              </div>

            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving
              ? "Saving..."
              : profile
              ? "Update Profile"
              : "Create Profile"}
          </button>

        </form>

        {/* PROFILE SUMMARY */}

        <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">

          <h2 className="text-xl font-bold mb-6">
            Profile Summary
          </h2>

          <div className="space-y-4 text-sm">

            <div>
              <p className="text-slate-500">
                Name
              </p>

              <p className="font-medium">
                {userInfo?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Email
              </p>

              <p className="font-medium break-all">
                {userInfo?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Gender
              </p>

              <p>
                {form.gender || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Height
              </p>

              <p>
                {form.height.feet || "-"} ft{" "}
                {form.height.inches || "0"} in
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Blood Group
              </p>

              <p>
                {form.bloodGroup || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Chronic Illnesses
              </p>

              {form.chronicIllnesses.length ? (
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {form.chronicIllnesses.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>None</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">
                Allergies
              </p>

              <p>
                {form.allergies || "None"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Surgeries
              </p>

              <p>
                {form.surgeries || "None"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Smoking
              </p>

              <p>
                {form.smoking || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Alcohol
              </p>

              <p>
                {form.alcohol || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Exercise
              </p>

              <p>
                {form.exercise || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Diet
              </p>

              <p>
                {form.diet || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Emergency Contact
              </p>

              <p>
                {form.emergencyContact.name || "-"}
              </p>

              <p className="text-slate-600">
                {form.emergencyContact.phone || "-"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}