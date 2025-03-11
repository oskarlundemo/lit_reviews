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



import {prisma} from "../prisma/index.js";

/**
 * 1. This functions bans user for commenting on posts/book reviews. So their account is suspended for that functionality
 *
 * 2. The function expects a 'POST' request which is sent in the Activity.jsx page/component to the activityRoute.js route
 *
 * 3. 201: The user was successfully banned
 *    400: An error occurred (e.g invalid user ID or database issue)
 */



export const banUserCommenting = async (req, res) => {
    try {

        // Add the user_id from the req.body to the banned table
        await prisma.banned.create({
            data: {
                user_id: parseInt(req.body.user.id),
            }
        })

        // User successfully banned
        res.status(201).json({message: 'Banned user'});
    } catch (err) {

        // User banned unsuccessfully
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}




/**
 * 1. This functions unbans user for commenting on posts/book reviews. So their account can post comments again.
 *
 * 2. The function expects a 'POST' request which is sent in the Activity.jsx page/component to the activityRoute.js route
 *
 * 3. 201: The user was successfully unbanned
 *    400: An error occurred (e.g invalid user ID or database issue)
 */


export const unBanUserComments = async (req, res) => {
    try {

        // Delete the user_id in req.body from the banned table
        await prisma.banned.delete({
            where: {
                user_id: parseInt(req.body.user.id),
            }
        })
        // User was successfully removed from the banned list
        res.status(201).json({message: 'Unbanned user'});
    } catch (err) {
        // User was unsuccessfully removed from the banned list
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}


/**
 * 1. This function retrieves all the banned users to display them in the
 *
 * 2. The function expects a 'GET' request which is sent in the Activity.jsx page/component to the activityRoute.js
 *
 * 3. 201: A list or JSON-object of banned users is sent
 *    400: An error occurred (e.g invalid user ID or database issue)
 */

export const getBannedUsers = async (req, res) => {
    try {
        // Select all users from the banned table
        const bannedUsers = await prisma.banned.findMany({
            include: {
                user: true
            }
        })
        // A list of banned users
        res.status(201).json(bannedUsers);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Error banning user'});
    }
}




/**
 * 1. This function retrieves all the comments that is posted on the sight. Which provides the admin
 * with the possibility to fast filter and remove inappropriate ones
 *
 * 2. The function expects a 'GET' request which is sent in the Activity.jsx page/component to the commmentsRoute.js route
 *
 * 3. 201: A list or JSON-object of user comments
 *    400: An error occurred (database issue)
 */


export const getAllComments = async (req, res) => {
    try {

        // Find all the comments in the comment table
        const comments = await prisma.comment.findMany({
            include: {
                user: {
                    include: {
                        Banned: true
                    }
                }
            }
        })

        // Successfully retrieved all the comments and sent a list
        res.status(200).json(comments);
    } catch (err) {
        // Unsuccessfully retrieved comments, send error message to front-end
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}



/**
 * 1. This function lets the admin search through comments by either username or comment
 *
 * 2. The function expects a 'GET' request which is sent in the Activity.jsx page/component to the commmentsRoute.js route
 *
 * 3. 201: A JSON-object of filtered user comments
 *    400: An error occurred filtering the database (database issue)
 */


export const searchForComments = async (req, res) => {
    try {


        // Get the search query from the param
        const query = req.query.query;


        // Retrieve all comments where the username or comment equals the provided search query
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


        // Sends a list of comments that fit the provided search string
        res.status(200).json(results);
    } catch (err) {

        // Error filtering the comments, send the message to the front end
        console.error(err);
        res.status(400).json({error: err.message});
    }
}


