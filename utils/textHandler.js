

const jobStateEmoji = (jobState) => { if (jobState === "לא הוגש שום דבר עבור מטלה זו." || jobState === "אין נסיונות") return "❌"; if (jobState === "נבדק" || jobState === "הוגש למתן ציון") return "✅"; return "❓"}

export const beutifyEventsMessageForTelegram = (events) => {
    let message = "";
    message += `*  עבודות הגשה קרובות*\n\n`;
    events.forEach(event => {
        const { title, date, time, jobURL, jobState, courseName } = event;
        message += `*כותרת*: ${title}\n`;
        message += `*תאריך*: ${date}\n`;
        message += `*שעה* ⏰ : ${time.split(",")[1]}\n`;
        message += `*סטטוס*: ${jobState} ${jobStateEmoji(jobState)}  \n`;
        message += `*קישור לעבודה*: ${jobURL}\n\n`;
    });
    return message;
};

export const upcomingTestsMessage = (tests) => {
    let message = "";
    message += `* ⏰ מבחנים קרובים*\n\n`;
    tests.forEach(test => {
        const { name, moed, nextMoedDate, moadim } = test;
        let { startTime, endTime } = moadim[0];
        if (test._isBeforeMoedB) {
            startTime = moadim[1].startTime;
            endTime = moadim[1].endTime;
        }
        message += `*קורס*: ${name}\n`;
        message += `*תאריך*: ${nextMoedDate}\n`;
        message += `*מועד*: ${moed}\n`;
        message += `*שעת התחלה*: ${startTime}\n`;
        message += `*שעת סיום*: ${endTime}\n \n`;
    });
    return message;
};

export const redoCoursesMessage = (tests) => {
    // courses that needs to be redo based on the tests
    let message = "";
    message += `* 😥 קורסים שצריך לקחת מחדש*\n\n`;
    tests.forEach(test => {
        const { name } = test;
        message += `*קורס*: ${name}\n`;
    });
    return message;
};

export const bestTestsMessage = (tests) => {
    let message = "";
    message += `* 💯  !מבחנים הטובים ביותר*\n\n`;
    tests.forEach(test => {
        const { name, lastMoedDate, finalGrade, naz } = test;
        message += `*קורס*: ${name}\n`;
        message += `*תאריך*: ${lastMoedDate}\n`;
        message += `*ציון*: ${finalGrade}\n`;
        message += `*נקז*: ${naz}\n\n`;
    });
    message += "המשיכו ככה!"
    return message;
}