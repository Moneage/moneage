// Stock Screener TypeScript Types

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    peRatio: number | null;
    sector: string;
    lastUpdated?: string;
}

export interface FilterCriteria {
    marketCap?: { min: number; max: number };
    peRatio?: { min: number; max: number };
    price?: { min: number; max: number };
    volume?: { min: number; max: number };
    changePercent?: { min: number; max: number };
    sectors?: string[];
    searchQuery?: string;
}

export interface SavedScreen {
    id: string;
    name: string;
    filters: FilterCriteria;
    createdAt: string;
    lastUsed: string;
}

export interface SortConfig {
    column: keyof Stock;
    direction: 'asc' | 'desc';
}

export interface StockListItem {
    symbol: string;
    name: string;
    sector: string;
}

export interface ScreenerState {
    stocks: Stock[];
    filteredStocks: Stock[];
    filters: FilterCriteria;
    sort: SortConfig;
    currentPage: number;
    itemsPerPage: number;
    loading: boolean;
    error: string | null;
}

// Market Cap ranges (in billions)
export const MARKET_CAP_RANGES = {
    MEGA: { min: 200, max: Infinity, label: 'Mega Cap ($200B+)' },
    LARGE: { min: 10, max: 200, label: 'Large Cap ($10B - $200B)' },
    MID: { min: 2, max: 10, label: 'Mid Cap ($2B - $10B)' },
    SMALL: { min: 0.3, max: 2, label: 'Small Cap ($300M - $2B)' },
    MICRO: { min: 0.05, max: 0.3, label: 'Micro Cap ($50M - $300M)' },
};

// Sectors
export const SECTORS = [
    'Technology',
    'Healthcare',
    'Financials',
    'Consumer Discretionary',
    'Communication Services',
    'Industrials',
    'Consumer Staples',
    'Energy',
    'Utilities',
    'Real Estate',
    'Materials',
];
