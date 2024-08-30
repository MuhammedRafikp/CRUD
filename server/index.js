import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import adminRouter from './src/Routes/AdminRoutes.js';
import userRouter from './src/Routes/UserRoutes.js';

dotenv.config();

const { MONGODB_URI,PORT } = process.env;

mongoose.connect(MONGODB_URI);

const app = express();

app.use('*',cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("Hello world");
});


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
