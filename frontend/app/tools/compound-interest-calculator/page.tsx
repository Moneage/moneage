"use client";

import { useState, useEffect } from 'react';
import { calculateLumpsum } from '@/lib/calculators';
import CalculatorInput from '@/components/calculators/CalculatorInput';
import DonutChart from '@/components/calculators/DonutChart';
import { Percent, TrendingUp, IndianRupee } from 'lucide-react';
import ArticleNewsletterCTA from '@/components/ArticleNewsletterCTA';

export default function CompoundCalculator() {
    const [investment, setInvestment] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [currency, setCurrency] = useState('$');
    const [results, setResults] = useState({ totalValue: 0, investedAmount: 0, wealthGained: 0 });

    const currencies = [
        { label: 'USD ($)', value: '$' },
        { label: 'INR (₹)', value: '₹' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
    ];

    useEffect(() => {
        setResults(calculateLumpsum(investment, rate, years));
    }, [investment, rate, years]);

    const chartData = [
        { name: 'Invested Amount', value: results.investedAmount, color: '#94a3b8' }, // Slate-400
        { name: 'Wealth Gained', value: results.wealthGained, color: '#9333ea' }, // Purple-600
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Compound Interest Calculator</h1>
                <p className="text-xl text-slate-600">Visualize the power of compounding on your investments.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                {/* Inputs Section */}
                <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Percent className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Investment Details</h2>
                        </div>

                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {currencies.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <CalculatorInput
                        label="Initial Investment"
                        value={investment}
                        onChange={setInvestment}
                        min={1000}
                        max={10000000}
                        step={1000}
                        prefix={currency}
                    />
                    <CalculatorInput
                        label="Interest Rate (p.a)"
                        value={rate}
                        onChange={setRate}
                        min={1}
                        max={30}
                        step={0.5}
                        suffix="%"
                    />
                    <CalculatorInput
                        label="Time Period"
                        value={years}
                        onChange={setYears}
                        min={1}
                        max={50}
                        step={1}
                        suffix=" Yr"
                    />
                </div>

                {/* Results Section */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                        <div className="text-center mb-8">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Future Value</span>
                            <div className="text-5xl font-extrabold text-slate-900 mt-2 flex items-center justify-center gap-1">
                                <span className="text-slate-400">{currency}</span>
                                {results.totalValue.toLocaleString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                <span className="text-slate-500 text-xs font-bold uppercase">Invested</span>
                                <div className="text-lg font-bold text-slate-700">{currency}{results.investedAmount.toLocaleString()}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                <span className="text-purple-600 text-xs font-bold uppercase">Wealth Gained</span>
                                <div className="text-lg font-bold text-purple-600">+{currency}{results.wealthGained.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative">
                        <DonutChart data={chartData} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center opacity-20">
                                <TrendingUp className="w-16 h-16 text-slate-400 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-lg prose-slate max-w-none">
                <h2>What is Compound Interest?</h2>
                <p>
                    Compound interest is often called the "eighth wonder of the world". It is the interest on your deposit,
                    plus the interest you've already earned. In simple terms, your money earns money, and then that new money earns even more money.
                </p>
                <h3>About this calculator</h3>
                <p>
                    This tool calculates the future value of a one-time (lumpsum) investment.
                    It is perfect for Fixed Deposits (FDs), Bonds, or long-term stock market investments.
                </p>
            </div>
        </div>
    );
}
