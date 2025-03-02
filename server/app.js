
require('dotenv').config();
const express = require('express')
const PORT = process.env.PORT || 5000;


const app = express();


const loginRoute = require('./routes/loginRoute');
const createRoute = require('./routes/createRoute');
const bookReview = require('./routes/newBookReview');
const homeRoute =   require('./routes/homeRoute');
const postRoute =   require('./routes/postsRoute');
const commentsRoute = require('./routes/commentsRoute');
const activityRouter = require("./routes/activityRoute");

app.use(express.json());
app.use('/api/create-user', createRoute);
app.use('/api/login', loginRoute);
app.use('/api/book-review', bookReview);
app.use('/api/home', homeRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentsRoute)
app.use('/api/activity', activityRouter);

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})



