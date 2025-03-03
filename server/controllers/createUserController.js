import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



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

export const createUser = async (req, res) => {
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