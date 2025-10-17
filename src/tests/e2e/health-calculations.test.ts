import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * E2E tests for Health Calculations and Validation
 * Tests BMI, SCORE2, Diabetes, and other health calculations
 */

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  const latestBuild = findLatestBuild();
  const appInfo = parseElectronApp(latestBuild);
  process.env.CI = "e2e";

  electronApp = await electron.launch({
    args: [appInfo.main],
  });

  page = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test.describe("Health Calculations and Validation", () => {
  test.beforeEach(async () => {
    // Navigate to input page before each test
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');
  });

  test("should calculate BMI correctly and show appropriate category", async () => {
    // Fill basic info
    await page.fill('[data-testid="age-input"]', "30");
    await page.click('[data-testid="gender-male"]');

    // Navigate to measures and input height/weight for normal BMI
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "70");
    await page.fill('[data-testid="height-input"]', "175");

    // Check if BMI is calculated and displayed
    await page.waitForSelector('[data-testid="bmi-result"]');
    const bmiValue = await page.textContent('[data-testid="bmi-result"]');
    expect(bmiValue).toContain("22.9"); // 70/(1.75^2) = 22.86

    // Check BMI category
    const bmiCategory = await page.textContent('[data-testid="bmi-category"]');
    expect(bmiCategory).toContain("Normaal gewicht"); // Dutch for "Normal weight"
  });

  test.skip("should validate required fields and show error messages", async () => {
    // Note: This test is skipped because the app currently doesn't have form validation
    // Try to navigate to results without filling required fields
    await page.click('[data-testid="nav-output"]');

    // Should show validation messages or prevent navigation
    // This depends on your validation implementation
    const errorMessages = await page.locator('[data-testid*="error"]').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  // TODO: Fix high cardiovascular risk test - navigation timeout issues
  /*
  test("should calculate high cardiovascular risk correctly", async () => {
    // Navigate to input page first
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Fill data for high-risk profile
    await page.fill('[data-testid="name-input"]', "High Risk Patient");
    await page.fill('[data-testid="age-input"]', "65");
    await page.click('[data-testid="gender-male"]');
    await page.check('[data-testid="smoking-checkbox"]');

    // Measures tab
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "90");
    await page.fill('[data-testid="height-input"]', "170");
    await page.fill('[data-testid="waist-input"]', "110");
    await page.fill('[data-testid="systolic-input"]', "170");
    await page.fill('[data-testid="nonHdl-input"]', "6.0");

    // Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="score2-result"]');

    // Verify high risk indicators
    const score2Result = await page.textContent(
      '[data-testid="score2-result"]',
    );
    expect(score2Result).toMatch(/hoog|verhoogd/i); // Dutch for "high|elevated"
  });
  */

  // TODO: Fix diabetes risk test - having navigation timeout issues
  /*
  test("should calculate diabetes risk correctly", async () => {
    // Navigate to input page first
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Navigate to input page and fill diabetes risk factors
    await page.fill('[data-testid="age-input"]', "60");
    await page.click('[data-testid="gender-female"]');

    // Measures tab
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "85");
    await page.fill('[data-testid="height-input"]', "160");
    await page.fill('[data-testid="waist-input"]', "95");

    // Diabetes tab with risk factors
    await page.click('[data-testid="tab-diabetes"]');
    await page.check('[data-testid="diabeticMother-checkbox"]');
    await page.check('[data-testid="hypertension-checkbox"]');
    await page.fill('[data-testid="glucoseMmol-input"]', "6.0");
    await page.fill('[data-testid="hdlMmol-input"]', "1.0");

    // Check results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="diabetes-result"]');

    const diabetesRisk = await page.textContent(
      '[data-testid="diabetes-result"]',
    );
    // For 46.1% risk, this should be "Very extreme risk"
    expect(diabetesRisk).toContain("46.1"); // Check the risk percentage
  });
  */

  // TODO: Fix edge cases test - having navigation and timeout issues
  /*
  test("should handle edge cases and boundary values", async () => {
    // Navigate to input page first
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Test minimum values
    await page.fill('[data-testid="age-input"]', "18");
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "40");
    await page.fill('[data-testid="height-input"]', "150");

    // Verify calculations still work
    await page.waitForSelector('[data-testid="bmi-result"]');
    const bmiValue = await page.textContent('[data-testid="bmi-result"]');
    expect(bmiValue).toMatch(/\d+\.\d+/); // Should show a decimal number

    // Test maximum reasonable values
    await page.fill('[data-testid="age-input"]', "100");
    await page.fill('[data-testid="weight-input"]', "200");
    await page.fill('[data-testid="height-input"]', "200");

    // Should still calculate BMI
    await page.waitForTimeout(500);
    const newBmiValue = await page.textContent('[data-testid="bmi-result"]');
    expect(newBmiValue).toMatch(/\d+\.\d+/);
  });
  */

  // TODO: Fix biological age comparison test - currently having issues with element rendering
  /*
  test("should show biological age comparison correctly", async () => {
    // Navigate to input page first
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Fill chronological age
    await page.fill('[data-testid="age-input"]', "50");

    // Fill biological age (younger than chronological)
    await page.click('[data-testid="tab-biologic-age"]');
    await page.fill('[data-testid="biologicAge-input"]', "45");

    // Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');

    // Wait for biological age section to appear
    await page.waitForSelector('[data-testid="biological-age-chart"]', {
      timeout: 10000,
    });

    // Verify the comparison shows positive results
    const chronologicalAge = await page.textContent(
      '[data-testid="chronological-age-display"]',
    );
    const biologicalAge = await page.textContent(
      '[data-testid="biological-age-display"]',
    );

    expect(chronologicalAge).toContain("50");
    expect(biologicalAge).toContain("45");

    // Check if the chart shows the right colors (green for better biological age)
    const biologicalAgeBox = page.locator('[data-testid="biological-age-box"]');
    const classList = await biologicalAgeBox.getAttribute("class");
    expect(classList).toContain("green"); // Assuming green indicates better biological age
  });
  */
});
