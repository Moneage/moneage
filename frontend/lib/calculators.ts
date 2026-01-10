export const calculateSIP = (monthlyInvestment: number, rate: number, years: number) => {
    const i = rate / 12 / 100;
    const n = years * 12;

    // Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
    const totalValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = monthlyInvestment * n;
    const wealthGained = totalValue - investedAmount;

    return {
        totalValue: Math.round(totalValue),
        investedAmount: Math.round(investedAmount),
        wealthGained: Math.round(wealthGained)
    };
};

export const calculateLumpsum = (investment: number, rate: number, years: number) => {
    // Formula: A = P(1 + r/n)^(nt) ... assuming annual compounding for lumpsum typically or essentially A = P(1+r)^t
    const totalValue = investment * Math.pow(1 + rate / 100, years);
    const investedAmount = investment;
    const wealthGained = totalValue - investedAmount;

    return {
        totalValue: Math.round(totalValue),
        investedAmount: Math.round(investedAmount),
        wealthGained: Math.round(wealthGained)
    };
};

export const calculateEMI = (loanAmount: number, rate: number, years: number) => {
    const r = rate / 12 / 100;
    const n = years * 12; // months

    // Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanAmount;

    return {
        emi: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalInterest)
    };
};
