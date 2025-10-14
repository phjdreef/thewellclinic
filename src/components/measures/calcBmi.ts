export type BmiCategory =
  | "underWeight"
  | "normalWeight"
  | "overWeight"
  | "obeseClass1"
  | "obeseClass2"
  | "obeseClass3";

function calcBmi(weight: number, height: number) {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(1));
}

// Determine BMI category

function determineBmiCategory(bmiValue: number): BmiCategory {
  if (bmiValue < 18.5) return "underWeight";
  else if (bmiValue >= 18.5 && bmiValue < 25) return "normalWeight";
  else if (bmiValue >= 25 && bmiValue < 30) return "overWeight";
  else if (bmiValue >= 30 && bmiValue < 35) return "obeseClass1";
  else if (bmiValue >= 35 && bmiValue < 40) return "obeseClass2";
  else return "obeseClass3";
}

export { calcBmi, determineBmiCategory };
