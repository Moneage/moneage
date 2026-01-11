'use client';

import { Stock, SortConfig } from '@/lib/screener/types';
import { formatMarketCap, formatVolume } from '@/lib/screener/screenerFilters';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StockTableProps {
    stocks: Stock[];
    sortConfig: SortConfig;
    onSort: (column: keyof Stock) => void;
}

export default function StockTable({ stocks, sortConfig, onSort }: StockTableProps) {
    const SortIcon = ({ column }: { column: keyof Stock }) => {
        if (sortConfig.column !== column) return null;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} className="inline ml-1" />
        ) : (
            <ArrowDown size={14} className="inline ml-1" />
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                onClick={() => onSort('symbol')}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Symbol <SortIcon column="symbol" />
                            </th>
                            <th
                                onClick={() => onSort('name')}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Name <SortIcon column="name" />
                            </th>
                            <th
                                onClick={() => onSort('price')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Price <SortIcon column="price" />
                            </th>
                            <th
                                onClick={() => onSort('changePercent')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Change % <SortIcon column="changePercent" />
                            </th>
                            <th
                                onClick={() => onSort('volume')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Volume <SortIcon column="volume" />
                            </th>
                            <th
                                onClick={() => onSort('marketCap')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                Market Cap <SortIcon column="marketCap" />
                            </th>
                            <th
                                onClick={() => onSort('peRatio')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                P/E Ratio <SortIcon column="peRatio" />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sector
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stocks.map((stock) => (
                            <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-semibold text-gray-900">{stock.symbol}</td>
                                <td className="px-4 py-3 text-gray-700 text-sm">{stock.name}</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                    ${stock.price.toFixed(2)}
                                </td>
                                <td
                                    className={`px-4 py-3 text-right font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {stock.changePercent >= 0 ? '+' : ''}
                                    {stock.changePercent.toFixed(2)}%
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                                    {formatVolume(stock.volume)}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                                    {formatMarketCap(stock.marketCap)}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                                    {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-gray-600 text-sm">{stock.sector}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
