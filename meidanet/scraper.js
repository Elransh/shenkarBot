
const SESSION_TOKEN_MEMORY = new Map();

const SHENKAR_BASE_URL = "https://meydanet.shenkar.ac.il/";
const HEBREW_QUERTERS = [
    "א",
    "ב"
]

const DIDNT_DO_THE_TEST = (grade) => grade === "טרם נקבע ציון" || grade === "לא לפרסום" ;

const login = async (user, browser) => {
    console.log("Logging in..." + user.name)
    const page = await browser.newPage();
    await page.goto("https://meydanet.shenkar.ac.il/Portals/student/login");
    await page.setViewport({ width: 1200, height: 720 });
    await page.type("input", user.SHENKAR_ID);
    await page.type("input[name='password']", user.SHENKAR_PASSWORD);
    await page.click("button[type='submit']");
    await page.waitForNavigation();
    // await for 2 seconds
    await page.waitForTimeout(9000);
    return page;
};

export const getSessionToken = async (user, browser) => {
    console.log("Getting session token...")
    if (SESSION_TOKEN_MEMORY.has(user.name)) {
        return SESSION_TOKEN_MEMORY.get(user.name);
    }
    const page = await login(user, browser);
    const sessionToken = await page.evaluate(() => {
        const stringifiedToken =  JSON.stringify(window.sessionStorage);
        const parsed = JSON.parse(stringifiedToken);
        return parsed.token
    });
    page.screenshot({ path: "example6.png" });
    // set the token in the memory for 30 minutes if possible 
    //setting up for 30 minutes memory
    SESSION_TOKEN_MEMORY.set(user.name, sessionToken);
    return sessionToken;
}




//  main({name: "Gilad"})