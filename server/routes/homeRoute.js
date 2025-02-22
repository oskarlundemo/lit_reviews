


const {Router} = require('express');
const {latestBookReviews, inspectReview, createComment, getComments} = require("../prisma");


const homeRouter = new Router();


homeRouter.get('/latest', async (req, res) => {
    await latestBookReviews(req, res);
})

homeRouter.get('/latest/:id', async (req, res) => {
    await inspectReview(req, res);
})


homeRouter.get('/latest/:id/comments', async (req, res) => {
    await getComments(req, res);
})

homeRouter.post('/latest/:id', async (req, res) => {
    console.log(req.body)
    await createComment(req,res);
})


module.exports = homeRouter;