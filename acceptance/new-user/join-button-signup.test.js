/** @jest-environment jsdom */
const puppeteer = require("puppeteer");
const URLS = require("../../constants/urls");
const { JOIN, MY_HOST, HOME_PAGE } = URLS;

let browser, page;

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

    await page.waitForNavigation();
    expect(page.url()).toBe(`${HOME_PAGE}/`);
  });
});
