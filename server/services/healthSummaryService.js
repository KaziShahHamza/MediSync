function generateHealthSummary(data) {

  const {
    bloodPressure,
    diabetes,
    bmi,
    profile,
  } = data;


  let summary = [];


  // Blood pressure analysis
  if (bloodPressure) {

    const high = bloodPressure.high;
    const low = bloodPressure.low;


    if (high >= 140 || low >= 90) {

      summary.push(
        "Your blood pressure is above the normal range. Reduce salty foods, avoid excessive processed foods, exercise regularly, and monitor your blood pressure frequently."
      );

    } 
    
    else if (high < 120 && low < 80) {

      summary.push(
        "Your blood pressure is currently within a healthy range. Continue maintaining a balanced diet and active lifestyle."
      );

    }

  }



  // Diabetes analysis
  if (diabetes) {

    const glucose = diabetes.glucose;


    if (glucose >= 7) {

      summary.push(
        "Your blood sugar level appears elevated. Limit sugary foods and refined carbohydrates, maintain regular physical activity, and follow your doctor's recommendations."
      );

    } 
    
    else {

      summary.push(
        "Your blood sugar level looks controlled. Continue healthy eating habits and regular monitoring."
      );

    }

  }



  // BMI analysis
  if (bmi) {

    if (bmi.value >= 30) {

      summary.push(
        "Your BMI indicates obesity. Focus on gradual weight management through balanced meals, exercise, and consistent lifestyle changes."
      );

    }

    else if (bmi.value >= 25) {

      summary.push(
        "Your BMI is above the recommended range. Increasing physical activity and improving diet quality may help maintain a healthier weight."
      );

    }

    else {

      summary.push(
        "Your BMI is within a healthy range. Continue your current lifestyle habits."
      );

    }

  }



  // Lifestyle analysis

  if (profile) {


    if (profile.smoking === "Current") {

      summary.push(
        "Smoking can increase health risks. Consider reducing or quitting smoking to improve heart and lung health."
      );

    }


    if (profile.alcohol === "Frequently") {

      summary.push(
        "Frequent alcohol consumption may affect overall health. Consider reducing intake."
      );

    }


    if (profile.exercise === "Never") {

      summary.push(
        "Adding regular physical activity can improve cardiovascular health and overall wellbeing."
      );

    }


  }



  if (summary.length === 0) {

    return (
      "Complete your health profile and add health records to receive personalized health insights."
    );

  }



  return summary.join(" ");

}


export default generateHealthSummary;