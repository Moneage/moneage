"use client";

import { useState } from 'react';
import { Minus, Plus, Type } from 'lucide-react';

interface ArticleReaderProps {
    children: React.ReactNode;
}

export default function ArticleReader({ children }: ArticleReaderProps) {
    const [textSize, setTextSize] = useState<'prose-base' | 'prose-lg' | 'prose-xl'>('prose-lg');

    const handleDecrease = () => {
        if (textSize === 'prose-xl') setTextSize('prose-lg');
        else if (textSize === 'prose-lg') setTextSize('prose-base');
    };

    const handleIncrease = () => {
        if (textSize === 'prose-base') setTextSize('prose-lg');
        else if (textSize === 'prose-lg') setTextSize('prose-xl');
    };

    return (
        <div>
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Article Content
                </span>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={handleDecrease}
                        disabled={textSize === 'prose-base'}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Decrease text size"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 px-2 text-slate-400">
                        <Type className="w-4 h-4" />
                    </div>
                    <button
                        onClick={handleIncrease}
                        disabled={textSize === 'prose-xl'}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Increase text size"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Display */}
            <div className={`prose ${textSize} prose-slate max-w-none mb-16 transition-all duration-300`}>
                {children}
            </div>
        </div>
    );
}
