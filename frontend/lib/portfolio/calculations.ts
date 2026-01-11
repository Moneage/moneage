import { StockHolding, PortfolioMetrics, ProfitLoss } from './types';

/**
 * Calculate total investment for a holding
 */
export function calculateInvestment(holding: StockHolding): number {
    return holding.quantity * holding.buyPrice;
}

/**
 * Calculate current value for a holding
 */
export function calculateCurrentValue(holding: StockHolding): number {
    if (!holding.currentPrice) return 0;
    return holding.quantity * holding.currentPrice;
}

/**
 * Calculate profit/loss for a holding
 */
export function calculateProfitLoss(holding: StockHolding): ProfitLoss {
    if (!holding.currentPrice) {
        return { amount: 0, percentage: 0 };
    }

    const investment = calculateInvestment(holding);
    const currentValue = calculateCurrentValue(holding);
    const amount = currentValue - investment;
    const percentage = (amount / investment) * 100;

    return {
        amount: Number(amount.toFixed(2)),
        percentage: Number(percentage.toFixed(2)),
    };
}

/**
 * Calculate total portfolio metrics
 */
export function calculateTotalPortfolioValue(
    holdings: StockHolding[]
): PortfolioMetrics {
    if (holdings.length === 0) {
        return {
            totalInvestment: 0,
            currentValue: 0,
            totalProfitLoss: 0,
            totalProfitLossPercentage: 0,
            holdingsCount: 0,
        };
    }

    let totalInvestment = 0;
    let currentValue = 0;

    holdings.forEach((holding) => {
        totalInvestment += calculateInvestment(holding);
        currentValue += calculateCurrentValue(holding);
    });

    const totalProfitLoss = currentValue - totalInvestment;
    const totalProfitLossPercentage =
        totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    const bestPerformer = getBestPerformer(holdings);
    const worstPerformer = getWorstPerformer(holdings);

    return {
        totalInvestment: Number(totalInvestment.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        totalProfitLoss: Number(totalProfitLoss.toFixed(2)),
        totalProfitLossPercentage: Number(totalProfitLossPercentage.toFixed(2)),
        holdingsCount: holdings.length,
        bestPerformer,
        worstPerformer,
    };
}

/**
 * Get best performing stock
 */
export function getBestPerformer(
    holdings: StockHolding[]
): StockHolding | undefined {
    if (holdings.length === 0) return undefined;

    return holdings.reduce((best, current) => {
        const bestPL = calculateProfitLoss(best);
        const currentPL = calculateProfitLoss(current);
        return currentPL.percentage > bestPL.percentage ? current : best;
    });
}

/**
 * Get worst performing stock
 */
export function getWorstPerformer(
    holdings: StockHolding[]
): StockHolding | undefined {
    if (holdings.length === 0) return undefined;

    return holdings.reduce((worst, current) => {
        const worstPL = calculateProfitLoss(worst);
        const currentPL = calculateProfitLoss(current);
        return currentPL.percentage < worstPL.percentage ? current : worst;
    });
}

/**
 * Format currency (USD)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
}
