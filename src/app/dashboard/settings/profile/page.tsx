import { getUser } from '@/lib/dal';
import ProfilePageClient from './profile-client';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('Profile.Metadata');
    return {
        title: t('Title')
    };
};

export default async function Profile() {
    const user = await getUser();
    if (!user) return null;
    return (
        <ProfilePageClient name={user.name} email={user.email} mustVerifyEmail={!user.emailVerified} />
    );
}