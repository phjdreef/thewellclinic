// Unit tests for GGR calculations
import { expect, test } from "vitest";
import {
  calcGgrCategory,
  GgrInput,
  GgrResult,
} from "../../components/cards/measures/calculateGGR";

test("calcGgrCategory throws error for non-positive BMI", () => {
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

test("calcGgrCategory throws error for invalid gender", () => {
  expect(() =>
    // @ts-expect-error // intentional invalid input for testing
    calcGgrCategory({ bmi: 25, gender: "other", bmiCategory: "overWeight" }),
  ).toThrow('sex must be "male" or "female".');
  expect(() =>
    // @ts-expect-error // intentional invalid input for testing
    calcGgrCategory({ bmi: 25, gender: "", bmiCategory: "overWeight" }),
  ).toThrow('sex must be "male" or "female".');
});

test("calcGgrCategory returns correct category for various inputs", () => {
  const testCases: { input: GgrInput; expected: GgrResult }[] = [
    // Normal weight
    {
      input: {
        bmi: 22,
        gender: "male",
        bmiCategory: "normalWeight",
        waist: 80,
      },
      expected: { GgrCategory: "normal" },
    },
    {
      input: {
        bmi: 22,
        gender: "female",
        bmiCategory: "normalWeight",
        waist: 70,
      },
      expected: { GgrCategory: "normal" },
    },

    // Overweight without risk factors
    {
      input: { bmi: 27, gender: "male", bmiCategory: "overWeight", waist: 100 },
      expected: { GgrCategory: "lightIncreased" },
    },
    {
      input: {
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 85,
      },
      expected: { GgrCategory: "lightIncreased" },
    },

    // Overweight with increased waist
    {
      input: { bmi: 27, gender: "male", bmiCategory: "overWeight", waist: 105 },
      expected: { GgrCategory: "moderateIncreased" },
    },
    {
      input: {
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 90,
      },
      expected: { GgrCategory: "moderateIncreased" },
    },

    // Overweight with comorbidity
    {
      input: {
        bmi: 27,
        gender: "male",
        bmiCategory: "overWeight",
        waist: 100,
        hasComorbidity: true,
      },
      expected: { GgrCategory: "moderateIncreased" },
    },
    {
      input: {
        bmi: 27,
        gender: "female",
        bmiCategory: "overWeight",
        waist: 85,
        hasComorbidity: true,
      },
      expected: { GgrCategory: "moderateIncreased" },
    },

    // Obese class 1 without risk factors
    {
      input: {
        bmi: 32,
        gender: "male",
        bmiCategory: "obeseClass1",
        waist: 100,
      },
      expected: { GgrCategory: "lightIncreased" },
    },
    {
      input: {
        bmi: 32,
        gender: "female",
        bmiCategory: "obeseClass1",
        waist: 85,
      },
      expected: { GgrCategory: "lightIncreased" },
    },

    // Obese class 1 with increased waist
    {
      input: {
        bmi: 32,
        gender: "male",
        bmiCategory: "obeseClass1",
        waist: 105,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },
    {
      input: {
        bmi: 32,
        gender: "female",
        bmiCategory: "obeseClass1",
        waist: 90,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },

    // Obese class 1 with comorbidity
    {
      input: {
        waist: 100,
        bmi: 32,
        gender: "male",
        bmiCategory: "obeseClass1",
        hasComorbidity: true,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },
    {
      input: {
        waist: 90,
        bmi: 32,
        gender: "female",
        bmiCategory: "obeseClass1",
        hasComorbidity: true,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },

    // Obese class 2 without risk factors
    {
      input: {
        bmi: 37,
        gender: "male",
        bmiCategory: "obeseClass2",
        waist: 100,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },
    {
      input: {
        bmi: 37,
        gender: "female",
        bmiCategory: "obeseClass2",
        waist: 85,
      },
      expected: { GgrCategory: "stronglyIncreased" },
    },
  ];
});
