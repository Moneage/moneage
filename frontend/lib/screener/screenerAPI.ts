import { Stock, StockListItem } from './types';

// Try alternative CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const YAHOO_QUOTE_API = 'https://query1.finance.yahoo.com/v7/finance/quote';

/**
 * Fetch stock data from Yahoo Finance Quote API
 */
export async function fetchStockData(symbol: string): Promise<Stock | null> {
    try {
        const apiUrl = `${YAHOO_QUOTE_API}?symbols=${symbol}`;
        const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

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
    const stocks: Stock[] = [];

    // Fetch in batches of 5 to avoid overwhelming the proxy
    const batchSize = 5;
    for (let i = 0; i < stockList.length; i += batchSize) {
        const batch = stockList.slice(i, i + batchSize);

        // Fetch batch as a single request (more efficient)
        const symbols = batch.map(item => item.symbol).join(',');
        try {
            const apiUrl = `${YAHOO_QUOTE_API}?symbols=${symbols}`;
            const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const quotes = data.quoteResponse?.result || [];

                quotes.forEach((quote: any) => {
                    const stockItem = batch.find(item => item.symbol === quote.symbol);
                    if (stockItem) {
                        stocks.push({
                            symbol: quote.symbol,
                            name: stockItem.name, // Use our curated name
                            price: quote.regularMarketPrice || quote.ask || quote.bid || 0,
                            change: quote.regularMarketChange || 0,
                            changePercent: quote.regularMarketChangePercent || 0,
                            volume: quote.regularMarketVolume || quote.volume || 0,
                            marketCap: quote.marketCap || 0,
                            peRatio: quote.trailingPE || quote.forwardPE || null,
                            sector: stockItem.sector, // Use our curated sector
                            lastUpdated: new Date().toISOString(),
                        });
                    }
                });
            } else {
                console.error(`Batch fetch failed: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching batch:`, error);
        }

        // Longer delay between batches to avoid rate limiting
        if (i + batchSize < stockList.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return stocks;
}

/**
 * Refresh prices for existing stocks
 */
export async function refreshStockPrices(stocks: Stock[]): Promise<Stock[]> {
    const refreshed: Stock[] = [];

    // Refresh in batches
    const batchSize = 5;
    for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize);
        const symbols = batch.map(s => s.symbol).join(',');

        try {
            const apiUrl = `${YAHOO_QUOTE_API}?symbols=${symbols}`;
            const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const quotes = data.quoteResponse?.result || [];

                batch.forEach(stock => {
                    const quote = quotes.find((q: any) => q.symbol === stock.symbol);
                    if (quote) {
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
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return refreshed;
}
