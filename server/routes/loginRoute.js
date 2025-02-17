



const {Router} = require("express");
const loginRoute = new Router();

loginRoute.post('/', (req, res) => {
    console.log('I login');
    console.log(req.body);
})



module.exports = loginRoute;