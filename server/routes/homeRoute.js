


const {Router} = require('express');
const {latestBookReviews} = require("../prisma");


const homeRouter = new Router();


homeRouter.get('/latest', async (req, res) => {
    await latestBookReviews(req, res);
})


module.exports = homeRouter;