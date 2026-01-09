import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

interface SidebarArticleCardProps {
    article: Article;
}

export default function SidebarArticleCard({ article }: SidebarArticleCardProps) {
    const imageUrl = article.coverImage?.url
        ? `http://localhost:1337${article.coverImage.url}`
        : null;

    return (
        <Link href={`/articles/${article.slug}`} className="group block">
            <article className="flex gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                {/* Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-slate-400 text-xs">No image</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Category */}
                    {article.category && (
                        <span className="inline-block text-xs font-semibold text-blue-900 uppercase mb-1">
                            {article.category.name}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-900 transition-colors">
                        {article.title}
                    </h3>
                </div>
            </article>
        </Link>
    );
}
