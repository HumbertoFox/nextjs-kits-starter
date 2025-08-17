import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { BreadcrumbProvider } from '@/context/breadcrumb-context';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Layout.Metadata');
  return {
    title: t('Title'),
    description: t('Description'),
  };
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <BreadcrumbProvider>
              {children}
            </BreadcrumbProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}