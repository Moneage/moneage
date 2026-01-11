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
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Stock Portfolio Tracker
                    </h1>
                    <p className="text-gray-600">
                        Track your US stock investments and monitor performance in real-time
                    </p>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Your data is stored locally</p>
                        <p>
                            All portfolio data is saved in your browser's localStorage. Make sure to export your
                            portfolio regularly to avoid data loss. Data is not synced across devices.
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                    >
                        <Plus size={20} />
                        Add Stock
                    </button>

                    <button
                        onClick={handleRefreshPrices}
                        disabled={refreshing || holdings.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh Prices'}
                    </button>

                    {lastUpdated && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                            Last updated: {new Date(lastUpdated).toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Portfolio Summary */}
                {holdings.length > 0 && <PortfolioSummary metrics={metrics} />}

                {/* Portfolio Chart */}
                {holdings.length > 0 && <PortfolioChart holdings={holdings} />}

                {/* Stock List */}
                <StockList holdings={holdings} onUpdate={loadPortfolio} />

                {/* Export/Import */}
                {holdings.length > 0 && (
                    <div className="mt-8">
                        <ExportImport onUpdate={loadPortfolio} />
                    </div>
                )}

                {/* Add Stock Modal */}
                {showAddForm && (
                    <AddStockForm
                        onClose={() => setShowAddForm(false)}
                        onSuccess={loadPortfolio}
                    />
                )}

                {/* Educational Content */}
                {holdings.length === 0 && (
                    <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            How to Use the Portfolio Tracker
                        </h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">1. Add Your Stocks</h3>
                                <p>
                                    Click "Add Stock" and enter the stock symbol (e.g., AAPL for Apple, GOOGL for
                                    Google). The system will automatically fetch the company name and current price.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">2. Track Performance</h3>
                                <p>
                                    View your portfolio's total value, profit/loss, and individual stock performance.
                                    Prices update automatically when you refresh.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">3. Export Your Data</h3>
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
