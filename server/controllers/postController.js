import {prisma} from '../prisma/index.js';
import {deleteImageFromDb} from "./supabaseController.js";



export const searchReviews = async (req, res) => {
    try {
        if (req.query.query.trim() === '') {
            try {
                const reviews = await prisma.review.findMany({
                    include: {
                        Book: {
                            include: {
                                Author: true,
                            }
                        }
                    }
                })
                res.status(201).json(reviews)
            } catch (err) {
                console.error(err);
                res.status(400).json({message: 'Error getting reviews'});
            }
        } else {
            const result = await prisma.review.findMany({
                include: {
                    Book: {
                        include: {
                            Author: true,
                        },
                    },
                },
                where: {
                    OR: [
                        {
                            title: {
                                contains: req.query.query,
                                mode: "insensitive",
                            },
                        },
                        {
                            Book: {
                                title: {
                                    contains: req.query.query,
                                    mode: "insensitive",
                                }
                            }
                        },
                        {
                            Book: {
                                Author: {
                                    name: {
                                        contains: req.query.query,
                                        mode: "insensitive",
                                    }
                                }
                            }
                        }
                    ],
                },
            });
            res.status(201).json(result)
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err});
    }
}



export const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                Book: {
                    include: {
                        Author: true,
                    }
                }
            }
        })
        res.status(201).json(reviews)
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error getting reviews'});
    }
}


export const deleteReview = async (req, res) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const review = await prisma.review.findUnique(({
                where: {
                    id: parseInt(req.params.id),
                }, include: {
                    Book: {
                        include: {
                            Author: true,
                        }
                    }
                }
            }))

            await prisma.review.delete(({
                where: {
                    id: parseInt(req.params.id)
                }
            }))

            await prisma.Book.delete({
                where: {
                    id: review.Book.id
                }
            })

            const books = await prisma.Book.findMany({
                where: {
                    Author: {
                        id: review.Book.Author.id
                    }
                }
            })

            if (!books) {
                await prisma.Author.delete({
                    where: {
                        id: review.Author.id
                    }
                })
            }
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error deleting review'});
    }
}

