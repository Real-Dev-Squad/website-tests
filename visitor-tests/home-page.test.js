const puppeteer = require("puppeteer");

const URLS = require("../constants/urls");

const { HOME_PAGE } = URLS;

let browser, page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
    });
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    return page;
});

afterAll(async () => {
    await browser.close();
});

describe("Click on Social Media Links", () => {
    test("Visitor click on social media links", async () => {
        await page.goto(HOME_PAGE);
        const links = await page.$$eval("a.social-media-link", (list) =>
            list.map((elm) => elm.href)
        );
        for (const link of links) {
            const newPage = await browser.newPage();
            await newPage.goto(link);
            if (link.includes("linkedin")) {
                await newPage.screenshot({ path: "social-media/linkedin.png" });
                expect(link).toMatch(/real-dev-squad/);
            } else if (link.includes("twitter")) {
                await newPage.screenshot({ path: "social-media/twitter.png" });
                expect(link).toMatch(/realdevsquad/);
            } else if (link.includes("facebook")) {
                await newPage.screenshot({ path: "social-media/facebook.png" });
                expect(link).toMatch(/Real-Dev-Squad/);
            } else {
                await newPage.screenshot({
                    path: "social-media/instagram.png",
                });
                expect(link).toMatch(/realdevsquad/);
            }
        }
    });
});
