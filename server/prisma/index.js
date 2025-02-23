

const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");
const { JSDOM } = require('jsdom');


const window = new JSDOM('').window;
const DOMPurify = require('dompurify');
const {asciiWhitespaceRe} = require("jsdom/lib/jsdom/living/helpers/strings");
const purify = DOMPurify(window);


/**
 * WriteBookReview.jsx
 */

exports.newBookReview = async (req, res) => {


    const token = req.headers.authorization.split(' ')[1];
    const {username, id} = jwtDecode(token);
    const {bookAuthor, body, bookTitle, bookPages, quote, reviewTitle, bookAbout, publish} = req.body;


    console.log(req.body);



    try {
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
                published: publish,
                title: reviewTitle,
                body: purify.sanitize(body),
                favouriteQuoute: quote,
                book_id: book.id,
                user_id: id,
            },
        });

        res.status(201).json(review);

    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }

}



/**
 * CreateUser.jsx
 */


async function uniqueUsername(username) {
    try {
        const existingUsername = await prisma.user.findUnique({
            where: {username: username,}
        })
        if (existingUsername) {
            console.log(`User already exists`)
            throw new Error(`Username already registered`)
        }
        return true;

    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function uniqueEmail(email) {
    try {
        const existingEmail = await prisma.user.findUnique({
            where: {email: email,}
        })
        if (existingEmail) {
            throw new Error(`Email already registered`)
        }
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.createUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        await uniqueUsername(username);
        await uniqueEmail(email);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
                data: {email: email,
                    password: hashedPassword,
                    username: username,
                }
            });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h'
            })

        res.status(200).json({ message: 'User created successfuly', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


/**
 * Login.jsx
 */


exports.verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
}


exports.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {username: username},
        })

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const userWithAdmin = await prisma.admin.findFirst({
            where: {
                user_id: user.id
            },
            include: {user: true}
        })

        if (userWithAdmin) {
            const payload = {
                id: userWithAdmin.user.id,
                username: userWithAdmin.user.username,
                admin: true
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: 'Login successful', token});
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
             process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}


/**
 * Home.jsx
 */

exports.latestBookReviews = async (req, res) => {
    try {
        const latestBooksReviews = await prisma.review.findMany({
            take: 6,
            where: {
                published: true
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

exports.inspectReview = async (req, res) => {

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
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



exports.getComments = async (req, res) => {
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



exports.createComment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const {username, id} = jwtDecode(token);

        await prisma.comment.create({
            data: {
                user_id: id,
                post_id: parseInt(req.params.id),
                comment: req.body.comment,
            }
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        await prisma.comment.delete({
            where: {
                id: parseInt(req.params.commentId),
            }
        })
    } catch (err) {
        console.error(err);
    }
}



exports.getLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: {
                post_id: parseInt(req.params.postid),
            }
        })
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



exports.likePost = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {username, id} = jwtDecode(token);
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

exports.unlikePost = async (req, res) => {

}



