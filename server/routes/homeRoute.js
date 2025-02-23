


const {Router} = require('express');
const {latestBookReviews, inspectReview, createComment, getComments, deleteComment, likePost, getLikes} = require("../prisma");


const homeRouter = new Router();


homeRouter.get('/api/latest/', async (req, res) => {
    await latestBookReviews(req, res);
})

homeRouter.get('/api/latest/:id', async (req, res) => {
    await inspectReview(req, res);
})


homeRouter.get('/api/latest/:id/comments', async (req, res) => {
    await getComments(req, res);
})

homeRouter.post('/api/latest/:id', async (req, res) => {
    await createComment(req,res);
})


homeRouter.delete('/api/latest/:id/comments/:commentId/:userid', async (req, res) => {
    await deleteComment(req,res);
    await getComments(req, res);
})

homeRouter.get('/api/latest/like/:postid', async (req, res) => {
    await getLikes(req, res);
})

homeRouter.post('/api/latest/like/:postid', async (req, res) => {
    await likePost(req,res);
})





module.exports = homeRouter;