'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Settings, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PreferencesPage() {
    const params = useParams();
    const [status, setStatus] = useState<'loading' | 'idle' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [preferences, setPreferences] = useState({
        weeklyNewsletter: true,
        productUpdates: true,
        marketInsights: true
    });

    useEffect(() => {
        // In a real implementation, you'd fetch current preferences
        // For now, we'll just set to idle after a brief delay
        setTimeout(() => setStatus('idle'), 500);
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers/${params.token}/preferences`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Preferences updated successfully!');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setMessage(data.error?.message || 'Failed to update preferences');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Email Preferences
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Choose what you'd like to receive from Moneage
                    </p>
                </div>

                {status === 'loading' && (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
                    </div>
                )}

                {(status === 'idle' || status === 'success' || status === 'error') && (
                    <>
                        {status === 'success' && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">{message}</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                                <XCircle className="w-5 h-5" />
                                <span className="text-sm">{message}</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.weeklyNewsletter}
                                    onChange={(e) => setPreferences({ ...preferences, weeklyNewsletter: e.target.checked })}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Weekly Newsletter</div>
                                    <div className="text-sm text-gray-600">
                                        Get our weekly roundup of financial insights and market trends
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.productUpdates}
                                    onChange={(e) => setPreferences({ ...preferences, productUpdates: e.target.checked })}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Product Updates</div>
                                    <div className="text-sm text-gray-600">
                                        New features, tools, and calculators
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.marketInsights}
                                    onChange={(e) => setPreferences({ ...preferences, marketInsights: e.target.checked })}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Market Insights</div>
                                    <div className="text-sm text-gray-600">
                                        Breaking news and important market updates
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleSave}
                                className="w-full bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                            >
                                Save Preferences
                            </button>
                            <Link
                                href="/"
                                className="block w-full text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Want to unsubscribe completely?{' '}
                            <Link href={`/unsubscribe/${params.token}`} className="text-red-600 hover:underline">
                                Click here
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
