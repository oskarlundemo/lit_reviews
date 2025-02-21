

const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");


/**
 * BookReview.jsx
 */

exports.newBookReview = async (req, res) => {


    const token = req.headers.authorization.split(' ')[1];
    const {username, id} = jwtDecode(token);
    const {bookAuthor, body, bookTitle, bookPages, quote, reviewTitle} = req.body;

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
                    author_id: author.id
                }
            })
        }

        const review = await prisma.review.create({
            data: {
                published: true,
                title: reviewTitle,
                body: body,
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

        const userWithAdmin = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                Admin: true
            }
        })

        if (userWithAdmin) {
            const payload = {
                id: userWithAdmin.id,
                username: userWithAdmin.username,
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






