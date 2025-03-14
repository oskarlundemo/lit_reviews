import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
 * 1. This function is used for verifying  the token
 *
 * 2. This function is a helper function
 *
 * 3. 401: Not authorized
 */


export const verifyToken = async (req, res, next) => {
    // Split the token rom the req.header
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
}


/**
 * 1. This function is used for login in user and assigning them a jwt
 *
 * 2. This function requires a 'POST' request in the Login.jsx handled in the loginRoute.js
 *
 * 3. 201: User credentials were correct adn then logged in
 *    402: Invalid user credentials
 *    500: Server error
 */






export const login = async (req, res) => {
    // Parse user credentials
    const {username, password} = req.body;

    try {
        // Try finding the username in the user table
        const user = await prisma.user.findUnique({
            where: {username: username},
        })

        // If the username was invalid, return error
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }


        // Username was found in the db, try matching the provided password with db using brypt
        const match = await bcrypt.compare(password, user.password)

        // If the password is incorrect the return error
        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Username and password correct, check if user has admin privileges in the admin table
        const userWithAdmin = await prisma.admin.findFirst({
            where: {
                user_id: user.id
            },
            include: {user: true}
        })

        // If user has admin privileges, then add it to the token
        if (userWithAdmin) {
            const payload = {
                id: userWithAdmin.user.id,
                username: userWithAdmin.user.username,
                admin: true
            }

            // Assign token
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Login succuesful
            return res.status(200).json({ message: 'Login successful', token});
        }

        // User is not admin but assign a normal token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Regular user signed in
        return res.status(200).json({ message: 'Login successful', token});
    } catch (err) {
        // Error logging in, display in UI
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
