// =============================================================================
// SCORE2 Tables and Matrix Data (ESC 2021)
// Contains risk values and color matrices for SCORE2 calculations
// =============================================================================

// Table-based risk values for SCORE2 (Low CVD risk region)
// Age bands: 40-44, 45-49, 50-54, 55-59, 60-64, 65-69
// SBP bands: 100-119, 120-139, 140-159, 160-179
// Non-HDL bands: 2.0-3.9, 4.0-5.9, 6.0-7.9, 8.0+ mmol/L

export const SCORE2_TABLE_LOW_RISK = {
  male: {
    nonsmoking: {
      "40-44": [
        [1, 2, 2, 2], // SBP 100-119
        [2, 2, 3, 3], // SBP 120-139
        [2, 3, 3, 4], // SBP 140-159
        [3, 4, 5, 5], // SBP 160-179
      ],
      "45-49": [
        [2, 2, 3, 3],
        [2, 3, 3, 4],
        [3, 4, 4, 5],
        [5, 5, 6, 6],
      ],
      "50-54": [
        [3, 3, 3, 4],
        [3, 4, 4, 5],
        [4, 5, 5, 6],
        [5, 6, 7, 8],
      ],
      "55-59": [
        [4, 4, 4, 5],
        [4, 5, 5, 6],
        [5, 6, 7, 8],
        [7, 7, 8, 9],
      ],
      "60-64": [
        [5, 5, 6, 6],
        [6, 6, 7, 8],
        [7, 8, 8, 9],
        [8, 9, 10, 11],
      ],
      "65-69": [
        [6, 7, 7, 8],
        [8, 8, 9, 10],
        [9, 10, 11, 11],
        [11, 12, 12, 13],
      ],
    },
    smoking: {
      "40-44": [
        [3, 3, 4, 5],
        [3, 4, 5, 6],
        [5, 5, 6, 8],
        [6, 7, 8, 10],
      ],
      "45-49": [
        [3, 4, 5, 5],
        [4, 5, 6, 7],
        [6, 7, 8, 9],
        [7, 8, 10, 11],
      ],
      "50-54": [
        [4, 5, 6, 7],
        [6, 6, 7, 8],
        [7, 8, 9, 10],
        [9, 10, 11, 13],
      ],
      "55-59": [
        [6, 6, 7, 8],
        [7, 8, 9, 10],
        [9, 10, 11, 12],
        [10, 12, 13, 15],
      ],
      "60-64": [
        [7, 8, 9, 10],
        [9, 10, 10, 11],
        [10, 11, 13, 14],
        [13, 14, 15, 17],
      ],
      "65-69": [
        [9, 10, 11, 11],
        [11, 12, 13, 13],
        [13, 14, 15, 16],
        [15, 16, 17, 19],
      ],
    },
  },
  female: {
    nonsmoking: {
      "40-44": [
        [1, 1, 1, 1],
        [1, 2, 1, 1],
        [2, 2, 2, 2],
        [2, 2, 2, 3],
      ],
      "45-49": [
        [1, 1, 1, 1],
        [1, 2, 2, 2],
        [2, 2, 2, 3],
        [2, 3, 3, 3],
      ],
      "50-54": [
        [2, 2, 2, 2],
        [2, 2, 2, 3],
        [3, 3, 3, 3],
        [3, 4, 4, 4],
      ],
      "55-59": [
        [2, 2, 3, 3],
        [3, 3, 3, 3],
        [3, 4, 4, 4],
        [4, 5, 5, 5],
      ],
      "60-64": [
        [3, 3, 4, 4],
        [4, 4, 4, 5],
        [5, 5, 5, 6],
        [6, 6, 7, 7],
      ],
      "65-69": [
        [5, 5, 5, 5],
        [5, 6, 6, 6],
        [7, 7, 7, 7],
        [8, 8, 9, 9],
      ],
    },
    smoking: {
      "40-44": [
        [2, 2, 2, 2],
        [2, 3, 3, 3],
        [3, 3, 4, 4],
        [4, 4, 5, 6],
      ],
      "45-49": [
        [2, 2, 3, 3],
        [3, 3, 4, 4],
        [4, 4, 5, 5],
        [5, 5, 6, 7],
      ],
      "50-54": [
        [3, 3, 4, 4],
        [4, 4, 5, 5],
        [5, 5, 6, 6],
        [6, 7, 7, 8],
      ],
      "55-59": [
        [4, 4, 5, 5],
        [5, 5, 6, 6],
        [6, 7, 7, 8],
        [8, 8, 9, 10],
      ],
      "60-64": [
        [5, 6, 6, 6],
        [6, 7, 7, 8],
        [8, 8, 9, 9],
        [10, 10, 11, 11],
      ],
      "65-69": [
        [7, 7, 7, 8],
        [8, 9, 9, 9],
        [10, 10, 11, 11],
        [12, 12, 13, 13],
      ],
    },
  },
} as const;

