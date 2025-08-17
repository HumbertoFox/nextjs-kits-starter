import { getTranslations } from 'next-intl/server';
import LanguagePageClient from './language-client';
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('Language.Metadata');
    return {
        title: t('Title')
    };
};

export default function Language() {
    return <LanguagePageClient />;
}