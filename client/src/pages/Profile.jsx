// src/pages/Profile.jsx
import { useEffect, useState } from "react";
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

    const nextForm = {
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

    };

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
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


  {/* HEADER */}

  <div className="mb-10">

    <h1 className="text-3xl font-bold text-slate-800">
      My Profile
    </h1>


    <p className="text-slate-500 mt-2">
      Manage your personal and medical information.
    </p>

  </div>





  <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">



    {/* SUMMARY */}

    <ProfileSummary
      userInfo={userInfo}
      form={form}
    />





    {/* FORM */}

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >




      <ProfileSection
        title="Personal Information"
        description="Basic details used for your health profile."
      >


        <div className="grid md:grid-cols-2 gap-5">


          <ProfileInput
            label="Name"
            value={userInfo?.name || ""}
            disabled
          />


          <ProfileInput
            label="Email"
            value={userInfo?.email || ""}
            disabled
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

            <option value="">
              Select
            </option>

            <option>
              Male
            </option>

            <option>
              Female
            </option>

            <option>
              Other
            </option>


          </ProfileSelect>



          <div>

            <label className="block text-sm font-medium mb-2">
              Height
            </label>


            <div className="flex gap-3">

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




          <ProfileSelect
            label="Blood Group"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
          >

            {bloodGroups.map(group=>(
              <option key={group}>
                {group || "Select"}
              </option>
            ))}


          </ProfileSelect>



        </div>


      </ProfileSection>








      <ProfileSection
        title="Medical Information"
        description="Important medical history."
      >


        <label className="block text-sm font-medium mb-3">
          Chronic Illnesses
        </label>



        <div className="grid md:grid-cols-2 gap-3">


          {illnessOptions.map((item)=>(

            <label
              key={item}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                p-3
                hover:bg-slate-50
                cursor-pointer
              "
            >

              <input
                type="checkbox"
                checked={
                  form.chronicIllnesses.includes(item)
                }
                onChange={() =>
                  toggleIllness(item)
                }
              />


              {item}


            </label>


          ))}


        </div>




        <textarea
          rows="3"
          name="allergies"
          placeholder="Allergies"
          value={form.allergies}
          onChange={handleChange}
          className="input w-full mt-5"
        />



        <textarea
          rows="3"
          name="surgeries"
          placeholder="Previous surgeries"
          value={form.surgeries}
          onChange={handleChange}
          className="input w-full mt-5"
        />



      </ProfileSection>









      <ProfileSection
        title="Lifestyle"
        description="Daily habits and activities."
      >


        <div className="grid md:grid-cols-2 gap-5">


          <ProfileSelect
            label="Smoking"
            name="smoking"
            value={form.smoking}
            onChange={handleChange}
          >
            <option value="">
              Select
            </option>

            <option>
              Never
            </option>

            <option>
              Former
            </option>

            <option>
              Current
            </option>

          </ProfileSelect>





          <ProfileSelect
            label="Alcohol"
            name="alcohol"
            value={form.alcohol}
            onChange={handleChange}
          >

            <option value="">
              Select
            </option>

            <option>
              Never
            </option>

            <option>
              Occasionally
            </option>

            <option>
              Frequently
            </option>

          </ProfileSelect>





          <ProfileSelect
            label="Exercise"
            name="exercise"
            value={form.exercise}
            onChange={handleChange}
          >

            <option value="">
              Select
            </option>

            <option>
              Never
            </option>

            <option>
              1-2 Days
            </option>

            <option>
              3-5 Days
            </option>

            <option>
              Daily
            </option>


          </ProfileSelect>




          <ProfileSelect
            label="Diet"
            name="diet"
            value={form.diet}
            onChange={handleChange}
          >

            <option value="">
              Select
            </option>

            <option>
              Mixed
            </option>

            <option>
              Vegetarian
            </option>

            <option>
              Vegan
            </option>


          </ProfileSelect>



        </div>


      </ProfileSection>








      <ProfileSection
        title="Emergency Contact"
      >


        <div className="grid md:grid-cols-2 gap-5">


          <ProfileInput
            label="Contact Name"
            name="name"
            value={
              form.emergencyContact.name
            }
            onChange={
              handleEmergencyChange
            }
          />



          <ProfileInput
            label="Phone Number"
            name="phone"
            value={
              form.emergencyContact.phone
            }
            onChange={
              handleEmergencyChange
            }
          />


        </div>


      </ProfileSection>







      <button
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



  </div>



</div>

);

}