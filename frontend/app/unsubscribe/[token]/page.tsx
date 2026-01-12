'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
    const params = useParams();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers/unsubscribe/${params.token}`,
                { method: 'POST' }
            );

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully unsubscribed');
            } else {
                setStatus('error');
                setMessage(data.error?.message || 'Unsubscribe failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {status === 'idle' && (
                    <>
                        <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-12 h-12 text-orange-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Unsubscribe from Moneage Newsletter
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry to see you go. Are you sure you want to unsubscribe from our newsletter?
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            You'll no longer receive financial insights, market analysis, and personal finance tips.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleUnsubscribe}
                                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Yes, Unsubscribe
                            </button>
                            <Link
                                href="/"
                                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                No, Keep Me Subscribed
                            </Link>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Unsubscribed Successfully
                        </h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-gray-600 mb-6">
                            You won't receive any more emails from us. You can resubscribe anytime from our homepage.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="inline-block bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                            >
                                Go to Homepage
                            </Link>
                            <p className="text-sm text-gray-500 mt-4">
                                Changed your mind? You can always <Link href="/" className="text-blue-600 hover:underline">subscribe again</Link>.
                            </p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Unsubscribe Failed
                        </h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="space-y-3">
                            <button
                                onClick={handleUnsubscribe}
                                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
