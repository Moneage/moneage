'use client';

import { useState, useEffect } from 'react';
import { Filter, RefreshCw, Download, Save, TrendingUp } from 'lucide-react';
import { Stock, FilterCriteria, SortConfig } from '@/lib/screener/types';
import { SP500_STOCKS } from '@/lib/screener/stockList';
import { batchFetchStocks } from '@/lib/screener/screenerAPI';
import { applyFilters, sortStocks, paginateStocks, getTotalPages } from '@/lib/screener/screenerFilters';
import { saveScreen, getSavedScreens } from '@/lib/screener/screenerStorage';
import StockTable from './components/StockTable';
import FilterPanel from './components/FilterPanel';
import Papa from 'papaparse';

export default function StockScreenerPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [filters, setFilters] = useState<FilterCriteria>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'marketCap', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    const itemsPerPage = 50;

    // Load stock data on mount
    useEffect(() => {
        loadStocks();
    }, []);

    // Apply filters and sorting whenever they change
    useEffect(() => {
        let result = applyFilters(stocks, filters);
        result = sortStocks(result, sortConfig);
        setFilteredStocks(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [stocks, filters, sortConfig]);

    const loadStocks = async () => {
        setLoading(true);
        try {
            const stockData = await batchFetchStocks(SP500_STOCKS);
            setStocks(stockData);
        } catch (error) {
            console.error('Error loading stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: FilterCriteria) => {
        setFilters(newFilters);
    };

    const handleSort = (column: keyof Stock) => {
        setSortConfig((prev) => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleSaveScreen = () => {
        const name = prompt('Enter a name for this screen:');
        if (name) {
            saveScreen(name, filters);
            alert('Screen saved successfully!');
        }
    };

    const handleExportCSV = () => {
        const csv = Papa.unparse(filteredStocks);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stock-screener-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const paginatedStocks = paginateStocks(filteredStocks, currentPage, itemsPerPage);
    const totalPages = getTotalPages(filteredStocks.length, itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Screener</h1>
                    <p className="text-gray-600">Filter and analyze {SP500_STOCKS.length} popular US stocks</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Filter size={18} />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </button>

                    <button
                        onClick={loadStocks}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>

                    <button
                        onClick={handleSaveScreen}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Save size={18} />
                        Save Screen
                    </button>

                    <button
                        onClick={handleExportCSV}
                        disabled={filteredStocks.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>

                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                        Showing {filteredStocks.length} of {stocks.length} stocks
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="lg:col-span-1">
                            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
                        </div>
                    )}

                    {/* Stock Table */}
                    <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading stock data...</p>
                                <p className="text-sm text-gray-500 mt-2">This may take a minute</p>
                            </div>
                        ) : filteredStocks.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No stocks match your criteria</h3>
                                <p className="text-gray-500">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <>
                                <StockTable
                                    stocks={paginatedStocks}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex justify-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            {totalPages > 5 && <span className="text-gray-500">...</span>}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Educational Content */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Stock Screener</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">1. Filter Stocks</h3>
                            <p>Use the filter panel to narrow down stocks by market cap, P/E ratio, price, volume, sector, and more.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">2. Sort Results</h3>
                            <p>Click on any column header to sort stocks by that metric. Click again to reverse the sort order.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">3. Save Screens</h3>
                            <p>Save your favorite filter combinations for quick access later. Perfect for tracking specific strategies.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">4. Export Data</h3>
                            <p>Export your filtered results to CSV for further analysis in Excel or Google Sheets.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
