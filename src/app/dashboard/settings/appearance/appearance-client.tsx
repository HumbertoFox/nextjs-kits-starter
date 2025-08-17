'use client';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function AppearancePageClient() {
    const { setBreadcrumbs } = useBreadcrumbs();
    const t = useTranslations('Appearance');
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('AppearanceSettings'), href: '/dashboard/settings/appearance' }
        ]);
    }, [setBreadcrumbs, tb]);
    return (
        <>
            <div className="space-y-6">
                <HeadingSmall title={t('Title')} description={t('Description')} />
                <AppearanceTabs />
            </div>
        </>
    );
}