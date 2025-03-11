


import {Router} from "express";

import {getAllComments, searchForComments} from '../controllers/activityController.js'
import {getCommentsForReview, deleteComment} from "../controllers/homeController.js";


const commentsRouter = Router();

commentsRouter.get("/all", getAllComments)

commentsRouter.get("/search", searchForComments)

commentsRouter.get("/:id", getCommentsForReview)

commentsRouter.delete('/:commentId', deleteComment)


export default commentsRouter;