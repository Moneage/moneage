export function calculateEMI(principal: number, rate: number, years: number) {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    // where P = principal, r = monthly interest rate, n = number of months
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;

    return {
        emi: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalInterest),
    };
}
