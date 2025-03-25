import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import loginRoute from './routes/loginRoute.js';
import createUserRoute from './routes/createUserRoute.js';
import bookReview from './routes/newBookReview.js';
import homeRoute from './routes/homeRoute.js';
import postRoute from './routes/postsRoute.js';
import commentsRoute from './routes/commentsRoute.js';
import activityRouter from './routes/activityRoute.js';
import cors from 'cors';



const PORT = process.env.PORT || 5001;

const app = express();

const corsOptions = {
    origin: 'https://lit-reviews.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/login', loginRoute);
app.use('/create-user', createUserRoute);
app.use('/book-review', bookReview);
app.use('/home', homeRoute);
app.use('/posts', postRoute);
app.use('/comments', commentsRoute);
app.use('/activity', activityRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


