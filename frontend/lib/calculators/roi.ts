export function calculateROI(principal: number, rate: number, years: number) {
    const totalValue = principal * Math.pow((1 + rate / 100), years);
    const wealthGained = totalValue - principal;
    const annualizedReturn = ((Math.pow(totalValue / principal, 1 / years) - 1) * 100);

    return {
        totalValue: Math.round(totalValue),
        investedAmount: principal,
        wealthGained: Math.round(wealthGained),
        annualizedReturn: parseFloat(annualizedReturn.toFixed(2))
    };
}
