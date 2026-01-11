import { MetadataRoute } from 'next';
import { getArticles, getCategories } from '@/lib/api';

// Always use production URL for sitemap
const SITE_URL = 'https://moneage.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemap: MetadataRoute.Sitemap = [];

    // Homepage
    sitemap.push({
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
    });

    // Static pages
    const staticPages = [
        { path: '/about', priority: 0.8 },
        { path: '/contact', priority: 0.8 },
        { path: '/privacy', priority: 0.5 },
        { path: '/terms', priority: 0.5 },
        { path: '/recents', priority: 0.9 },
        { path: '/tools', priority: 0.7 },
        { path: '/tools/sip-calculator', priority: 0.6 },
        { path: '/tools/emi-calculator', priority: 0.6 },
        { path: '/tools/roi-calculator', priority: 0.6 },
        { path: '/tools/compound-interest-calculator', priority: 0.6 },
        { path: '/tools/portfolio', priority: 0.6 },
        { path: '/tools/screener', priority: 0.7 },
    ];

    staticPages.forEach(({ path, priority }) => {
        sitemap.push({
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority,
        });
    });

    // Fetch and add all articles
    try {
        const articlesData = await getArticles();
        const articles = articlesData?.data || [];

        articles.forEach((article: any) => {
            sitemap.push({
                url: `${SITE_URL}/articles/${article.slug}`,
                lastModified: new Date(article.updatedAt),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    // Fetch and add all categories
    try {
        const categoriesData = await getCategories();
        const categories = categoriesData?.data || [];

        categories.forEach((category: any) => {
            sitemap.push({
                url: `${SITE_URL}/category/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    return sitemap;
}
