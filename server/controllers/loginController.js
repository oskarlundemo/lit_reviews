import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
}



export const login = async (req, res) => {
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
