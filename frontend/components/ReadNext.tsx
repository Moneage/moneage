"use client";

import { getStrapiMedia } from '@/lib/api';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Article {
    slug: string;
    title: string;
    excerpt?: string;
    category?: {
        name: string;
        slug: string;
    };
    coverImage?: {
        url: string;
    }
}

interface ReadNextProps {
    articles: Article[];
}

export default function ReadNext({ articles }: ReadNextProps) {
    if (!articles || articles.length === 0) return null;

    // Take just the first one for a big prominence, or up to 2
    const featured = articles[0];

    return (
        <div className="my-16 border-t border-b border-slate-200 py-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Read Next</h3>
                <Link href={`/category/${featured.category?.slug}`} className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 group">
                    More in {featured.category?.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <Link href={`/articles/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-6 items-center bg-slate-50 hover:bg-white border boundary-transparent hover:border-slate-200 hover:shadow-lg rounded-2xl p-6 transition-all duration-300">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                        {featured.coverImage?.url ? (
                            <Image
                                src={getStrapiMedia(featured.coverImage.url)!}
                                alt={featured.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <div>
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2 block">
                            Recommended For You
                        </span>
                        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-800 transition-colors leading-tight">
                            {featured.title}
                        </h4>
                        <p className="text-slate-600 line-clamp-3 mb-4">
                            {featured.excerpt || "Dive deeper into this topic with our detailed analysis and expert insights."}
                        </p>
                        <span className="inline-flex items-center font-semibold text-slate-900 group-hover:underline decoration-blue-500 underline-offset-4">
                            Continue Reading
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
