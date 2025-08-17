'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeadingSmall from '@/components/heading-small';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Eye, EyeClosed } from 'lucide-react';
import { deleteUser } from '@/app/api/actions/deleteuser';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function DeleteUser() {
    const router = useRouter();
    const passwordInput = useRef<HTMLInputElement>(null);
    const t = useTranslations('DeleteUser');
    const [state, action, pending] = useActionState(deleteUser, undefined);
    const [showPassword, setshowPassword] = useState<boolean>(false);
    const [data, setData] = useState<{ password: string }>({ password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };
    const toggleShowPassword = () => setshowPassword(!showPassword);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', data.password);
        startTransition(() => action(formData));
    };
    const handleClose = () => setData({ password: '' });

    useEffect(() => {
        if (state?.message) {
            router.push('/logout');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return (
        <div className="space-y-6">
            <HeadingSmall title={t('Title')} description={t('Description')} />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{t('Warning')}</p>
                    <p className="text-sm">{t('WarningDescription')}</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t('DialogButton')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{t('DialogTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('DialogDescription')}
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">{t('PasswordLabel')}</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder={t("PasswordPlaceholder")}
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

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={handleClose}>
                                        {t('DialogButtonCancel')}
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" type="submit" disabled={pending} aria-busy={pending}>
                                    {t('DialogButtonSubmit')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
