'use client';

import { LoaderCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, startTransition, useActionState, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/layouts/auth-layout';
import { forgotPassword } from '@/app/api/auth/forgotpassword';
import { useTranslations } from 'next-intl';

export default function ForgotPassword() {
    const t = useTranslations('ForgotPassword');
    const [state, action, pending] = useActionState(forgotPassword, undefined);
    const [data, setData] = useState<Required<{ email: string }>>({ email: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };
    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
    };
    return (
        <AuthLayout title={t('Title')} description={t('Description')}>
            {state?.message && <div className="mb-4 text-center text-sm font-medium text-blue-600">{t(state.message)}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('EmailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={handleChange}
                            placeholder={t('EmailPlaceholder')}
                            required
                        />
                        {state?.errors?.email && <InputError message={t(state.errors.email[0])} />}
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={pending}>
                            {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {t('Submit')}
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>{t('LinkSpan')}</span>
                    <TextLink href="/login">{t('LinkLogin')}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
