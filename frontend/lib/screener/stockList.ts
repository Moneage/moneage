import { StockListItem } from './types';

// Curated list of popular S&P 500 stocks
// This is a subset for initial implementation - can be expanded later
export const SP500_STOCKS: StockListItem[] = [
    // Technology
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Communication Services' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
    { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology' },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
    { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology' },
    { symbol: 'QCOM', name: 'QUALCOMM Inc.', sector: 'Technology' },
    { symbol: 'TXN', name: 'Texas Instruments Inc.', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },

    // Financials
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. Class B', sector: 'Financials' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financials' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financials' },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financials' },
    { symbol: 'WFC', name: 'Wells Fargo & Co.', sector: 'Financials' },
    { symbol: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financials' },
    { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financials' },
    { symbol: 'AXP', name: 'American Express Co.', sector: 'Financials' },
    { symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Financials' },

    // Healthcare
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare' },
    { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare' },
    { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
    { symbol: 'DHR', name: 'Danaher Corporation', sector: 'Healthcare' },
    { symbol: 'CVS', name: 'CVS Health Corporation', sector: 'Healthcare' },

    // Consumer
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' },
    { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
    { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples' },
    { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples' },
    { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Staples' },
    { symbol: 'MCD', name: 'McDonald\'s Corp.', sector: 'Consumer Discretionary' },
    { symbol: 'NKE', name: 'NIKE Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary' },
    { symbol: 'TGT', name: 'Target Corporation', sector: 'Consumer Discretionary' },

    // Industrials
    { symbol: 'BA', name: 'Boeing Co.', sector: 'Industrials' },
    { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials' },
    { symbol: 'GE', name: 'General Electric Co.', sector: 'Industrials' },
    { symbol: 'UPS', name: 'United Parcel Service Inc.', sector: 'Industrials' },
    { symbol: 'HON', name: 'Honeywell International Inc.', sector: 'Industrials' },
    { symbol: 'UNP', name: 'Union Pacific Corporation', sector: 'Industrials' },
    { symbol: 'RTX', name: 'RTX Corporation', sector: 'Industrials' },
    { symbol: 'LMT', name: 'Lockheed Martin Corporation', sector: 'Industrials' },

    // Energy
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy' },
    { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy' },
    { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy' },
    { symbol: 'SLB', name: 'Schlumberger NV', sector: 'Energy' },
    { symbol: 'EOG', name: 'EOG Resources Inc.', sector: 'Energy' },

    // Utilities
    { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities' },
    { symbol: 'DUK', name: 'Duke Energy Corporation', sector: 'Utilities' },
    { symbol: 'SO', name: 'Southern Company', sector: 'Utilities' },
    { symbol: 'D', name: 'Dominion Energy Inc.', sector: 'Utilities' },

    // Real Estate
    { symbol: 'AMT', name: 'American Tower Corporation', sector: 'Real Estate' },
    { symbol: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate' },
    { symbol: 'CCI', name: 'Crown Castle Inc.', sector: 'Real Estate' },
    { symbol: 'EQIX', name: 'Equinix Inc.', sector: 'Real Estate' },

    // Materials
    { symbol: 'LIN', name: 'Linde plc', sector: 'Materials' },
    { symbol: 'APD', name: 'Air Products and Chemicals Inc.', sector: 'Materials' },
    { symbol: 'SHW', name: 'Sherwin-Williams Co.', sector: 'Materials' },
    { symbol: 'FCX', name: 'Freeport-McMoRan Inc.', sector: 'Materials' },
    { symbol: 'NEM', name: 'Newmont Corporation', sector: 'Materials' },

    // Additional Popular Stocks
    { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
    { symbol: 'CMCSA', name: 'Comcast Corporation', sector: 'Communication Services' },
    { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services' },
    { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financials' },
    { symbol: 'IBM', name: 'International Business Machines Corp.', sector: 'Technology' },
    { symbol: 'UBER', name: 'Uber Technologies Inc.', sector: 'Technology' },
    { symbol: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'COIN', name: 'Coinbase Global Inc.', sector: 'Financials' },
    { symbol: 'SQ', name: 'Block Inc.', sector: 'Technology' },
    { symbol: 'SHOP', name: 'Shopify Inc.', sector: 'Technology' },
    { symbol: 'SNAP', name: 'Snap Inc.', sector: 'Communication Services' },
    { symbol: 'SPOT', name: 'Spotify Technology SA', sector: 'Communication Services' },
    { symbol: 'ZM', name: 'Zoom Video Communications Inc.', sector: 'Technology' },
    { symbol: 'DOCU', name: 'DocuSign Inc.', sector: 'Technology' },
    { symbol: 'TWLO', name: 'Twilio Inc.', sector: 'Communication Services' },
    { symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology' },
    { symbol: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology' },
    { symbol: 'RBLX', name: 'Roblox Corporation', sector: 'Communication Services' },
    { symbol: 'RIVN', name: 'Rivian Automotive Inc.', sector: 'Consumer Discretionary' },
];

// Helper function to get stock by symbol
export function getStockBySymbol(symbol: string): StockListItem | undefined {
    return SP500_STOCKS.find(stock => stock.symbol === symbol);
}

// Helper function to get stocks by sector
export function getStocksBySector(sector: string): StockListItem[] {
    return SP500_STOCKS.filter(stock => stock.sector === sector);
}

// Helper function to search stocks
export function searchStockList(query: string): StockListItem[] {
    const lowerQuery = query.toLowerCase();
    return SP500_STOCKS.filter(
        stock =>
            stock.symbol.toLowerCase().includes(lowerQuery) ||
            stock.name.toLowerCase().includes(lowerQuery)
    );
}
