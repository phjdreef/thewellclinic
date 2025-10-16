import { expect, test, describe } from "vitest";
import {
  calcBmi,
  determineBmiCategory,
} from "../../components/measures/calcBmi";

describe("BMI Calculations", () => {
  describe("calcBmi", () => {
    test("calculates BMI correctly for normal values", () => {
      expect(calcBmi(70, 175)).toBe(22.9); // 70kg, 175cm
      expect(calcBmi(80, 180)).toBe(24.7); // 80kg, 180cm
      expect(calcBmi(60, 160)).toBe(23.4); // 60kg, 160cm
    });

    test("calculates BMI correctly for edge cases", () => {
      expect(calcBmi(50, 150)).toBe(22.2); // Lower values
      expect(calcBmi(120, 200)).toBe(30.0); // Higher values
      expect(calcBmi(45, 140)).toBe(23.0); // Very low values
    });

    test("rounds BMI to 1 decimal place", () => {
      expect(calcBmi(77.7, 177.7)).toBe(24.6);
      expect(calcBmi(68.3, 172.3)).toBe(23.0);
    });

    test("handles decimal inputs correctly", () => {
      expect(calcBmi(70.5, 175.5)).toBe(22.9);
      expect(calcBmi(80.2, 180.8)).toBe(24.5);
    });
  });

  describe("determineBmiCategory", () => {
    test("categorizes underweight correctly", () => {
      expect(determineBmiCategory(15.0)).toBe("underWeight");
      expect(determineBmiCategory(18.4)).toBe("underWeight");
      expect(determineBmiCategory(17.5)).toBe("underWeight");
    });

    test("categorizes normal weight correctly", () => {
      expect(determineBmiCategory(18.5)).toBe("normalWeight");
      expect(determineBmiCategory(22.0)).toBe("normalWeight");
      expect(determineBmiCategory(24.9)).toBe("normalWeight");
    });

    test("categorizes overweight correctly", () => {
      expect(determineBmiCategory(25.0)).toBe("overWeight");
      expect(determineBmiCategory(27.5)).toBe("overWeight");
      expect(determineBmiCategory(29.9)).toBe("overWeight");
    });

    test("categorizes obese class 1 correctly", () => {
      expect(determineBmiCategory(30.0)).toBe("obeseClass1");
      expect(determineBmiCategory(32.5)).toBe("obeseClass1");
      expect(determineBmiCategory(34.9)).toBe("obeseClass1");
    });

    test("categorizes obese class 2 correctly", () => {
      expect(determineBmiCategory(35.0)).toBe("obeseClass2");
      expect(determineBmiCategory(37.5)).toBe("obeseClass2");
      expect(determineBmiCategory(39.9)).toBe("obeseClass2");
    });

    test("categorizes obese class 3 correctly", () => {
      expect(determineBmiCategory(40.0)).toBe("obeseClass3");
      expect(determineBmiCategory(45.0)).toBe("obeseClass3");
      expect(determineBmiCategory(50.0)).toBe("obeseClass3");
    });

    test("handles boundary values correctly", () => {
      expect(determineBmiCategory(18.49999)).toBe("underWeight");
      expect(determineBmiCategory(18.5)).toBe("normalWeight");
      expect(determineBmiCategory(24.99999)).toBe("normalWeight");
      expect(determineBmiCategory(25.0)).toBe("overWeight");
      expect(determineBmiCategory(29.99999)).toBe("overWeight");
      expect(determineBmiCategory(30.0)).toBe("obeseClass1");
    });
  });

  describe("BMI integration tests", () => {
    test("calculates BMI and determines category in one flow", () => {
      // Underweight example
      const bmi1 = calcBmi(50, 170);
      expect(bmi1).toBe(17.3);
      expect(determineBmiCategory(bmi1)).toBe("underWeight");

      // Normal weight example
      const bmi2 = calcBmi(70, 175);
      expect(bmi2).toBe(22.9);
      expect(determineBmiCategory(bmi2)).toBe("normalWeight");

      // Overweight example
      const bmi3 = calcBmi(85, 175);
      expect(bmi3).toBe(27.8);
      expect(determineBmiCategory(bmi3)).toBe("overWeight");

      // Obese example
      const bmi4 = calcBmi(95, 175);
      expect(bmi4).toBe(31.0);
      expect(determineBmiCategory(bmi4)).toBe("obeseClass1");
    });
  });
});
