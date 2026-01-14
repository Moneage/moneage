// Google Analytics 4 Event Tracking Utility

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    }
};

// Article engagement events
export const trackArticleView = (articleTitle: string, category?: string) => {
    trackEvent('article_view', {
        article_title: articleTitle,
        category: category || 'uncategorized',
    });
};

export const trackArticleRead = (articleTitle: string, scrollDepth: number) => {
    trackEvent('article_read', {
        article_title: articleTitle,
        scroll_depth: scrollDepth,
    });
};

export const trackArticleComplete = (articleTitle: string) => {
    trackEvent('article_complete', {
        article_title: articleTitle,
    });
};

// Calculator events
export const trackCalculatorUse = (calculatorType: string, action: string) => {
    trackEvent('calculator_use', {
        calculator_type: calculatorType,
        action: action,
    });
};

// Social share events
export const trackSocialShare = (platform: string, articleTitle: string) => {
    trackEvent('share', {
        method: platform,
        content_type: 'article',
        item_id: articleTitle,
    });
};

// Newsletter events
export const trackNewsletterSignup = (source: string) => {
    trackEvent('newsletter_signup', {
        source: source,
    });
};

// Search events
export const trackSearch = (searchTerm: string) => {
    trackEvent('search', {
        search_term: searchTerm,
    });
};
