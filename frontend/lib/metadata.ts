import type { Metadata } from 'next';

interface GenerateMetadataParams {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
}

const SITE_NAME = 'Moneage';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export function generateMetadata({
    title,
    description,
    keywords = [],
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
}: GenerateMetadataParams): Metadata {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: [...keywords, 'finance', 'investing', 'market analysis', 'financial insights'],
        authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
            creator: '@finblog',
        },
    };

    // Add article-specific metadata
    if (type === 'article' && (publishedTime || modifiedTime)) {
        metadata.openGraph = {
            ...metadata.openGraph,
            type: 'article',
            publishedTime,
            modifiedTime,
            authors: author ? [author] : undefined,
        };
    }

    return metadata;
}

export const defaultMetadata: Metadata = generateMetadata({
    title: 'Moneage - Financial Insights',
    description: 'Your trusted source for expert financial analysis, market trends, and personal finance tips. Stay ahead of the market with Moneage.',
    keywords: ['finance blog', 'investment advice', 'market analysis', 'personal finance', 'economy news'],
});
