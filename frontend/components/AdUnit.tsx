"use client";

import { useEffect, useState } from 'react';
import { getAds } from '@/lib/api';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface AdUnitProps {
    placement: 'sidebar_top' | 'article_bottom' | 'banner_top';
    className?: string;
}

export default function AdUnit({ placement, className = '' }: AdUnitProps) {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        async function fetchAd() {
            const data = await getAds(placement);
            setAd(data);
        }
        fetchAd();
    }, [placement]);

    if (!ad) return null;

    if (ad.type === 'code' && ad.codeSnippet) {
        return (
            <div
                className={`ad-unit ad-${placement} ${className}`}
                dangerouslySetInnerHTML={{ __html: ad.codeSnippet }}
            />
        );
    }

    if (ad.type === 'image' && ad.image?.url) {
        const imageUrl = getStrapiMedia(ad.image.url);
        if (!imageUrl) return null;

        const Content = (
            <div className={`relative w-full overflow-hidden rounded-lg shadow-sm ${placement === 'sidebar_top' ? 'aspect-square' : 'aspect-[4/1]'}`}>
                <Image
                    src={imageUrl}
                    alt={ad.title || 'Advertisement'}
                    fill
                    className="object-cover"
                />
                <span className="absolute top-0 right-0 bg-slate-200 text-[10px] px-1 text-slate-500">Ad</span>
            </div>
        );

        if (ad.destinationUrl) {
            return (
                <a href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className={`block ${className}`}>
                    {Content}
                </a>
            );
        }

        return <div className={className}>{Content}</div>;
    }

    return null;
}
