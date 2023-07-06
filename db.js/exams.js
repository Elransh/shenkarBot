import { Client } from './client.js';
const client = Client;

export const getAllExams = async () => {
    const db = await client;
    const exams = await db.collection('exams').find().toArray();
    return exams;
};