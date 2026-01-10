export function calculateEMI(principal: number, rate: number, years: number) {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    // where P = principal, r = monthly interest rate, n = number of months
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: Math.round(principal),
    };
}
