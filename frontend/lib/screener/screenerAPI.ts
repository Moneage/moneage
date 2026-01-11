import { Stock, StockListItem } from './types';

// Use our own API route
const STOCK_API = '/api/stocks';

/**
 * Fetch stock data from our API route (now using Finnhub)
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
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            volume: quote.regularMarketVolume || 0,
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
    const stocks: Stock[] = [];
    let successCount = 0;

    console.log(`[Screener] Fetching ${stockList.length} stocks from Finnhub API...`);

    // Fetch in batches of 10 (Finnhub allows 60/min)
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
                            name: stockItem.name, // Use our curated name
                            price: quote.regularMarketPrice || 0,
                            change: quote.regularMarketChange || 0,
                            changePercent: quote.regularMarketChangePercent || 0,
                            volume: quote.regularMarketVolume || 0,
                            marketCap: quote.marketCap || 0,
                            peRatio: quote.trailingPE || quote.forwardPE || null,
                            sector: stockItem.sector, // Use our curated sector
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

        // Progress update
        console.log(`[Screener] Fetched ${successCount} of ${stockList.length} stocks...`);

        // Small delay between batches
        if (i + batchSize < stockList.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    console.log(`[Screener] Successfully fetched ${successCount} of ${stockList.length} stocks from Finnhub`);

    return stocks;
}

/**
 * Refresh prices for existing stocks
 */
export async function refreshStockPrices(stocks: Stock[]): Promise<Stock[]> {
    const refreshed: Stock[] = [];

    console.log(`[Screener] Refreshing ${stocks.length} stock prices...`);

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

    console.log(`[Screener] Refresh complete`);

    return refreshed;
}
