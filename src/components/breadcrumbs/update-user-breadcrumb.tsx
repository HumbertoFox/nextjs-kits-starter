'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { type User } from '@/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function UpdateUserBreadcrumb({ user }: { user: User }) {
    const router = useRouter();
    const { setBreadcrumbs } = useBreadcrumbs();
    const tb = useTranslations('Breadcrumb');
    useEffect(() => {
        if (user) {
            const base = [
                { title: tb('Dashboard'), href: '/dashboard' },
                { title: tb('Administrators'), href: '/dashboard/admins' },
            ];

            const nameOrDefault = user?.name ? `${tb('Update')} ${user.name}` : tb('UpdateUser');
            const updateCrumb = { title: nameOrDefault, href: `/dashboard/admins/update/${user.id}` };

            const crumbs =
                user.role === 'USER'
                    ? [...base, { title: tb('Users'), href: '/dashboard/admins/users' }, updateCrumb]
                    : [...base, updateCrumb];

            setBreadcrumbs(crumbs);
        }
        router.back();
    }, [setBreadcrumbs, user, tb]);

    return null;
}