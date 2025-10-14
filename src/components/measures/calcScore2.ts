// =============================================================================
// SCORE2 Calculation Functions (ESC 2021)
// Contains calculation logic for SCORE2 cardiovascular risk assessment
// =============================================================================

import {
  SCORE2_TABLE_LOW_RISK,
  SCORE2_COLOR_MATRIX,
  AgeGroup,
  SmokingStatus,
  RiskColor,
  Gender,
} from "./score2Tables";

export type Region = "low" | "moderate" | "high" | "very-high";

export interface Score2Input {
  sex: Gender;
  region: Region;
  age: number; // 40–89 years
  sbp: number; // systolic BP (mmHg)
  nonHdl: number; // mmol/L
  smoker: boolean;
}

interface Risk10yr {
  step: number;
  value: number;
  description: string;
}

export interface Score2Result {
  model: "SCORE2" | "SCORE2-OP";
  risk10yr: Risk10yr; // e.g. "<2.5%", "2.5% - 7.5%", "≥7.5%"
  color: "green" | "yellow" | "red"; // risk category color
  tableValue: number; // original number from the SCORE2 table
}

// Helper function to map age to age group
function getAgeGroup(age: number): AgeGroup | null {
  if (age >= 40 && age <= 44) return "40-44";
  if (age >= 45 && age <= 49) return "45-49";
  if (age >= 50 && age <= 54) return "50-54";
  if (age >= 55 && age <= 59) return "55-59";
  if (age >= 60 && age <= 64) return "60-64";
  if (age >= 65 && age <= 69) return "65-69";
  return null; // Age not in supported range
}

// Helper function to map systolic BP to index
function getSbpIndex(sbp: number): number | null {
  if (sbp >= 100 && sbp <= 119) return 0;
  if (sbp >= 120 && sbp <= 139) return 1;
  if (sbp >= 140 && sbp <= 159) return 2;
  if (sbp >= 160) return 3; // Use highest category for very high BP
  return null; // SBP out of range
}

// Helper function to map non-HDL cholesterol to index
function getNonHdlIndex(nonHdl: number): number | null {
  if (nonHdl >= 2.0 && nonHdl < 4.0) return 0;
  if (nonHdl >= 4.0 && nonHdl < 6.0) return 1;
  if (nonHdl >= 6.0 && nonHdl < 8.0) return 2;
  if (nonHdl >= 8.0) return 3; // Use highest category for very high non-HDL
  return null; // Non-HDL out of range (< 2.0)
}

// Get risk color category from the color matrix
export function getRiskColorCategory(
  sex: Gender,
  age: number,
  sbp: number,
  nonHdl: number,
  smoker: boolean,
): RiskColor | null {
  const ageGroup = getAgeGroup(age);
  const sbpIndex = getSbpIndex(sbp);
  const nonHdlIndex = getNonHdlIndex(nonHdl);

  // Check if any of the values are out of range
  if (ageGroup === null || sbpIndex === null || nonHdlIndex === null) {
    return null; // Invalid input values
  }

  const smokingStatus: SmokingStatus = smoker ? "smoking" : "nonsmoking";
  const colorTable = SCORE2_COLOR_MATRIX[sex][smokingStatus][ageGroup];
  return colorTable[sbpIndex][nonHdlIndex];
}

// Convert risk color to age-appropriate risk description
export function getRiskPercentFromColor(
  color: RiskColor,
  age: number,
): Risk10yr {
  if (age < 50) {
    // For patients < 50 years
    switch (color) {
      case "green":
        return { step: 1, value: 2.5, description: "<2.5%" };
      case "yellow":
        return { step: 2, value: 5, description: "2.5% - 7.5%" };
      case "red":
        return { step: 3, value: 7.5, description: "≥7.5%" };
    }
  } else {
    // For patients 50-69 years
    switch (color) {
      case "green":
        return { step: 1, value: 5, description: "<5%" };
      case "yellow":
        return { step: 2, value: 7.5, description: "5% - 10%" };
      case "red":
        return { step: 3, value: 10, description: "≥10%" };
    }
  }
}

// Main SCORE2 calculation function
export function calcScore2Unified(input: Score2Input): Score2Result | null {
  const { sex, age, sbp, nonHdl, smoker } = input;

  // Check if age is in supported range
  if (age < 40 || age > 69) {
    return null; // Age not supported
  }

  const ageGroup = getAgeGroup(age);
  const sbpIndex = getSbpIndex(sbp);
  const nonHdlIndex = getNonHdlIndex(nonHdl);

  // Check if any of the values are out of range
  if (ageGroup === null || sbpIndex === null || nonHdlIndex === null) {
    return null; // Invalid input values
  }

  const smokingStatus: SmokingStatus = smoker ? "smoking" : "nonsmoking";

  // Get the original table value
  const table = SCORE2_TABLE_LOW_RISK[sex][smokingStatus][ageGroup];
  const tableValue = table[sbpIndex][nonHdlIndex];

  // Get color from matrix
  const riskColor = getRiskColorCategory(sex, age, sbp, nonHdl, smoker);

  // If color calculation failed, return null
  if (riskColor === null) {
    return null;
  }

  // Calculate risk percentage based on color and age
  const riskPercent = getRiskPercentFromColor(riskColor, age);

  return {
    model: "SCORE2",
    risk10yr: riskPercent,
    color: riskColor,
    tableValue: tableValue,
  };
}
