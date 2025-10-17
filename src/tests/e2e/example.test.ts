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
 * E2E tests for 360° Health Analysis app
 * Using Playwright with Electron:
 * https://www.electronjs.org/pt/docs/latest/tutorial/automated-testing#using-playwright
 */

let electronApp: ElectronApplication;

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
      // Filter out markdown file loading errors to clean up test output
      const text = msg.text();
      if (!text.includes("Error loading markdown file")) {
        console.log(text);
      }
    });
  });
});

// Helper function to ensure Dutch language is set
async function ensureDutchLanguage(page: Page) {
  try {
    // Wait for page to load with CI-friendly timeout
    await page.waitForSelector("h1", getSelectorOptions(5000));

    // Check if we can find language toggle
    const langToggle = page.locator('[data-testid="lang-toggle"]');
    const isVisible = await langToggle
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (isVisible) {
      // Always try to set to Dutch by looking for the NL button
      const langButtons = langToggle.locator("button");
      const buttonCount = await langButtons.count();

      // Look for Dutch language button and click it
      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await langButtons.nth(i).textContent();
        if (buttonText?.includes("NL") || buttonText?.includes("nl")) {
          await langButtons.nth(i).click();
          await page.waitForTimeout(1000); // Wait longer for language to change
          break;
        }
      }

      // If no NL button found, check if the page is already in Dutch
      const pageText = await page.textContent("body");
      if (
        !pageText?.includes("Gezondheidsanalyse") &&
        !pageText?.includes("gezond")
      ) {
        // Try clicking the first button (might be Dutch)
        if (buttonCount > 0) {
          await langButtons.nth(0).click();
          await page.waitForTimeout(1000);
        }
      }
    }
  } catch (error) {
    // Language toggle might not be available on all pages, which is fine
    console.log("Language toggle not found or error occurred:", error);
  }
}

test("renders the first page", async () => {
  const page: Page = await electronApp.firstWindow();

  // Ensure Dutch language is set
  await ensureDutchLanguage(page);

  const title = await page.waitForSelector("h1");
  const text = await title.textContent();
  expect(text).toBe("The Well Clinic");
});
