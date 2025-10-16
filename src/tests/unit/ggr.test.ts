import { expect, test, describe } from "vitest";
import {
  calcGgrCategory,
  type GgrInput,
} from "../../components/measures/calcGGR";

describe("GGR (Glucose-Glycated Hemoglobin Ratio) Calculations", () => {
  describe("calcGgrCategory - Input validation", () => {
    test("throws error for non-positive BMI", () => {
      expect(() =>
        calcGgrCategory({
          bmi: -1,
          gender: "male",
          bmiCategory: "overWeight",
          waist: 100,
        }),
      ).toThrow("BMI must be a positive number.");

      expect(() =>
        calcGgrCategory({
          bmi: 0,
          gender: "female",
          bmiCategory: "overWeight",
          waist: 85,
        }),
      ).toThrow("BMI must be a positive number.");
    });

    test("throws error for invalid gender", () => {
      expect(() =>
        calcGgrCategory({
          bmi: 25,
          gender: "other" as any,
          bmiCategory: "overWeight",
          waist: 90,
        }),
      ).toThrow('sex must be "male" or "female".');

      expect(() =>
        calcGgrCategory({
          bmi: 25,
          gender: "" as any,
          bmiCategory: "overWeight",
          waist: 90,
        }),
      ).toThrow('sex must be "male" or "female".');
    });

    test("handles zero and negative waist measurements gracefully", () => {
      // Function treats undefined/invalid waist as no increased waist risk
      const result1 = calcGgrCategory({
        bmi: 25,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 0, // This will be treated as not increased waist
      });
      expect(result1.GgrCategory).toBe("lightIncreased");

      const result2 = calcGgrCategory({
        bmi: 25,
        gender: "male",
        bmiCategory: "overWeight",
        waist: -5, // This will also be treated as not increased waist
      });
      expect(result2.GgrCategory).toBe("lightIncreased");
    });
  });

  describe("calcGgrCategory - Normal weight scenarios", () => {
    test("returns normal for normal weight males", () => {
      const result = calcGgrCategory({
        bmi: 22,
        gender: "male",
        bmiCategory: "normalWeight",
        waist: 80,
      });
      expect(result.GgrCategory).toBe("normal");
    });

    test("returns normal for normal weight females", () => {
      const result = calcGgrCategory({
        bmi: 21,
        gender: "female",
        bmiCategory: "normalWeight",
        waist: 70,
      });
      expect(result.GgrCategory).toBe("normal");
    });

    test("returns normal regardless of waist size for normal weight", () => {
      // Even with larger waist, normal BMI should return normal
      const result = calcGgrCategory({
        bmi: 23,
        gender: "male",
        bmiCategory: "normalWeight",
        waist: 95, // Higher waist but normal BMI
      });
      expect(result.GgrCategory).toBe("normal");
    });
  });

  describe("calcGgrCategory - Overweight scenarios", () => {
    test("returns lightIncreased for overweight without risk factors", () => {
      const maleResult = calcGgrCategory({
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 95, // Below male threshold (102cm)
      });
      expect(maleResult.GgrCategory).toBe("lightIncreased");

      const femaleResult = calcGgrCategory({
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 80, // Below female threshold (88cm)
      });
      expect(femaleResult.GgrCategory).toBe("lightIncreased");
    });

    test("returns moderateIncreased for overweight with increased waist", () => {
      const maleResult = calcGgrCategory({
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 105, // Above male threshold (102cm)
      });
      expect(maleResult.GgrCategory).toBe("moderateIncreased");

      const femaleResult = calcGgrCategory({
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 90, // Above female threshold (88cm)
      });
      expect(femaleResult.GgrCategory).toBe("moderateIncreased");
    });

    test("returns moderateIncreased for overweight with comorbidity", () => {
      const maleResult = calcGgrCategory({
        bmi: 26,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 95, // Normal waist
        hasComorbidity: true,
      });
      expect(maleResult.GgrCategory).toBe("moderateIncreased");

      const femaleResult = calcGgrCategory({
        bmi: 28,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 82, // Normal waist
        hasComorbidity: true,
      });
      expect(femaleResult.GgrCategory).toBe("moderateIncreased");
    });

    test("returns moderateIncreased for overweight with both waist and comorbidity", () => {
      const result = calcGgrCategory({
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 105, // High waist
        hasComorbidity: true, // And comorbidity
      });
      expect(result.GgrCategory).toBe("moderateIncreased");
    });
  });

  describe("calcGgrCategory - Obese Class 1 scenarios", () => {
    test("returns lightIncreased for obese class 1 without risk factors", () => {
      const maleResult = calcGgrCategory({
        bmi: 32,
        gender: "male",
        bmiCategory: "obeseClass1",
        waist: 100, // Normal waist
      });
      expect(maleResult.GgrCategory).toBe("lightIncreased");

      const femaleResult = calcGgrCategory({
        bmi: 31,
        gender: "female",
        bmiCategory: "obeseClass1",
        waist: 85, // Normal waist
      });
      expect(femaleResult.GgrCategory).toBe("lightIncreased");
    });

    test("returns stronglyIncreased for obese class 1 with increased waist", () => {
      const maleResult = calcGgrCategory({
        bmi: 32,
        gender: "male",
        bmiCategory: "obeseClass1",
        waist: 110, // High waist
      });
      expect(maleResult.GgrCategory).toBe("stronglyIncreased");

      const femaleResult = calcGgrCategory({
        bmi: 33,
        gender: "female",
        bmiCategory: "obeseClass1",
        waist: 95, // High waist
      });
      expect(femaleResult.GgrCategory).toBe("stronglyIncreased");
    });

    test("returns stronglyIncreased for obese class 1 with comorbidity", () => {
      const result = calcGgrCategory({
        bmi: 31,
        gender: "male",
        bmiCategory: "obeseClass1",
        waist: 98, // Normal waist
        hasComorbidity: true,
      });
      expect(result.GgrCategory).toBe("stronglyIncreased");
    });
  });

  describe("calcGgrCategory - Obese Class 2+ scenarios", () => {
    test("returns stronglyIncreased for obese class 2 regardless of other factors", () => {
      const result1 = calcGgrCategory({
        bmi: 37,
        gender: "male",
        bmiCategory: "obeseClass2",
        waist: 95, // Low waist
      });
      expect(result1.GgrCategory).toBe("stronglyIncreased");

      const result2 = calcGgrCategory({
        bmi: 36,
        gender: "female",
        bmiCategory: "obeseClass2",
        waist: 80, // Low waist, no comorbidity
        hasComorbidity: false,
      });
      expect(result2.GgrCategory).toBe("stronglyIncreased");
    });

    test("returns extremeIncreased for obese class 3", () => {
      const result = calcGgrCategory({
        bmi: 42.0, // Class 3 obesity
        gender: "female",
        bmiCategory: "obeseClass3",
        waist: 120,
      });
      expect(result.GgrCategory).toBe("extremeIncreased");
    });
  });

  describe("calcGgrCategory - Underweight scenarios", () => {
    test("returns normal for underweight individuals", () => {
      const result = calcGgrCategory({
        bmi: 17.5,
        gender: "female",
        bmiCategory: "underWeight",
        waist: 65,
      });
      expect(result.GgrCategory).toBe("normal");
    });
  });

  describe("calcGgrCategory - Boundary cases", () => {
    test("handles exact threshold values correctly", () => {
      // Male waist threshold is 102cm
      const maleAtThreshold = calcGgrCategory({
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 102,
      });

      const maleBelowThreshold = calcGgrCategory({
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 101,
      });

      // Female waist threshold is 88cm
      const femaleAtThreshold = calcGgrCategory({
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 88,
      });

      // At or above threshold should increase risk
      expect(maleAtThreshold.GgrCategory).toBe("moderateIncreased");
      expect(maleBelowThreshold.GgrCategory).toBe("lightIncreased");
      expect(femaleAtThreshold.GgrCategory).toBe("moderateIncreased");
    });

    test("handles decimal BMI values correctly", () => {
      const result = calcGgrCategory({
        bmi: 29.9, // Just below obese class 1
        gender: "male",
        bmiCategory: "overWeight",
        waist: 100,
      });
      expect(result.GgrCategory).toBe("lightIncreased");
    });
  });

  describe("calcGgrCategory - Integration scenarios", () => {
    test("handles realistic patient profiles", () => {
      // Typical overweight male with metabolic syndrome
      const metabolicSyndrome = calcGgrCategory({
        bmi: 28.5,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 108, // Central obesity
        hasComorbidity: true, // Diabetes/hypertension
      });
      expect(metabolicSyndrome.GgrCategory).toBe("moderateIncreased");

      // Healthy weight active female
      const healthyFemale = calcGgrCategory({
        bmi: 22.0,
        gender: "female",
        bmiCategory: "normalWeight",
        waist: 68,
        hasComorbidity: false,
      });
      expect(healthyFemale.GgrCategory).toBe("normal");

      // Severely obese patient
      const severeObesity = calcGgrCategory({
        bmi: 45.0,
        gender: "female",
        bmiCategory: "obeseClass3",
        waist: 130,
        hasComorbidity: true,
      });
      expect(severeObesity.GgrCategory).toBe("extremeIncreased");
    });
  });
});
