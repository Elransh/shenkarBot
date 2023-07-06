import { EXAMS_URL }  from './endpoints.js'
import { MEIDANET } from './api.js'



class Exams {
    constructor(params) {
        this.params = params;
    };

    async rawExamsData() {
        const { token } = this.params;
        const meidanet = MEIDANET(token);
        const { data } = await meidanet.post(EXAMS_URL);
        return data;
    };      

    handleExamsData(rawExamsData) {
        const { collapsedExams: { clientData } } = rawExamsData;
        const exams = clientData.map(exam => {
            const splitHours = ( hours ) => { return hours.split("-") };
            return {
                id: exam.krs_bhn_moed_krs,
                name: exam.krs_shm,
                examOrder: ( exam.krs_bhn_moed_mis ) - 1,
                tutor: exam.pm_shm,
                semester: exam.krs_bhn_moed_sms,
                date: exam.date,
                startTime: splitHours(exam.krs_bhn_moed_mishaa)[0],
                endTime: splitHours(exam.krs_bhn_moed_mishaa)[1],
                room: exam.hdr_shm,
                textState: exam.mzv_zakaut_short_info,
            }
        });
        return exams;
    };

    getNextExams(exams) {
        const today = new Date();
        const nextExams = exams.filter(exam => {
            const examDate = new Date(exam.date);
            return examDate > today;
        });
        return nextExams.slice(0,10);
    };
};

export default Exams;