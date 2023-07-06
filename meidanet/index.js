
import { getUpcomingTests, getBest5, getLastGotGrades } from "./utils.js";
import { getToken, getGrades } from "./api.js";
import dotenv from "dotenv";
import  Exams from "./exams.js";

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



export const examsData = async () => {
    const user = {
        MEIDANET_ID: process.env.SHENKAR_ID,
        MEIDANET_PASSWORD: process.env.SHENKAR_PASSWORD,
    };
    const token = await getToken(user);
    const { access_token } = token;
    const exams = new Exams({ token: access_token });
    const rawExamsData = await exams.rawExamsData();
    const examsData = exams.handleExamsData(rawExamsData);
    const nextExams = exams.getNextExams(examsData);
    console.log(nextExams);
    return examsData;
};


