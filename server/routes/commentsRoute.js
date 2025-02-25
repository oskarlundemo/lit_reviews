


const {Router} = require("express");
const {getComments, getAllComments, searchForComments} = require("../prisma");


const commentsRouter = Router();


commentsRouter.get("/", async (req, res) => {
    await getAllComments(req, res);
})


commentsRouter.get("/search", async (req, res) => {
    await searchForComments(req, res);
})

module.exports = commentsRouter;