'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Check, Link as LinkIcon } from 'lucide-react';
import { FaXTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa6';

interface ArticleActionsProps {
    articleTitle: string;
    articleUrl: string;
    articleSlug: string;
}

export default function ArticleActions({ articleTitle, articleUrl, articleSlug }: ArticleActionsProps) {
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
                className="p-2.5 hover:bg-slate-100 rounded-full transition-colors relative group border border-slate-200"
                title="Copy Link"
            >
                {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                ) : (
                    <LinkIcon className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                )}
            </button>

            {/* Social Links - Official Colors */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-black hover:bg-slate-800 text-white rounded-full transition-colors group shadow-sm"
                title="Share on X"
            >
                <FaXTwitter className="w-5 h-5" />
            </a>

            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full transition-colors group shadow-sm"
                title="Share on Facebook"
            >
                <FaFacebook className="w-5 h-5" />
            </a>

            <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0A66C2] hover:bg-[#095eb3] text-white rounded-full transition-colors group shadow-sm"
                title="Share on LinkedIn"
            >
                <FaLinkedin className="w-5 h-5" />
            </a>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 mx-2"></div>

            {/* Bookmark Button */}
            <button
                onClick={handleBookmark}
                className={`p-2.5 rounded-full transition-colors border ${isBookmarked
                    ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
                <Bookmark
                    className={`w-5 h-5 ${isBookmarked
                        ? 'text-yellow-600 fill-yellow-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                />
            </button>
        </div>
    );
}
