import {prisma} from '../prisma/index.js';
import {jwtDecode} from "jwt-decode";

import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);


import { body } from 'express-validator';
import {deleteImageFromDb, saveFile} from "./supabaseController.js";

export const validateBookReview = [
    body('bookTitle')
        .trim()
        .isLength({ min: 1, max: 50})
        .escape()
        .withMessage('Please enter a title for the book'),
    body('bookAuthor')
        .trim()
        .escape()
        .isLength({ min: 1, max: 50})
        .withMessage('Please enter an author'),
    body('bookAbout')
        .trim()
        .isLength({ min: 1})
        .withMessage('Please enter a preview of the book'),
    body('bookPages')
        .trim()
        .isInt()
        .isLength({ min: 1, max: 10 })
        .withMessage('Please enter the number of book pages'),
    body('quote')
        .trim()
        .isLength({ min: 1, max: 350})
        .withMessage('Please enter a quote'),
    body('reviewTitle')
        .trim()
        .isLength({ min: 1, max: 150})
        .withMessage('Please enter a review title'),
    body('categories').custom((value, { req }) => {
        if (value.length === 0) {
            throw new Error('Categories is required');
        } else if (value.length > 5) {
            throw new Error('You can only provide up to five categories');
        }
        return true;
    }),

    body('body')
        .trim()
        .isLength({min: 1})
        .withMessage('You must write something in your review'),
    body('thumbnail').custom((value, { req }) => {
        // Check if it's a new post by looking for reviewId or bookId
        const isNewPost = !req.body.reviewId && !req.body.bookId;

        // If it's a new post and no file is provided, throw an error
        if (isNewPost && !req.file) {
            throw new Error('Thumbnail is required for new posts');
        }

        return true;
    })
];


/**
 * 1. This function is used to update the thumbnail if the user selects a new one
 *
 * 2. It is triggered in the updatePreviousBookReivew function further down
 *
 *
 * @param reviewId
 * @param req
 * @param res
 */




export const updatedThumbnail = async (reviewId, req, res) => {
    try {
        // If the user does not select a thumnail at all, exit
        if (!req.file) {
            return { message: 'No thumbnail provided, no changes made' };
        }

        // Otherwise check if it is the same one
        const reviewHasSameThumbnail = await prisma.review.findUnique({
            where: {
                id: reviewId,
            }
        });

        // Is the saved url for the thumbnail the same as the name of the new file?
        if (reviewHasSameThumbnail && reviewHasSameThumbnail.thumbnail === req.file.originalname) {
            return { message: 'Same thumbnail, no changes made' };  // Return instead of sending response
        }

        // Find the review where updating the thumbnail
        const getReview = await prisma.review.findUnique({
            where: {
                id: reviewId,
            }
        });

        // Get the url of the old thumbnail and delete it from supabase
        if (getReview?.thumbnail) {
            await deleteImageFromDb(getReview.thumbnail);
        }

        // Save the new thumbnail
        await saveFile(req, res);

        // Update the path in the db
        await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                thumbnail: req.file.originalname,
            },
        });
        return { message: 'Thumbnail updated successfully' };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


