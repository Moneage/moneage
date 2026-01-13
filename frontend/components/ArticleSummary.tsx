'use client';

import { Sparkles } from 'lucide-react';

interface ArticleSummaryProps {
    storedSummary?: {
        tldr: string;
        metaDescription: string;
        keywords: string[];
    } | null;
}

interface Summary {
    tldr: string;
    metaDescription: string;
    keywords: string[];
}

export default function ArticleSummary({ storedSummary }: ArticleSummaryProps) {
    // If no stored summary, don't display anything
    if (!storedSummary || !storedSummary.tldr) {
        return null;
    }

    const summary: Summary = storedSummary;

    return (
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 mb-8 shadow-lg overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-full blur-2xl -z-10"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900">Quick Summary</h3>
                        <p className="text-xs text-slate-600">AI-generated • Powered by Gemini</p>
                    </div>
                </div>

                {/* Summary Text */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 mb-4 border border-amber-200/50">
                    <p className="text-slate-800 leading-relaxed text-lg font-medium">
                        {summary.tldr}
                    </p>
                </div>

                {/* Keywords */}
                {summary.keywords && summary.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-slate-600 self-center">Topics:</span>
                        {summary.keywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="text-xs bg-white/80 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200 font-medium hover:bg-amber-100 transition-colors"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
