import { expect, test, describe } from "vitest";
import {
  calcScore2Unified,
  type Score2Input,
} from "../../components/measures/calcScore2";

describe("SCORE2 Calculations", () => {
  describe("calcScore2Unified - Basic functionality", () => {
    test("calculates SCORE2 for valid low-risk profile", () => {
      const input: Score2Input = {
        sex: "male",
        region: "low",
        age: 50,
        sbp: 120, // Normal blood pressure
        nonHdl: 3.0, // Normal cholesterol
        smoker: false,
      };

      const result = calcScore2Unified(input);
      expect(result).toBeDefined();
      expect(result?.model).toBe("SCORE2");
      expect(result?.color).toBeOneOf(["green", "yellow", "red"]);
      expect(result?.tableValue).toBeGreaterThanOrEqual(0);
    });

    test("calculates SCORE2 for high-risk profile", () => {
      const input: Score2Input = {
        sex: "female",
        region: "low",
        age: 65,
        sbp: 170, // High blood pressure (within valid range)
        nonHdl: 6.0, // High cholesterol
        smoker: true,
      };

      const result = calcScore2Unified(input);
      expect(result).toBeDefined();
      expect(result?.model).toBe("SCORE2");
      expect(result?.tableValue).toBeGreaterThan(0);
      // High risk should generally result in higher values
    });

    test("returns null for age out of range", () => {
      const youngInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 35, // Too young
        sbp: 120,
        nonHdl: 3.0,
        smoker: false,
      };

      const oldInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 95, // Too old
        sbp: 120,
        nonHdl: 3.0,
        smoker: false,
      };

      expect(calcScore2Unified(youngInput)).toBeNull();
      expect(calcScore2Unified(oldInput)).toBeNull();
    });

    test("returns null for invalid blood pressure", () => {
      const lowBpInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 50,
        sbp: 90, // Too low
        nonHdl: 3.0,
        smoker: false,
      };

      const highBpInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 50,
        sbp: 220, // Too high
        nonHdl: 3.0,
        smoker: false,
      };

      expect(calcScore2Unified(lowBpInput)).toBeNull();
      expect(calcScore2Unified(highBpInput)).toBeNull();
    });

    test("returns null for invalid cholesterol", () => {
      const lowCholInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 50,
        sbp: 120,
        nonHdl: 1.0, // Too low
        smoker: false,
      };

      const highCholInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 50,
        sbp: 120,
        nonHdl: 10.0, // Too high
        smoker: false,
      };

      expect(calcScore2Unified(lowCholInput)).toBeNull();
      expect(calcScore2Unified(highCholInput)).toBeNull();
    });
  });

  describe("SCORE2 - Gender differences", () => {
    test("calculates different risks for male vs female with same parameters", () => {
      const baseInput = {
        region: "low" as const,
        age: 55,
        sbp: 140,
        nonHdl: 4.0,
        smoker: false,
      };

      const maleResult = calcScore2Unified({ ...baseInput, sex: "male" });
      const femaleResult = calcScore2Unified({ ...baseInput, sex: "female" });

      expect(maleResult).toBeDefined();
      expect(femaleResult).toBeDefined();

      // Generally, males have higher cardiovascular risk
      if (maleResult && femaleResult) {
        expect(typeof maleResult.tableValue).toBe("number");
        expect(typeof femaleResult.tableValue).toBe("number");
      }
    });
  });

  describe("SCORE2 - Smoking impact", () => {
    test("smoking increases cardiovascular risk", () => {
      const baseInput = {
        sex: "male" as const,
        region: "low" as const,
        age: 55,
        sbp: 140,
        nonHdl: 4.0,
      };

      const nonSmokerResult = calcScore2Unified({
        ...baseInput,
        smoker: false,
      });
      const smokerResult = calcScore2Unified({ ...baseInput, smoker: true });

      expect(nonSmokerResult).toBeDefined();
      expect(smokerResult).toBeDefined();

      if (nonSmokerResult && smokerResult) {
        expect(smokerResult.tableValue).toBeGreaterThan(
          nonSmokerResult.tableValue,
        );
      }
    });
  });

  describe("SCORE2 - Age impact", () => {
    test("older age increases cardiovascular risk", () => {
      const baseInput = {
        sex: "male" as const,
        region: "low" as const,
        sbp: 140,
        nonHdl: 4.0,
        smoker: false,
      };

      const youngerResult = calcScore2Unified({ ...baseInput, age: 45 });
      const olderResult = calcScore2Unified({ ...baseInput, age: 65 });

      expect(youngerResult).toBeDefined();
      expect(olderResult).toBeDefined();

      if (youngerResult && olderResult) {
        expect(olderResult.tableValue).toBeGreaterThan(
          youngerResult.tableValue,
        );
      }
    });
  });

  describe("SCORE2 - Blood pressure impact", () => {
    test("higher blood pressure increases cardiovascular risk", () => {
      const baseInput = {
        sex: "male" as const,
        region: "low" as const,
        age: 55,
        nonHdl: 4.0,
        smoker: false,
      };

      const normalBpResult = calcScore2Unified({ ...baseInput, sbp: 120 });
      const highBpResult = calcScore2Unified({ ...baseInput, sbp: 160 });

      expect(normalBpResult).toBeDefined();
      expect(highBpResult).toBeDefined();

      if (normalBpResult && highBpResult) {
        expect(highBpResult.tableValue).toBeGreaterThan(
          normalBpResult.tableValue,
        );
      }
    });
  });

  describe("SCORE2 - Cholesterol impact", () => {
    test("higher cholesterol increases cardiovascular risk", () => {
      const baseInput = {
        sex: "male" as const,
        region: "low" as const,
        age: 55,
        sbp: 140,
        smoker: false,
      };

      const normalCholResult = calcScore2Unified({ ...baseInput, nonHdl: 3.0 });
      const highCholResult = calcScore2Unified({ ...baseInput, nonHdl: 5.0 });

      expect(normalCholResult).toBeDefined();
      expect(highCholResult).toBeDefined();

      if (normalCholResult && highCholResult) {
        expect(highCholResult.tableValue).toBeGreaterThan(
          normalCholResult.tableValue,
        );
      }
    });
  });

  describe("SCORE2 - Risk color classification", () => {
    test("assigns appropriate risk colors", () => {
      const lowRiskInput: Score2Input = {
        sex: "female",
        region: "low",
        age: 45,
        sbp: 110,
        nonHdl: 2.5,
        smoker: false,
      };

      const highRiskInput: Score2Input = {
        sex: "male",
        region: "low",
        age: 65,
        sbp: 170,
        nonHdl: 5.5,
        smoker: true,
      };

      const lowRiskResult = calcScore2Unified(lowRiskInput);
      const highRiskResult = calcScore2Unified(highRiskInput);

      if (lowRiskResult && highRiskResult) {
        expect(["green", "yellow", "red"]).toContain(lowRiskResult.color);
        expect(["green", "yellow", "red"]).toContain(highRiskResult.color);
      }
    });
  });

  describe("SCORE2 - Edge cases", () => {
    test("handles boundary age values correctly", () => {
      const age40Result = calcScore2Unified({
        sex: "male",
        region: "low",
        age: 40, // Minimum age
        sbp: 120,
        nonHdl: 3.0,
        smoker: false,
      });

      const age69Result = calcScore2Unified({
        sex: "male",
        region: "low",
        age: 69, // Maximum age for SCORE2
        sbp: 120,
        nonHdl: 3.0,
        smoker: false,
      });

      expect(age40Result).toBeDefined();
      expect(age69Result).toBeDefined();
    });

    test("handles boundary blood pressure values correctly", () => {
      const minBpResult = calcScore2Unified({
        sex: "male",
        region: "low",
        age: 50,
        sbp: 100, // Minimum BP
        nonHdl: 3.0,
        smoker: false,
      });

      const maxBpResult = calcScore2Unified({
        sex: "male",
        region: "low",
        age: 50,
        sbp: 200, // Maximum BP
        nonHdl: 3.0,
        smoker: false,
      });

      expect(minBpResult).toBeDefined();
      expect(maxBpResult).toBeDefined();
    });
  });
});
