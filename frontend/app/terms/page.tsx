import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMeta({
    title: 'Terms of Service',
    description: 'Read Moneage\'s Terms of Service to understand the rules and regulations for using our website and services.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement'],
});

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-navy mb-4">Terms of Service</h1>
                <p className="text-slate-600">Last updated: January 9, 2026</p>
            </div>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Agreement to Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        By accessing and using Moneage, you accept and agree to be bound by the terms and provisions of this
                        agreement. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Use License</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Permission is granted to temporarily access the materials on Moneage for personal, non-commercial use only.
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose</li>
                        <li>Attempt to decompile or reverse engineer any software</li>
                        <li>Remove any copyright or proprietary notations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Disclaimer</h2>
                    <p className="text-slate-700 leading-relaxed">
                        The materials on Moneage are provided on an 'as is' basis. Moneage makes no warranties, expressed or
                        implied, and hereby disclaims all other warranties including, without limitation, implied warranties or
                        conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Financial Advice Disclaimer</h2>
                    <p className="text-slate-700 leading-relaxed">
                        The content on Moneage is for informational purposes only and should not be considered financial advice.
                        Always consult with a qualified financial advisor before making investment decisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Limitations</h2>
                    <p className="text-slate-700 leading-relaxed">
                        In no event shall Moneage or its suppliers be liable for any damages arising out of the use or inability
                        to use the materials on Moneage's website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-navy mb-4">Contact</h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have any questions about these Terms, please contact us at legal@finblog.com
                    </p>
                </section>
            </div>
        </div>
    );
}
