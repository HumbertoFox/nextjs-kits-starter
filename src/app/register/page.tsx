import RegisterAdmin from './form-register-admin';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('RegisterAdmin.Metadata');
  return {
    title: t('Title')
  };
};
export default async function Register() {
    return <RegisterAdmin />;
}