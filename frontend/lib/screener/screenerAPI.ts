import { Stock, StockListItem } from './types';

const CORS_PROXY = 'https://corsproxy.io/?';
const YAHOO_QUOTE_API = 'https://query1.finance.yahoo.com/v7/finance/quote';

/**
 * Fetch stock data from Yahoo Finance Quote API
 */
export async function fetchStockData(symbol: string): Promise<Stock | null> {
    try {
        const url = `${CORS_PROXY}${encodeURIComponent(`${YAHOO_QUOTE_API}?symbols=${symbol}`)}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch ${symbol}`);
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

    // Fetch in batches of 10 to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < stockList.length; i += batchSize) {
        const batch = stockList.slice(i, i + batchSize);

        // Fetch batch as a single request (more efficient)
        const symbols = batch.map(item => item.symbol).join(',');
        try {
            const url = `${CORS_PROXY}${encodeURIComponent(`${YAHOO_QUOTE_API}?symbols=${symbols}`)}`;
            const response = await fetch(url);

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
            }
        } catch (error) {
            console.error(`Error fetching batch:`, error);
        }

        // Small delay between batches to be nice to the API
        if (i + batchSize < stockList.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    return stocks;
}

/**
 * Refresh prices for existing stocks
 */
export async function refreshStockPrices(stocks: Stock[]): Promise<Stock[]> {
    const refreshed: Stock[] = [];

    for (const stock of stocks) {
        const updated = await fetchStockData(stock.symbol);
        if (updated) {
            updated.name = stock.name;
            updated.sector = stock.sector;
            refreshed.push(updated);
        } else {
            // Keep old data if fetch fails
            refreshed.push(stock);
        }
    }

    return refreshed;
}
