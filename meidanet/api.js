import axios from "axios";
import { booleanDateIsAfterToday } from "./utils.js";
const DIDNT_COME_TO_THE_TEST = (grade) => grade === "לא נבחנ/ה";
const SHENKAR_BASE_URL = "https://meydanet.shenkar.ac.il/";

const HEBREW_QUERTERS = [
    "א",
    "ב"
]


const MEIDANET = (token) => {
    const instance =  axios.create({
    baseURL: SHENKAR_BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`
        },
    });
    return instance;
};

export const getGrades = async (token) => {
    try {
    const meidanet = MEIDANET(token);
    const { data } = await meidanet.post("Portals/api/Grades/Data");
    const { averages, collapsedCourses } = data;
    const averageData = {
        thisYear: averages[0].annualAverage,
        cumAvg: averages[0].cumulativeAverage,
    }
    const coursesAvg = collapsedCourses.clientData.filter(course => JSON.stringify(course.__body) !== "[]").map((course) => {
        console.log(course)
        const { __body: body } = course;
        const bodyElements  = body[0].__body;
        let response =  {
            name: course.krs_shm,
            semester: course.sms,
            semesterNumber : HEBREW_QUERTERS.indexOf(course.sms) + 1,
            naz: Number(course.zikui_mishkal),
            courseHebrewYear: course.krs_snl,
            finalGrade: Number(course.moed_1_zin),
            failedTimes: Number(course.fail),
            moed: Number(course.fail) === 0 ? "מועד א" : "מועד ב",
            lastMoedDate: '',
            hasAnyGrade: false,
            hasFinalGrade: !!Number(course.moed_1_zin),
            needToRetake: false,
        }
        response.moadim = bodyElements.map((element) => {
            let moedGrade = element.moed_1_zin;
            const moedTime = element.bhn_moed_time.split("-");
            const moedDate = element.bhn_moed_dtmoed;
            const isAfterToday = booleanDateIsAfterToday(moedDate);
            console.log(`moedGrade: ${moedGrade} DIDNT_COME_TO_THE_TEST: ${DIDNT_COME_TO_THE_TEST(moedGrade)}`)
            const hasGrade = moedGrade !== "" || !!moedGrade;
            const isFinalGrade = Number(moedGrade) === response.finalGrade;
            if (hasGrade) response.hasAnyGrade = true;
            if(isFinalGrade) response.lastMoedDate = element.bhn_moed_dtmoed;
            if (element.moed_1_zin === "" && !isAfterToday) return null;
            return {
                moedDate,
                startTime: moedTime[0],
                endTime: moedTime[1],
                isFinalGrade,
                hasGrade,
                isAfterToday,
            }
        });
        response.isFutureTest = response.moadim[0].isAfterToday;
        response._isBeforeMoedB = response.moadim[1]?.isAfterToday && !response.moadim[0].isAfterToday;
        if(!response.isFutureTest && ( !response.hasFinalGrade || response.finalGrade < 60)) response.needToRetake = true;
        if (response.isFutureTest) response.nextMoedDate = response.moadim[0].moedDate;
        if (response._isBeforeMoedB) response.nextMoedDate = response.moadim[1].moedDate;
        const responseWithoutNulls = {
            ...response,
            moadim: response.moadim.filter((moed) => moed !== null && (moed.hasGrade || moed.isAfterToday)),
        }
        return responseWithoutNulls;
    });
    return coursesAvg;
    } catch (error) {
        console.log("error in getGrades: " + error);
        return null;
    }
};
