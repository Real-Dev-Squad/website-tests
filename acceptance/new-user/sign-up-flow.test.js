const puppeteer = require("puppeteer");
const config = require("config");

const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST } = URLS;
const {signupPageTitle} = require("../../constants/pageTitles")

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
  return page;
});


// afterAll(async () => {
//   await browser.close();
// });

describe("New user navigates in the page", () => {
  test("github signin", async () => {
    await page.goto(HOME_PAGE);

    await Promise.all([
      page.waitForNavigation(),
      page.click("a.btn-login"),
    ]);

    const ghUsernameInput = await page.waitForSelector("input#login_field");
    const ghPasswordInput = await page.waitForSelector("input#password");

    if(ghPasswordInput && ghUsernameInput)
    {
      await ghUsernameInput.type(config.get("testUser.username"));
      await ghPasswordInput.type(config.get("testUser.password"));
      await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
      
    //   const pageTitle = await page.$eval(document.title) 
    //   console.log(pageTitle)
    // //    Authorization applition
    //   await delay(2000)
     
    //   await page.waitForSelector("button#js-oauth-authorize-btn");
    //   await Promise.all([
    //   await page.click("button#js-oauth-authorize-btn"),
    //   await page.waitForNavigation()
    //   ])
    }
    
    await Promise.all([
        page.waitForNavigation(), 
        page.keyboard.press("Enter")
    ]);
  })
})    





