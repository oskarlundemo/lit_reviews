import {prisma} from '../prisma/index.js';
import {jwtDecode} from "jwt-decode";

export const newBookReview = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {id} = jwtDecode(token);


    const published = req.body.publish === 'true';

    const {bookAuthor, body,
        bookTitle, bookPages,
        quote, reviewTitle,
        bookAbout,
        reviewId, bookId, authorId
    } = req.body;


    try {
        if (reviewId) {
            await prisma.author.update({
                where: {
                    id: authorId,
                }, data: {
                    name: bookAuthor,
                }
            })

            await prisma.book.update({
                where: {
                    id: bookId
                },

                data: {
                    title: bookTitle,
                    pages: bookPages,
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
                    published: published
                }
            })
            res.status(201).json({message: 'Review updated'});
        } else {
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
                    body: purify.sanitize(body),
                    favouriteQuoute: quote,
                    book_id: book.id,
                    user_id: id,
                },
            });
            res.status(201).json(review);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }

}