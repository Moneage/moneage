// Stock Portfolio Data Types

export interface StockHolding {
    id: string;
    symbol: string;           // e.g., "AAPL", "GOOGL"
    name: string;             // Company name
    quantity: number;         // Number of shares
    buyPrice: number;         // Purchase price per share (USD)
    buyDate: string;          // ISO date string
    currentPrice?: number;    // Fetched from API (USD)
    lastUpdated?: string;     // ISO timestamp
}

export interface Portfolio {
    holdings: StockHolding[];
    lastSync: string;
    settings: {
        autoRefresh: boolean;
        refreshInterval: number;  // Minutes
        currency: string;         // "USD"
    };
}

export interface PortfolioMetrics {
    totalInvestment: number;
    currentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    holdingsCount: number;
    bestPerformer?: StockHolding;
    worstPerformer?: StockHolding;
}

export interface StockInfo {
    symbol: string;
    name: string;
    price: number;
    previousClose: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    marketCap?: number;
}

export interface ProfitLoss {
    amount: number;
    percentage: number;
}
