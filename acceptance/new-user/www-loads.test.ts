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
    page_x = await context_x.newPage(); // better than the slower `await page`

    await Promise.all([
      page_x.waitForResponse((res) => res.url().endsWith("/users/self")),
      page_x.goto("https://realdevsquad.com", { // https://pptr.dev/api/puppeteer.page.goto/
        waitUntil: 'networkidle0'
      }),
      // page_x.waitForNavigation(),
    ]);
  });

  afterEach(async () => {
    await page_x.close();
  });


  it('should display "Real Dev Squad" text on page in desktop', async () => {
    await expect(page_x).toMatch('Real Dev Squad');
  });

  it('should display "Real Dev Squad" text on page in mobile', async () => {
    await page_x.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
    });
      
    await expect(page_x).toMatch('Real Dev Squad');

    // Won't work, because we don't have this visible in mobile:
    // await page_x.click("body > nav > ul > li:nth-child(3) > a");
  });

  it('should visit Welcome site', async () => {
    // await page_x.waitForSelector('li > a');
    await expect(page_x).toMatchElement('body > nav > ul > li:nth-child(3) > a');
    // works too: await expect(page_x).toClick("body > nav > ul > li:nth-child(3) > a");
    await page_x.click("body > nav > ul > li:nth-child(3) > a");
  });
});
