import { Stock, StockListItem } from './types';

const CORS_PROXY = 'https://corsproxy.io/?';
const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Fetch stock data from Yahoo Finance
 */
export async function fetchStockData(symbol: string): Promise<Stock | null> {
    try {
        const url = `${CORS_PROXY}${encodeURIComponent(YAHOO_FINANCE_API)}/${symbol}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch ${symbol}`);
            return null;
        }

        const data = await response.json();

        if (data.chart?.error || !data.chart?.result?.[0]) {
            console.error(`Invalid data for ${symbol}`);
            return null;
        }

        const result = data.chart.result[0];
        const meta = result.meta;

        return {
            symbol: meta.symbol,
            name: meta.longName || meta.shortName || meta.symbol,
            price: meta.regularMarketPrice || meta.previousClose || 0,
            change: meta.regularMarketChange || 0,
            changePercent: meta.regularMarketChangePercent || 0,
            volume: meta.regularMarketVolume || 0,
            marketCap: meta.marketCap || 0,
            peRatio: meta.trailingPE || null,
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
        const promises = batch.map(async (item) => {
            const stock = await fetchStockData(item.symbol);
            if (stock) {
                stock.name = item.name; // Use our curated name
                stock.sector = item.sector; // Use our curated sector
                return stock;
            }
            return null;
        });

        const results = await Promise.all(promises);
        stocks.push(...results.filter((s): s is Stock => s !== null));

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
