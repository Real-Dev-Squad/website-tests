const puppeteer = require("puppeteer");
const config = require("config");

const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST , SELF_USER_API} = URLS;
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


  

test('can sign in and authorize with GitHub', async () => {
    await page.goto(HOME_PAGE);
    await Promise.all([
      page.waitForNavigation(),
      page.click("a.btn-login"),
    ]);

    // Fill in the test account's login credentials and submit the login form
    await page.type('#login_field', config.get("testUser.username"));
    await page.type('#password', config.get("testUser.password"));
    await page.click('[type="submit"]');

    // Wait for the GitHub authorization page to load
    await page.waitForSelector('#js-oauth-authorize-btn');

    // Click the "Authorize" button to authorize the application
    await Promise.all([
      await page.click("button#js-oauth-authorize-btn"),
      await page.waitForNavigation()
    ])

    /* navigate to signup */
    // await page.setRequestInterception(true);
    // page.on("request", (request) => {
        
    //   if (request.url().endsWith("/users/self") && request.method() === "GET") {
        
    //     request.respond({
    //       headers: {
    //         "Access-Control-Allow-Credentials": true,
    //         "Access-Control-Allow-Origin": MY_HOST,
    //       },
    //       body: JSON.stringify({
    //         id: "<>",
    //         incompleteUserDetails: true,
    //         github_display_name: "<>",
    //         github_id: "<>",
    //       }),
    //     });
    //   } else {
    //     request.continue();
    //   }
    // });
    //   await page.goto(SIGN_UP_PAGE)
      
      browser.close()    
  });

describe("New user sign up page works correctly",() => {
   test("Incomplete user sees sign up page", async () => {
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
     await page.goto(SIGN_UP_PAGE);

     browser.close()
  })
})
    
  






