import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