/**
 * 1. This function is used to update the categories of a book when a user updates a review
 *
 * 2. It is called in the updatePreviousBookReview function further down
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




export const updateCategories = async (req, res) => {
    try {
        // Get the categories sent with the form
        const categories = req.body.categories;

        // Get the categories for the book we are updating
        const book = await prisma.book.findUnique({
            where: {
                id: parseInt(req.body.bookId),
            }
        });

        // Get the current categories associated with the book
        const currentCategories = await prisma.bookCategory.findMany({
            where: {
                book_id: book.id,
            },
            include: {
                category: true,  // Include category details to check existing categories
            }
        });

        const currentCategoryNames = currentCategories.map(item => item.category.category.toLowerCase());

        // Compare and remove categories that are no longer part of the updated list
        const newCategoryNames = categories.map(category => category.toLowerCase().trim());

        // Find the categories to remove (those in current but not in new)
        const categoriesToRemove = currentCategories.filter(item => !newCategoryNames.includes(item.category.category.toLowerCase().trim()));


        for (const categoryToRemove of categoriesToRemove) {
            await prisma.bookCategory.delete({
                where: {
                    category_id_book_id: {
                        category_id: categoryToRemove.category_id,
                        book_id: book.id,
                    }
                }
            });
        }

        // Now add the new categories
        for (const category of categories) {

            // First, check if the book already has this category (case insensitive)
            const existingBookCategory = await prisma.bookCategory.findFirst({
                where: {
                    book_id: book.id, // The book id you're looking for
                    category: {
                        category: {  // Accessing the 'category' field of the related 'Category' model
                            equals: category,  // Category name you're matching
                            mode: 'insensitive',  // Case-insensitive comparison
                        }
                    }
                },
                include: {
                    category: true  // Include category details if needed
                }
            });

            // If the book does not have this category, we need to add it
            if (!existingBookCategory) {
                // Does the category already exist in the Category table?
                const categoryExists = await prisma.category.findFirst({
                    where: {
                        category: {
                            equals: category,
                            mode: "insensitive"  // case insensitive comparison
                        }
                    }
                });

                // If the category does not exist, create it
                if (!categoryExists) {
                    const newCategory = await prisma.category.create({
                        data: {
                            category: category,
                        }
                    });

                    // Insert the new category into the bookCategory table
                    await prisma.bookCategory.create({
                        data: {
                            category_id: newCategory.id,
                            book_id: book.id,
                        }
                    });
                } else {
                    // If the category already exists, just create the bookCategory entry
                    await prisma.bookCategory.create({
                        data: {
                            category_id: categoryExists.id,
                            book_id: book.id,
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
};


/**
 *
 *
 * 1. This function is used for updating a previous book review if the user modifies it
 *
 * 2. It is triggered by configureBookReview function further down
 *
 *
 * @param user_id
 * @param reviewId
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const updatePreviousBookReview = async (user_id, reviewId, req, res) => {

    try {

        // Parse the formdata from the req.body
        const publish = req.body.publish === "true";
        const {bookAuthor, body,
            bookTitle, bookPages,
            quote, reviewTitle,
            bookAbout, bookId, authorId
        } = req.body;

        // Update the thumbnail
        await updatedThumbnail(reviewId, req, res);

        // Update the author
        await prisma.author.update({
            where: {
                id: parseInt(authorId),
            }, data: {
                name: bookAuthor,
            }
        })

        // Update the book
        await prisma.book.update({
            where: {
                id: parseInt(bookId)
            },
            data: {
                title: bookTitle,
                pages: parseInt(bookPages),
                about: bookAbout,
            }
        })

        // Update review info
        await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                favoriteQuote: quote,
                body: body,
                title: reviewTitle,
                published: publish,
            }
        })

        // Update the new or removed categories
        await updateCategories(req, res);

        // Review was successfully updated
        res.status(201).json({message: 'Review updated'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Review update failed with error'});
    }
}


/**
 * 1. This function is used for adding the categories of a book
 *
 * 2. It is triggerd in the createNewBookReview function further down
 *
 *
 * @param book
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const addCategories = async (book,req, res) => {

    try {

        // Parse the category from the body
        const categories = req.body.categories;

        // Iterate through the array of categories sent in the body
        for (const category of categories) {


            let newCategory;

            // Check if the category already exists in the category table
            const categoryExists = await prisma.category.findFirst({
                where: {
                    category: {
                        contains: category,
                        mode: "insensitive"
                    }
                }
            })

            // If it does not, then create it
            if (!categoryExists) {
                newCategory = await prisma.category.create({
                    data: {
                        category: category,
                    }
                })

                // Insert the new category and the book into the bookCategory table
                await prisma.bookCategory.create({
                    data: {
                        category_id: newCategory.id,
                        book_id: book.id
                    }
                })
            } else {
                // Dont create a new category, but insert the row into the bookCategory
                await prisma.bookCategory.create({
                    data: {
                        category_id: categoryExists.id,
                        book_id: book.id
                    }
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}


/**
 *
 * 1. This function is used for creating a new book review
 *
 * 2. It is triggered in the configureBookReview funciton further down
 *
 *
 * @param user_id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */





export const createNewBookReview = async (user_id, req, res) => {

    try {

        // Parse the formdata
        const {
            bookAuthor, body,
            bookTitle, bookPages,
            quote, reviewTitle,
            bookAbout, published
        } = req.body;


        // See if the author already exists
        let author = await prisma.author.findFirst({
            where: {
                name: {
                    equals: bookAuthor,
                    mode: 'insensitive',
                },
            },
        });

        // If the author does not, create them
        if (!author) {
            author = await prisma.author.create({
                data: {
                    name: bookAuthor,
                },
            });
        }

        // See if the book already is in the db
        let book = await prisma.book.findFirst({
            where: {
                title: {
                    equals: bookTitle,
                    mode: 'insensitive',
                }
            }
        })

        // If the book is not already in the db, then create it
        if (!book) {
            book = await prisma.book.create({
                data: {
                    title: bookTitle,
                    pages: parseInt(bookPages),
                    author_id: author.id,
                    about: bookAbout
                }
            })
        }


        // Create a new table in the db
        const review = await prisma.review.create({
            data: {
                published: published,
                title: reviewTitle,
                body: DOMPurify.sanitize(body),
                favoriteQuote: quote,
                book_id: book.id,
                user_id: user_id,
                thumbnail: req.file.originalname
            },
        });

        // Save the thumbnail
        await saveFile(req, res);
        // Add the categories
        await addCategories(book, req, res);
        // Book review created successfully
        res.status(201).json(review);
    } catch (error) {
        console.log(error);
        // Error creating the book
        res.status(400).json({message: 'Error inserting book review'});
    }
}


/**
 * 1. This function is used to check either to update the book review or create a new one
 *
 *
 * 2. It is triggered by a 'POST' request in the WriteBookReview.jsx through the newBookReview.js router
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




export const configureBookReview = async (req, res) => {
    // Split the token
    const token = req.headers.authorization.split(' ')[1];

    // Get the id of the author of the review
    const {id} = jwtDecode(token);

    // Parse the id of the review
    const {reviewId} = req.body;

    try {

        const result = await prisma.$transaction(async (prisma) => {


            // If there is a reviewId, then we are updating a review
            if (reviewId) {
                return await updatePreviousBookReview(parseInt(id), parseInt(reviewId), req, res);
            } else {
                // Else we are creating a new book review
                return await createNewBookReview(id, req, res);
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }
}