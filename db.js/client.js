import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('Shenkar');
    } catch (error) {
        console.log(error);
    }
};


export const Client = connectToDatabase();