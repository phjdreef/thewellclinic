import { Gender } from "@/hooks/useStore";
import { DiabetesConfig } from "./calcDiabetes";

// Types for diabetes risk calculation
export interface DiabetesInput {
  sex: Gender;
  age?: number;
  waistCm?: number;
  heightCm?: number;
  pulse?: number;
  glucoseMmol?: number;
  trigMmol?: number;
  hdlMmol?: number;
  uricUmol?: number;
  diabeticMother?: boolean;
  diabeticFather?: boolean;
  hypertension?: boolean;
  blackRace?: boolean;
  neverOrFormerDrinker?: boolean;
}

export interface DiabetesResult {
  totalPoints: number;
  risk: number; // Probability as decimal (0-1)
  riskBand: string; // e.g., "0–17", "18–27"
  detail: Record<string, number>; // Contributing factors and their points
  percentOfMax: number; // Score as percentage of maximum possible
}

// Helper function to safely convert and clamp numbers
const clampNumber = (n: number | undefined): number | undefined =>
  Number.isFinite(n as number) && (n as number) >= 0
    ? (n as number)
    : undefined;

// Helper function to get points for value within ranges
function pointsForRange(
  value: number | undefined,
  ranges: { min: number; max: number; pts: number }[],
): number {
  if (value === undefined) return 0;
  for (const r of ranges) {
    if (value >= r.min && value < r.max) return r.pts;
  }
  return 0;
}

/**
 * Calculate diabetes risk based on various health factors
 * Uses validated scoring system for type 2 diabetes risk assessment
 */
export function calcDiabetesRisk(input: DiabetesInput): DiabetesResult {
  let totalPoints = 0;
  const detail: Record<string, number> = {};

  // Determine if age is in 55-64 range
  const age55to64 = input.age ? input.age >= 55 && input.age < 65 : false;

  // Base yes/no factors
  const { base } = DiabetesConfig;

  if (input.diabeticMother) {
    totalPoints += base.diabeticMother;
    detail["Diabetic mother"] = base.diabeticMother;
  }

  if (input.diabeticFather) {
    totalPoints += base.diabeticFather;
    detail["Diabetic father"] = base.diabeticFather;
  }

  if (input.hypertension) {
    totalPoints += base.hypertension;
    detail["Hypertension"] = base.hypertension;
  }

  if (input.blackRace) {
    totalPoints += base.blackRace;
    detail["Black race"] = base.blackRace;
  }

  if (age55to64) {
    totalPoints += base.age55to64;
    detail["Age 55–64 y"] = base.age55to64;
  }

  if (input.neverOrFormerDrinker) {
    totalPoints += base.neverOrFormerDrinker;
    detail["Never/former drinker"] = base.neverOrFormerDrinker;
  }

  // Waist circumference (sex specific)
  const waist = clampNumber(input.waistCm);
  const waistPts = pointsForRange(waist, DiabetesConfig.waist[input.sex]);
  if (waistPts > 0) {
    totalPoints += waistPts;
    detail["Waist circumference"] = waistPts;
  }

  // Height (shortness) — points if below threshold
  const height = clampNumber(input.heightCm);
  if (height !== undefined) {
    const shortThreshold = DiabetesConfig.heightShort[input.sex];
    if (height < shortThreshold) {
      totalPoints += DiabetesConfig.heightShort.pts;
      detail["Height (<threshold)"] = DiabetesConfig.heightShort.pts;
    }
  }

  // Resting pulse — points if >= threshold
  const pulse = clampNumber(input.pulse);
  if (pulse !== undefined) {
    const pulseThr = DiabetesConfig.pulseHigh[input.sex];
    if (pulse >= pulseThr) {
      totalPoints += DiabetesConfig.pulseHigh.pts;
      detail["Resting pulse (high)"] = DiabetesConfig.pulseHigh.pts;
    }
  }

  // Fasting glucose
  const glucose = clampNumber(input.glucoseMmol);
  const glucosePts = pointsForRange(glucose, DiabetesConfig.glucose);
  if (glucosePts > 0) {
    totalPoints += glucosePts;
    detail["Glucose"] = glucosePts;
  }

  // Triglycerides (sex specific)
  const triglycerides = clampNumber(input.trigMmol);
  const trigPts = pointsForRange(
    triglycerides,
    DiabetesConfig.triglycerides[input.sex],
  );
  if (trigPts > 0) {
    totalPoints += trigPts;
    detail["Triglycerides"] = trigPts;
  }

  // HDL — low threshold
  const hdl = clampNumber(input.hdlMmol);
  if (hdl !== undefined) {
    const hdlThr = DiabetesConfig.hdlLow[input.sex];
    if (hdl < hdlThr) {
      totalPoints += DiabetesConfig.hdlLow.pts;
      detail["HDL (low)"] = DiabetesConfig.hdlLow.pts;
    }
  }

  // Uric acid — high threshold
  const uricAcid = clampNumber(input.uricUmol);
  if (uricAcid !== undefined) {
    const uaThr = DiabetesConfig.uricAcidHigh[input.sex];
    if (uricAcid >= uaThr) {
      totalPoints += DiabetesConfig.uricAcidHigh.pts;
      detail["Uric acid (high)"] = DiabetesConfig.uricAcidHigh.pts;
    }
  }

  // Find risk band and calculate risk probability
  const band =
    DiabetesConfig.riskBands.find(
      (b) => totalPoints >= b.min && totalPoints < b.max,
    ) ?? DiabetesConfig.riskBands[DiabetesConfig.riskBands.length - 1];

  const risk = band.risk;
  const riskBand = band.label;
  const percentOfMax = Math.min(
    100,
    Math.round((totalPoints / DiabetesConfig.maxTotal) * 100),
  );

  return {
    totalPoints,
    risk,
    riskBand,
    detail,
    percentOfMax,
  };
}
