import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { TrendingUp } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = generateMeta({
    title: 'Recent Articles',
    description: 'Browse our latest financial insights, market analysis, and investment strategies. Stay updated with the most recent articles from Moneage.',
    keywords: ['recent articles', 'latest finance news', 'new financial insights'],
});

export default async function RecentsPage() {
    let articles: any[] = [];
    try {
        const data = await getArticles();
        articles = data?.data || [];
    } catch (error) {
        console.error("Failed to fetch articles", error);
    }

    // Sort by date (most recent first)
    const sortedArticles = [...articles].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-navy mb-2">Recent Articles</h1>
                <p className="text-lg text-slate-600">Our latest financial insights and market analysis</p>
            </div>

            {sortedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <TrendingUp className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Yet</h3>
                    <p className="text-slate-600">Check back soon for new content!</p>
                </div>
            )}
        </div>
    );
}
