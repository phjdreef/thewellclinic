import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * E2E tests for Complete Health Analysis User Flow
 * Tests the main user journey from input to results
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

  electronApp.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);

    page.on("pageerror", (error) => {
      console.error(error);
    });
    page.on("console", (msg) => {
      console.log(msg.text());
    });
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

test.describe("Complete Health Analysis Workflow", () => {
  test("should navigate through complete health analysis flow", async () => {
    // Ensure Dutch language is set
    await ensureDutchLanguage(page);

    // 1. Verify home page loads
    const title = await page.waitForSelector("h1");
    const titleText = await title.textContent();
    expect(titleText).toContain("The Well Clinic");

    // 2. Navigate to input page
    await page.click('[data-testid="nav-input"]');
    await page.waitForSelector('[data-testid="input-page-title"]');

    // 3. Fill basic information
    await page.fill('[data-testid="name-input"]', "John Doe");
    await page.fill('[data-testid="age-input"]', "45");
    await page.click('[data-testid="gender-male"]');
    await page.check('[data-testid="smoking-checkbox"]');

    // 4. Switch to measures tab and fill data
    await page.click('[data-testid="tab-measures"]');
    await page.fill('[data-testid="weight-input"]', "80");
    await page.fill('[data-testid="height-input"]', "180");
    await page.fill('[data-testid="waist-input"]', "90");
    await page.fill('[data-testid="systolic-input"]', "140");
    await page.fill('[data-testid="nonHdl-input"]', "4.5");

    // 5. Fill biological age tab
    await page.click('[data-testid="tab-biologic-age"]');
    await page.fill('[data-testid="biologicAge-input"]', "50");

    // 6. Fill diabetes assessment
    await page.click('[data-testid="tab-diabetes"]');
    await page.check('[data-testid="diabeticMother-checkbox"]');
    await page.fill('[data-testid="glucoseMmol-input"]', "5.5");
    await page.fill('[data-testid="hdlMmol-input"]', "1.2");

    // 7. Navigate to results
    await page.click('[data-testid="nav-output"]');
    await page.waitForSelector('[data-testid="overall-results"]');

    // 8. Verify results are displayed
    expect(await page.isVisible('[data-testid="bmi-chart"]')).toBeTruthy();
    expect(await page.isVisible('[data-testid="score2-chart"]')).toBeTruthy();
    expect(await page.isVisible('[data-testid="diabetes-chart"]')).toBeTruthy();
    expect(
      await page.isVisible('[data-testid="biological-age-chart"]'),
    ).toBeTruthy();

    // 9. Test print functionality
    await page.click('[data-testid="print-button"]');
    // Note: Print functionality would need special handling in e2e tests
  });
});
