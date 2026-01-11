import { Stock, FilterCriteria, SortConfig } from './types';

/**
 * Apply all filters to stock list
 */
export function applyFilters(stocks: Stock[], filters: FilterCriteria): Stock[] {
    let filtered = [...stocks];

    // Market Cap filter
    if (filters.marketCap) {
        filtered = filtered.filter((stock) => {
            const marketCapB = stock.marketCap / 1_000_000_000; // Convert to billions
            return (
                marketCapB >= filters.marketCap!.min &&
                marketCapB <= filters.marketCap!.max
            );
        });
    }

    // P/E Ratio filter
    if (filters.peRatio) {
        filtered = filtered.filter((stock) => {
            if (stock.peRatio === null) return false;
            return (
                stock.peRatio >= filters.peRatio!.min &&
                stock.peRatio <= filters.peRatio!.max
            );
        });
    }

    // Price filter
    if (filters.price) {
        filtered = filtered.filter((stock) => {
            return (
                stock.price >= filters.price!.min && stock.price <= filters.price!.max
            );
        });
    }

    // Volume filter
    if (filters.volume) {
        filtered = filtered.filter((stock) => {
            return (
                stock.volume >= filters.volume!.min &&
                stock.volume <= filters.volume!.max
            );
        });
    }

    // Change Percent filter
    if (filters.changePercent) {
        filtered = filtered.filter((stock) => {
            return (
                stock.changePercent >= filters.changePercent!.min &&
                stock.changePercent <= filters.changePercent!.max
            );
        });
    }

    // Sector filter
    if (filters.sectors && filters.sectors.length > 0) {
        filtered = filtered.filter((stock) =>
            filters.sectors!.includes(stock.sector)
        );
    }

    // Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
            (stock) =>
                stock.symbol.toLowerCase().includes(query) ||
                stock.name.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Sort stocks by column
 */
export function sortStocks(
    stocks: Stock[],
    sortConfig: SortConfig
): Stock[] {
    const sorted = [...stocks];

    sorted.sort((a, b) => {
        const aValue = a[sortConfig.column];
        const bValue = b[sortConfig.column];

        // Handle null values
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        // Compare values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        }

        return 0;
    });

    return sorted;
}

/**
 * Get filter match count
 */
export function getMatchCount(
    stocks: Stock[],
    filters: FilterCriteria
): number {
    return applyFilters(stocks, filters).length;
}

/**
 * Paginate stocks
 */
export function paginateStocks(
    stocks: Stock[],
    page: number,
    itemsPerPage: number
): Stock[] {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return stocks.slice(start, end);
}

/**
 * Get total pages
 */
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Format market cap for display
 */
export function formatMarketCap(marketCap: number): string {
    const billions = marketCap / 1_000_000_000;
    if (billions >= 1000) {
        return `$${(billions / 1000).toFixed(2)}T`;
    }
    if (billions >= 1) {
        return `$${billions.toFixed(2)}B`;
    }
    const millions = marketCap / 1_000_000;
    return `$${millions.toFixed(2)}M`;
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
    if (volume >= 1_000_000_000) {
        return `${(volume / 1_000_000_000).toFixed(2)}B`;
    }
    if (volume >= 1_000_000) {
        return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
        return `${(volume / 1_000).toFixed(2)}K`;
    }
    return volume.toString();
}
