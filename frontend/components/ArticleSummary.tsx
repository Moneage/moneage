'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface ArticleSummaryProps {
    title: string;
    content: string;
    excerpt?: string;
}

interface Summary {
    tldr: string;
    metaDescription: string;
    keywords: string[];
    cached?: boolean;
}

export default function ArticleSummary({ title, content, excerpt }: ArticleSummaryProps) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const response = await fetch('/api/generate-summary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        excerpt,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate summary');
                }

                const data = await response.json();
                setSummary(data);
            } catch (err) {
                console.error('Summary error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, [title, content, excerpt]);

    if (loading) {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-slate-600">Generating AI summary...</span>
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return null; // Don't show anything if there's an error
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">TL;DR</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    AI Summary
                </span>
                {summary.cached && (
                    <span className="text-xs text-slate-500 ml-auto">
                        Cached
                    </span>
                )}
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
                {summary.tldr}
            </p>
            {summary.keywords && summary.keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {summary.keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="text-xs bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
