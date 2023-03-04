const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST } = URLS;
const { signupPageTitle } = require("../../constants/pageTitles")

let context_x;

beforeAll(async () => {
  // page_x = browser.newPage(); // We want to open the browser once, and use incognito context.
  // Question to answer: Does the same context leak shared state across multiple pages, even when closed?
  context_x = await browser.createIncognitoBrowserContext();
});

// afterAll(async () => {
//   await browser.close();
// });

describe("Homepage", () => {
  beforeEach(async () => {
    page_x = await context_x.newPage(); // await page , which is slower
    await page_x.goto("https://google.com");
  });

  afterEach(async () => {
    await page_x.close();
  });


  it('should display "Google" text on page', async () => {
    await expect(page_x).toMatch("google");
  });
});
