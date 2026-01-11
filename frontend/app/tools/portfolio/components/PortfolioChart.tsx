'use client';

import { StockHolding } from '@/lib/portfolio/types';
import { calculateCurrentValue } from '@/lib/portfolio/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioChartProps {
    holdings: StockHolding[];
}

const COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
];

export default function PortfolioChart({ holdings }: PortfolioChartProps) {
    if (holdings.length === 0) {
        return null;
    }

    const data = holdings.map((holding) => ({
        name: holding.symbol,
        value: calculateCurrentValue(holding),
    })).filter((item) => item.value > 0);

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Composition</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(1) : '0'}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) =>
                            new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(value as number)
                        }
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
