import { GILAD_USER_ID, IDO_USER_ID, ELRAN_USER_ID } from "./constants.js";

export const user = (userId) => {
    console.log(`Handling User Identity: ${userId}`)
    if (userId === GILAD_USER_ID) {
        return {
            name: "Gilad",
            hebrewName: "גלעד",
            SHENKAR_ID: process.env.GILAD_SHENKAR_ID,
            SHENKAR_PASSWORD: process.env.GILAD_SHENKAR_PASSWORD,
        }
    }else if (userId === IDO_USER_ID) {
        return {
            name: "Ido",
            hebrewName: "עידו",
            SHENKAR_ID: process.env.IDO_SHENKAR_ID,
            SHENKAR_PASSWORD: process.env.IDO_SHENKAR_PASSWORD,
        }
    }else if (userId === ELRAN_USER_ID) {
        return {
            name: "Elran",
            hebrewName: "אלרן",
            SHENKAR_ID: process.env.SHENKAR_ID,
            SHENKAR_PASSWORD: process.env.SHENKAR_PASSWORD,
        }
    } else {
        throw new Error("User not found");
    }
}