import { StockInfo } from './types';

const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Fetch current stock price and info from Yahoo Finance
 */
export async function getStockInfo(symbol: string): Promise<StockInfo> {
    try {
        const response = await fetch(`${YAHOO_FINANCE_API}/${symbol.toUpperCase()}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch stock data for ${symbol}`);
        }

        const data = await response.json();

        if (data.chart.error) {
            throw new Error(data.chart.error.description || 'Invalid stock symbol');
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        return {
            symbol: meta.symbol,
            name: meta.longName || meta.symbol,
            price: meta.regularMarketPrice || meta.previousClose,
            previousClose: meta.previousClose,
            dayHigh: quote.high?.[quote.high.length - 1] || meta.regularMarketPrice,
            dayLow: quote.low?.[quote.low.length - 1] || meta.regularMarketPrice,
            volume: quote.volume?.[quote.volume.length - 1] || 0,
            marketCap: meta.marketCap,
        };
    } catch (error) {
        console.error('Error fetching stock info:', error);
        throw error;
    }
}

/**
 * Get current price for a single stock
 */
export async function getCurrentPrice(symbol: string): Promise<number> {
    const info = await getStockInfo(symbol);
    return info.price;
}

/**
 * Batch fetch prices for multiple stocks
 */
export async function batchGetPrices(
    symbols: string[]
): Promise<Map<string, number>> {
    const priceMap = new Map<string, number>();

    // Fetch all prices in parallel
    const promises = symbols.map(async (symbol) => {
        try {
            const price = await getCurrentPrice(symbol);
            priceMap.set(symbol, price);
        } catch (error) {
            console.error(`Failed to fetch price for ${symbol}:`, error);
            // Keep existing price if fetch fails
        }
    });

    await Promise.all(promises);
    return priceMap;
}

/**
 * Validate if a stock symbol exists
 */
export async function validateSymbol(symbol: string): Promise<boolean> {
    try {
        await getStockInfo(symbol);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Search for stock symbols (basic implementation)
 */
export async function searchStocks(query: string): Promise<string[]> {
    // This is a simplified version - in production, you'd use a proper search API
    // For now, just validate the query as a symbol
    const isValid = await validateSymbol(query.toUpperCase());
    return isValid ? [query.toUpperCase()] : [];
}
