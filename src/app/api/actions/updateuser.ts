'use server';

import { getUser } from '@/lib/dal';
import { FormStateUserUpdate, updateUserSchema } from '@/lib/definitions';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import z from 'zod';
import { put, del } from '@vercel/blob';
import crypto from 'crypto';
import sharp from 'sharp';

const MAX_FILE_SIZE = 512 * 1024;
const MAX_DIMENSION = 512;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function updateUser(state: FormStateUserUpdate, formData: FormData): Promise<FormStateUserUpdate> {
    const validatedFields = updateUserSchema.safeParse({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
    });
    const file = formData.get('file') as File | null;

    if (!validatedFields.success) return { errors: z.flattenError(validatedFields.error).fieldErrors };

    const { name, email } = validatedFields.data;
    const sessionUser = await getUser();

    if (!sessionUser?.id) return redirect('/');

    const emailInUse = await prisma.user.findUnique({ where: { email } });

    if (emailInUse && emailInUse.id !== sessionUser.id) return { errors: { email: ['ErrorsZod.EmailAlreadyUse'] } };

    const dataToUpdate: { name?: string; email?: string, image?: string | null } = {};
    if (sessionUser.name !== name) dataToUpdate.name = name;
    if (sessionUser.email !== email) dataToUpdate.email = email;

    if (file && file.size > 0) {
        if (!ALLOWED_TYPES.includes(file.type)) return { errors: { image: ['TypeImage'] } };

        if (file.size > MAX_FILE_SIZE) return { errors: { image: ['SizeImage'] } };

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const metadata = await sharp(buffer).metadata();
            const { width, height } = metadata;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                return {
                    errors: { image: ['DimensionImage'] },
                    meta: { width, height },
                };
            };
        } catch {
            return { errors: { image: ['UplodeImageError'] } };
        }

        try {
            if (sessionUser.image) {
                try {
                    await del(sessionUser.image);
                } catch (deleteErr) {
                    console.warn('It was not possible to delete the previous image.', deleteErr);
                }
            }

            const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;
            const blob = await put(`avatars/${uniqueFileName}`, file, {
                access: 'public',
            });

            if (blob.url) {
                dataToUpdate.image = blob.url;
            }
        } catch (error) {
            console.error('Error sending image.:', error);
            return { errors: { image: ['UplodeImageError'] } };
        }
    }

    if (Object.keys(dataToUpdate).length === 0) return { message: 'No changes made.' };

    await prisma.user.update({ where: { id: sessionUser.id }, data: dataToUpdate });

    return { success: true };
}