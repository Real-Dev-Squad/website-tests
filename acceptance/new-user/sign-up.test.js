const puppeteer = require("puppeteer");
const config = require("config");

const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST } = URLS;

let browser, page;

function delay(time) {
    return new Promise(function (res) {
        setTimeout(res, time);
    });
}

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
    });

    const context = await browser.createIncognitoBrowserContext();

    page = await context.newPage();
    // await page.emulate(puppeteer.devices['iPhone 8']);
    // await page.setViewport({
    //   width: 1440,
    //   height: 900,
    //   deviceScaleFactor: 1,
    // });
    return page;
});

afterAll(async () => {
    await browser.close();
});

describe("New user navigates", () => {
    test("New user sess a sign up page", async () => {
        await page.goto(HOME_PAGE);

        await page.waitForResponse((res) => res.url().endsWith("/users/self"));
        await page.waitForSelector("button.login-btn-text");

        await Promise.all([
            page.waitForNavigation(),
            page.click("button.login-btn-text"),
        ]);

        const ghUsernameInput = await page.waitForSelector("input#login_field");
        const ghPasswordInput = await page.waitForSelector("input#password");

        await ghUsernameInput.type(config.get("testUser.username"));
        await ghPasswordInput.type(config.get("testUser.password"));
        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press("Enter"),
        ]);
        await page.waitForSelector("button#js-oauth-authorize-btn");
        await delay(2000);
        await page.click("button#js-oauth-authorize-btn");
        await page.waitForNavigation();
        await page.waitForFunction(
            `window.location.href.includes("${SIGN_UP_PAGE}")`
        );
        await page.waitForSelector("button.submitButton");
        console.log("submit button found");
        await page.screenshot({ path: "tmp/sign-up-form.png" });
        console.log("Screenshot taken");
        const pageTitle = await page.title();
        console.log(pageTitle);
        expect(pageTitle).toMatch(/Sign Up/);
    });
});

describe("New user sign up page works correctly", () => {
    beforeEach(async () => {
        await page.setRequestInterception(true);
    });

    afterEach(async () => {
        await page.setRequestInterception(false);
    });

    test("Incomplete user sees sign up page", async () => {
        // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        page.on("request", (request) => {
            if (
                request.url().endsWith("/users/self") &&
                request.method() === "GET"
            ) {
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
        await page.waitForSelector("h2");

        const pageTitle = await page.title();
        expect(pageTitle).toMatch(/Sign Up/);
    });
});