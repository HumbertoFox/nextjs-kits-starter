export type HandleImageChangeResult = {
    file: File | null;
    preview: string | null;
    error: string | null;
    meta?: {
        width?: number;
        height?: number;
    };
};

export async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): Promise<HandleImageChangeResult> {
    const file = e.target.files?.[0];
    if (!file) return { file: null, preview: null, error: null };

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return { file: null, preview: null, error: 'TypeImage' };
    }

    if (file.size > 512 * 1024) {
        return { file: null, preview: null, error: 'SizeImage' };
    }

    try {
        const imageBitmap = await createImageBitmap(file);
        const { width, height } = imageBitmap;

        if (width > 512 || height > 512) {
            return {
                file: null,
                preview: null,
                error: 'DimensionImage',
                meta: { width, height },
            };
        }
    } catch {
        return { file: null, preview: null, error: 'UploadImageError' };
    }

    return {
        file,
        preview: URL.createObjectURL(file),
        error: null,
    };
}