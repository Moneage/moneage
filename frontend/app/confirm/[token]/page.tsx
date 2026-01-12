'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmEmailPage() {
    const params = useParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers/confirm/${params.token}`,
                    { method: 'POST' }
                );

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email confirmed successfully!');
                } else {
                    setStatus('error');
                    setMessage(data.error?.message || 'Confirmation failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred. Please try again.');
            }
        };

        if (params.token) {
            confirmEmail();
        }
    }, [params.token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Confirming your email...
                        </h1>
                        <p className="text-gray-600">Please wait a moment</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Email Confirmed!
                        </h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-gray-600 mb-6">
                            You're all set! You'll now receive our financial insights and market analysis directly in your inbox.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                        >
                            Go to Homepage
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Confirmation Failed
                        </h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                                Go to Homepage
                            </Link>
                            <p className="text-sm text-gray-500">
                                Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
