'use client';

import { PortfolioMetrics } from '@/lib/portfolio/types';
import { formatCurrency, formatPercentage } from '@/lib/portfolio/calculations';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface PortfolioSummaryProps {
    metrics: PortfolioMetrics;
}

export default function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
    const isProfit = metrics.totalProfitLoss >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Investment */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
                    <DollarSign className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.totalInvestment)}
                </p>
            </div>

            {/* Current Value */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
                    <PieChart className="text-purple-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.currentValue)}
                </p>
            </div>

            {/* Total Profit/Loss */}
            <div className={`bg-white rounded-lg shadow-md p-6 ${isProfit ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Total Profit/Loss</h3>
                    {isProfit ? (
                        <TrendingUp className="text-green-500" size={20} />
                    ) : (
                        <TrendingDown className="text-red-500" size={20} />
                    )}
                </div>
                <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.totalProfitLoss)}
                </p>
                <p className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.totalProfitLossPercentage)}
                </p>
            </div>

            {/* Holdings Count */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Total Holdings</h3>
                    <TrendingUp className="text-indigo-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {metrics.holdingsCount}
                </p>
                <p className="text-sm text-gray-500">
                    {metrics.holdingsCount === 1 ? 'Stock' : 'Stocks'}
                </p>
            </div>
        </div>
    );
}
