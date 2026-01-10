import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { getStrapiMedia } from '@/lib/api';
import type { Article } from '@/types';

interface HeroArticleProps {
    article: Article;
}

export default function HeroArticle({ article }: HeroArticleProps) {
    const imageUrl = getStrapiMedia(article.coverImage?.url || null);

    return (
        <Link href={`/articles/${article.slug}`} className="group block">
            <article className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                {/* Cover Image */}
                <div className="aspect-[16/9] relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 100vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-slate-400 text-sm">No image</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Category Badge */}
                    {article.category && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 mb-3 uppercase">
                            {article.category.name}
                        </span>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-900 transition-colors">
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-slate-600 text-lg mb-4 line-clamp-2">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{article.author.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
