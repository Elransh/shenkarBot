
import { getUpcomingTests, getBest5, getLastGotGrades } from "./utils.js";
import { getToken, getGrades } from "./api.js";
import dotenv from "dotenv";
dotenv.config();

export const meidanetData = async () => {
    const user = {
        MEIDANET_ID: process.env.SHENKAR_ID,
        MEIDANET_PASSWORD: process.env.SHENKAR_PASSWORD,
    }
    const token = await getToken(user);
    const grades = await getGrades(token);
    const futureTests = grades.filter(grade => grade.nextMoedDate);
    const upcomingTests = getUpcomingTests(futureTests);
    return  upcomingTests;
};


