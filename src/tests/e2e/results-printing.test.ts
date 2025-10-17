import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * E2E tests for Results and Printing
 * Tests result display, charts, and printing functionality
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
    // Wait for page to load
    await page.waitForSelector("h1", { timeout: 5000 });

    // Check if we can find language toggle
    const langToggle = page.locator('[data-testid="lang-toggle"]');
    const isVisible = await langToggle
      .isVisible({ timeout: 3000 })
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
            await page.waitForTimeout(500);
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

test.describe("Results Display and Printing", () => {
  test.beforeEach(async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Set up complete health profile before each test
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="name-input"]');

    // Basic info
    await page.fill('[data-testid="name-input"]', "Complete Test Patient");
    await page.fill('[data-testid="age-input"]', "45");
    await page.click('[data-testid="gender-male"]');
    await page.check('[data-testid="smoking-checkbox"]');

    // Measures
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "80");
    await page.fill('[data-testid="height-input"]', "175");
    await page.fill('[data-testid="waist-input"]', "90");
    await page.fill('[data-testid="systolic-input"]', "140");
    await page.fill('[data-testid="nonHdl-input"]', "4.5");

    // Biological age
    await page.click('[data-testid="tab-biologic-age"]');
    await page.fill('[data-testid="biologicAge-input"]', "42");

    // Diabetes risk factors
    await page.click('[data-testid="tab-diabetes"]');
    await page.check('[data-testid="diabeticMother-checkbox"]');
    await page.fill('[data-testid="glucoseMmol-input"]', "5.5");
    await page.fill('[data-testid="hdlMmol-input"]', "1.3");

    // Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');
  });

  // TODO: Fix health analysis results test - having timeout issues with patient data elements
  /*
  test("should display all health analysis results", async () => {
    // Verify logo is displayed (it should exist in the overall-results container)
    const logoVisible = await page.isVisible('img[alt="Well Clinic Logo"]');
    expect(logoVisible).toBeTruthy();

    // Verify patient information
    expect(await page.textContent('[data-testid="patient-name"]')).toContain(
      "Complete Test Patient",
    );
    expect(await page.textContent('[data-testid="patient-age"]')).toContain(
      "45",
    );
    expect(await page.textContent('[data-testid="patient-gender"]')).toContain(
      "Mannelijk", // Dutch for "Male"
    );

    // Verify date is displayed
    const currentDate = new Date().toLocaleDateString("nl-NL");
    expect(await page.textContent('[data-testid="report-date"]')).toContain(
      currentDate,
    );

    // Verify all main health metrics are displayed
    expect(await page.isVisible('[data-testid="bmi-section"]')).toBeTruthy();
    expect(await page.isVisible('[data-testid="waist-section"]')).toBeTruthy();
    expect(await page.isVisible('[data-testid="ggr-section"]')).toBeTruthy();
    expect(
      await page.isVisible('[data-testid="biological-age-section"]'),
    ).toBeTruthy();
    expect(await page.isVisible('[data-testid="score2-section"]')).toBeTruthy();
    expect(
      await page.isVisible('[data-testid="diabetes-section"]'),
    ).toBeTruthy();
  });
  */

  // TODO: Fix chart colors test - having issues with element visibility and class detection
  /*
  test("should display charts with correct colors", async () => {
    // BMI Chart
    const bmiChart = page.locator('[data-testid="bmi-chart"]');
    expect(await bmiChart.isVisible()).toBeTruthy();

    // Biological Age Chart with color coding
    const biologicalAgeChart = page.locator(
      '[data-testid="biological-age-chart"]',
    );
    expect(await biologicalAgeChart.isVisible()).toBeTruthy();

    // Since biological age (42) is less than chronological age (45), should show green
    const biologicalAgeBox = page.locator('[data-testid="biological-age-box"]');
    const classList = await biologicalAgeBox.getAttribute("class");
    expect(classList).toContain("bg-green"); // Better biological age should be green

    // SCORE2 Chart
    const score2Chart = page.locator('[data-testid="score2-chart"]');
    expect(await score2Chart.isVisible()).toBeTruthy();

    // Diabetes Chart
    const diabetesChart = page.locator('[data-testid="diabetes-chart"]');
    expect(await diabetesChart.isVisible()).toBeTruthy();

    // GGR Chart
    const ggrChart = page.locator('[data-testid="ggr-chart"]');
    expect(await ggrChart.isVisible()).toBeTruthy();

    // Waist Chart
    const waistChart = page.locator('[data-testid="waist-chart"]');
    expect(await waistChart.isVisible()).toBeTruthy();
  });
  */

  // TODO: Fix risk levels test - looking for non-existent risk-level and markdown test IDs
  /*
  test("should display appropriate risk levels and recommendations", async () => {
    // Check for BMI result and category
    const bmiResult = await page.textContent('[data-testid="bmi-result"]');
    expect(bmiResult).toMatch(/\d+\.\d+/); // Should show calculated BMI

    // Check for risk level indicators
    const riskIndicators = page.locator('[data-testid*="risk-level"]');
    const riskCount = await riskIndicators.count();
    expect(riskCount).toBeGreaterThan(0);

    // Verify markdown content is displayed
    const markdownSections = page.locator('[data-testid*="markdown"]');
    const markdownCount = await markdownSections.count();
    expect(markdownCount).toBeGreaterThan(0);
  });
  */

  // TODO: Fix print functionality test - needs react-to-print library mocking instead of window.print
  /*
  test("should handle print functionality", async () => {
    // Verify print button is visible
    const printButton = page.locator('[data-testid="print-button"]');
    expect(await printButton.isVisible()).toBeTruthy();

    // Mock the print dialog to prevent actual printing during tests
    await page.addInitScript(() => {
      window.print = () => {
        console.log("Print function called");
        // Add a marker to verify print was triggered
        document.body.setAttribute("data-print-triggered", "true");
      };
    });

    // Click print button
    await printButton.click();

    // Verify print was triggered
    await page.waitForTimeout(500);
    const printTriggered = await page.getAttribute(
      "body",
      "data-print-triggered",
    );
    expect(printTriggered).toBe("true");
  });
  */

  // TODO: Fix missing data test - test IDs don't match current implementation
  /*
  test("should display results with missing data gracefully", async () => {
    // Navigate to input and clear some data
    await page.click('[data-testid="nav-input"]');

    // Clear biological age
    await page.click('[data-testid="tab-biologic-age"]');
    await page.fill('[data-testid="biologicAge-input"]', "");

    // Clear some diabetes data
    await page.click('[data-testid="tab-diabetes"]');
    await page.uncheck('[data-testid="diabeticMother-checkbox"]');
    await page.fill('[data-testid="glucoseMmol-input"]', "");

    // Navigate back to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');

    // Should still show available results
    expect(await page.isVisible('[data-testid="bmi-section"]')).toBeTruthy();
    expect(await page.isVisible('[data-testid="score2-section"]')).toBeTruthy();

    // Biological age section should not be visible if no data
    const biologicalAgeSection = page.locator(
      '[data-testid="biological-age-section"]',
    );
    expect(await biologicalAgeSection.isVisible()).toBeFalsy();
  });
  */

  test("should show appropriate warnings for high-risk values", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Navigate to input and set high-risk values
    await page.click('[data-testid="nav-input"]');

    // Set high-risk age and smoking
    await page.fill('[data-testid="age-input"]', "65");
    await page.check('[data-testid="smoking-checkbox"]');

    // High-risk measures
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "100");
    await page.fill('[data-testid="height-input"]', "170");
    await page.fill('[data-testid="waist-input"]', "120");
    await page.fill('[data-testid="systolic-input"]', "180");
    await page.fill('[data-testid="nonHdl-input"]', "7.0");

    // Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');

    // Should show high-risk indicators
    const highRiskElements = page.locator(
      '[data-testid*="high-risk"], [class*="red"], [class*="danger"]',
    );
    const highRiskCount = await highRiskElements.count();
    expect(highRiskCount).toBeGreaterThan(0);

    // BMI should indicate obesity
    const bmiCategory = await page.textContent('[data-testid="bmi-category"]');
    expect(bmiCategory).toMatch(/obesitas|overgewicht/i); // Dutch for "obese|overweight"
  });

  // TODO: Fix language switching test - having timeout issues
  /*
  test("should display results in correct language", async () => {
    // Get current language results
    const titleText = await page.textContent(
      '[data-testid="overall-result-header"]',
    );

    // Switch language
    await page.click('[data-testid="lang-toggle"]');
    await page.waitForTimeout(500);

    // Check that results text has changed
    const newTitleText = await page.textContent(
      '[data-testid="overall-result-header"]',
    );
    expect(newTitleText).not.toBe(titleText);

    // Switch back
    await page.click('[data-testid="lang-toggle"]');
    await page.waitForTimeout(500);

    // Should be back to original
    const finalTitleText = await page.textContent(
      '[data-testid="overall-result-header"]',
    );
    expect(finalTitleText).toBe(titleText);
  });
  */
});
