'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { getStockInfo } from '@/lib/portfolio/stockAPI';
import { addHolding } from '@/lib/portfolio/portfolioStorage';

interface AddStockFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddStockForm({ onClose, onSuccess }: AddStockFormProps) {
    const [symbol, setSymbol] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validating, setValidating] = useState(false);

    const handleSymbolBlur = async () => {
        if (!symbol.trim()) return;

        setValidating(true);
        setError('');

        try {
            const stockInfo = await getStockInfo(symbol.toUpperCase());
            setName(stockInfo.name);
            if (!buyPrice) {
                setBuyPrice(stockInfo.price.toFixed(2));
            }
        } catch (err) {
            setError('Invalid stock symbol. Please enter a valid US stock symbol (e.g., AAPL, GOOGL).');
            setName('');
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!symbol || !name || !quantity || !buyPrice || !buyDate) {
            setError('Please fill in all fields');
            return;
        }

        const qty = parseFloat(quantity);
        const price = parseFloat(buyPrice);

        if (isNaN(qty) || qty <= 0) {
            setError('Quantity must be a positive number');
            return;
        }

        if (isNaN(price) || price <= 0) {
            setError('Buy price must be a positive number');
            return;
        }

        setLoading(true);

        try {
            // Fetch current price
            const stockInfo = await getStockInfo(symbol.toUpperCase());

            addHolding({
                symbol: symbol.toUpperCase(),
                name: name,
                quantity: qty,
                buyPrice: price,
                buyDate: buyDate,
                currentPrice: stockInfo.price,
                lastUpdated: new Date().toISOString(),
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to add stock. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Stock</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Symbol *
                        </label>
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            onBlur={handleSymbolBlur}
                            placeholder="e.g., AAPL, GOOGL, TSLA"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading || validating}
                        />
                        {validating && (
                            <p className="text-sm text-gray-500 mt-1">Validating symbol...</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Auto-filled from symbol"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            required
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity (Shares) *
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g., 10"
                            step="0.01"
                            min="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buy Price (USD) *
                        </label>
                        <input
                            type="number"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                            placeholder="e.g., 150.00"
                            step="0.01"
                            min="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Purchase Date *
                        </label>
                        <input
                            type="date"
                            value={buyDate}
                            onChange={(e) => setBuyDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || validating}
                        >
                            {loading ? 'Adding...' : 'Add Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
