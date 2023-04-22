/** @jest-environment jsdom */
const puppeteer = require("puppeteer");

const URLS = require("../../constants/urls");

const { JOIN, MY_HOST } = URLS;

let browser, page;

/* time delay */
const delay = (time) => {
  return new Promise((res) => {
    setTimeout(res, time);
  });
};

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 0,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
  return page;
});

describe("Navigation of Join with incomplete details", () => {
  test("Join button navigation", async () => {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().endsWith("/users/self") && request.method() === "GET") {
        request.respond({
          headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": MY_HOST,
          },
          body: JSON.stringify({
            id: "<>",
            incompleteUserDetails: true,
            github_display_name: "<>",
            github_id: "<>",
          }),
        });
      } else {
        request.continue();
      }
    });

    await page.goto(JOIN);

    await Promise.all([page.click(".btn-join"), page.waitForNavigation()]);

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    delay(4000);

    const val = window.location.href;
    expect(val).toMatch("/");
    await browser.close();
  });
});
