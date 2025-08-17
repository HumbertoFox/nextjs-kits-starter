import RegisterUserForm from '@/app/dashboard/admins/form-register-user';
import RegisterUserBreadcrumb from '@/components/breadcrumbs/register-user-breadcrumb';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('RegisterUserPage.Metadata');
  return {
    title: t('Title')
  };
};

export default async function RegisterUserPage() {
    const t = await getTranslations('RegisterUserPage');
    return (
        <>
            <RegisterUserBreadcrumb />
            <div className="flex gap-4 rounded-xl p-4">
                <RegisterUserForm valueButton={t('ValueButton')} />
            </div>
        </>
    );
}