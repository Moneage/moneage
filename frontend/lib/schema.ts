const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Moneage';

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: 'Your trusted source for expert financial analysis, market trends, and personal finance tips.',
        sameAs: [
            'https://twitter.com/finblog',
            'https://linkedin.com/company/finblog',
            'https://facebook.com/finblog',
        ],
    };
}

export function generateArticleSchema(article: {
    title: string;
    excerpt?: string;
    coverImage?: { url: string };
    author?: { name: string };
    publishedAt: string;
    updatedAt: string;
    slug: string;
}) {
    const imageUrl = article.coverImage?.url
        ? `http://localhost:1337${article.coverImage.url}`
        : `${SITE_URL}/og-image.jpg`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt || article.title,
        image: imageUrl,
        author: {
            '@type': 'Person',
            name: article.author?.name || 'Moneage Team',
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
            },
        },
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/articles/${article.slug}`,
        },
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Your trusted source for expert financial analysis, market trends, and personal finance tips.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generatePersonSchema(author: {
    name: string;
    bio?: string;
    avatar?: { url: string };
}) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.name,
    };

    if (author.bio) {
        schema.description = author.bio;
    }

    if (author.avatar?.url) {
        schema.image = `http://localhost:1337${author.avatar.url}`;
    }

    return schema;
}
