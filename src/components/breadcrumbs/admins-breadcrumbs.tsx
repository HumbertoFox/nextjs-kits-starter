'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';

export default function AdminsBreadcrumbs() {
    const { setBreadcrumbs } = useBreadcrumbs();
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('Administrators'), href: '/dashboard/admins' },
        ]);
    }, [setBreadcrumbs, tb]);

    return null;
}