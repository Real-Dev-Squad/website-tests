/** @jest-environment jsdom */
const puppeteer = require("puppeteer");
const URLS = require("../../constants/urls");
const { JOIN } = URLS;
const { delay } = require("../../utils/delay");

let browser, page;

function confirmAlerts() {
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    await page.waitForNavigation();
    expect(page.url()).toMatch(/login/);
  });
}

/* check status*/
async function checkResponse() {
  await page.on("response", (response) => {
    if (response.url().endsWith("/users/self")) {
          expect(response.status()).toBe(401);
          expect(page.url().endsWith("/join"));
          confirmAlerts();
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

describe("Navigation of Join button with not logged In user", () => {
  test("Join button test for user", async () => {
    await page.goto(JOIN);

    await page.click(".btn-join");

    await Promise.all([page.waitForNavigation(), checkResponse()]);
  });
});
