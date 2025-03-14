


import {Router} from 'express';

import {inspectReview} from '../controllers/homeController.js'
import {getAllReviews, deleteReview, searchReviews} from "../controllers/postController.js";


const postRoute = new Router();

postRoute.get('/search', searchReviews)

postRoute.get('/', getAllReviews)

postRoute.get('/:id', inspectReview)

postRoute.delete('/:id', deleteReview, getAllReviews)



export default postRoute;