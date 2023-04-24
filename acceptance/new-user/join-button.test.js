/** @jest-environment jsdom */
const puppeteer = require("puppeteer");
const URLS = require("../../constants/urls");
const { JOIN } = URLS;
const { delay } = require("../../constants/utils");

let browser, page;

/* confirm alerts */
async function confirmAlerts() {
  await page.on("dialog", async (dialog) => {
    await dialog.accept();

    delay(2000);
    await page.waitForNavigation();
    expect(page.url()).toMatch(/login/);
  });
}

/* check status*/
async function checkResponse() {
  await page.on("response", (response) => {
    if (response.url().endsWith("/users/self")) {
      switch (response.status()) {
        case 401:
          // user not logged in
          expect(response.status()).toBe(401);
          expect(page.url().endsWith("/join")).toBeTruthy();
          confirmAlerts();
          break;
        case 200:
          // user logged in
          expect(response.status()).toBe(200);
          expect(page.url().endsWith("/join")).toBeTruthy();
          break;
        default:
          browser.close();
      }
    }
  });
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe("Navigation of Join button with complete details", () => {
  test("Join button test for user", async () => {
    await page.goto(JOIN);

    await page.click(".btn-join");

    await Promise.all([page.waitForNavigation(), checkResponse()]);
  });
});
