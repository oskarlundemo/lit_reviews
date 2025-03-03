




import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$on('query', (e) => {
    console.log(`Query: ${e.query}`);
});

export { prisma };