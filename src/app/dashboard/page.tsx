import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardPageClient from './dashboard-client';
import { getUser } from '@/lib/dal';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Dashboard.Metadata');
  return {
    title: t('Title')
  };
};

export default async function Dashboard() {
    const sessionUser = await getUser();
    const user = await prisma.user.findUnique({ where: { id: sessionUser?.id } });
    if (!sessionUser?.id || !user?.id) redirect('/login');
    return <DashboardPageClient />;
}