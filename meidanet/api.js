import axios from "axios";
import { booleanDateIsAfterToday } from "./utils.js";
const DIDNT_COME_TO_THE_TEST = (grade) => grade === "לא נבחנ/ה";
const SHENKAR_BASE_URL = "https://meydanet.shenkar.ac.il/";

const HEBREW_QUERTERS = [
    "א",
    "ב"
];


const MEIDANET_LOGIN_URL = "https://meydanet.shenkar.ac.il/Portals/token?type=student"

export const getToken = async (user) => {
    const { MEIDANET_ID, MEIDANET_PASSWORD } = user;
    const text = `grant_type=password&captchaToken=&captchaAction=&password=${MEIDANET_PASSWORD}&zht=${MEIDANET_ID}&secret=`
    const headers = {
        "authority": "meydanet.shenkar.ac.il",
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "dnt": "1",
        "referer": "https://meydanet.shenkar.ac.il/Portals/student/login",
        "sec-ch-ua": `Not.A/Brand";v="8", "Chromium";v="114`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "macOS",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36`,
        "x-requested-with": "XMLHttpRequest"
    }
    const { data } = await axios.post(MEIDANET_LOGIN_URL, text, { headers });
    return data.access_token;
};


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
        const { __body: body } = course;
        const bodyElements  = body[0].__body;
        let response =  {
            name: course.krs_shm,
            semester: course.sms,
            semesterNumber : HEBREW_QUERTERS.indexOf(course.sms) + 1,
            naz: Number(course.zikui_mishkal),
            courseHebrewYear: course.krs_snl,
            finalGrade: Number(course.moed_1_zin) || null,
            failedTimes: Number(course.fail),
            moed: Number(course.fail) === 0 ? "מועד א" : "מועד ב",
            lastMoedDate: '',
            hasAnyGrade: false,
            hasFinalGrade: !!Number(course.moed_1_zin),
            needToRetake: false,
        }
        response.moadim = bodyElements.map((element, index) => {
            let moedGrade = element.moed_1_zin;
            const moedTime = element.bhn_moed_time.split("-");
            const moedDate = element.bhn_moed_dtmoed;
            const isAfterToday = booleanDateIsAfterToday(moedDate) || false;
            if ( isAfterToday && index === 0 || (isAfterToday && response.nextMoedDate > moedDate) ) {
                response.nextMoedDate = moedDate;
            };
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
        // response.isFutureTest = response.moadim[0].isAfterToday ;
        // console.log("got here")
        // response._isBeforeMoedB = response.moadim[1]?.isAfterToday && !response.moadim[0].isAfterToday;
        // response._isBeforeMoedB = response._isBeforeMoedB || (response.moadim[0].isAfterToday && !response.moadim[1]?.isAfterToday);
        // if(!response.isFutureTest && ( !response.hasFinalGrade || response.finalGrade < 60)) response.needToRetake = true;
        // if (response.isFutureTest) response.nextMoedDate = response.moadim[0].moedDate;
        // if (response._isBeforeMoedB) response.nextMoedDate = response.moadim[1].moedDate;
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
