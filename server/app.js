
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;


const app = express();


const loginRoute = require('./routes/loginRoute');
const createRoute = require('./routes/createRoute');
app.use(express.json());



app.use('/create-user', createRoute);
app.use('/login',loginRoute);

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})



