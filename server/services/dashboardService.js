import Profile from "../models/Profile.js";
import HealthLog from "../models/HealthLog.js";
import Medicine from "../models/Medicine.js";
import Doctor from "../models/Doctor.js";
import Prescription from "../models/Prescription.js";


export async function getDashboardData(userId) {

  const profile = await Profile.findOne({
    user: userId,
  });


  const latestBP = await HealthLog.findOne({
    user: userId,
    type: "bp",
  }).sort({ createdAt: -1 });


  const latestDiabetes = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
  }).sort({ createdAt: -1 });


  const latestBMI = await HealthLog.findOne({
    user: userId,
    type: "bmi",
  }).sort({ createdAt: -1 });


  const medicineCount = await Medicine.countDocuments({
    user: userId,
  });


  const doctorCount = await Doctor.countDocuments({
    user: userId,
  });


  const prescriptionCount = await Prescription.countDocuments({
    user: userId,
  });


  return {

    user: {
      name: profile?.user?.name || "",
    },


    profile: {
      bloodGroup: profile?.bloodGroup || "",
      gender: profile?.gender || "",
    },


    health: {

      bloodPressure: latestBP
        ? {
            high: latestBP.High,
            low: latestBP.Low,
            date: latestBP.createdAt,
          }
        : null,


      diabetes: latestDiabetes
        ? {
            glucose: latestDiabetes.glucose,
            date: latestDiabetes.createdAt,
          }
        : null,


      bmi: latestBMI
        ? {
            value: latestBMI.bmi,
            weight: latestBMI.weight,
            date: latestBMI.createdAt,
          }
        : null,

    },


    summary: {

      medicines: medicineCount,

      doctors: doctorCount,

      prescriptions: prescriptionCount,

    },


  };

}