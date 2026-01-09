import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMeta({
    title: 'About Us',
    description: 'Learn about Moneage - your trusted source for expert financial analysis, market insights, and personal finance tips. Discover our mission and what we cover.',
    keywords: ['about finblog', 'financial blog', 'finance experts', 'market analysis team'],
});

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-navy mb-4">About Moneage</h1>
                <p className="text-lg text-slate-600">Your trusted source for financial insights and market analysis</p>
            </div>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Moneage is dedicated to providing expert financial analysis, market insights, and personal finance tips
                        to help you make informed decisions about your money and investments.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                        We believe that everyone deserves access to high-quality financial information, regardless of their
                        background or experience level. Our team of financial experts works tirelessly to bring you the latest
                        news, trends, and actionable advice.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">What We Cover</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-navy mb-2">Investing</h3>
                            <p className="text-slate-600">Stock market analysis, investment strategies, and portfolio management tips.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-navy mb-2">Personal Finance</h3>
                            <p className="text-slate-600">Budgeting, saving, debt management, and financial planning advice.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-navy mb-2">Economy</h3>
                            <p className="text-slate-600">Economic trends, policy analysis, and market forecasts.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-navy mb-2">Market News</h3>
                            <p className="text-slate-600">Breaking financial news and real-time market updates.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-navy mb-4">Our Team</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Our team consists of experienced financial analysts, certified financial planners, and industry experts
                        who bring years of knowledge and expertise to every article we publish.
                    </p>
                </section>
            </div>
        </div>
    );
}
