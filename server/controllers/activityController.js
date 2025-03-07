


import {prisma} from "../prisma/index.js";

export const banUserCommenting = async (req, res) => {
    try {
        await prisma.banned.create({
            data: {
                user_id: parseInt(req.body.user.id),
            }
        })
        res.status(201).json({message: 'Banned user'});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}

export const unBanUserComments = async (req, res) => {
    try {
        await prisma.banned.delete({
            where: {
                user_id: parseInt(req.body.user.id),
            }
        })
        res.status(201).json({message: 'Unbanned user'});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}

export const getBannedUsers = async (req, res) => {
    try {
        const bannedUsers = await prisma.banned.findMany({
            include: {
                user: true
            }
        })
        res.status(201).json(bannedUsers);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}


export const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                user: {
                    include: {
                        Banned: true
                    }
                }
            }
        })
        res.status(200).json(comments);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


export const searchForComments = async (req, res) => {
    try {
        const query = req.query.query;
        const results = await prisma.comment.findMany({
            where: {
                OR: [
                    {comment: {contains: query, mode: 'insensitive'}},
                    {user: {username: {contains: query, mode: 'insensitive'}}},
                ]
            },
            include: {
                user: true
            }
        });
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
}


