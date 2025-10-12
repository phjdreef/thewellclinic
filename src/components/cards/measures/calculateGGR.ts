import { BmiCategory, Gender, GgrCategory } from "@/hooks/useStore";

// Types for inputs/outputs
export interface GgrInput {
  bmi: number; // kg/m²
  bmiCategory: BmiCategory; // optional, for reference
  gender: Gender;
  waist: number; // centimeters
  hasComorbidity?: boolean; // default false
}

export interface GgrResult {
  GgrCategory: GgrCategory;
}

/**
 * Compute GGR category from BMI, sex, waist circumference, and comorbidity.
 * Based on thresholds:
 * - Increased waist: men ≥102 cm, women ≥88 cm
 * - Risk rises by BMI band and presence of either increased waist OR comorbidity.
 */
export function calcGgrCategory(input: GgrInput): GgrResult {
  const bmi = input.bmi;
  if (!Number.isFinite(bmi) || bmi <= 0) {
    throw new Error("BMI must be a positive number.");
  }

  const sex = input.gender;
  if (sex !== "male" && sex !== "female") {
    throw new Error('sex must be "male" or "female".');
  }

  const hasComorbidity = !!input.hasComorbidity;

  const hasIncreasedWaist =
    input.waist == null
      ? false // unknown waist -> treat as not increased (conservative). Adjust if you prefer "unknown = treat as increased".
      : sex === "male"
        ? input.waist >= 102
        : input.waist >= 88;

  const anyRiskFactor = hasIncreasedWaist || hasComorbidity;

  // Map to category per table
  let ggrCategory: GgrCategory;
  switch (input.bmiCategory) {
    case "normalWeight":
    case "underWeight":
      ggrCategory = "normal"; // outside the table; typical interpretation
      break;
    case "overWeight":
      ggrCategory = anyRiskFactor ? "moderateIncreased" : "lightIncreased";
      break;
    case "obeseClass1":
      ggrCategory = anyRiskFactor ? "stronglyIncreased" : "lightIncreased";
      break;
    case "obeseClass2":
      ggrCategory = anyRiskFactor ? "extremeIncreased" : "stronglyIncreased";
      break;
    case "obeseClass3":
      ggrCategory = "extremeIncreased";
      break;
  }

  return { GgrCategory: ggrCategory };
}
