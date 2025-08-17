import { Suspense } from 'react';
import LoginClient from './login-client';
import LoadingLoginSimple from '@/components/loadings/loading-login-simple';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('Login.Metadata');
    return {
        title: t('Title')
    };
};

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingLoginSimple />}>
            <LoginClient />
        </Suspense>
    );
}