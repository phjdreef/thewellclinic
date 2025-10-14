export const DiabetesConfig = {
  base: {
    diabeticMother: 8,
    diabeticFather: 6,
    hypertension: 3,
    blackRace: 7,
    age55to64: 3,
    neverOrFormerDrinker: 2,
  },
  waist: {
    male: [
      { min: 90, max: 95, pts: 5 },
      { min: 95, max: 100, pts: 11 },
      { min: 100, max: 106, pts: 14 },
      { min: 106, max: Infinity, pts: 21 },
    ],
    female: [
      { min: 81, max: 88, pts: 5 },
      { min: 88, max: 96, pts: 11 },
      { min: 96, max: 105, pts: 14 },
      { min: 105, max: Infinity, pts: 21 },
    ],
  },
  heightShort: { male: 175, female: 161, pts: 4 },
  pulseHigh: { male: 68, female: 70, pts: 2 },
  glucose: [
    // mmol/L ranges
    { min: 5.29, max: 5.55, pts: 6 }, // 95–<100 mg/dL
    { min: 5.55, max: 5.88, pts: 13 }, // 100–<106 mg/dL
    { min: 5.88, max: Infinity, pts: 28 }, // ≥106 mg/dL
  ],
  triglycerides: {
    male: [
      { min: 1.47, max: 2.02, pts: 4 }, // 130–<179 mg/dL
      { min: 2.02, max: Infinity, pts: 7 }, // ≥179 mg/dL
    ],
    female: [
      { min: 1.26, max: 1.7, pts: 4 }, // 112–<151 mg/dL
      { min: 1.7, max: Infinity, pts: 7 }, // ≥151 mg/dL
    ],
  },
  hdlLow: { male: 1.04, female: 1.27, pts: 5 }, // <40 mg/dL (men); <53 mg/dL (women)
  uricAcidHigh: { male: 404, female: 281, pts: 3 }, // ~6.8 mg/dL (men), ~4.6 mg/dL (women)
  maxTotal: 99,
  riskBands: [
    { min: 0, max: 18, label: "0–17", risk: 0.035 },
    { min: 18, max: 28, label: "18–27", risk: 0.064 },
    { min: 28, max: 38, label: "28–37", risk: 0.115 },
    { min: 38, max: Infinity, label: "≥38", risk: 0.461 },
  ],
};
