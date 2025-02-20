


const {Router} = require("express");
const {login} = require("../prisma");
const loginRoute = new Router();

loginRoute.post('/', async (req, res) => {
    await login(req, res);
})



module.exports = loginRoute;