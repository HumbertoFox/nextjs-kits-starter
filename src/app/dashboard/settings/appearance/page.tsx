import { getTranslations } from 'next-intl/server';
import AppearancePageClient from './appearance-client';
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('Appearance.Metadata');
    return {
        title: t('Title')
    };
};

export default function Appearance() {
    return <AppearancePageClient />;
}