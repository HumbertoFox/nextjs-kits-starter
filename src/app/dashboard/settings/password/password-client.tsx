'use client';

import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { Eye, EyeClosed } from 'lucide-react';
import { updatePassword } from '@/app/api/actions/updatepassword';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';

export default function PasswordPageClient() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const t = useTranslations('Password');
    const tb = useTranslations('Breadcrumb');
    const { setBreadcrumbs } = useBreadcrumbs();
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
    const [recentlySuccessful, setrecentlySuccessful] = useState<boolean>(false);
    const [state, action, pending] = useActionState(updatePassword, undefined);
    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };
    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
    };

    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('PasswordSettings'), href: '/dashboard/settings/password' }
        ]);
    }, [setBreadcrumbs, tb]);
    useEffect(() => {
        if (state?.message) setrecentlySuccessful(true);
    }, [state]);
    return (
        <>
            <div className="space-y-6">
                <HeadingSmall title={t("Title")} description={t('Description')} />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="current_password">{t('PasswordCurrentLabel')}</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                name="current_password"
                                tabIndex={1}
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={handleChange}
                                type={showOldPassword ? "text" : "password"}
                                className="block w-full"
                                autoComplete="current-password"
                                placeholder={t('PasswordCurrentPlaceholder')}
                                required
                            />
                            <button
                                type="button"
                                className='absolute right-2 top-[6px] opacity-30 hover:opacity-100 duration-300 cursor-pointer'
                                onClick={toggleShowOldPassword}
                            >
                                {showOldPassword ? <Icon iconNode={Eye} /> : <Icon iconNode={EyeClosed} />}
                            </button>
                        </div>
                        {state?.errors?.current_password && <InputError message={t(state.errors.current_password[0])} />}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('PasswordNewLabel')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                tabIndex={2}
                                ref={passwordInput}
                                value={data.password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                className="block w-full"
                                autoComplete="new-password"
                                placeholder={t('PasswordNewPlaceholder')}
                                required
                            />
                            <button
                                type="button"
                                className='absolute right-2 top-[6px] opacity-30 hover:opacity-100 duration-300 cursor-pointer'
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <Icon iconNode={Eye} /> : <Icon iconNode={EyeClosed} />}
                            </button>
                        </div>
                        {state?.errors?.password && <InputError message={t(state.errors.password[0])} />}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">{t('ConfirmPasswordLabel')}</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                tabIndex={3}
                                value={data.password_confirmation}
                                onChange={handleChange}
                                type={showPasswordConfirm ? "text" : "password"}
                                className="block w-full"
                                autoComplete="new-password"
                                placeholder={t('ConfirmPasswordPlaceholder')}
                                required
                            />
                            <button
                                type="button"
                                className='absolute right-2 top-[6px] opacity-30 hover:opacity-100 duration-300 cursor-pointer'
                                onClick={toggleShowPasswordConfirm}
                            >
                                {showPasswordConfirm ? <Icon iconNode={Eye} /> : <Icon iconNode={EyeClosed} />}
                            </button>
                        </div>
                        {state?.errors?.password_confirmation && <InputError message={t(state.errors.password_confirmation[0])} />}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={pending}>{t('Submit')}</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">{t('Saved')}</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </>
    );
}
