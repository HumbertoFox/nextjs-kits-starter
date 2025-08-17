'use client';

import { LoaderCircle } from 'lucide-react';
import { FormEvent, startTransition, useActionState, useEffect, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/layouts/auth-layout';
import { handleEmailVerification } from '@/app/api/auth/handleemailverification';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

type FormProps = {
    email: string;
    token: string;
}

export default function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const t = useTranslations('VerifyEmail');
    const [state, action, pending] = useActionState(handleEmailVerification, undefined);
    const [data, setData] = useState<Required<FormProps>>({ email: '', token: '' });
    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
    };
    useEffect(() => {
        const emailFromParams = searchParams.get('email');
        const tokenFromParams = searchParams.get('token');
        if (emailFromParams && tokenFromParams) {
            setData((prevData) => ({ ...prevData, email: emailFromParams, token: tokenFromParams }));
            const formData = new FormData();
            formData.append('email', emailFromParams);
            formData.append('token', tokenFromParams);
            startTransition(() => action(formData));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);
    return (
        <AuthLayout title={t('Title')} description={t('Description')}>
            {state?.status === "verification-link-sent" && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    <p>{t('TextParagraf')}</p>
                </div>
            )}

            {state?.success && <div className="mb-4 text-center text-sm font-medium text-blue-600">{t(state.success)}</div>}
            {state?.error && <div className="mb-4 text-center text-sm font-medium text-red-600">{t(state.error)}</div>}

            <form onSubmit={submit} className="space-y-6 text-center">
                <input type="hidden" name="email" value={data.email} />
                <input type="hidden" name="token" value={data.token} />
                <Button disabled={pending || state?.status === 'verification-email-sent' || state?.error !== ''} variant="secondary">
                    {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {t('Submit')}
                </Button>

                <TextLink href={!state?.status ? "/login" : "/login?status=email verified"} className="mx-auto block text-sm">
                    {t('LinkLogin')}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
