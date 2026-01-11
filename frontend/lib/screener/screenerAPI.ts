import { Stock, StockListItem } from './types';

// Mock data generator for development/fallback
function generateMockStockData(stockItem: StockListItem): Stock {
    // Generate realistic-looking mock data
    const basePrice = Math.random() * 500 + 10; // $10-$510
    const change = (Math.random() - 0.5) * 20; // -$10 to +$10
    const changePercent = (change / basePrice) * 100;

    return {
        symbol: stockItem.symbol,
        name: stockItem.name,
        price: parseFloat(basePrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 100000000) + 1000000, // 1M-100M
        marketCap: Math.floor(Math.random() * 2000000000000) + 10000000000, // $10B-$2T
        peRatio: Math.random() < 0.1 ? null : parseFloat((Math.random() * 50 + 5).toFixed(2)), // 5-55 or null
        sector: stockItem.sector,
        lastUpdated: new Date().toISOString(),
    };
}

// Use our own API route
const STOCK_API = '/api/stocks';
const USE_MOCK_DATA = false; // Set to true to use mock data for testing

/**
 * Fetch stock data from our API route
 */
export async function fetchStockData(symbol: string): Promise<Stock | null> {
    try {
        const response = await fetch(`${STOCK_API}?symbols=${symbol}`);

        if (!response.ok) {
            console.error(`Failed to fetch ${symbol}: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data.quoteResponse?.error || !data.quoteResponse?.result?.[0]) {
            console.error(`Invalid data for ${symbol}`);
            return null;
        }

        const quote = data.quoteResponse.result[0];

        return {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || quote.symbol,
            price: quote.regularMarketPrice || quote.ask || quote.bid || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            volume: quote.regularMarketVolume || quote.volume || 0,
            marketCap: quote.marketCap || 0,
            peRatio: quote.trailingPE || quote.forwardPE || null,
            sector: '', // Will be filled from stockList
            lastUpdated: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

/**
 * Batch fetch stock data for multiple symbols
 */
export async function batchFetchStocks(
    stockList: StockListItem[]
): Promise<Stock[]> {
    // Use mock data if enabled or as fallback
    if (USE_MOCK_DATA) {
        console.log('[Screener] Using mock data');
        return stockList.map(generateMockStockData);
    }

    const stocks: Stock[] = [];
    let successCount = 0;

    // Fetch in batches of 10
    const batchSize = 10;
    for (let i = 0; i < stockList.length; i += batchSize) {
        const batch = stockList.slice(i, i + batchSize);

        // Fetch batch as a single request
        const symbols = batch.map(item => item.symbol).join(',');
        try {
            const response = await fetch(`${STOCK_API}?symbols=${symbols}`);

            if (response.ok) {
                const data = await response.json();
                const quotes = data.quoteResponse?.result || [];

                quotes.forEach((quote: any) => {
                    const stockItem = batch.find(item => item.symbol === quote.symbol);
                    if (stockItem && quote.regularMarketPrice) {
                        stocks.push({
                            symbol: quote.symbol,
                            name: stockItem.name,
                            price: quote.regularMarketPrice || 0,
                            change: quote.regularMarketChange || 0,
                            changePercent: quote.regularMarketChangePercent || 0,
                            volume: quote.regularMarketVolume || quote.volume || 0,
                            marketCap: quote.marketCap || 0,
                            peRatio: quote.trailingPE || quote.forwardPE || null,
                            sector: stockItem.sector,
                            lastUpdated: new Date().toISOString(),
                        });
                        successCount++;
                    }
                });
            } else {
                console.error(`Batch fetch failed: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching batch:`, error);
        }

        // Small delay between batches
        if (i + batchSize < stockList.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    console.log(`[Screener] Successfully fetched ${successCount} of ${stockList.length} stocks`);

    // If we got very few results, fall back to mock data
    if (stocks.length < stockList.length * 0.1) {
        console.warn('[Screener] API returned too few results, using mock data as fallback');
        return stockList.map(generateMockStockData);
    }

    return stocks;
}

/**
 * Refresh prices for existing stocks
 */
export async function refreshStockPrices(stocks: Stock[]): Promise<Stock[]> {
    if (USE_MOCK_DATA) {
        // Regenerate mock data with slight variations
        return stocks.map(stock => ({
            ...stock,
            price: stock.price + (Math.random() - 0.5) * 5,
            change: (Math.random() - 0.5) * 10,
            changePercent: (Math.random() - 0.5) * 5,
            lastUpdated: new Date().toISOString(),
        }));
    }

    const refreshed: Stock[] = [];

    // Refresh in batches
    const batchSize = 10;
    for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize);
        const symbols = batch.map(s => s.symbol).join(',');

        try {
            const response = await fetch(`${STOCK_API}?symbols=${symbols}`);

            if (response.ok) {
                const data = await response.json();
                const quotes = data.quoteResponse?.result || [];

                batch.forEach(stock => {
                    const quote = quotes.find((q: any) => q.symbol === stock.symbol);
                    if (quote && quote.regularMarketPrice) {
                        refreshed.push({
                            ...stock,
                            price: quote.regularMarketPrice || stock.price,
                            change: quote.regularMarketChange || stock.change,
                            changePercent: quote.regularMarketChangePercent || stock.changePercent,
                            volume: quote.regularMarketVolume || stock.volume,
                            marketCap: quote.marketCap || stock.marketCap,
                            peRatio: quote.trailingPE || stock.peRatio,
                            lastUpdated: new Date().toISOString(),
                        });
                    } else {
                        refreshed.push(stock);
                    }
                });
            }
        } catch (error) {
            console.error(`Error refreshing batch:`, error);
            // Keep old data if fetch fails
            refreshed.push(...batch);
        }

        if (i + batchSize < stocks.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    return refreshed;
}
