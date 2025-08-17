'use client';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User, type NavItem } from '@/types';
import { BookOpen, Folder, LayoutGrid, UserRoundCog, UserRoundPlus, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function AppSidebar({ user }: { user: User }) {
    const isAdmin = user.role === 'ADMIN';
    const t = useTranslations('AppSidebar');

    const mainNavItems: NavItem[] = [
        { title: t('Dashboard'), href: '/dashboard', icon: LayoutGrid, },
    ];
    const adminNavItems: NavItem[] = [
        { title: t('Administrators'), href: '/dashboard/admins', icon: UserRoundCog },
        { title: t('Users'), href: '/dashboard/admins/users', icon: UsersRound },
        { title: t('Register'), href: '/dashboard/admins/register', icon: UserRoundPlus },
    ];
    const footerNavItems: NavItem[] = [
        { title: t('Repository'), href: 'https://github.com/HumbertoFox/next-auth-start-kit', icon: Folder, },
        { title: t('Developer'), href: 'https://betofoxnet-info.vercel.app/', icon: BookOpen, },
    ];

    const navItems = isAdmin ? [...mainNavItems, ...adminNavItems] : mainNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
