


import {Router}  from 'express';

import {getAllComments} from '../controllers/activityController.js'
import {
    latestBookReviews, inspectReview, postNewComment, getCommentsForReview, deleteComment, likePost, getReviewLikes,
    getAllBookReviews, getAllLikes, getTopThreeQuotes, getTopCategories, getBookCategories
} from "../controllers/homeController.js";

const homeRouter = new Router();

homeRouter.get('/inspect/:id', inspectReview)

homeRouter.get('/:id/comments', getCommentsForReview)

homeRouter.post('/review/create/comment/:id', postNewComment)

homeRouter.delete('/review/delete/:commentId/', deleteComment)

homeRouter.get('/like/:postid', getReviewLikes)

homeRouter.post('/like/:postid', likePost)

homeRouter.get('/latest', latestBookReviews)

homeRouter.get('/reviews/all', getAllBookReviews)

homeRouter.get('/likes/all', getAllLikes)

homeRouter.get('/comments/all', getAllComments)

homeRouter.get('/top-three-quotes', getTopThreeQuotes)

homeRouter.get('/categories-top', getTopCategories)

homeRouter.get('/categories/books/:id', getBookCategories)




export default homeRouter;