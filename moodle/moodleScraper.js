import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();



const SHENKAR_LOGIN_URL = "https://online.shenkar.ac.il/";


const login = async (user,browser) => {
    console.log("Logging in..." + user.name)
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 720 });
    await page.goto(SHENKAR_LOGIN_URL);
    await page.type("#login_username", user.SHENKAR_ID);
    await page.type("#login_password", user.SHENKAR_PASSWORD);
    await page.click("input[type='submit']");
    return page;
};

const getUpcomingEvents = async (page) => {
    if (!page) {
        throw new Error("page is not defined");
    };
    console.log("finished login");

    await page.waitForSelector('.card-text.content');

    const upcomingEvents = await page.evaluate(() => {
        const upcomingEvents = [];
        const upcomingEventsElements = document.querySelectorAll('.card-text.content .event');

        upcomingEventsElements.forEach((element) => {
            const date = element.querySelector('.date a').innerText;
            const jobCalenderLink = element.querySelector('.date a').href;
            const time = element.querySelector('.date').innerText;
            const title = element.querySelector('a').innerText.split("יש להגיש את")[1];
            upcomingEvents.push({ title, date, time, jobCalenderLink })
        });
        return upcomingEvents;
    });
    return upcomingEvents;
    // const upcomingEventsWithJobState = await addJobStateToEvent(upcomingEvents);
    // console.log(upcomingEventsWithJobState);
};

const addJobURLToEvent = async (events,browser) => {
    const output = await Promise.all(events.map(async (event) => {
        const page = await browser.newPage();
        await page.goto(`${event.jobCalenderLink}`);
        const jobURL = await page.evaluate(() => {
            const jobCard = document.querySelector(".card.rounded");
            const jobFooter = jobCard.querySelector(".card-footer.text-right.bg-transparent");
            const jobURL = jobFooter.querySelector(".card-link").href;
            return jobURL.split("&")[0];
        });
        const courseName = await page.evaluate(() => {
            const pageHeader = document.querySelector(".page-context-header");
            const h1 = pageHeader.querySelector("h1");
            return h1.innerText;
        });
        return { ...event, jobURL, courseName };
    }));
    return output;
};

const addJobStateToEvent = async (events,browser) => {
    const output = await Promise.all(events.map(async (event) => {
        const page = await browser.newPage();
        console.log(`${event.jobURL}`)
        await page.goto(`${event.jobURL}`);
        const jobState = await page.evaluate(() => {
            // find the table class class="generaltable"
            const table = document.querySelector(".generaltable");
            // find the table body
            const tableBody = table.querySelector("tbody");
            // find the tale row with inner text "מצב ההגשה"
            const jobStateRow = Array.from(tableBody.querySelectorAll("tr")).find((row) => {
                return row.querySelector("th").innerText === "מצב ההגשה";
            });
            // return the first cell in the row
            return jobStateRow.querySelector("td").innerText;
        });
        return { ...event, jobState };
    }));
    return output;
};


export const getEventsData = async (user) => {
    const browser = await puppeteer.launch({headless: true, args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]});
    const page = await login(user, browser);
    const upcomingEvents = await getUpcomingEvents(page);
    const upcomingEventsWithJobURL = await addJobURLToEvent(upcomingEvents, browser);
    const upcomingEventsWithJobState = await addJobStateToEvent(upcomingEventsWithJobURL, browser);
    console.log(upcomingEventsWithJobState);
    await browser.close();
    return upcomingEventsWithJobState;
};


