


import {Router} from "express";

import {getAllComments, searchForComments} from '../controllers/activityController.js'
import {getComments, deleteComment} from "../controllers/homeController.js";


const commentsRouter = Router();

commentsRouter.get("/all", getAllComments)

commentsRouter.get("/search", searchForComments)

commentsRouter.get("/:id", getComments)

commentsRouter.delete('/:commentId', deleteComment)


export default commentsRouter;