export function calculateSIP(monthly: number, rate: number, years: number) {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const investedAmount = monthly * months;

    // SIP Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
    // where P = monthly investment, i = monthly interest rate, n = number of months
    const totalValue =
        (monthly *
            (Math.pow(1 + monthlyRate, months) - 1) *
            (1 + monthlyRate)) /
        monthlyRate;

    const wealthGained = totalValue - investedAmount;

    return {
        totalValue: Math.round(totalValue),
        investedAmount: Math.round(investedAmount),
        wealthGained: Math.round(wealthGained),
    };
}
