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
        <div className="flex items-center gap-2">
            {/* Share Button */}
            <div className="relative">
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Share"
                >
                    <Share2 className="w-5 h-5 text-slate-600" />
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                        <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 text-sm"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Link copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="w-4 h-4 text-slate-600" />
                                    <span>Copy link</span>
                                </>
                            )}
                        </button>

                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-sm"
                        >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span>Share on Facebook</span>
                        </a>

                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-sm"
                        >
                            <Twitter className="w-4 h-4 text-sky-500" />
                            <span>Share on X</span>
                        </a>

                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-sm"
                        >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            <span>Share on LinkedIn</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Bookmark Button */}
            <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${isBookmarked
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'hover:bg-slate-100'
                    }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
                <Bookmark
                    className={`w-5 h-5 ${isBookmarked
                        ? 'text-blue-900 fill-blue-900'
                        : 'text-slate-600'
                        }`}
                />
            </button>
        </div>
    );
}
