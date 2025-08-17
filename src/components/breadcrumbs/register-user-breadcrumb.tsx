'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';

export default function RegisterUserBreadcrumb() {
    const { setBreadcrumbs } = useBreadcrumbs();
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('Administrators'), href: '/dashboard/admins' },
            { title: tb('Register'), href: '/dashboard/admins/register' }
        ]);
    }, [setBreadcrumbs, tb]);

    return null;
}