// Color matrix for SCORE2 risk categories based on the risk values
// Colors: "green" (low risk), "yellow" (moderate risk), "red" (high risk)
export const SCORE2_COLOR_MATRIX = {
  male: {
    nonsmoking: {
      "40-44": [
        ["green", "green", "green", "green"], // SBP 100-119
        ["green", "green", "yellow", "yellow"], // SBP 120-139
        ["green", "yellow", "yellow", "yellow"], // SBP 140-159
        ["yellow", "yellow", "yellow", "yellow"], // SBP 160-179
      ],
      "45-49": [
        ["green", "green", "yellow", "yellow"],
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "50-54": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "yellow"],
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "55-59": [
        ["green", "green", "green", "yellow"],
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "60-64": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "red", "red"],
      ],
      "65-69": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "red"],
        ["yellow", "red", "red", "red"],
        ["red", "red", "red", "red"],
      ],
    },
    smoking: {
      "40-44": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "red"],
        ["yellow", "yellow", "red", "red"],
      ],
      "45-49": [
        ["green", "green", "yellow", "yellow"],
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "red", "red"],
        ["yellow", "red", "red", "red"],
      ],
      "50-54": [
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "red"],
        ["yellow", "red", "red", "red"],
      ],
      "55-59": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "red"],
        ["yellow", "red", "red", "red"],
        ["red", "red", "red", "red"],
      ],
      "60-64": [
        ["yellow", "yellow", "yellow", "red"],
        ["yellow", "red", "red", "red"],
        ["red", "red", "red", "red"],
        ["red", "red", "red", "red"],
      ],
      "65-69": [
        ["yellow", "red", "red", "red"],
        ["red", "red", "red", "red"],
        ["red", "red", "red", "red"],
        ["red", "red", "red", "red"],
      ],
    },
  },
  female: {
    nonsmoking: {
      "40-44": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "yellow"],
      ],
      "45-49": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "yellow"],
        ["green", "yellow", "yellow", "yellow"],
      ],
      "50-54": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
      ],
      "55-59": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "green", "green", "green"],
        ["green", "yellow", "yellow", "yellow"],
      ],
      "60-64": [
        ["green", "green", "green", "green"],
        ["green", "green", "green", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "65-69": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
    },
    smoking: {
      "40-44": [
        ["green", "green", "green", "green"],
        ["green", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "45-49": [
        ["green", "green", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "50-54": [
        ["green", "green", "green", "green"],
        ["green", "green", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
      ],
      "55-59": [
        ["green", "green", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "red"],
      ],
      "60-64": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["red", "red", "red", "red"],
      ],
      "65-69": [
        ["yellow", "yellow", "yellow", "yellow"],
        ["yellow", "yellow", "yellow", "yellow"],
        ["red", "red", "red", "red"],
        ["red", "red", "red", "red"],
      ],
    },
  },
} as const;

// Type definitions for table access
export type AgeGroup = keyof typeof SCORE2_TABLE_LOW_RISK.male.nonsmoking;
export type SmokingStatus = "smoking" | "nonsmoking";
export type Gender = "male" | "female";
export type RiskColor = "green" | "yellow" | "red";
