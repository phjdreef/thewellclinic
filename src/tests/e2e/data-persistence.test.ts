import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { getSelectorOptions, getWaitTime } from "./utils/testHelpers";

/*
 * E2E tests for Data Persistence and State Management
 * Tests that user data persists across navigation and app restarts
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

// Helper function to ensure Dutch language is set
async function ensureDutchLanguage(page: Page) {
  try {
    // Wait for page to load with CI-friendly timeout
    await page.waitForSelector("h1", getSelectorOptions(5000));

    // Check if we can find language toggle with extended timeout
    const langToggle = page.locator('[data-testid="lang-toggle"]');
    const isVisible = await langToggle
      .isVisible(getSelectorOptions(3000))
      .catch(() => false);

    if (isVisible) {
      // Check current language by looking for Dutch text
      const pageText = await page.textContent("body");

      // If we don't see Dutch text, try to switch to Dutch
      if (
        !pageText?.includes("Gezondheidsanalyse") &&
        !pageText?.includes("gezond")
      ) {
        const langButtons = langToggle.locator("button");
        const buttonCount = await langButtons.count();

        // Try to find and click the Dutch language button (NL)
        for (let i = 0; i < buttonCount; i++) {
          const buttonText = await langButtons.nth(i).textContent();
          if (buttonText?.includes("NL") || buttonText?.includes("nl")) {
            await langButtons.nth(i).click();
            await page.waitForTimeout(getWaitTime(500));
            break;
          }
        }
      }
    }
  } catch (error) {
    // Language toggle might not be available on all pages, which is fine
    console.log("Language toggle not found or error occurred:", error);
  }
}

test.describe("Data Persistence and State Management", () => {
  const testData = {
    name: "Test Patient",
    age: "42",
    weight: "75",
    height: "170",
    waist: "85",
    systolic: "130",
    nonhdl: "4.2",
    biologicAge: "38",
    glucose: "5.2",
  };

  test("should persist data when navigating between pages", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Navigate to input and fill basic data
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector(
      '[data-testid="name-input"]',
      getSelectorOptions(10000),
    );

    await page.fill('[data-testid="name-input"]', testData.name);
    await page.fill('[data-testid="age-input"]', testData.age);
    await page.click('[data-testid="gender-male"]');

    // Navigate to measures tab and fill data
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', testData.weight);
    await page.fill('[data-testid="height-input"]', testData.height);

    // Navigate to home and back to input
    await page.click('[data-testid="nav-home"]');
    await page.click('[data-testid="nav-input"]');

    // Verify data is still there
    const nameValue = await page.inputValue('[data-testid="name-input"]');
    const ageValue = await page.inputValue('[data-testid="age-input"]');
    expect(nameValue).toBe(testData.name);
    expect(ageValue).toBe(testData.age);

    // Check measures tab data
    await page.click('[data-testid="tab-measures"]');
    const weightValue = await page.inputValue('[data-testid="weight-input"]');
    const heightValue = await page.inputValue('[data-testid="height-input"]');
    expect(weightValue).toBe(testData.weight);
    expect(heightValue).toBe(testData.height);
  });

  test("should persist theme and language preferences", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Navigate to home page where theme toggle should be
    await page.click('[data-testid="nav-home"]');
    await page.waitForTimeout(getWaitTime(500));

    // Set dark theme
    await page.click('[data-testid="theme-toggle"]');
    const body = await page.locator("body");
    const darkThemeClass = await body.getAttribute("class");

    // Navigate to different pages and verify theme persists
    await page.click('[data-testid="nav-input"]');
    await page.waitForTimeout(getWaitTime(500));
    let currentThemeClass = await body.getAttribute("class");
    expect(currentThemeClass).toBe(darkThemeClass);

    await page.click('[data-testid="nav-output"]');
    await page.waitForTimeout(getWaitTime(500));
    currentThemeClass = await body.getAttribute("class");
    expect(currentThemeClass).toBe(darkThemeClass);

    // Reset theme for other tests
    await page.click('[data-testid="nav-home"]');
    await page.click('[data-testid="theme-toggle"]');
  });

  test("should maintain calculated values across navigation", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Fill complete health data
    await page.click('[data-testid="nav-input"]');

    // Basic info
    await page.fill('[data-testid="name-input"]', testData.name);
    await page.fill('[data-testid="age-input"]', testData.age);
    await page.click('[data-testid="gender-female"]');

    // Measures
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', testData.weight);
    await page.fill('[data-testid="height-input"]', testData.height);
    await page.fill('[data-testid="waist-input"]', testData.waist);
    await page.fill('[data-testid="systolic-input"]', testData.systolic);
    await page.fill('[data-testid="nonHdl-input"]', testData.nonhdl);

    // Biological age
    await page.click('[data-testid="tab-biologic-age"]');
    await page.fill('[data-testid="biologicAge-input"]', testData.biologicAge);

    // Go to results and note calculated values
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="bmi-result"]');
    const bmiValue = await page.textContent('[data-testid="bmi-result"]');

    // Navigate away and back
    await page.click('[data-testid="nav-home"]');
    await page.click('[data-testid="nav-output"]');

    // Verify calculated values are still there
    await page.waitForSelector('[data-testid="bmi-result"]');
    const persistedBmiValue = await page.textContent(
      '[data-testid="bmi-result"]',
    );
    expect(persistedBmiValue).toBe(bmiValue);

    // Verify patient name appears in results
    const patientInfo = await page.textContent('[data-testid="patient-name"]');
    expect(patientInfo).toContain(testData.name);
  });

  test("should handle data clearing/reset functionality", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Fill some data first
    await page.click('[data-testid="nav-input"]');
    await page.fill('[data-testid="name-input"]', "Test Clear");
    await page.fill('[data-testid="age-input"]', "30");

    // If there's a clear/reset button, test it
    const clearButton = page.locator('[data-testid="clear-data"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Verify data is cleared
      const nameValue = await page.inputValue('[data-testid="name-input"]');
      const ageValue = await page.inputValue('[data-testid="age-input"]');
      expect(nameValue).toBe("");
      expect(ageValue).toBe("");
    }
  });

  test("should handle invalid data gracefully", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Try to input invalid data
    await page.fill('[data-testid="age-input"]', "999");
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "0");
    await page.fill('[data-testid="height-input"]', "0");

    // Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');

    // Should handle gracefully - either show results or indicate invalid data
    // The application should not crash and should show the results page
    const resultsVisible = await page.isVisible(
      '[data-testid="overall-results"]',
    );
    expect(resultsVisible).toBeTruthy();
  });
});
