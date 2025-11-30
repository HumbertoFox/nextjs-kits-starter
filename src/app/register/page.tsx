import RegisterAdmin from './form-register-admin';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getIsAdmin } from '@/lib/getisadmin';

export const generateMetadata = async (): Promise<Metadata> => {
  const isAdmin = await getIsAdmin();
  const t = await getTranslations('RegisterAdmin.Metadata');

  return {
    title: isAdmin ? t('TitleUser') : t('TitleAdmin')
  };
};

export default async function Register() {
  const isAdmin = await getIsAdmin();
  const Title = isAdmin ? 'TitleUser' : 'TitleAdmin';

  return <RegisterAdmin TitleIntl={Title} />;
}