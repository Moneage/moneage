import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMeta({
    title: 'Privacy Policy',
    description: 'Read Moneage\'s Privacy Policy to understand how we collect, use, and protect your personal information when you visit our website.',
    keywords: ['privacy policy', 'data protection', 'user privacy'],
});

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-navy mb-4">Privacy Policy</h1>
                <p className="text-slate-600">Last updated: January 9, 2026</p>
            </div>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Introduction</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Moneage ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                        how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Information We Collect</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may collect information about you in a variety of ways. The information we may collect includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Personal Data: Name, email address, and contact information you provide</li>
                        <li>Usage Data: Information about how you use our website</li>
                        <li>Cookies and Tracking Technologies: We use cookies to enhance your experience</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">How We Use Your Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our services</li>
                        <li>Send you newsletters and marketing communications (with your consent)</li>
                        <li>Respond to your comments and questions</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-navy mb-4">Data Security</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We use administrative, technical, and physical security measures to protect your personal information.
                        However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-navy mb-4">Contact Us</h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have questions about this Privacy Policy, please contact us at privacy@finblog.com
                    </p>
                </section>
            </div>
        </div>
    );
}
