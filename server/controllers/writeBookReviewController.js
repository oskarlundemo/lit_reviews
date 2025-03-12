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
        .withMessage('Please enter a title for the book'),
    body('bookAuthor')
        .trim()
        .isLength({ min: 1, max: 50})
        .withMessage('Please enter an author'),
    body('bookAbout')
        .trim()
        .isLength({ min: 1})
        .withMessage('Please enter a preview of the book'),
    body('bookPages')
        .trim()
        .isInt()
        .withMessage('Please enter the number of book pages'),
    body('quote')
        .trim()
        .isLength({ min: 1, max: 350})
        .withMessage('Please enter a quote'),
    body('reviewTitle')
        .trim()
        .isLength({ min: 1, max: 150})
        .withMessage('Please enter a review title'),
    body('body')
        .trim()
        .isLength({min: 1})
        .withMessage('You must write something in your review'),
    body('thumbnail').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Thumbnail is required');
        }
        return true;
    })
];



export const updatedThumbnail = async (reviewId, req, res) => {
    try {
        const reviewHasSameThumbnail = await prisma.review.findUnique({
            where: {
                id: reviewId,
            }
        });

        if (reviewHasSameThumbnail && reviewHasSameThumbnail.thumbnail === req.file.originalname) {
            return { message: 'Same thumbnail, no changes made' };  // Return instead of sending response
        }

        const getReview = await prisma.review.findUnique({
            where: {
                id: reviewId,
            }
        });

        if (getReview?.thumbnail) {
            await deleteImageFromDb(getReview.thumbnail);
        }

        await saveFile(req, res);

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


export const updateCategories = async (req, res) => {
    try {
        const categories = JSON.parse(req.body.categories);  // Get categories from request

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



export const updatePreviousBookReview = async (user_id, reviewId, req, res) => {

    try {
        const published = req.body.publish === 'true';

        const {bookAuthor, body,
            bookTitle, bookPages,
            quote, reviewTitle,
            bookAbout, bookId, authorId
        } = req.body;

        await updatedThumbnail(reviewId, req, res);

        await prisma.author.update({
            where: {
                id: parseInt(authorId),
            }, data: {
                name: bookAuthor,
            }
        })

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

        await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                favouriteQuoute: quote,
                body: body,
                title: reviewTitle,
                published: published,
            }
        })

        await updateCategories(req, res);
        res.status(201).json({message: 'Review updated'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Review update failed with error'});
    }
}



export const addCategories = async (book,req, res) => {

    try {
        const categories = JSON.parse(req.body.categories);
        for (const category of categories) {

            let newCategory;

            const categoryExists = await prisma.category.findFirst({
                where: {
                    category: {
                        contains: category,
                        mode: "insensitive"
                    }
                }
            })

            if (!categoryExists) {
                newCategory = await prisma.category.create({
                    data: {
                        category: category,
                    }
                })


                await prisma.bookCategory.create({
                    data: {
                        category_id: newCategory.id,
                        book_id: book.id
                    }
                })
            } else {
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



export const createNewBookReview = async (user_id, req, res) => {


    try {
        const published = req.body.publish === 'true';
        const {
            bookAuthor, body,
            bookTitle, bookPages,
            quote, reviewTitle,
            bookAbout,
        } = req.body;

        let author = await prisma.author.findFirst({
            where: {
                name: {
                    equals: bookAuthor,
                    mode: 'insensitive',
                },
            },
        });

        if (!author) {
            author = await prisma.author.create({
                data: {
                    name: bookAuthor,
                },
            });
        }

        let book = await prisma.book.findFirst({
            where: {
                title: {
                    equals: bookTitle,
                    mode: 'insensitive',
                }
            }
        })

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

        const review = await prisma.review.create({
            data: {
                published: published,
                title: reviewTitle,
                body: DOMPurify.sanitize(body),
                favouriteQuoute: quote,
                book_id: book.id,
                user_id: user_id,
                thumbnail: req.file.originalname
            },
        });
        await saveFile(req, res);
        await addCategories(book, req, res);
        res.status(201).json(review);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Error inserting book review'});
    }
}



export const configureBookReview = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {id} = jwtDecode(token);
    const {reviewId} = req.body;

    try {
        if (reviewId) {
            await updatePreviousBookReview(parseInt(id), parseInt(reviewId), req, res);
        } else {
            await createNewBookReview(id, req, res);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }
}