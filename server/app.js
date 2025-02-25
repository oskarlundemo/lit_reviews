
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;


const app = express();


const loginRoute = require('./routes/loginRoute');
const createRoute = require('./routes/createRoute');
const bookReview = require('./routes/newBookReview');
const homeRoute =   require('./routes/homeRoute');
const postRoute =   require('./routes/postsRoute');
const commentsRoute = require('./routes/commentsRoute');

app.use(express.json());
app.use('/api/create-user', createRoute);
app.use('/api/login', loginRoute);
app.use('/api/book-review', bookReview);
app.use('/', homeRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentsRoute)

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})



