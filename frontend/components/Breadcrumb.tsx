'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6 overflow-x-auto" aria-label="Breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item.url} className="flex items-center gap-2 whitespace-nowrap">
                        {isLast ? (
                            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <>
                                <Link
                                    href={item.url}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {item.name}
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
