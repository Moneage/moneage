'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { StockHolding } from '@/lib/portfolio/types';
import { getPortfolio, updatePrices } from '@/lib/portfolio/portfolioStorage';
import { batchGetPrices } from '@/lib/portfolio/stockAPI';
import { calculateTotalPortfolioValue } from '@/lib/portfolio/calculations';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';
import PortfolioSummary from './components/PortfolioSummary';
import PortfolioChart from './components/PortfolioChart';
import ExportImport from './components/ExportImport';


export default function PortfolioPage() {
    const [holdings, setHoldings] = useState<StockHolding[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [error, setError] = useState('');

    // Load portfolio on mount
    useEffect(() => {
        loadPortfolio();
    }, []);

    const loadPortfolio = () => {
        const portfolio = getPortfolio();
        setHoldings(portfolio.holdings);
        setLastUpdated(portfolio.lastSync);
    };

    const handleRefreshPrices = async () => {
        if (holdings.length === 0) return;

        setRefreshing(true);
        setError('');

        try {
            const symbols = holdings.map((h) => h.symbol);
            const prices = await batchGetPrices(symbols);
            updatePrices(prices);
            loadPortfolio();
        } catch (err) {
            setError('Failed to refresh prices. Please try again.');
        } finally {
            setRefreshing(false);
        }
    };

    const metrics = calculateTotalPortfolioValue(holdings);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Stock Portfolio Tracker
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Track your US stock investments and monitor performance in real-time
                    </p>
                </div>

                {/* Info Banner - Compact */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-blue-800">
                        <strong>Local Storage:</strong> Data saved in browser. Export regularly to backup.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Action Buttons - Compact */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-sm"
                    >
                        <Plus size={18} />
                        Add Stock
                    </button>

                    <button
                        onClick={handleRefreshPrices}
                        disabled={refreshing || holdings.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh Prices'}
                    </button>

                    {lastUpdated && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600">
                            Last updated: {new Date(lastUpdated).toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Portfolio Summary */}
                {holdings.length > 0 && <PortfolioSummary metrics={metrics} />}

                {/* Stock List */}
                <StockList holdings={holdings} onUpdate={loadPortfolio} />

                {/* Data Management - Moved above chart */}
                {holdings.length > 0 && (
                    <div className="mt-6">
                        <ExportImport onUpdate={loadPortfolio} />
                    </div>
                )}

                {/* Portfolio Chart - Now at bottom */}
                {holdings.length > 0 && (
                    <div className="mt-6">
                        <PortfolioChart holdings={holdings} />
                    </div>
                )}

                {/* Add Stock Modal */}
                {showAddForm && (
                    <AddStockForm
                        onClose={() => setShowAddForm(false)}
                        onSuccess={loadPortfolio}
                    />
                )}

                {/* Educational Content - Compact */}
                {holdings.length === 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                            How to Use the Portfolio Tracker
                        </h2>
                        <div className="space-y-3 text-gray-700 text-sm">
                            <div>
                                <h3 className="font-semibold mb-1">1. Add Your Stocks</h3>
                                <p>
                                    Click "Add Stock" and enter the stock symbol (e.g., AAPL for Apple, GOOGL for
                                    Google). The system will automatically fetch the company name and current price.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">2. Track Performance</h3>
                                <p>
                                    View your portfolio's total value, profit/loss, and individual stock performance.
                                    Prices update automatically when you refresh.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">3. Export Your Data</h3>
                                <p>
                                    Export your portfolio to JSON or CSV format for backup or analysis. You can also
                                    import previously exported portfolios.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
