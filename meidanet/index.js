import puppeteer from "puppeteer";
import { getGrades } from "./api.js";
import { getSessionToken } from "./scraper.js";
import { getUpcomingTests, getBest5, getLastGotGrades } from "./utils.js";

const GRADES_MEMORY = new Map();
const GRADES_MEMORY_TIMESTAMP = new Map();


export const main = async (user) => {
    const browser = await puppeteer.launch({headless: true},{args: [
        '--no-sandbox',
    ]});
    const { name } = user;
    if (GRADES_MEMORY_TIMESTAMP.has(name) && GRADES_MEMORY_TIMESTAMP.get(name) > Date.now() - 1000 * 60 * 60 * 24) {
        const grades = GRADES_MEMORY.get(name);
        return grades;
    }
    const sessionToken = await getSessionToken(user, browser);
    const grades = await getGrades(sessionToken);
    const futureTests = grades.filter((grade) => grade.isFutureTest);
    const upcomingTests = getUpcomingTests(futureTests);
    const UPCOMING_NAMES = upcomingTests.map((test) => test.name);
    const NEED_TO_RETAKE = grades.filter((grade) => grade.needToRetake);
    const best5 = getBest5(grades);
    const lastGotGrade = getLastGotGrades(grades);
    GRADES_MEMORY.set(name, {best5, upcomingTests, UPCOMING_NAMES, NEED_TO_RETAKE, lastGotGrade, grades,
    });
    await Promise.all([
        browser.close(),
        GRADES_MEMORY_TIMESTAMP.set(name, Date.now()),
    ]);
    return {
        best5,
        upcomingTests,
        UPCOMING_NAMES,
        NEED_TO_RETAKE,
        lastGotGrade,
        grades,
    }
};
