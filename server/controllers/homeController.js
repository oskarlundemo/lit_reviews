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




import {prisma} from '../prisma/index.js';
import {jwtDecode} from "jwt-decode";


/**
 * 1. This function retrieves all the book reviews stored in the db
 *
 * 2. The function expects a 'GET' request triggered in the AllBookReviews.jsx handled in the homerRoute.js
 *
 * 3. 200: Sends a list containing all the reviews to the front-end
 *    400: Error retrieving the reviews from the db
 */


export const getAllBookReviews = async (req, res) => {
    try {
        // Get all the reviews from the review table
       const reviews = await prisma.review.findMany({
            // Get the book the review is about
            include: {
                Book: {
                    // Include also the author of the book
                    include: {
                        Author: true,
                        BookCategory: true,
                    },
                }
            },

            where: {
                published: true,
            },

            // Order them by their created/posted data ascending
            orderBy: {
                created: 'asc'
            }
        })

        // A list of reviews is sent to the front-end
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        // Error retrieving the reviews from the back-end
        res.status(404).json({message: 'Not Found'});
    }
}


/**
 * 1. This function retrieves the three latest book reviews from the db
 *
 * 2. The function expects a 'GET' request triggered in the LatestReview.jsx handled in the homerRoute.js
 *
 * 3. 200: Sends a list containing the three latest reviews to the front-end
 *    400: Error retrieving the three reviews from the db
 */



export const latestBookReviews = async (req, res) => {
    try {

        // Retrieve the three latest reviews from the review table
        const latestBooksReviews = await prisma.review.findMany({

            // Limit the result to three rows
            take: 3,
            // They must be published! Unpublished reviews should not be displayed
            where: {published: true},

            // Order the reviews by their creation date desc
            orderBy: {
                created: 'desc'
            },

            // Include the book the review is about
            include: {
                Book: {
                    // Include the info of the author of that book
                    include: {
                        Author: true
                    }
                }
            }
        })

        // Sends a list of the three latest book reviews
        res.status(200).json(latestBooksReviews);
    } catch (err) {
        // Error retrieving the three latest book reviews
        res.status(400).json({ error: err.message });
        console.error(err);
    }
}




/**
 * 1. This function retrieves information about a specific book review that the user has clicked on
 *
 * 2. The function expects a 'GET' request triggered in many components ex LatestReview.jsx and AllBookReview.
 *    Basically everywhere a user can inspect a review this is triggered and handled by the homeRoute.js
 *
 * 3. 200: Sends an object of the book review to display in the front-end
 *    400: Error retrieving the review from the db
 */




export const inspectReview = async (req, res) => {
    try {

        // Retrieve a specific book review with the req.params.id in the review table
        const bookReview = await prisma.review.findUnique({
            where: {
                id: parseInt(req.params.id),
            },

            // Also include the information of the book and the author
            include: {
                Book: {include: {Author: true,}},
                User: {select: {username: true, id: true}}
            }
        })

        // Sends the unique book review to the front-end
        res.status(201).json(bookReview);
    } catch (err) {
        // Error finding the review in the db
        res.status(400).json({ error: err.message });
    }
}


/**
 * 1. This function retrieves all the comments from users that are associated to the inspected book review
 *
 * 2. The function expects a 'GET' request triggered in the CommentSection.jsx handled in the homeRoute.js
 *
 * 3. 201: Sends a list containing all the comments associated with the book review
 *    404: Could not find any comments associated with post
 *
 *    400: Error with the db
 */




export const getCommentsForReview = async (req, res) => {
    try {
        // Get all the comments that matches the req.params.id
        const comments = await prisma.comment.findMany({
            where: {
                post_id: parseInt(req.params.id),
            }, include: {
                user: true
            }
        })

        // If the length is longer than 201 (0 or many comments associated with the review) else
        // Set the status to 404 not found
        res.status(200).json(comments);
    } catch (err) {
        // Error fetching the comments from the back-end
        console.error(err);
        res.status(404).json({ error: err.message });
    }
}


