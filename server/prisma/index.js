

const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();




exports.createUser = async (user, req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                username: user.username,
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
    }
};





