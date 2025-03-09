


import {Router}  from 'express';

import {getAllComments} from '../controllers/activityController.js'
import {latestBookReviews, inspectReview, createComment, getComments, deleteComment, likePost, getLikes,
    getAllBookReviews, getAllLikes, getTopThreeQuotes} from "../controllers/homeController.js";

const homeRouter = new Router();

homeRouter.get('/inspect/:id', inspectReview)

homeRouter.get('/:id/comments', getComments)

homeRouter.post('/review/create/comment/:id', createComment)

homeRouter.delete('/review/delete/:commentId/', deleteComment)

homeRouter.get('/like/:postid', getLikes)

homeRouter.post('/like/:postid', likePost)

homeRouter.get('/latest', latestBookReviews)

homeRouter.get('/reviews/all', getAllBookReviews)

homeRouter.get('/likes/all', getAllLikes)

homeRouter.get('/comments/all', getAllComments)

homeRouter.get('/top-five-quotes', getTopThreeQuotes)



export default homeRouter;