




import {prisma} from '../prisma/index.js';
import {jwtDecode} from "jwt-decode";
import {compareSync} from "bcrypt";

export const getAllBookReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                Book: true
            }
        })
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: 'Not Found'});
    }
}

export const latestBookReviews = async (req, res) => {
    try {
        const latestBooksReviews = await prisma.review.findMany({
            take: 3,
            where: {
                published: true
            },
            orderBy: {
                created: 'desc'
            },
            include: {
                Book: {
                    include: {
                        Author: true
                    }
                }
            }
        })
        res.status(200).json(latestBooksReviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(err);
    }
}

export const inspectReview = async (req, res) => {
    try {
        const bookReview = await prisma.review.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            include: {
                Book: {include: {Author: true,}},
                User: {select: {username: true, id: true}}
            }
        })
        res.status(201).json(bookReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export const getComments = async (req, res) => {


    try {
        const comments = await prisma.comment.findMany({
            where: {
                post_id: parseInt(req.params.id),
            }, include: {
                user: true
            }
        })
        res.status(201).json(comments);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: 'Not Found' });
    }
}

export const createComment = async (req, res) => {

    console.log(req.params)

    try {
        const token = req.headers.authorization.split(' ')[1];
        const {id} = jwtDecode(token);
        await prisma.comment.create({
            data: {
                user_id: id,
                post_id: parseInt(req.params.id),
                comment: req.body.comment,
            }
        })
        res.status(201).json({ message: "Comment created"});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export const deleteComment = async (req, res) => {
    try {
        await prisma.comment.delete({
            where: {
                id: parseInt(req.params.commentId),
            }
        })
        res.status(201).json({message: 'Comment deleted'});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export const getAllLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({});
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


export const getLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: {
                post_id: parseInt(req.params.postid),
            }
        });
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



export const likePost = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {id} = jwtDecode(token);
    try {
        const alreadyLiked = await prisma.like.findUnique({
            where: {
                post_id_user_id: {user_id: id, post_id: parseInt(req.params.postid)}
            }
        })

        if (!alreadyLiked) {
            await prisma.like.create({
                data: {
                    user_id: id,
                    post_id: parseInt(req.params.postid),
                }
            })
            res.status(200).json({message: 'Liked post'});
        } else {
            await prisma.like.delete({
                where: {
                    post_id_user_id: {user_id: id, post_id: parseInt(req.params.postid)}
                }
            })
            res.status(200).json({message: 'Unliked post'});
        }

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}