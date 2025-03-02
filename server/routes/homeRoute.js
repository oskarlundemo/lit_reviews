


const {Router} = require('express');
const {latestBookReviews, inspectReview, createComment, getComments, deleteComment, likePost, getLikes,
    getAllBookReviews, getAllLikes, getAllComments, downloadFileFromDB
} = require("../prisma");


const homeRouter = new Router();



homeRouter.get('/inspect/:id', async (req, res) => {
    await inspectReview(req, res);
})

homeRouter.get('/image', async (req, res) => {
    await downloadFileFromDB(req, res);
})

homeRouter.get('/:id/comments', async (req, res) => {
    await getComments(req, res);
})

homeRouter.post('/review/create/comment/:id', async (req, res) => {
    await createComment(req,res);
})

homeRouter.delete('/review/delete/:commentId/', async (req, res) => {
    await deleteComment(req,res);
})

homeRouter.get('/like/:postid', async (req, res) => {
    await getLikes(req, res);
})

homeRouter.post('/like/:postid', async (req, res) => {
    await likePost(req,res);
})

homeRouter.get('/latest', async (req, res) => {
    await latestBookReviews(req, res);
})

homeRouter.get('/reviews/all', async (req, res) => {
    await getAllBookReviews(req, res);
})

homeRouter.get('/likes/all', async (req, res) => {
    await getAllLikes(req, res);
})

homeRouter.get('/comments/all', async (req, res) => {
    await getAllComments(req, res);
})



module.exports = homeRouter;