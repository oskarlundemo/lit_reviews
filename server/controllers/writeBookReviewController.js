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
        res.status(201).json({message: 'Review updated'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Review update failed with error'});
    }
}



export const createNewBookReview = async (user_id, req, res) => {

    const published = req.body.publish === 'true';

    const {bookAuthor, body,
        bookTitle, bookPages,
        quote, reviewTitle,
        bookAbout,
    } = req.body;


    const categories = JSON.parse(req.body.categories);
    console.log(categories);

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
    res.status(201).json(review);
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