'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Sparkles, Activity, DollarSign } from 'lucide-react';
import MiniChart from '@/components/MiniChart';

interface MarketIndex {
    value: string;
    change: string;
    changePercent: string;
    chartData?: Array<{ date: string; value: number }>;
}

interface Stock {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
}

interface Sector {
    symbol: string;
    name: string;
    changePercent: string;
}

interface Commodity {
    symbol: string;
    name: string;
    value: string;
    change: string;
    changePercent: string;
}

interface MarketData {
    indices: {
        sp500: MarketIndex;
        dow: MarketIndex;
        nasdaq: MarketIndex;
        vix: MarketIndex;
    };
    sectors: Sector[];
    commodities: Commodity[];
    topGainers: Stock[];
    topLosers: Stock[];
    aiSummary: string;
    yfinanceSummary: string;
    lastUpdated: string;
    cached?: boolean;
}

export default function MarketSummaryPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const response = await fetch('/api/market-summary');
            if (!response.ok) throw new Error('Failed to fetch market data');
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError('Unable to load market data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-12 bg-slate-200 rounded w-1/3 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="h-48 bg-slate-200 rounded-xl mb-8"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchData}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Market Summary
                        </h1>
                        <p className="text-slate-600">
                            Last updated: {formatTime(data.lastUpdated)}
                            {data.cached && <span className="ml-2 text-sm text-slate-500">(Cached)</span>}
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Major Indices + VIX */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <IndexCard name="S&P 500" symbol="^GSPC" data={data.indices.sp500} />
                    <IndexCard name="Dow Jones" symbol="^DJI" data={data.indices.dow} />
                    <IndexCard name="Nasdaq" symbol="^IXIC" data={data.indices.nasdaq} />
                    <IndexCard name="VIX (Fear)" symbol="^VIX" data={data.indices.vix} isVix={true} />
                </div>

                {/* Sector Performance */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-900">Sector Performance</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {data.sectors.map((sector) => (
                            <SectorCard key={sector.symbol} sector={sector} />
                        ))}
                    </div>
                </div>

                {/* Commodities */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                        <h2 className="text-2xl font-bold text-slate-900">Commodities & Crypto</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.commodities.map((commodity) => (
                            <CommodityCard key={commodity.symbol} commodity={commodity} />
                        ))}
                    </div>
                </div>

                {/* Market Summaries - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* AI Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-900">AI Analysis</h2>
                            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                Gemini 2.0
                            </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            {data.aiSummary}
                        </p>
                    </div>

                    {/* Yahoo Finance Summary */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-bold text-slate-900">Market Summary</h2>
                            <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                Yahoo Finance
                            </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            {data.yfinanceSummary}
                        </p>
                    </div>
                </div>

                {/* Top Movers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MoversCard title="Top Gainers" stocks={data.topGainers} type="gainers" />
                    <MoversCard title="Top Losers" stocks={data.topLosers} type="losers" />
                </div>
            </div>
        </div>
    );
}

function IndexCard({ name, symbol, data, isVix = false }: { name: string; symbol: string; data: MarketIndex; isVix?: boolean }) {
    const isPositive = parseFloat(data.change) >= 0;
    // For VIX, lower is better (inverse)
    const colorClass = isVix
        ? (isPositive ? 'text-red-600' : 'text-green-600')
        : (isPositive ? 'text-green-600' : 'text-red-600');

    const chartColor = isVix
        ? (isPositive ? '#dc2626' : '#16a34a')
        : (isPositive ? '#16a34a' : '#dc2626');

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                    <p className="text-sm text-slate-500">{symbol}</p>
                </div>
                {isPositive ? (
                    <TrendingUp className={`w-6 h-6 ${colorClass}`} />
                ) : (
                    <TrendingDown className={`w-6 h-6 ${colorClass}`} />
                )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
                {parseFloat(data.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-2 ${colorClass} mb-3`}>
                <span className="font-semibold">
                    {isPositive ? '+' : ''}{data.change}
                </span>
                <span className="text-sm">
                    ({isPositive ? '+' : ''}{data.changePercent}%)
                </span>
            </div>

            {/* 5-Day Chart */}
            {data.chartData && data.chartData.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-500 mb-1">5-Day Trend</p>
                    <MiniChart
                        data={data.chartData}
                        color={chartColor}
                        isPositive={!isVix ? isPositive : !isPositive}
                    />
                </div>
            )}
        </div>
    );
}

function SectorCard({ sector }: { sector: Sector }) {
    const isPositive = parseFloat(sector.changePercent) >= 0;

    return (
        <div className={`p-3 rounded-lg border-2 ${isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="text-xs font-medium text-slate-600 mb-1">{sector.name}</div>
            <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{sector.changePercent}%
            </div>
        </div>
    );
}

function CommodityCard({ commodity }: { commodity: Commodity }) {
    const isPositive = parseFloat(commodity.change) >= 0;

    return (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-slate-900">{commodity.name}</h3>
                    <p className="text-xs text-slate-500">{commodity.symbol}</p>
                </div>
                {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                )}
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
                ${parseFloat(commodity.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-semibold">
                    {isPositive ? '+' : ''}{commodity.change}
                </span>
                <span>
                    ({isPositive ? '+' : ''}{commodity.changePercent}%)
                </span>
            </div>
        </div>
    );
}

function MoversCard({ title, stocks, type }: { title: string; stocks: Stock[]; type: 'gainers' | 'losers' }) {
    const isGainers = type === 'gainers';

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                {isGainers ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                )}
                {title}
            </h2>
            <div className="space-y-3">
                {stocks.map((stock, index) => (
                    <div
                        key={stock.symbol}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                                <span className="font-semibold text-slate-900">{stock.symbol}</span>
                            </div>
                            <p className="text-sm text-slate-600 truncate">{stock.name}</p>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-slate-900">${stock.price}</div>
                            <div className={`text-sm font-medium ${isGainers ? 'text-green-600' : 'text-red-600'}`}>
                                {isGainers ? '+' : ''}{stock.changePercent}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
