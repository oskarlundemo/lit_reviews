import {prisma} from '../prisma/index.js';

/**
 * What does this function do?
 *
 * 1. Explain its purpose. For example: "This function bans a user from commenting by adding their ID to the banned table in the database."
 * What are the expected inputs?
 *
 * 2. Describe the required request structure. Example: "This function expects a POST request with a user object inside the request body, containing an id field (integer)."
 * What are the possible responses?
 *
 * 3. List the success and error responses. Example:
 * 201: User was successfully banned.
 * 400: An error occurred (e.g., invalid user ID or database issue).
 */


/**
 * 1. This function is used to search through reviews
 *
 *
 * 2. It requires a 'GET' request triggered in the Post.jsx / PostsTable.jsx through the postsRoute.js
 *
 * 3. 201: Return the filtered reviews
 *    401: Error retrieving the review from db
 *
 * @param req
 * @param res
 */


export const searchReviews = async (req, res) => {
    try {

        // If user enters a blank string, just reset the filter
        if (req.query.query.trim() === '') {
            try {
                // Get all reviews from the back-end
                const reviews = await prisma.review.findMany({
                    include: {
                        Book: {
                            include: {
                                Author: true,
                            }
                        }
                    }
                })
                // Return all the reviews
                res.status(201).json(reviews)
            } catch (err) {
                // Error retrieving the reviews from the db
                console.error(err);
                res.status(400).json({message: 'Error getting reviews'});
            }
        } else {
            // User provided a searchstring
            const result = await prisma.review.findMany({

                include: {
                    // include the book
                    Book: {
                        include: {
                            //Include the author
                            Author: true,
                        },
                    },
                },
                where: {
                    OR: [
                        {
                            title: {
                                // Filter the review title by the query, insensitive
                                contains: req.query.query,
                                mode: "insensitive",
                            },
                        },
                        {
                            Book: {
                                title: {
                                    // Filter the book title by the query, insensitive
                                    contains: req.query.query,
                                    mode: "insensitive",
                                }
                            }
                        },
                        {
                            Book: {
                                Author: {
                                    name: {
                                        // Filter the author name by the query, insensitive
                                        contains: req.query.query,
                                        mode: "insensitive",
                                    }
                                }
                            }
                        }
                    ],
                },
            });
            // Return the found reviews
            res.status(201).json(result)
        }
    } catch (err) {

        // Error retrieving the reviews
        console.error(err);
        res.status(400).json({error: err});
    }
}


/**
 * 1. This function is used to retrieve all the reviews
 *
 * 2  This function is triggered by both 'GET' 'DELETE' in PostTable.jsx and Login.jsx through the postRoute.js and loginRoute.js
 *
 *
 * 3. 201: Retrieved all the reviews successfully
 *    400: Error getting fetching the review
 *
 * @param req
 * @param res
 */

export const getAllReviews = async (req, res) => {
    try {
        // Find all reviews from the review table
        const reviews = await prisma.review.findMany({
            include: {
                Book: {
                    include: {
                        Author: true,
                        BookCategory: {
                            include: {
                                category: true,
                            }
                        }
                    }
                }
            }
        })

        // Reviews found to the
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

            await prisma.BookCategory.deleteMany({
                where: {
                    book_id: review.Book.id
                }
            })

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

