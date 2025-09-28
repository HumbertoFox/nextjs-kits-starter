import { getTranslations } from 'next-intl/server';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    const t = await getTranslations('ResetPasswordClient');
    await transporter.sendMail({
        from: `'next-kits-starter' <${process.env.SMTP_USER}>`,
        to,
        subject: `${t('SubjectPassword')}`,
        html: `
        <p>${t('ParagrafPasswordOne')}</p>
        <p>${t('ParagrafPasswordTwo')}</p>
        <a href='${resetLink}'>${resetLink}</a>
        <p>${t('ParagrafPasswordThree')}</p>
        `,
    });
};

export const sendEmailVerification = async (to: string, link: string) => {
    const t = await getTranslations('VerifyEmail');
    await transporter.sendMail({
        from: `'next-kits-starter' <${process.env.SMTP_USER}>`,
        to,
        subject: `${t('SubjectEmail')}`,
        html: `
        <h2>${t('TextH2EmailOne')}</h2>
        <p>${t('ParagrafEmailOne')}</p>
        <a href='${link}'>${link}</a>
        <p>${t('ParagrafEmailTwo')}</p>
        `,
    });
};