import { getCategoryBySlug, getArticlesByCategory } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { notFound } from 'next/navigation';
import { Folder, TrendingUp } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const revalidate = 300; // Revalidate every 5 minutes

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>
}

// Generate dynamic metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    let category = null;
    let articleCount = 0;

    try {
        const categoryData = await getCategoryBySlug(slug);
        category = categoryData;

        if (category) {
            const articlesData = await getArticlesByCategory(slug);
            articleCount = articlesData?.data?.length || 0;
        }
    } catch (error) {
        console.error("Failed to fetch category for metadata", error);
    }

    if (!category) {
        return generateMeta({
            title: 'Category Not Found',
            description: 'The requested category could not be found.',
        });
    }

    return generateMeta({
        title: `${category.name} - Financial Insights`,
        description: category.description || `Browse ${articleCount} articles about ${category.name}. Expert analysis and insights on ${category.name} topics.`,
        keywords: [category.name, 'finance', 'investing', 'market analysis'],
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/category/${category.slug}`,
    });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    let category = null;
    let articles: any[] = [];

    try {
        const categoryData = await getCategoryBySlug(slug);
        category = categoryData;

        if (category) {
            const articlesData = await getArticlesByCategory(slug);
            articles = articlesData?.data || [];
        }
    } catch (error) {
        console.error("Failed to fetch category data", error);
    }

    if (!category) {
        notFound();
    }

    // Generate breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
        {
            name: category.name,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/category/${category.slug}`
        },
    ];

    return (
        <>
            {/* Structured Data */}
            <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />

            <div className="space-y-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-600">
                    <a href="/" className="hover:text-blue-900 transition-colors">Home</a>
                    <span>/</span>
                    <span className="text-slate-400 capitalize">{category.name}</span>
                </nav>

                {/* Header */}
                <header className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 -z-10 rounded-2xl" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/20 to-transparent -z-10" />

                    <div className="text-center py-16 px-4">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Folder className="w-10 h-10 text-blue-900" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4 capitalize">
                            {category.name}
                        </h1>

                        {category.description && (
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                {category.description}
                            </p>
                        )}

                        <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-sm">
                            <TrendingUp className="w-4 h-4 text-blue-900" />
                            <span>{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}</span>
                        </div>
                    </div>
                </header>

                {/* Articles Grid */}
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article: any) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Folder className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Yet</h3>
                        <p className="text-slate-600 mb-6">This category doesn't have any published articles yet.</p>
                        <a href="/" className="btn-primary inline-block">
                            Browse All Articles
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
