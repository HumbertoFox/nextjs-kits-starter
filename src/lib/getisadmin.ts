import prisma from '@/lib/prisma';

export async function getIsAdmin() {
    const count = await prisma.user.count({
        where: { role: 'ADMIN' }
    });

    return count > 0;
}