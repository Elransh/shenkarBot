
export const booleanDateIsAfterToday = (date = "DD/MM/YYYY") => {
    const today = new Date();
    const [day, month, year] = date.split("/");
    const dateToCheck = new Date(year, month - 1, day);
    return dateToCheck > today;
};

export const checkLaterDate = ({dateToCheck, dateToCompare}) => {
    const [day, month, year] = dateToCheck.split("/");
    const dateToCheckDate = new Date(year, month - 1, day);
    const [dayToCompare, monthToCompare, yearToCompare] = dateToCompare.split("/");
    const dateToCompareDate = new Date(yearToCompare, monthToCompare - 1, dayToCompare);
    return dateToCheckDate > dateToCompareDate;
}

export const getUpcomingTests = (futureTests) => {
    const response =  futureTests.sort((a, b) => {
        const aDate = a.moadim[0].moedDate;
        const bDate = b.moadim[0].moedDate;
        const [aDay, aMonth, aYear] = aDate.split("/");
        const [bDay, bMonth, bYear] = bDate.split("/");
        const aDateToCheck = new Date(aYear, aMonth - 1, aDay);
        const bDateToCheck = new Date(bYear, bMonth - 1, bDay);
        return aDateToCheck > bDateToCheck ? 1 : -1;
    }).slice(0, 5)
    return response;
}
export const getBest5 = (grades) =>{
    const response = grades.sort((a, b) => {
        const aGrade = !a.finalGrade ? 0 : a.finalGrade;
        const bGrade = !b.finalGrade ? 0 : b.finalGrade;
        if (aGrade === bGrade) {
            const aDate = a.moadim[0].moedDate;
            const bDate = b.moadim[0].moedDate;
            const [aDay, aMonth, aYear] = aDate.split("/");
            const [bDay, bMonth, bYear] = bDate.split("/");
            const aDateToCheck = new Date(aYear, aMonth - 1, aDay);
            const bDateToCheck = new Date(bYear, bMonth - 1, bDay);
            return aDateToCheck > bDateToCheck ? 1 : -1;
        }
        return aGrade > bGrade ? -1 : 1;
    }).slice(0, 5);
    return response;
};

export const getLastGotGrades = (grades) => {
    const response = grades.sort((a, b) => {
        if (a.hasAnyGrade && !b.hasAnyGrade) return -1;
        if (!a.hasAnyGrade && b.hasAnyGrade) return 1;
        const aDate = a.lastMoedDate;
        const bDate = b.lastMoedDate;
        const [aDay, aMonth, aYear] = aDate.split("/");
        const [bDay, bMonth, bYear] = bDate.split("/");
        const aDateToCheck = new Date(aYear, aMonth - 1, aDay);
        const bDateToCheck = new Date(bYear, bMonth - 1, bDay);
        return aDateToCheck > bDateToCheck ? 1 : -1;
    })[0];
    return response;
}