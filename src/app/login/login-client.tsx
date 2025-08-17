'use client';

import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/layouts/auth-layout';
import { Icon } from '@/components/ui/icon';
import { loginUser } from '@/app/api/actions/loginuser';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type LoginForm = {
    email: string;
    password: string;
};

export default function Login() {
    const searchParams = useSearchParams();
    const t = useTranslations('Login');
    const [status, setStatus] = useState<string | boolean>(false);
    const canResetPassword = !status;
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [state, action, pending] = useActionState(loginUser, undefined);
    const [isVisibledPassword, setIsVisibledPassword] = useState<boolean>(false);
    const [data, setData] = useState<LoginForm>({ email: '', password: '' });

    const togglePasswordVisibility = () => setIsVisibledPassword(!isVisibledPassword);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
    };

    useEffect(() => {
        const statusFromParams = searchParams.get('status');
        const emailFromParams = searchParams.get('email');

        if (emailFromParams) {
            setData((prevData) => ({ ...prevData, email: emailFromParams }));
            passwordRef?.current?.focus();
        };

        if (statusFromParams) {
            setStatus(statusFromParams);
            const timer = setTimeout(() => setStatus(true), 5000);
            return () => clearTimeout(timer);
        };
    }, [searchParams]);
    useEffect(() => {
        if (state?.message) {
            setData({ email: '', password: '' });
            router.push('/dashboard');
        };
        if (state?.warning && emailRef.current) {
            emailRef.current.focus();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return (
        <AuthLayout title={t('Title')} description={t('Description')}>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('EmailLabel')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            ref={emailRef}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder={t('EmailPlaceholder')}
                        />
                        {state?.errors?.email && <InputError message={t(state.errors.email[0])} />}
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">{t('PasswordLabel')}</Label>
                            {canResetPassword && (
                                <TextLink href="/auth/forgot-password" className="ml-auto text-sm" tabIndex={5}>
                                    {t('Forgot')}
                                </TextLink>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={isVisibledPassword ? "text" : "password"}
                                ref={passwordRef}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder={t('PasswordPlaceholder')}
                            />
                            <button
                                type="button"
                                className='absolute right-2 top-[6px] opacity-30 hover:opacity-100 duration-300 cursor-pointer'
                                onClick={togglePasswordVisibility}
                            >
                                {isVisibledPassword ? <Icon iconNode={Eye} /> : <Icon iconNode={EyeClosed} />}
                            </button>
                        </div>
                        {state?.errors?.password && <InputError message={t(state.errors.password[0])} />}
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={pending}>
                        {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('Submit')}
                    </Button>

                    <div className="text-muted-foreground text-center text-sm">
                        {t('TextLink')}
                        <TextLink href="/register" tabIndex={6}>
                            {t('LinkCreateAccount')}
                        </TextLink>
                    </div>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-blue-600">{status}</div>}
            {state?.message && <div className="mb-4 text-center text-sm font-medium text-blue-600">{t(state.message)}</div>}
            {state?.warning && <div className="mb-4 text-center text-sm font-medium text-red-400">{t(state.warning)}</div>}
        </AuthLayout>
    );
}
