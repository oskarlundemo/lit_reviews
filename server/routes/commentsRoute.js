


const {Router} = require("express");
const {getComments, getAllComments, searchForComments, deleteComment} = require("../prisma");


const commentsRouter = Router();

commentsRouter.get("/all", async (req, res) => {
    await getAllComments(req, res);
})

commentsRouter.get("/search", async (req, res) => {
    await searchForComments(req, res);
})

commentsRouter.get("/:id", async (req, res) => {
    await getComments(req, res);
})

commentsRouter.delete('/:commentId', async (req, res) => {
    await deleteComment(req, res);
})





module.exports = commentsRouter;