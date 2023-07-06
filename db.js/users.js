import { Client } from './client.js';
const client = Client;


export const getUser = async (id) => {
    const user = await db.collection('users').findOne({ id });
    return user;
};

export const createUser = async (user = {
    userId: 0,
    password: '',
    token: '',
    expireDate: 0,
    iat: 0,
    phoneNumber: '',
}) => {
    const db = await client
    const newUser = await db.collection('users').insertOne(user);
    return newUser;
};

export const setNewExpireToken = async (id, token) => {
    const db = await client;
    const date = new Date();
    const expireDate = date.getTime() + 86399;
    const user = await db.collection('users').findOneAndUpdate(
        { userId: id },
        { $set: { token, expireDate, iat: date.getTime()}},
        { returnOriginal: false }
    );
    console.log(user);
    return user;
};

