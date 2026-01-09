import { getArticleBySlug, getArticles, getArticlesByCategory } from '@/lib/api';
import { getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { generateArticleSchema, generateBreadcrumbSchema, generatePersonSchema } from '@/lib/schema';
import ArticleActions from '@/components/ArticleActions';

export const revalidate = 0;

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>
}

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    let article = null;

    try {
        article = await getArticleBySlug(slug);
    } catch (error) {
        console.error("Failed to fetch article for metadata", error);
    }

    if (!article) {
        return generateMeta({
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
        });
    }

    const imageUrl = article.coverImage?.url
        ? `http://localhost:1337${article.coverImage.url}`
        : undefined;

    return generateMeta({
        title: article.title,
        description: article.excerpt || article.title,
        keywords: article.category ? [article.category.name, 'finance', 'investing'] : ['finance'],
        image: imageUrl,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/articles/${article.slug}`,
        type: 'article',
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        author: article.author?.name,
    });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    let article = null;
    let recentArticles: any[] = [];
    let relatedArticles: any[] = [];

    try {
        article = await getArticleBySlug(slug);

        // Fetch recent articles
        const recentData = await getArticles({ pagination: { limit: 3 } });
        recentArticles = recentData?.data?.filter((a: any) => a.slug !== slug) || [];

        // Fetch related articles from same category
        if (article?.category?.slug) {
            const relatedData = await getArticlesByCategory(article.category.slug);
            relatedArticles = relatedData?.data?.filter((a: any) => a.slug !== slug).slice(0, 3) || [];
        }
    } catch (error) {
        console.error("Failed to fetch article", error);
    }

    if (!article) {
        notFound();
    }

    const imageUrl = getStrapiMedia(article.coverImage?.url || null);

    // Generate breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
    ];

    if (article.category) {
        breadcrumbItems.push({
            name: article.category.name,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/category/${article.category.slug}`,
        });
    }

    breadcrumbItems.push({
        name: article.title,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/articles/${article.slug}`,
    });

    return (
        <>
            {/* Structured Data */}
            <StructuredData data={generateArticleSchema({
                ...article,
                excerpt: article.excerpt || undefined,
                coverImage: article.coverImage || undefined,
                author: article.author || undefined,
            })} />
            <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
            {article.author && <StructuredData data={generatePersonSchema({
                ...article.author,
                bio: article.author.bio || undefined,
                avatar: article.author.avatar || undefined,
            })} />}

            <article className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
                    <a href="/" className="hover:text-blue-900 transition-colors">Home</a>
                    <span>/</span>
                    {article.category && (
                        <>
                            <a href={`/category/${article.category.slug}`} className="hover:text-blue-900 transition-colors capitalize">
                                {article.category.name}
                            </a>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-slate-400 truncate">{article.title}</span>
                </nav>

                {/* Header */}
                <header className="mb-10">
                    {article.category && (
                        <span className="badge-primary mb-4 inline-block capitalize">
                            {article.category.name}
                        </span>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-200">
                        {/* Author */}
                        {article.author && (
                            <div className="flex items-center gap-3">
                                {article.author.avatar?.url && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-200">
                                        <Image
                                            src={getStrapiMedia(article.author.avatar.url)!}
                                            alt={article.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900">{article.author.name}</p>
                                    {article.author.bio && (
                                        <p className="text-sm text-slate-500">{article.author.bio}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Date */}
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <time>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</time>
                        </div>

                        {/* Actions */}
                        <div className="ml-auto">
                            <ArticleActions
                                articleTitle={article.title}
                                articleUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/articles/${article.slug}`}
                                articleSlug={article.slug}
                            />
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {imageUrl && (
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <Image
                            src={imageUrl}
                            alt={article.coverImage?.alternativeText || article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none mb-16">
                    {article.content && Array.isArray(article.content) ? (
                        article.content.map((block: any, index: number) => {
                            if (block.type === 'paragraph') {
                                return (
                                    <p key={index} className="mb-6 text-slate-700 leading-relaxed text-lg">
                                        {block.children.map((child: any, childIndex: number) => {
                                            if (child.text) {
                                                let text = child.text;
                                                if (child.bold) return <strong key={childIndex} className="font-bold text-slate-900">{text}</strong>;
                                                if (child.italic) return <em key={childIndex}>{text}</em>;
                                                return <span key={childIndex}>{text}</span>;
                                            }
                                            return null;
                                        })}
                                    </p>
                                );
                            }
                            if (block.type === 'heading') {
                                const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                                const className = block.level === 2
                                    ? "text-3xl font-bold text-slate-900 mt-12 mb-6"
                                    : "text-2xl font-bold text-slate-900 mt-10 mb-4";
                                return (
                                    <Tag key={index} className={className}>
                                        {block.children.map((child: any) => child.text).join('')}
                                    </Tag>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <p className="text-slate-600">No content available.</p>
                    )}
                </div>

                {/* Author Bio */}
                {article.author && (
                    <div className="card p-8 bg-gradient-to-br from-slate-50 to-blue-50 border-blue-100">
                        <div className="flex items-start gap-4">
                            {article.author.avatar?.url && (
                                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg flex-shrink-0">
                                    <Image
                                        src={getStrapiMedia(article.author.avatar.url)!}
                                        alt={article.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">About {article.author.name}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {article.author.bio || 'Financial expert and analyst with years of experience in market research and investment strategies.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </article>

            {/* Related and Recent Articles */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Related Articles from Same Category */}
                {relatedArticles.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-navy mb-6 pb-3 border-b border-slate-200">
                            More from {article.category?.name}
                        </h2>
                        <div className="space-y-4">
                            {relatedArticles.map((relatedArticle: any) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/articles/${relatedArticle.slug}`}
                                    className="group block"
                                >
                                    <article className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                        {relatedArticle.coverImage?.url && (
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={getStrapiMedia(relatedArticle.coverImage.url)!}
                                                    alt={relatedArticle.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-900 transition-colors mb-2">
                                                {relatedArticle.title}
                                            </h3>
                                            {relatedArticle.excerpt && (
                                                <p className="text-xs text-slate-600 line-clamp-2">
                                                    {relatedArticle.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Articles */}
                {recentArticles.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-navy mb-6 pb-3 border-b border-slate-200">
                            Recent Articles
                        </h2>
                        <div className="space-y-4">
                            {recentArticles.map((recentArticle: any) => (
                                <Link
                                    key={recentArticle.id}
                                    href={`/articles/${recentArticle.slug}`}
                                    className="group block"
                                >
                                    <article className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                        {recentArticle.coverImage?.url && (
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={getStrapiMedia(recentArticle.coverImage.url)!}
                                                    alt={recentArticle.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-900 transition-colors mb-2">
                                                {recentArticle.title}
                                            </h3>
                                            {recentArticle.excerpt && (
                                                <p className="text-xs text-slate-600 line-clamp-2">
                                                    {recentArticle.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
