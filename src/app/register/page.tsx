import prisma from '@/lib/prisma';
import RegisterAdmin from './form-register-admin';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const isAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const t = await getTranslations('RegisterAdmin.Metadata');

  return {
    title: isAdmin ? t('TitleUser') : t('TitleAdmin')
  };
};

export default async function Register() {
  const isAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const Title = isAdmin ? 'TitleUser' : 'TitleAdmin';

  return <RegisterAdmin TitleIntl={Title} />;
}