/**
 * 1. This function is used for posting/creating new user comments
 *
 * 2. The function expects a 'POST' request triggered in the CommentSection.jsx handled by the homeRoute.js
 *
 * 3. 201: The comment was successful posted and inserted into the db
 *    404: Error trying to insert the comment into the db
 */


export const postNewComment = async (req, res) => {
    try {
        // Retrieve the token from the current user
        const token = req.headers.authorization.split(' ')[1];
        // Split the id to query against the db
        const {id} = jwtDecode(token);

        // Create a new comment and insert it into the comments table
        await prisma.comment.create({
            data: {
                user_id: id,
                post_id: parseInt(req.params.id),
                comment: req.body.comment,
            }
        })

        // Comment was successfully posted
        res.status(201).json({ message: "Comment created"});
    } catch (err) {

        // Error posting the comment to the db
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


/**
 * 1. This function is used for deleting comments posted on reviews
 *
 * 2. The function requires a 'DELETE' request triggered in the CommentSection.jsx component
 *    and is handled in the homeRoute.js
 *
 * 3. 201: Comment was successfully deleted from db
 *    400: There was an error trying to delete the comment from the db
 */

export const deleteComment = async (req, res) => {
    try {

        // Delete a comment from the comment table
        await prisma.comment.delete({
            where: {
                id: parseInt(req.params.commentId),
            }
        })
        // Comment was successfully deleted
        res.status(201).json({message: 'Comment deleted'});
    } catch (err) {
        // There was an error deleting the comment from the db
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



/**
 * 1. This function is used for retrieving all the likes given to the book reviews
 *    by the users
 *
 * 2. The function requires a 'GET' request triggered in the Home.jsx page handled by the homeRoute.js route
 *
 * 3. 201: Sends a list of all the likes to the front-end
 *    404: Could not find any likes
 *    400: There was an error trying retrieve the likes from the db
 */


export const getAllLikes = async (req, res) => {
    try {
        // Get all likes from the like table
        const likes = await prisma.like.findMany({});

        // No likes at all? 404: Not found, else 201 the list of likes
        likes.length > 0 ? res.status(200).json(likes) : res.status(404).json({ error: 'Not Found' });
    } catch (err) {
        // Error with retrieving the likes from the db
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


/**
 * 1. This function is used for retrieve the top categories on the book reviews
 *
 * 2. The function requires a 'GET' request in the Home.jsx page
 *
 * 3. 201: Top five categories are sent to the front end
 *    401: Error retrieving the top categories
 */


const postLikes = await prisma.like.groupBy({
    by: ['post_id'],
    _count: {
        user_id: true
    },

    // Order the result by the most liked posts descending
    orderBy: {
        _count: {
            user_id: 'desc'

        }
    },

    // Only retrieve the three most liked reviews
    take: 3,
});

export const getTopCategories = async (req, res) => {
    try {
        // Group the BookCategory records by category_id and count the number of books per category
        const groupedCategories = await prisma.bookCategory.groupBy({
            by: ['category_id'],
            _count: { book_id: true },
            orderBy: { _count: { book_id: 'desc' } },
            take: 5,
        });

        const results = await Promise.all(
            groupedCategories.map(async (group) => {
                const categoryDetails = await prisma.category.findUnique({
                    where: { id: group.category_id },
                });
                return {
                    id: group.category_id,
                    category: categoryDetails.category,
                    count: group._count.book_id,
                };
            })
        );

        res.status(200).json(results);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};



/**
 * 1. This function is used to retrieve all categories on for book reviews
 *
 * 2. The function requires a 'GET' request in the Home.jsx page
 *
 * 3. 201: All categories are sent to the front end
 *    401: Error retrieving the top categories
 */




export const getBookCategories = async (req, res) => {
    try {
        const bookCategories = await prisma.bookCategory.findMany({
            include: {
                category: true,
            }
        });
        res.status(200).json(bookCategories); // Return only the BookCategory with the associated Category data
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



/**
 * 1. This function retrieves all the likes associated to a specific book review
 *
 * 2. The function requires a 'GET' request triggered in the Home.jsx page handled by the homeRoute.js route
 *
 * 3. 201: Sends a list of all the likes associated with the book review to the front-end
 *    404: Could not find any likes associated the book review
 *    400: There was an error trying retrieve the likes from the db
 */


export const getReviewLikes = async (req, res) => {
    try {
        // Get the likes associated with the post
        const likes = await prisma.like.findMany({
            // Match the postid with the id column in the like table
            where: {
                post_id: parseInt(req.params.postid),
            }
        });
        // No likes for the review? 404: Not found, else 201 the list of likes
        res.status(200).json(likes);
    } catch (err) {
        // Error with retrieving the likes for the review
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


/**
 * 1. This functions retrieves the top three / most liked quotes from the users
 *
 * 2. It requires a 'GET' request triggered in the QuoteSlider.jsx and handled in the homeRouter.js route
 *
 * 3. 200: A list containing the top three quotes
 *    404: A 404 error of not found
 *    400: Error getting the reviews from the database
 */



export const getTopThreeQuotes = async (req, res) => {
    try {
        // Count the likes each post has by grouping them by user_id
        const postLikes = await prisma.like.groupBy({
            by: ['post_id'],
            _count: {
                user_id: true
            },

            // Order the result by the most liked posts descending
            orderBy: {
                _count: {
                    user_id: 'desc'

                }
            },

            // Only retrieve the three most liked reviews
            take: 3,
        });

        // Filter out the id of the top three post_id result
        const topPostsId = postLikes.map(postLike => postLike.post_id);

        // Retrieve the revires that are associated with the id of the top three
        const topThreeQuotes = await prisma.review.findMany({
            where: {
                // The id is in the list of topliked
                id: { in: topPostsId }
            },

            // Select only the favorite quote
            select: {
                favoriteQuote: true,
                id: true,
                // Include the book
                Book: {
                    select: {
                        title: true,

                        // Include the author
                        Author: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            },
        })

        // Successfully found the top three most liked quotes and send it to the front end
        res.status(200).json(topThreeQuotes);
    } catch (err) {
        // Error trying to get the top three quotes
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


/**
 * 1. This functions is used so users can like/heart the reviews they like
 *
 * 2. It requires a 'POST' request triggered in the ReviewBody.jsx component and is handled in the homeRoute.js
 *
 * 3. 200: User successfully liked / unliked the post
 *    400: Error trying to like / unlike the post
 */


export const likePost = async (req, res) => {

    // Retrieve the token of the user
    const token = req.headers.authorization.split(' ')[1];

    // Parse the user_id from the token
    const {id} = jwtDecode(token);
    try {

        // Check if the user already has liked the post
        const alreadyLiked = await prisma.like.findUnique({
            where: {
                post_id_user_id: {user_id: id, post_id: parseInt(req.params.postid)}
            }
        })


        // If the user has not already liked the posts then like the post
        if (!alreadyLiked) {
            // Insert a new like into the like table
            await prisma.like.create({
                data: {
                    user_id: id,
                    post_id: parseInt(req.params.postid),
                }
            })
            // Successful like
            res.status(200).json({message: 'Liked post'});

        } else {
            // If the user has already liked it and clicks again, then unlike it
            await prisma.like.delete({
                where: {
                    post_id_user_id: {user_id: id, post_id: parseInt(req.params.postid)}
                }
            })
            // Successful unlike
            res.status(200).json({message: 'Unliked post'});
        }

    } catch (err) {
        // Error liking or unliking the post 
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


/**
 *
 *
 *
 *
 */


export const getNumberOfReviews = async (req, res) => {

    try {

        const amountOfReviews = await prisma.review.findMany({
            where: {
                published: true,
            }
        })
        res.status(200).json(amountOfReviews.length);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


export const getNumberOfCategories = async (req, res) => {

    try {
        const numberOfCategories = await prisma.category.findMany({})
        res.status(200).json(numberOfCategories.length);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



export const getCategoriesForBook = async (req, res) => {

    try {

        console.log(req.params)

        const review = await prisma.review.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            include: {
                Book: true, // Include the related book
            },
        });


        const bookCategory = await prisma.bookCategory.findMany({
            where: {
                book_id: review.Book.id
            },
            include: {
                category: true,
            }
        })

        console.log(bookCategory)

        res.status(200).json(bookCategory);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }

}