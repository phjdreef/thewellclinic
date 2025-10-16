import { describe, expect, test } from "vitest";
import {
  calcDiabetesRisk,
  DiabetesInput,
} from "@/components/measures/calcDiabetesRisk";
import { DiabetesConfig } from "@/components/measures/calcDiabetes";

describe("Diabetes Risk Calculations", () => {
  describe("calcDiabetesRisk - Basic functionality", () => {
    test("calculates zero risk for minimal risk profile", () => {
      const input: DiabetesInput = {
        sex: "male",
        age: 30,
        waistCm: 85,
        heightCm: 180,
        pulse: 60,
        glucoseMmol: 4.5,
        trigMmol: 1.0,
        hdlMmol: 1.5,
        uricUmol: 300,
        diabeticMother: false,
        diabeticFather: false,
        hypertension: false,
        blackRace: false,
        neverOrFormerDrinker: false,
      };

      const result = calcDiabetesRisk(input);
      expect(result.totalPoints).toBe(0);
      expect(result.risk).toBe(0.035); // Lowest risk band
      expect(result.riskBand).toBe("0–17");
      expect(Object.keys(result.detail)).toHaveLength(0);
      expect(result.percentOfMax).toBe(0);
    });

    test("calculates high risk for multiple risk factors", () => {
      const input: DiabetesInput = {
        sex: "female",
        age: 60,
        waistCm: 110, // High waist circumference
        heightCm: 155, // Below threshold
        pulse: 75, // High for female
        glucoseMmol: 6.0, // High glucose
        trigMmol: 2.0, // High triglycerides
        hdlMmol: 1.0, // Low HDL
        uricUmol: 350, // High uric acid
        diabeticMother: true,
        diabeticFather: true,
        hypertension: true,
        blackRace: true,
        neverOrFormerDrinker: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.totalPoints).toBeGreaterThan(40);
      expect(result.risk).toBe(0.461); // Highest risk band
      expect(result.riskBand).toBe("≥38");
      expect(Object.keys(result.detail).length).toBeGreaterThan(5);
      expect(result.percentOfMax).toBeGreaterThan(40);
    });

    test("handles undefined values gracefully", () => {
      const input: DiabetesInput = {
        sex: "male",
        // All optional values undefined
      };

      const result = calcDiabetesRisk(input);
      expect(result.totalPoints).toBe(0);
      expect(result.risk).toBe(0.035);
      expect(Object.keys(result.detail)).toHaveLength(0);
    });
  });

  describe("calcDiabetesRisk - Age factor", () => {
    test("adds points for age 55-64", () => {
      const baseInput: DiabetesInput = {
        sex: "male",
        age: 50, // Not in risk range
      };

      const riskAgeInput: DiabetesInput = {
        sex: "male",
        age: 60, // In risk range
      };

      const baseResult = calcDiabetesRisk(baseInput);
      const riskAgeResult = calcDiabetesRisk(riskAgeInput);

      expect(riskAgeResult.totalPoints).toBe(
        baseResult.totalPoints + DiabetesConfig.base.age55to64,
      );
      expect(riskAgeResult.detail["Age 55–64 y"]).toBe(
        DiabetesConfig.base.age55to64,
      );
    });

    test("no points for age outside 55-64 range", () => {
      const youngInput: DiabetesInput = { sex: "male", age: 54 };
      const oldInput: DiabetesInput = { sex: "male", age: 65 };

      const youngResult = calcDiabetesRisk(youngInput);
      const oldResult = calcDiabetesRisk(oldInput);

      expect(youngResult.detail["Age 55–64 y"]).toBeUndefined();
      expect(oldResult.detail["Age 55–64 y"]).toBeUndefined();
    });
  });

  describe("calcDiabetesRisk - Family history", () => {
    test("adds points for diabetic mother", () => {
      const input: DiabetesInput = {
        sex: "female",
        diabeticMother: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.detail["Diabetic mother"]).toBe(
        DiabetesConfig.base.diabeticMother,
      );
      expect(result.totalPoints).toBeGreaterThanOrEqual(
        DiabetesConfig.base.diabeticMother,
      );
    });

    test("adds points for diabetic father", () => {
      const input: DiabetesInput = {
        sex: "male",
        diabeticFather: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.detail["Diabetic father"]).toBe(
        DiabetesConfig.base.diabeticFather,
      );
      expect(result.totalPoints).toBeGreaterThanOrEqual(
        DiabetesConfig.base.diabeticFather,
      );
    });

    test("adds points for both parents", () => {
      const input: DiabetesInput = {
        sex: "female",
        diabeticMother: true,
        diabeticFather: true,
      };

      const result = calcDiabetesRisk(input);
      const expectedPoints =
        DiabetesConfig.base.diabeticMother + DiabetesConfig.base.diabeticFather;
      expect(result.totalPoints).toBeGreaterThanOrEqual(expectedPoints);
      expect(result.detail["Diabetic mother"]).toBe(
        DiabetesConfig.base.diabeticMother,
      );
      expect(result.detail["Diabetic father"]).toBe(
        DiabetesConfig.base.diabeticFather,
      );
    });
  });

  describe("calcDiabetesRisk - Medical conditions", () => {
    test("adds points for hypertension", () => {
      const input: DiabetesInput = {
        sex: "male",
        hypertension: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.detail["Hypertension"]).toBe(
        DiabetesConfig.base.hypertension,
      );
    });

    test("adds points for black race", () => {
      const input: DiabetesInput = {
        sex: "female",
        blackRace: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.detail["Black race"]).toBe(DiabetesConfig.base.blackRace);
    });

    test("adds points for never/former drinker", () => {
      const input: DiabetesInput = {
        sex: "male",
        neverOrFormerDrinker: true,
      };

      const result = calcDiabetesRisk(input);
      expect(result.detail["Never/former drinker"]).toBe(
        DiabetesConfig.base.neverOrFormerDrinker,
      );
    });
  });

  describe("calcDiabetesRisk - Physical measurements", () => {
    test("adds points for increased waist circumference - male", () => {
      const lowWaist: DiabetesInput = { sex: "male", waistCm: 89 };
      const highWaist: DiabetesInput = { sex: "male", waistCm: 110 };

      const lowResult = calcDiabetesRisk(lowWaist);
      const highResult = calcDiabetesRisk(highWaist);

      expect(lowResult.detail["Waist circumference"]).toBeUndefined();
      expect(highResult.detail["Waist circumference"]).toBeGreaterThan(0);
      expect(highResult.totalPoints).toBeGreaterThan(lowResult.totalPoints);
    });

    test("adds points for increased waist circumference - female", () => {
      const lowWaist: DiabetesInput = { sex: "female", waistCm: 80 };
      const highWaist: DiabetesInput = { sex: "female", waistCm: 100 };

      const lowResult = calcDiabetesRisk(lowWaist);
      const highResult = calcDiabetesRisk(highWaist);

      expect(lowResult.detail["Waist circumference"]).toBeUndefined();
      expect(highResult.detail["Waist circumference"]).toBeGreaterThan(0);
    });

    test("adds points for short height", () => {
      const tallMale: DiabetesInput = { sex: "male", heightCm: 180 };
      const shortMale: DiabetesInput = { sex: "male", heightCm: 170 };

      const tallResult = calcDiabetesRisk(tallMale);
      const shortResult = calcDiabetesRisk(shortMale);

      expect(tallResult.detail["Height (<threshold)"]).toBeUndefined();
      expect(shortResult.detail["Height (<threshold)"]).toBe(
        DiabetesConfig.heightShort.pts,
      );
    });

    test("adds points for high resting pulse", () => {
      const lowPulse: DiabetesInput = { sex: "male", pulse: 60 };
      const highPulse: DiabetesInput = { sex: "male", pulse: 75 };

      const lowResult = calcDiabetesRisk(lowPulse);
      const highResult = calcDiabetesRisk(highPulse);

      expect(lowResult.detail["Resting pulse (high)"]).toBeUndefined();
      expect(highResult.detail["Resting pulse (high)"]).toBe(
        DiabetesConfig.pulseHigh.pts,
      );
    });
  });

  describe("calcDiabetesRisk - Laboratory values", () => {
    test("adds points for elevated glucose", () => {
      const normalGlucose: DiabetesInput = { sex: "male", glucoseMmol: 4.5 };
      const highGlucose: DiabetesInput = { sex: "male", glucoseMmol: 6.0 };

      const normalResult = calcDiabetesRisk(normalGlucose);
      const highResult = calcDiabetesRisk(highGlucose);

      expect(normalResult.detail["Glucose"]).toBeUndefined();
      expect(highResult.detail["Glucose"]).toBeGreaterThan(0);
    });

    test("adds points for elevated triglycerides", () => {
      const normalTrig: DiabetesInput = { sex: "male", trigMmol: 1.0 };
      const highTrig: DiabetesInput = { sex: "male", trigMmol: 2.5 };

      const normalResult = calcDiabetesRisk(normalTrig);
      const highResult = calcDiabetesRisk(highTrig);

      expect(normalResult.detail["Triglycerides"]).toBeUndefined();
      expect(highResult.detail["Triglycerides"]).toBeGreaterThan(0);
    });

    test("adds points for low HDL cholesterol", () => {
      const normalHDL: DiabetesInput = { sex: "male", hdlMmol: 1.2 };
      const lowHDL: DiabetesInput = { sex: "male", hdlMmol: 0.9 };

      const normalResult = calcDiabetesRisk(normalHDL);
      const lowResult = calcDiabetesRisk(lowHDL);

      expect(normalResult.detail["HDL (low)"]).toBeUndefined();
      expect(lowResult.detail["HDL (low)"]).toBe(DiabetesConfig.hdlLow.pts);
    });

    test("adds points for high uric acid", () => {
      const normalUric: DiabetesInput = { sex: "male", uricUmol: 350 };
      const highUric: DiabetesInput = { sex: "male", uricUmol: 450 };

      const normalResult = calcDiabetesRisk(normalUric);
      const highResult = calcDiabetesRisk(highUric);

      expect(normalResult.detail["Uric acid (high)"]).toBeUndefined();
      expect(highResult.detail["Uric acid (high)"]).toBe(
        DiabetesConfig.uricAcidHigh.pts,
      );
    });
  });

  describe("calcDiabetesRisk - Gender differences", () => {
    test("uses different thresholds for waist circumference", () => {
      const maleInput: DiabetesInput = { sex: "male", waistCm: 92 }; // In 90-95 range (5 pts)
      const femaleInput: DiabetesInput = { sex: "female", waistCm: 92 }; // In 88-96 range (11 pts)

      const maleResult = calcDiabetesRisk(maleInput);
      const femaleResult = calcDiabetesRisk(femaleInput);

      // Same waist measurement should result in different points due to different thresholds
      const maleWaistPoints = maleResult.detail["Waist circumference"] || 0;
      const femaleWaistPoints = femaleResult.detail["Waist circumference"] || 0;

      expect(maleWaistPoints).toBe(5); // Male threshold: 90-95 = 5 pts
      expect(femaleWaistPoints).toBe(11); // Female threshold: 88-96 = 11 pts
      expect(maleWaistPoints).not.toBe(femaleWaistPoints);
    });

    test("uses different thresholds for height", () => {
      const shortHeight = 165; // Below threshold for both, but different impact
      const maleInput: DiabetesInput = { sex: "male", heightCm: shortHeight };
      const femaleInput: DiabetesInput = {
        sex: "female",
        heightCm: shortHeight,
      };

      const maleResult = calcDiabetesRisk(maleInput);
      const femaleResult = calcDiabetesRisk(femaleInput);

      // Both should get points, but based on different thresholds
      expect(maleResult.detail["Height (<threshold)"]).toBe(
        DiabetesConfig.heightShort.pts,
      );
      expect(femaleResult.detail["Height (<threshold)"]).toBeUndefined(); // 165 > 161 (female threshold)
    });
  });

  describe("calcDiabetesRisk - Risk bands", () => {
    test("assigns correct risk bands", () => {
      const lowRiskInput: DiabetesInput = { sex: "male" }; // Minimal risk
      const mediumRiskInput: DiabetesInput = {
        sex: "male",
        diabeticMother: true,
        diabeticFather: true,
        hypertension: true,
        age: 60,
      }; // ~20 points

      const lowResult = calcDiabetesRisk(lowRiskInput);
      const mediumResult = calcDiabetesRisk(mediumRiskInput);

      expect(lowResult.riskBand).toBe("0–17");
      expect(lowResult.risk).toBe(0.035);

      expect(mediumResult.riskBand).toBe("18–27");
      expect(mediumResult.risk).toBe(0.064);
    });

    test("calculates percentage of maximum correctly", () => {
      const input: DiabetesInput = {
        sex: "male",
        diabeticMother: true, // 8 points
      };

      const result = calcDiabetesRisk(input);
      const expectedPercentage = Math.round(
        (8 / DiabetesConfig.maxTotal) * 100,
      );
      expect(result.percentOfMax).toBe(expectedPercentage);
    });
  });

  describe("calcDiabetesRisk - Integration scenarios", () => {
    test("handles realistic patient profiles", () => {
      // Scenario 1: Low-risk young person
      const youngHealthy = calcDiabetesRisk({
        sex: "female",
        age: 25,
        waistCm: 75,
        heightCm: 165,
        pulse: 65,
        glucoseMmol: 4.8,
        trigMmol: 1.1,
        hdlMmol: 1.4,
        uricUmol: 250,
      });

      expect(youngHealthy.totalPoints).toBeLessThan(10);
      expect(youngHealthy.risk).toBe(0.035);

      // Scenario 2: High-risk elderly person with multiple conditions
      const elderlyAtRisk = calcDiabetesRisk({
        sex: "male",
        age: 62,
        waistCm: 108,
        heightCm: 170,
        pulse: 70,
        glucoseMmol: 5.8,
        trigMmol: 2.1,
        hdlMmol: 0.95,
        uricUmol: 420,
        diabeticMother: true,
        hypertension: true,
        blackRace: true,
      });

      expect(elderlyAtRisk.totalPoints).toBeGreaterThan(35);
      expect(elderlyAtRisk.risk).toBeGreaterThanOrEqual(0.115);
      expect(Object.keys(elderlyAtRisk.detail)).toContain("Age 55–64 y");
      expect(Object.keys(elderlyAtRisk.detail)).toContain(
        "Waist circumference",
      );
    });
  });

  describe("calcDiabetesRisk - Edge cases", () => {
    test("handles boundary values correctly", () => {
      const boundaryInput: DiabetesInput = {
        sex: "male",
        age: 55, // Exactly at boundary
        waistCm: 102, // Exactly at male threshold
        heightCm: 175, // Exactly at male threshold
        pulse: 68, // Exactly at male threshold
        glucoseMmol: 5.29, // Exactly at glucose boundary
      };

      const result = calcDiabetesRisk(boundaryInput);
      expect(result.detail["Age 55–64 y"]).toBe(DiabetesConfig.base.age55to64);
      expect(result.detail["Waist circumference"]).toBeGreaterThan(0);
      expect(result.detail["Height (<threshold)"]).toBeUndefined(); // Not below threshold
      expect(result.detail["Resting pulse (high)"]).toBe(
        DiabetesConfig.pulseHigh.pts,
      );
      expect(result.detail["Glucose"]).toBeGreaterThan(0);
    });

    test("handles invalid/negative values gracefully", () => {
      const invalidInput: DiabetesInput = {
        sex: "female",
        waistCm: -10,
        heightCm: -5,
        pulse: -20,
        glucoseMmol: -1,
        trigMmol: -0.5,
        hdlMmol: -2,
        uricUmol: -100,
        // Explicitly set boolean values to false to avoid undefined behavior
        diabeticMother: false,
        diabeticFather: false,
        hypertension: false,
        blackRace: false,
        neverOrFormerDrinker: false,
      };

      const result = calcDiabetesRisk(invalidInput);
      // Should not crash and should treat invalid values as undefined
      expect(result.totalPoints).toBe(0);
      expect(Object.keys(result.detail)).toHaveLength(0);
    });
  });
});
