"use client";

import { useState, useEffect } from 'react';
import { calculateROI } from '@/lib/calculators/roi';
import CalculatorInput from '@/components/calculators/CalculatorInput';
import DonutChart from '@/components/calculators/DonutChart';
import { RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

const currencies = [
    { label: 'INR (₹)', value: '₹' },
    { label: 'USD ($)', value: '$' },
    { label: 'EUR (€)', value: '€' },
    { label: 'GBP (£)', value: '£' },
];

export default function ROICalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(5);
    const [currency, setCurrency] = useState('₹');
    const [results, setResults] = useState({ totalValue: 0, investedAmount: 0, wealthGained: 0, annualizedReturn: 0 });

    useEffect(() => {
        setResults(calculateROI(principal, rate, years));
    }, [principal, rate, years]);

    const chartData = [
        { name: 'Invested Amount', value: results.investedAmount, color: '#94a3b8' }, // Slate-400
        { name: 'Est. Returns', value: results.wealthGained, color: '#2563eb' }, // Blue-600
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Lumpsum / ROI Calculator</h1>
                <p className="text-xl text-slate-600">Calculate the future value of your one-time investment.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                {/* Inputs Section */}
                <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Configuration</h2>
                        </div>

                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {currencies.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <CalculatorInput
                        label="Total Investment"
                        value={principal}
                        onChange={setPrincipal}
                        min={1000}
                        max={10000000}
                        step={1000}
                        prefix={currency}
                    />
                    <CalculatorInput
                        label="Expected Return Rate (p.a)"
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
                        max={40}
                        step={1}
                        suffix=" Yr"
                    />
                </div>

                {/* Results Section */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                        <div className="text-center mb-8">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Total Value</span>
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
                                <span className="text-blue-600 text-xs font-bold uppercase">Wealth Gained</span>
                                <div className="text-lg font-bold text-blue-600">+{currency}{results.wealthGained.toLocaleString()}</div>
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
                <h2>What is ROI (Return on Investment)?</h2>
                <p>
                    Return on Investment (ROI) is a performance measure used to evaluate the efficiency of an investment.
                    It compares the gain or loss from an investment relative to its cost.
                </p>
                <h3>How to use this calculator?</h3>
                <p>
                    Enter your initial investment amount, the expected annual interest rate, and the duration of the investment.
                    The calculator will show you the future value of your money and the total wealth gained through compounding.
                </p>
            </div>
        </div>
    );
}
