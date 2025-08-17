'use client';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguagePageClient() {
    const { setBreadcrumbs } = useBreadcrumbs();
    const t = useTranslations('Language');
    const tb = useTranslations('Breadcrumb');
    const [locale, setLocale] = useState<string>();
    const router = useRouter();
    const changeLocale = (newLocale: string) => {
        setLocale(newLocale);
        document.cookie = `nextLocale=${newLocale};`;
        router.refresh();
    }
    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('LanguageSettings'), href: '/dashboard/settings/language' }
        ]);
    }, [setBreadcrumbs, tb]);
    useEffect(() => {
        const coockieLocale = document.cookie
            .split('; ')
            .find((row) => row.startsWith('nextLocale='))
            ?.split('=')[1];
        if (coockieLocale) {
            setLocale(coockieLocale);
        } else {
            const browserLocale = navigator.language.slice(0, 2);
            setLocale(browserLocale);
            document.cookie = `nextLocale=${browserLocale};`;
            router.refresh();
        }
    }, [router]);
    return (
        <>
            <div className="space-y-6">
                <HeadingSmall title={t('Title')} description={t('Description')} />
                <div className="space-x-4">
                    <Button title={t('TitleButtonEn')} disabled={locale === 'en'} onClick={() => changeLocale('en')}>
                        <Languages />
                        EN
                    </Button>
                    <Button title={t('TitleButtonPt')} disabled={locale === 'pt'} onClick={() => changeLocale('pt')}>
                        <Languages />
                        PT
                    </Button>
                </div>
            </div>
        </>
    );
}