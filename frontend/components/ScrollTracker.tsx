'use client';

import { useEffect, useRef } from 'react';
import { trackArticleRead, trackArticleComplete } from '@/lib/analytics';

interface ScrollTrackerProps {
    articleTitle: string;
}

export default function ScrollTracker({ articleTitle }: ScrollTrackerProps) {
    const hasTracked50 = useRef(false);
    const hasTracked90 = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

            // Track 50% scroll
            if (scrollPercentage >= 50 && !hasTracked50.current) {
                hasTracked50.current = true;
                trackArticleRead(articleTitle, 50);
            }

            // Track 90% scroll (article complete)
            if (scrollPercentage >= 90 && !hasTracked90.current) {
                hasTracked90.current = true;
                trackArticleComplete(articleTitle);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [articleTitle]);

    return null; // This component doesn't render anything
}
