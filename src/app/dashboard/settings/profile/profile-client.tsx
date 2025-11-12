'use client';

import { Transition } from '@headlessui/react';
import { startTransition, useActionState, useEffect, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser } from '@/app/api/actions/updateuser';
import { emailVerifiedChecked } from '@/app/api/actions/emailverified';
import { useRouter } from 'next/navigation';
import { useBreadcrumbs } from '@/context/breadcrumb-context';
import { useTranslations } from 'next-intl';
import { handleImageChange } from '@/lib/handleimagechange';
import Image from 'next/image';

type ProfileForm = {
    name: string;
    email: string;
    image?: string | null;
};

type Props = ProfileForm & {
    mustVerifyEmail: boolean;
};

export default function ProfilePageClient({ name, email, image, mustVerifyEmail }: Props) {
    const router = useRouter();
    const t = useTranslations('ProfilePageClient');
    const tb = useTranslations('Breadcrumb');
    const { setBreadcrumbs } = useBreadcrumbs();
    const [state, action, pending] = useActionState(updateUser, undefined);
    const [status, setStatus] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(image ?? null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [recentlySuccessful, setRecentlySuccessful] = useState<boolean>(false);
    const [data, setData] = useState<ProfileForm>({
        name: name,
        email: email,
        image: image,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };
    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { file, preview, error } = await handleImageChange(e);
        setImageFile(file);
        setImagePreview(preview);
        setImageError(error);
    };
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (imageError) return;
        const formData = new FormData(e.currentTarget);
        if (imageFile) formData.append('file', imageFile);
        startTransition(() => action(formData));
    };
    const handleVerifildEmail = async () => {
        const result = await emailVerifiedChecked();
        setStatus(result);
        if (result === 'verification-link-sent') {
            setTimeout(() => router.push('/logout'), 3000);
        }
    };

    useEffect(() => {
        setBreadcrumbs([
            { title: tb('Dashboard'), href: '/dashboard' },
            { title: tb('Profile'), href: '/dashboard/settings/profile' }
        ]);
    }, [setBreadcrumbs, tb]);
    useEffect(() => {
        if (state?.success) {
            setRecentlySuccessful(true);
            router.refresh();
            setTimeout(() => setRecentlySuccessful(false), 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return (
        <>
            <div className="space-y-6">
                <HeadingSmall title={t('Title')} description={t('Description')} />

                <form onSubmit={submit} className="space-y-6">
                    <div className="flex flex-col-reverse justify-between lg:flex-row gap-6">
                        <div className="flex flex-col flex-1 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('NameLabel')}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    tabIndex={2}
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    placeholder={t('NamePlaceholder')}
                                    className="mt-1 block w-full"
                                />
                                {state?.errors?.name?.[0] && <InputError message={t(state.errors.name[0])} />}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('EmailLabel')}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    tabIndex={3}
                                    value={data.email ?? ""}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder={t('EmailPlaceholder')}
                                    className="mt-1 block w-full"
                                />
                                {state?.errors?.email?.[0] && <InputError message={t(state.errors.email[0])} />}
                            </div>

                            {mustVerifyEmail && (
                                <div>
                                    <p className="text-muted-foreground -mt-4 text-sm">
                                        {t('TextParagrafPrimary')}&nbsp;&nbsp;
                                        <button
                                            type="button"
                                            tabIndex={4}
                                            onClick={handleVerifildEmail}
                                            className="text-foreground underline decoration-neutral-300 cursor-pointer underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            {t('Submit')}
                                        </button>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            {t('TextParagrafSecond')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2 text-center">
                            <Label htmlFor="file">{t('ProfilePictureLabel')}</Label>
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative size-40 rounded-full overflow-hidden border border-gray-300">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt={t('ImageAlt')}
                                            width={512}
                                            height={512}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gray-50">
                                            {t('NoImage')}
                                        </div>
                                    )}
                                </div>

                                <Label
                                    htmlFor="file"
                                    title={imageError ? t('TitleSelectImageError') : t('TitleSelectImage')}
                                    className="cursor-pointer px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                                >
                                    {t('ImageLabel')}
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    tabIndex={1}
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={onImageChange}
                                    disabled={pending}
                                    className="hidden"
                                />
                                {imageError && <InputError message={imageError} />}
                                {state?.errors?.image?.[0] && <InputError message={state.errors.image[0]} />}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button tabIndex={5} disabled={pending || Boolean(imageError)}>{t('ButtonSave')}</Button>

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

            <DeleteUser />
        </>
    );
}
