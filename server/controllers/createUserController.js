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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/**
 * 1. This function take a username as @param and checks either or not the username is already registered in the db.
 *  This is a helper function to the createUser function
 *
 * 2. The functions requires a string (username) as a parameter
 *
 * 3. Return true if the username does not exist else throw a new error displayed in the front-end
 */

export async function uniqueUsername(username) {
    try {

        // Does the parameter username exist in the user table
        const existingUsername = await prisma.user.findUnique({
            where: {username: username,}
        })

        // If the username already exists the send the error 'Already registered'
        if (existingUsername) {
            throw new Error(`Username already registered`)
        }

        // Not found so proceed with
        return true;

    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**
 * 1. This function take a email as @param and checks either or not the mail is already registered in the db.
 *  This is a helper function to the createUser function
 *
 * 2. The functions require a string (email) as a parameter
 *
 * 3. Return true if the email does not exist else throw a new error displayed in the front-end
 */

export async function uniqueEmail(email) {
    try {
        // Check if the email already exists in the user table
        const existingEmail = await prisma.user.findUnique({
            where: {email: email,}
        })

        // If it already exists, throw an error displayed in the front-end
        if (existingEmail) {
            throw new Error(`Email already registered`)
        }


        // Email is not registered in the system. proceed
        return true;
    } catch (err) {
        // Error with request to db
        console.error(err);
        throw err;
    }
}




/**
 * 1. This function is used to create a new user in the system.
 *
 * 2. The function retrieves the req and res sent from the front end
 *
 * 3. 200: User was successfully created and inserted into the back-end
 *    400: Error inserting the userdata into the db
 */

export const createUser = async (req, res) => {

    // Parse the username, email and password from the req.body
    const {username, email, password} = req.body;

    try {

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the hashed password, username and email into the user table
        const user = await prisma.user.create({
            data: {email: email,
                password: hashedPassword,
                username: username,
            }
        });


        // Create a new jwt token for the user
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h'
            })

        // User was successfully created and sends back the token to the front end
        res.status(200).json({ message: 'User created successfuly', token });
    } catch (error) {
        // There was an error entering the user to the database
        res.status(400).json({ error: error.message });
    }
};