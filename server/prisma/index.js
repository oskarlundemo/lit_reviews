

const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");
const { JSDOM } = require('jsdom');


const window = new JSDOM('').window;
const DOMPurify = require('dompurify');
const purify = DOMPurify(window);



const mime = require('mime-types');
const { createClient } = require('@supabase/supabase-js');

const fs = require('fs').promises;
const supabaseUrl = 'https://szbfcswimsizxxcbtbyx.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



/**
 * Posts.jsx
 */


exports.searchReviews = async (req, res) => {
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



exports.getReviews = async (req, res) => {
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


exports.deleteReview = async (req, res) => {
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


/**
 * WriteBookReview.jsx
 */


exports.newBookReview = async (req, res) => {
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



/**
 * CreateUser.jsx
 */


async function uniqueUsername(username) {
    try {
        const existingUsername = await prisma.user.findUnique({
            where: {username: username,}
        })
        if (existingUsername) {
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
 * Favorites.jsx
 */


exports.getFavorites = async (req, res) => {

    try {




    } catch (err) {
        console.error(err);
        res.status(404).json({message: 'Not Found'});
    }
}




/**
 * Home.jsx
 */



exports.getAllBookReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                Book: true
            }
        })
         res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(404).json({message: 'Not Found'});
    }

}


exports.latestBookReviews = async (req, res) => {
    try {
        const latestBooksReviews = await prisma.review.findMany({
            take: 3,
            where: {
                published: true
            },
            orderBy: {
                created: 'desc'
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
        const {id} = jwtDecode(token);
        await prisma.comment.create({
            data: {
                user_id: id,
                post_id: parseInt(req.params.id),
                comment: req.body.comment,
            }
        })

        res.status(201).json({ message: "Comment created"});
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
        res.status(201).json({message: 'Comment deleted'});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

exports.getAllLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({});
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}


exports.getLikes = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: {
                post_id: parseInt(req.params.postid),
            }
        });
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



exports.likePost = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {id} = jwtDecode(token);
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


/**
 * Activity.jsx
 */




exports.banUserCommenting = async (req, res) => {
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


exports.unBanUserComments = async (req, res) => {
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

exports.getBannedUsers = async (req, res) => {
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


exports.getAllComments = async (req, res) => {
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


exports.searchForComments = async (req, res) => {
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






/**
 * Supabase
 */


exports.saveFile = async (req, res) => {

    console.log(req.file);
    console.log(req.body);
    const { foldername, id } = req.params;

    const filePath = `books/${req.file.originalname}`;
    const fileMimeType = req.file.mimetype;

    try {
        const fileBlob = new Blob([req.file.buffer], { type: fileMimeType });

        const {data, error} = await supabase
            .storage
            .from('library')
            .upload(filePath, fileBlob, {
                contentType: fileMimeType,
                cacheControl: '3600',
                upsert: true,
            })

        if (error) {
            console.error("❌ Supabase Error:", error.message);
        }

    } catch (err) {
        console.error('Error uploading file:', err.message);
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
}


exports.downloadFileFromDB = async (req, res) => {

    try {
        const filePath = `books/test.jpg`;
        const { data, error } = await supabase
            .storage
            .from('library')
            .download(filePath);

        if (error) {
            console.error('Error downloading file:', error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileExtension = filePath.split('.').pop();
        const contentType = mime.lookup(fileExtension) || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        data.body.pipe(res);
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ error: e.message });
    }
}