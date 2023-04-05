const puppeteer = require("puppeteer");
const config = require("config");

const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST ,JOIN } = URLS;
const {signupPageTitle} = require("../../constants/pageTitles")


let browser, page;


/* time delay */
const delay = (time) => {
  return new Promise((res) => {
    setTimeout(res, time);
  });
};

/* confirm alerts */
async function confirmAlerts(){
        page.on('dialog', async dialog => {
               await dialog.accept();
               delay(2000)

               await page.waitForNavigation()
               delay(2000)
               await browser.close()
        })
}

async function checkResponse(){
 page.on("response", (response) => {
            if (response.url().endsWith("/users/self")) 
            {
              if(response.url().endsWith("/users/self")){ 
              if(response.status() === 401)
              {
                let url = page.url()
                if(url.endsWith("/join"))
                 {
                       delay(2000)
                       confirmAlerts()    
                 }
                }  
              }
              else if(response.status() === 200){
                const url = page.url()
                if(url.endsWith("/join"))
                {
                  browser.close()
                }  
              }

            }});
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
  return page;
});

describe("Navigation of Join button with logged user and logged out user", () => {
  test("Join button test for user", async () => {

    await page.goto(JOIN)
     
    await Promise.all([
            page.click('.btn-join'), 
            page.waitForNavigation() 
    ]);
         
    delay(5000)
    await checkResponse()        
  })
})
