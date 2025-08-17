import RegisterUserForm from '@/app/dashboard/admins/form-register-user';
import EditUserBreadcrumb from '@/components/breadcrumbs/update-user-breadcrumb';
import prisma from '@/lib/prisma';
import { User } from '@/types';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface UserProps {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly role: string;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Update.Metadata');
  return {
    title: t('Title')
  };
};

export default async function Update({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id, deletedAt: null }, select: { id: true, name: true, email: true, role: true } });
    const t = await getTranslations('Update');
    return (
        <>
            <EditUserBreadcrumb user={user as User} />
            <div className="flex gap-4 rounded-xl p-4">
                <RegisterUserForm user={user as UserProps} isEdit={true} valueButton={t('ValueButton')} />
            </div>
        </>
    );
}