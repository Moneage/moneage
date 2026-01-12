'use client';

import NewsletterForm from '@/components/NewsletterForm';
import { Mail } from 'lucide-react';

export default function ArticleNewsletterCTA() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 my-12 border border-blue-100">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3">
                    Enjoyed this article?
                </h3>
                <p className="text-slate-600 mb-6">
                    Subscribe to get more financial insights and market analysis delivered to your inbox weekly.
                </p>
                <NewsletterForm />
                <p className="text-xs text-slate-500 mt-4">
                    No spam. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
}
