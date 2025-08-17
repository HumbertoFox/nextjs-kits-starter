'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';

export default function UsersBreadcrumb() {
    const { setBreadcrumbs } = useBreadcrumbs();
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('Administrators'), href: '/dashboard/admins' },
            { title: tb('Users'), href: '/dashboard/admins/users' }
        ]);
    }, [setBreadcrumbs, tb]);

    return null;
}