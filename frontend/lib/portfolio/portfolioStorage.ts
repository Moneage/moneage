import { v4 as uuidv4 } from 'uuid';
import { Portfolio, StockHolding } from './types';

const STORAGE_KEY = 'moneage_portfolio';

const DEFAULT_PORTFOLIO: Portfolio = {
    holdings: [],
    lastSync: new Date().toISOString(),
    settings: {
        autoRefresh: true,
        refreshInterval: 5, // 5 minutes
        currency: 'USD',
    },
};

/**
 * Get portfolio from localStorage
 */
export function getPortfolio(): Portfolio {
    if (typeof window === 'undefined') return DEFAULT_PORTFOLIO;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULT_PORTFOLIO;

        const portfolio = JSON.parse(stored) as Portfolio;
        return portfolio;
    } catch (error) {
        console.error('Error reading portfolio from localStorage:', error);
        return DEFAULT_PORTFOLIO;
    }
}

/**
 * Save portfolio to localStorage
 */
export function savePortfolio(portfolio: Portfolio): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
        console.error('Error saving portfolio to localStorage:', error);
        throw new Error('Failed to save portfolio. Storage might be full.');
    }
}

/**
 * Add a new holding
 */
export function addHolding(holding: Omit<StockHolding, 'id'>): StockHolding {
    const portfolio = getPortfolio();

    const newHolding: StockHolding = {
        ...holding,
        id: uuidv4(),
    };

    portfolio.holdings.push(newHolding);
    portfolio.lastSync = new Date().toISOString();

    savePortfolio(portfolio);
    return newHolding;
}

/**
 * Update an existing holding
 */
export function updateHolding(
    id: string,
    updates: Partial<StockHolding>
): void {
    const portfolio = getPortfolio();

    const index = portfolio.holdings.findIndex((h) => h.id === id);
    if (index === -1) {
        throw new Error('Holding not found');
    }

    portfolio.holdings[index] = {
        ...portfolio.holdings[index],
        ...updates,
    };

    portfolio.lastSync = new Date().toISOString();
    savePortfolio(portfolio);
}

/**
 * Delete a holding
 */
export function deleteHolding(id: string): void {
    const portfolio = getPortfolio();

    portfolio.holdings = portfolio.holdings.filter((h) => h.id !== id);
    portfolio.lastSync = new Date().toISOString();

    savePortfolio(portfolio);
}

/**
 * Update current prices for all holdings
 */
export function updatePrices(prices: Map<string, number>): void {
    const portfolio = getPortfolio();

    portfolio.holdings = portfolio.holdings.map((holding) => {
        const price = prices.get(holding.symbol);
        if (price !== undefined) {
            return {
                ...holding,
                currentPrice: price,
                lastUpdated: new Date().toISOString(),
            };
        }
        return holding;
    });

    portfolio.lastSync = new Date().toISOString();
    savePortfolio(portfolio);
}

/**
 * Clear all portfolio data
 */
export function clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export portfolio to JSON string
 */
export function exportToJSON(): string {
    const portfolio = getPortfolio();
    return JSON.stringify(portfolio, null, 2);
}

/**
 * Export portfolio to CSV string
 */
export function exportToCSV(): string {
    const portfolio = getPortfolio();

    const headers = [
        'Symbol',
        'Name',
        'Quantity',
        'Buy Price',
        'Buy Date',
        'Current Price',
        'Investment',
        'Current Value',
        'Profit/Loss',
        'P/L %',
    ];

    const rows = portfolio.holdings.map((holding) => {
        const investment = holding.quantity * holding.buyPrice;
        const currentValue = holding.currentPrice
            ? holding.quantity * holding.currentPrice
            : 0;
        const profitLoss = currentValue - investment;
        const profitLossPercentage = (profitLoss / investment) * 100;

        return [
            holding.symbol,
            holding.name,
            holding.quantity,
            holding.buyPrice.toFixed(2),
            holding.buyDate,
            holding.currentPrice?.toFixed(2) || 'N/A',
            investment.toFixed(2),
            currentValue.toFixed(2),
            profitLoss.toFixed(2),
            profitLossPercentage.toFixed(2),
        ];
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
}

/**
 * Import portfolio from JSON string
 */
export function importFromJSON(json: string): Portfolio {
    try {
        const portfolio = JSON.parse(json) as Portfolio;

        // Validate structure
        if (!portfolio.holdings || !Array.isArray(portfolio.holdings)) {
            throw new Error('Invalid portfolio format');
        }

        savePortfolio(portfolio);
        return portfolio;
    } catch (error) {
        console.error('Error importing portfolio:', error);
        throw new Error('Failed to import portfolio. Invalid JSON format.');
    }
}

/**
 * Update portfolio settings
 */
export function updateSettings(
    settings: Partial<Portfolio['settings']>
): void {
    const portfolio = getPortfolio();
    portfolio.settings = {
        ...portfolio.settings,
        ...settings,
    };
    savePortfolio(portfolio);
}
