'use client';

import Link from 'next/link';
import { TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Search query:', searchQuery);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-4">
                {/* Top Bar with Logo and Search */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-navy p-2.5 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-navy">Moneage</h1>
                            <p className="text-xs text-slate-500 -mt-1">Financial Insights</p>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Subscribe Button */}
                    <div className="hidden lg:block">
                        <button className="bg-navy text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 py-3 overflow-x-auto">
                    <Link
                        href="/"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Home
                    </Link>
                    <Link
                        href="/category/investing"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Investing
                    </Link>
                    <Link
                        href="/category/personal-finance"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Personal Finance
                    </Link>
                    <Link
                        href="/category/economy"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Economy
                    </Link>
                    <Link
                        href="/category/technology"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Technology
                    </Link>
                    <Link
                        href="/category/money"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Money
                    </Link>
                    <Link
                        href="/recents"
                        className="px-4 py-2 text-slate-700 hover:text-navy font-medium rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        Recents
                    </Link>
                </div>
            </div>
        </nav>
    );
}
