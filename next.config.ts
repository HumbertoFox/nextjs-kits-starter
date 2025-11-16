import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dq47ivujyw249lvb.public.blob.vercel-storage.com',
                pathname: '/avatars/**',
            },
        ],
    },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);