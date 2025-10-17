import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * E2E tests for Navigation and UI Components
 * Tests app navigation, theme switching, language switching
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

test.describe("Navigation and UI Components", () => {
  test("should navigate between all pages", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Start at home page
    await page.waitForSelector("h1");

    // Navigate to Input page
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');
    // Verify we're on the input page by checking the page content (language-agnostic)
    const inputTitle = await page.textContent(
      '[data-testid="input-page-title"]',
    );
    // Should be either "Invoer" (Dutch) or "Analyze" (English)
    expect(inputTitle === "Invoer" || inputTitle === "Analyze").toBeTruthy();

    // Navigate to Output page
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');
    // Verify we're on the results page
    expect(
      await page.isVisible('[data-testid="overall-results"]'),
    ).toBeTruthy();

    // Navigate back to Home
    await page.click('[data-testid="nav-home"]');
    await page.waitForSelector("h1");
    // Verify we're back on home page by checking for the main title
    const homeTitle = await page.textContent("h1");
    expect(homeTitle).toContain("The Well Clinic");
  });

  test("should switch themes correctly", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Get initial html element class (where theme is applied)
    const html = await page.locator("html");
    const initialClass = (await html.getAttribute("class")) || "";
    console.log("Initial class:", initialClass);

    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');

    // Wait for the class to actually change on the html element
    let attempts = 0;
    let currentClass = initialClass;
    while (attempts < 5 && currentClass === initialClass) {
      await page.waitForTimeout(200);
      currentClass = (await html.getAttribute("class")) || "";
      attempts++;
    }

    console.log("New class after toggle:", currentClass);

    // Check if theme actually changed
    expect(currentClass).not.toBe(initialClass);
  });
  test("should switch languages correctly", async () => {
    // Start with Dutch (default language)
    await ensureDutchLanguage(page);
    await page.waitForTimeout(500);

    // Check initial Dutch text
    const appNameElements = await page.locator("h1").all();
    const dutchAppName = await appNameElements[1].textContent();
    console.log("Dutch app name:", dutchAppName);
    expect(dutchAppName).toContain("Gezondheidsanalyse"); // Should be Dutch

    // Click the EN button to switch to English
    const enButton = page.locator(
      '[data-testid="lang-toggle"] button:has-text("EN")',
    );
    await enButton.click();
    await page.waitForTimeout(500);

    // Check that it switched to English
    const englishAppName = await appNameElements[1].textContent();
    console.log("English app name:", englishAppName);
    expect(englishAppName).toContain("Health Analysis"); // Should be English
    expect(englishAppName).not.toBe(dutchAppName);

    // Switch back to Dutch
    const nlButton = page.locator(
      '[data-testid="lang-toggle"] button:has-text("NL")',
    );
    await nlButton.click();
    await page.waitForTimeout(500);

    // Verify it's back to Dutch
    const backToDutchAppName = await appNameElements[1].textContent();
    console.log("Back to Dutch app name:", backToDutchAppName);
    expect(backToDutchAppName).toContain("Gezondheidsanalyse");
    expect(backToDutchAppName).not.toBe(englishAppName);
  });
  test("should navigate through all input tabs", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // Navigate to input page
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // Wait for the tabs to load
    await page.waitForSelector('[data-testid="tab-basic"]', { timeout: 10000 });

    // Debug: Check what elements are present after tabs load
    const allTestIds = await page.$$eval("[data-testid]", (elements) =>
      elements.map((el) => el.getAttribute("data-testid")),
    );
    console.log("Available test IDs after tabs load:", allTestIds);

    // Test Basic tab (should be active by default)
    await page.waitForSelector('[data-testid="basic-input-card"]', {
      timeout: 5000,
    });
    expect(
      await page.isVisible('[data-testid="basic-input-card"]'),
    ).toBeTruthy();

    // Test Measures tab
    await page.click('[data-testid="tab-measures"]');
    expect(
      await page.isVisible('[data-testid="measures-input-card"]'),
    ).toBeTruthy();

    // Test Biological Age tab
    await page.click('[data-testid="tab-biologic-age"]');
    expect(
      await page.isVisible('[data-testid="biological-age-input-card"]'),
    ).toBeTruthy();

    // Test Diabetes tab
    await page.click('[data-testid="tab-diabetes"]');
    expect(
      await page.isVisible('[data-testid="diabetes-input-card"]'),
    ).toBeTruthy();

    // Test Additional Texts tab
    await page.click('[data-testid="tab-additional-texts"]');
    expect(
      await page.isVisible('[data-testid="text-input-card"]'),
    ).toBeTruthy();
  });
});
