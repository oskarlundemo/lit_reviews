


import {Router} from 'express';

import {inspectReview} from '../controllers/homeController.js'
import {getReviews, deleteReview, searchReviews} from "../controllers/postController.js";


const postRoute = new Router();

postRoute.get('/search', searchReviews)

postRoute.get('/', getReviews)

postRoute.get('/:id', inspectReview)

postRoute.delete('/:id', deleteReview, getReviews)



export default postRoute;