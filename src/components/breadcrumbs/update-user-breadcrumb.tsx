'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { type User } from '@/types';
import { useTranslations } from 'next-intl';

export default function UpdateUserBreadcrumb({ user }: { user: User }) {
    const { setBreadcrumbs } = useBreadcrumbs();
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('Administrators'), href: '/dashboard/admins' },
            { title: user?.name ? `${tb('Update')} ${user.name}` : tb('UpdateUser'), href: `/dashboard/admins/update/${user.id}` }
        ]);
    }, [setBreadcrumbs, user, tb]);

    return null;
}