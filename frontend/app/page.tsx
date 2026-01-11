import { getArticles } from '@/lib/api';
import HeroArticle from '@/components/HeroArticle';
import MarketTicker from '@/components/MarketTicker';
import SidebarArticleCard from '@/components/SidebarArticleCard';
import ArticleCard from '@/components/ArticleCard';
import AdUnit from '@/components/AdUnit';
import { TrendingUp } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const revalidate = 300; // Revalidate every 5 minutes

export const metadata: Metadata = generateMeta({
  title: 'Moneage - Financial Insights & Market Analysis',
  description: 'Stay ahead of the market with expert financial analysis, investment strategies, and personal finance tips. Your trusted source for financial insights.',
  keywords: ['finance blog', 'investment advice', 'market analysis', 'personal finance', 'economy news', 'financial insights'],
});

export default async function Home() {
  let articles: any[] = [];
  let error: string | null = null;

  try {
    const data = await getArticles();
    console.log('Homepage - Articles data:', JSON.stringify(data, null, 2));
    articles = data?.data || [];
    console.log('Homepage - Articles count:', articles.length);
  } catch (err) {
    console.error("Failed to fetch articles", err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  // Split articles for different sections
  const heroArticle = articles[0];
  const sidebarArticles = articles.slice(1, 4);
  const gridArticles = articles.slice(4);

  return (
    <div className="space-y-12">
      <MarketTicker />

      {/* Debug info - remove after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p><strong>Debug:</strong> Articles count: {articles.length}</p>
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      )}

      {articles.length > 0 ? (
        <>
          {/* Hero Section with Sidebar */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Hero Article - 2/3 width */}
            <div className="lg:col-span-2">
              {heroArticle && <HeroArticle article={heroArticle} />}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <AdUnit placement="sidebar_top" className="mb-6" />
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-navy mb-4 pb-3 border-b border-slate-200">
                  Latest Articles
                </h2>
                <div className="space-y-4">
                  {sidebarArticles.map((article) => (
                    <SidebarArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Latest Articles Grid */}
          {gridArticles.length > 0 && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-navy mb-2">More Articles</h2>
                <p className="text-slate-600">Explore our latest financial insights and analysis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Yet</h3>
          <p className="text-slate-600 mb-6">Start creating content in your Strapi admin panel.</p>
          {error && <p className="text-red-600 text-sm mb-4">Error: {error}</p>}
          <a href={process.env.NEXT_PUBLIC_STRAPI_URL + '/admin'} target="_blank" rel="noopener noreferrer" className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg inline-block">
            Go to Admin Panel
          </a>
        </div>
      )}
    </div>
  );
}
