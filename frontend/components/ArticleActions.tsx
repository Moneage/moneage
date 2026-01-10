'use client';

import { useState, useEffect } from 'react';
import { Share2, Bookmark, Check, Link as LinkIcon, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ArticleActionsProps {
    articleTitle: string;
    articleUrl: string;
    articleSlug: string;
}

export default function ArticleActions({ articleTitle, articleUrl, articleSlug }: ArticleActionsProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [copied, setCopied] = useState(false);

    // Check if article is bookmarked on mount (client-side only)
    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('moneage_bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(articleSlug));
    }, [articleSlug]);

    const handleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('moneage_bookmarks') || '[]');

        if (isBookmarked) {
            // Remove bookmark
            const updated = bookmarks.filter((slug: string) => slug !== articleSlug);
            localStorage.setItem('moneage_bookmarks', JSON.stringify(updated));
            setIsBookmarked(false);
        } else {
            // Add bookmark
            bookmarks.push(articleSlug);
            localStorage.setItem('moneage_bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(articleUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    };

    return (
        <div className="flex items-center gap-3">
            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group"
                title="Copy Link"
            >
                {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                ) : (
                    <LinkIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
                )}
            </button>

            {/* Social Links */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-sky-50 rounded-full transition-colors group"
                title="Share on X (Twitter)"
            >
                <Twitter className="w-5 h-5 text-slate-500 group-hover:text-sky-500" />
            </a>

            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-blue-50 rounded-full transition-colors group"
                title="Share on Facebook"
            >
                <Facebook className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
            </a>

            <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-blue-50 rounded-full transition-colors group"
                title="Share on LinkedIn"
            >
                <Linkedin className="w-5 h-5 text-slate-500 group-hover:text-blue-700" />
            </a>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* Bookmark Button */}
            <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${isBookmarked
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'hover:bg-slate-100'
                    }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
                <Bookmark
                    className={`w-5 h-5 ${isBookmarked
                        ? 'text-blue-900 fill-blue-900'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                />
            </button>
        </div>
    );
}
