const puppeteer = require("puppeteer");
const config = require("config");

const URLS = require("../../constants/urls");

const { HOME_PAGE, SIGN_UP_PAGE, MY_HOST ,JOIN } = URLS;
const {signupPageTitle} = require("../../constants/pageTitles")


let browser, page;

const delay = (time) => {
  return new Promise((res) => {
    setTimeout(res, time);
  });
};

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const context = await browser.createIncognitoBrowserContext();

  page = await context.newPage();
  return page;
});

afterAll(async () => {
  await browser.close();
});


describe("Navigation Join page", () => {
  test("Join button test for logged user", async () => {

    await page.goto(JOIN)
     
    const join_button = await page.$('.btn-join')
     
    if(join_button)
    {
        console.log("successful")

         await Promise.all([
            page.waitForNavigation(), 
            page.click('.btn-join'), 
         ]);
         
         delay(5000)
        
        page.on("response", (response) => {
            if (response.url().endsWith("/users/self")) 
            {
              if(response.url().endsWith("/users/self")){ 
              if(response.status() === 401)
              {
                let url = page.url()
                if(url.endsWith("/join"))
                {                  
                  Promise.all([
                       page.waitForNavigation(),
                       page.evaluate(`window.confirm = () => true`)
                  ])
                  
                }
                delay(2000)  
              }
              else if(response.status() === 200){
                const url = page.url()
                if(url.endsWith("/join"))
                {
                  browser.close()
                }  
              }
            }
            
            }
             
        } 
    );

    // page.on('dialog', async dialog => { 
    //            console.log(dialog.message());
    //            await dialog.accept();
    //            expect(page.url()).toBe("https://github.com/login/")
    //     })

     
    }
    else{
        console.log("failure")
    }
  })
})
