


const {Router} = require("express");
const {login, getQuotes, getReviews} = require("../prisma");
const loginRoute = new Router();


loginRoute.get('/', async (req, res) => {
    await getReviews(req, res);
})


loginRoute.post('/', async (req, res) => {
    await login(req, res);
})



module.exports = loginRoute;