/** @jest-environment jsdom */

const puppeteer = require("puppeteer");

const URLS = require("../../constants/urls");

const { JOIN } = URLS;

let browser, page;

/* time delay */
const delay = (time) => {
  return new Promise((res) => {
    setTimeout(res, time);
  });
};

/* confirm alerts */
async function confirmAlerts() {
  await page.on("dialog", async (dialog) => {
    await dialog.accept();

    delay(2000);
    await page.waitForNavigation();

    expect(page.url().match(/login/) !== null).toBeTruthy();

    await browser.close();
  });
}

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
    slowMo: 0,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
  return page;
});

describe("Navigation of Join button with logged user and logged out user", () => {
  test("Join button test for user", async () => {
    await page.goto(JOIN);

    await page.click(".btn-join");

    // delay(2000);
    await Promise.all([page.waitForNavigation(), checkResponse()]);
    // await browser.close();
  });
});
