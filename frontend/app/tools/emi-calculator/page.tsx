"use client";

import { useState, useEffect } from 'react';
import { calculateEMI } from '@/lib/calculators';
import CalculatorInput from '@/components/calculators/CalculatorInput';
import DonutChart from '@/components/calculators/DonutChart';
import { Landmark, TrendingUp, IndianRupee } from 'lucide-react';
import ArticleNewsletterCTA from '@/components/ArticleNewsletterCTA';

export default function EMICalculator() {
    const [loanAmount, setLoanAmount] = useState(50000); // Default $50,000
    const [rate, setRate] = useState(8.5);
    const [years, setYears] = useState(20);
    const [currency, setCurrency] = useState('$');
    const [results, setResults] = useState({ emi: 0, totalPayable: 0, totalInterest: 0 });

    const currencies = [
        { label: 'USD ($)', value: '$' },
        { label: 'INR (₹)', value: '₹' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
    ];

    useEffect(() => {
        setResults(calculateEMI(loanAmount, rate, years));
    }, [loanAmount, rate, years]);

    const chartData = [
        { name: 'Principal Amount', value: loanAmount, color: '#94a3b8' }, // Slate-400
        { name: 'Total Interest', value: results.totalInterest, color: '#16a34a' }, // Green-600
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">EMI Calculator</h1>
                <p className="text-xl text-slate-600">Plan your home, car, or personal loan repayments.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                {/* Inputs Section */}
                <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Loan Details</h2>
                        </div>

                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {currencies.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <CalculatorInput
                        label="Loan Amount"
                        value={loanAmount}
                        onChange={setLoanAmount}
                        min={500}
                        max={10000000}
                        step={100}
                        prefix={currency}
                    />
                    <CalculatorInput
                        label="Interest Rate (p.a)"
                        value={rate}
                        onChange={setRate}
                        min={1}
                        max={20}
                        step={0.1}
                        suffix="%"
                    />
                    <CalculatorInput
                        label="Loan Tenure"
                        value={years}
                        onChange={setYears}
                        min={1}
                        max={30}
                        step={1}
                        suffix=" Yr"
                    />
                </div>

                {/* Results Section */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                        <div className="text-center mb-8">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Monthly EMI</span>
                            <div className="text-5xl font-extrabold text-slate-900 mt-2 flex items-center justify-center gap-1">
                                <span className="text-slate-400">{currency}</span>
                                {results.emi.toLocaleString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                <span className="text-slate-500 text-xs font-bold uppercase">Total Interest</span>
                                <div className="text-lg font-bold text-green-600">{currency}{results.totalInterest.toLocaleString()}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                <span className="text-slate-500 text-xs font-bold uppercase">Total Payable</span>
                                <div className="text-lg font-bold text-slate-700">{currency}{results.totalPayable.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative">
                        <DonutChart data={chartData} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center opacity-20">
                                <Landmark className="w-16 h-16 text-slate-400 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-lg prose-slate max-w-none">
                <h2>How does an EMI Calculator work?</h2>
                <p>
                    Equated Monthly Installment (EMI) is the fixed amount you pay to a bank or lender each month to repay a loan.
                    It consists of both the principal amount and the interest on the loan.
                </p>
                <h3>Why use this calculator?</h3>
                <p>
                    Before taking a Home Loan, Car Loan, or Personal Loan, it is crucial to know your monthly outflow.
                    This tool helps you adjust the tenure and loan amount to find an EMI that fits your monthly budget.
                </p>
            </div>

            {/* Newsletter CTA */}
            <ArticleNewsletterCTA />
        </div>
    );
}
