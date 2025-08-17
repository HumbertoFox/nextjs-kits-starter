import { Metadata } from 'next';
import PasswordPageClient from './password-client';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('Password.Metadata');
    return {
        title: t('Title')
    };
};

export default function Password() {
    return <PasswordPageClient />;
}