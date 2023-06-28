import express from 'express';
import { meidanetData } from './meidanet/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    console.log(`Got New Request`)
    const data = await meidanetData();
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});