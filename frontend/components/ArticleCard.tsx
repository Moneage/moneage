import Link from 'next/link';
import Image from 'next/image';
import { User, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import type { Article } from '@/types';
import { getStrapiMedia } from '@/lib/api';
import { format } from 'date-fns';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const imageUrl = getStrapiMedia(article.coverImage?.url || null);

    return (
        <Link href={`/articles/${article.slug}`} className="group block h-full">
            <article className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 h-full flex flex-col overflow-hidden">
                {/* Image */}
                <div className="aspect-[16/10] relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={article.coverImage?.alternativeText || article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-slate-400 text-center">
                                <TrendingUp className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No Image</p>
                            </div>
                        </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-500">
                        {article.category && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 capitalize">
                                {article.category.name}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 mb-3 line-clamp-2 transition-colors">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                        {article.excerpt || 'Read more to discover insights...'}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            {article.author?.avatar?.url && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-100">
                                    <Image
                                        src={getStrapiMedia(article.author.avatar.url)!}
                                        alt={article.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <span className="text-sm font-medium text-slate-700">
                                {article.author?.name || 'Anonymous'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-blue-900 font-semibold text-sm group-hover:gap-2 transition-all">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
