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
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reactBuildPath = path.join(__dirname, "../client/public-app/dist");

const corsOptions = {
    origin: 'https://lit-reviews.onrender.com', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials like cookies or Authorization headers
};

app.use(express.static(reactBuildPath));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/sign-in', loginRoute);
app.use('/sign-up', createUserRoute);
app.use('/book-review', bookReview);
app.use('/home', homeRoute);
app.use('/posts', postRoute);
app.use('/comments', commentsRoute);
app.use('/activity', activityRouter);



// Handle React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            res.status(500).send(err);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


