'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
    data: Array<{ date: string; value: number }>;
    color: string;
    isPositive: boolean;
}

export default function MiniChart({ data, color, isPositive }: MiniChartProps) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="w-full h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis
                        dataKey="date"
                        hide
                    />
                    <YAxis
                        hide
                        domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                        labelStyle={{
                            color: '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                        }}
                        itemStyle={{
                            color: isPositive ? '#16a34a' : '#dc2626',
                            fontSize: '14px',
                            fontWeight: '700',
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
