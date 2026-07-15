function InfoItem({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={`
        rounded-xl 
        border border-slate-200
        bg-slate-50
        p-4
        ${full ? "sm:col-span-2" : ""}
      `}
    >

      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-medium text-slate-800 break-words">
        {value || "-"}
      </p>

    </div>
  );
}



export default function ProfileSummary({
  userInfo,
  form,
}) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        border border-slate-200
        p-6
        lg:p-8
        lg:sticky
        lg:top-24
      "
    >


      <div className="mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Profile Summary
        </h2>


        <p className="text-sm text-slate-500 mt-1">
          Overview of your saved health information.
        </p>

      </div>




      <div className="grid sm:grid-cols-2 gap-4">


        <InfoItem
          label="Name"
          value={userInfo?.name}
        />


        <InfoItem
          label="Email"
          value={userInfo?.email}
          full
        />



        <InfoItem
          label="Gender"
          value={form.gender}
        />


        <InfoItem
          label="Height"
          value={
            form.height.feet
              ? `${form.height.feet} ft ${form.height.inches || 0} in`
              : "-"
          }
        />



        <InfoItem
          label="Blood Group"
          value={form.bloodGroup}
        />



        <InfoItem
          label="Smoking"
          value={form.smoking}
        />


        <InfoItem
          label="Alcohol"
          value={form.alcohol}
        />


        <InfoItem
          label="Exercise"
          value={form.exercise}
        />


        <InfoItem
          label="Diet"
          value={form.diet}
        />



        <InfoItem
          label="Allergies"
          value={form.allergies || "None"}
          full
        />


        <InfoItem
          label="Surgeries"
          value={form.surgeries || "None"}
          full
        />



        <InfoItem
          label="Emergency Contact"
          value={
            form.emergencyContact.name
              ? `${form.emergencyContact.name} - ${form.emergencyContact.phone}`
              : "-"
          }
          full
        />



        <div
          className="
            sm:col-span-2
            rounded-xl
            bg-sky-50
            border
            border-sky-100
            p-4
          "
        >

          <p className="text-xs uppercase tracking-wide text-sky-600">
            Chronic Illnesses
          </p>


          {form.chronicIllnesses.length ? (

            <ul className="mt-2 list-disc list-inside text-slate-700">

              {form.chronicIllnesses.map((item)=>(
                <li key={item}>
                  {item}
                </li>
              ))}

            </ul>

          ) : (

            <p className="mt-2 text-slate-600">
              None
            </p>

          )}

        </div>


      </div>


    </div>

  );
}