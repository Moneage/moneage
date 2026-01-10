import { getArticles, searchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { Search } from 'lucide-react';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';

    // Fetch articles based on query
    let articles: any[] = [];
    if (query) {
        try {
            const data = await searchArticles(query);
            articles = data?.data || [];
        } catch (error) {
            console.error("Failed to search articles", error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy mb-4">
                    Search Results
                </h1>
                {query ? (
                    <p className="text-slate-600">
                        Found {articles.length} result{articles.length !== 1 ? 's' : ''} for <span className="font-semibold">"{query}"</span>
                    </p>
                ) : (
                    <p className="text-slate-600">Please enter a search term.</p>
                )}
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : query ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found</h3>
                    <p className="text-slate-600">Try adjusting your search terms or browse our categories.</p>
                </div>
            ) : null}
        </div>
    );
}
