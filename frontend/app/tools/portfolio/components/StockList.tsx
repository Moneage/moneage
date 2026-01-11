'use client';

import { StockHolding } from '@/lib/portfolio/types';
import {
    calculateInvestment,
    calculateCurrentValue,
    calculateProfitLoss,
    formatCurrency,
    formatPercentage,
} from '@/lib/portfolio/calculations';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { deleteHolding } from '@/lib/portfolio/portfolioStorage';

interface StockListProps {
    holdings: StockHolding[];
    onUpdate: () => void;
}

export default function StockList({ holdings, onUpdate }: StockListProps) {
    const handleDelete = (id: string, symbol: string) => {
        if (confirm(`Are you sure you want to delete ${symbol} from your portfolio?`)) {
            deleteHolding(id);
            onUpdate();
        }
    };

    if (holdings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                    <TrendingUp size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No stocks in your portfolio yet
                </h3>
                <p className="text-gray-500">
                    Click "Add Stock" to start tracking your investments
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Buy Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Investment
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Value
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Profit/Loss
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {holdings.map((holding) => {
                            const investment = calculateInvestment(holding);
                            const currentValue = calculateCurrentValue(holding);
                            const profitLoss = calculateProfitLoss(holding);
                            const isProfit = profitLoss.amount >= 0;

                            return (
                                <tr key={holding.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-semibold text-gray-900">{holding.symbol}</div>
                                            <div className="text-sm text-gray-500">{holding.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900">
                                        {holding.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900">
                                        {formatCurrency(holding.buyPrice)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900">
                                        {holding.currentPrice ? formatCurrency(holding.currentPrice) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        {formatCurrency(investment)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        {formatCurrency(currentValue)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                {formatCurrency(profitLoss.amount)}
                                            </div>
                                            <div className="text-sm">
                                                {formatPercentage(profitLoss.percentage)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(holding.id, holding.symbol)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete stock"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
