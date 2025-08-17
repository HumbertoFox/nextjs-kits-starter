'use server';

import { createAdminSchema, FormStateCreateAdmin } from '@/lib/definitions';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/session';
import * as bcrypt from 'bcrypt-ts';

export async function createAdmin(state: FormStateCreateAdmin, formData: FormData): Promise<FormStateCreateAdmin> {
    const validatedFields = createAdminSchema.safeParse({
        name: formData.get('name') as string,
        email: (formData.get('email') as string)?.toLowerCase().trim(),
        password: formData.get('password') as string,
        password_confirmation: formData.get('password_confirmation') as string
    });

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findFirst({ where: { email } });

        if (existingUser) return { warning: 'WarningUserExisting' };

        const existingUserAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

        const role = existingUserAdmin ? 'USER' : 'ADMIN';

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({ data: { name, email, role, password: hashedPassword } });

        await createSession(user.id, user.role);

        return { message: true };
    } catch (error) {
        console.error(error);
        return { warning: 'Warning' };
    }
}