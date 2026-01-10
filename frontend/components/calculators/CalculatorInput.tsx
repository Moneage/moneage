"use client";

import React from 'react';

interface CalculatorInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    suffix?: string;
}

export default function CalculatorInput({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    prefix = '',
    suffix = ''
}: CalculatorInputProps) {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <label className="text-slate-700 font-semibold text-lg">{label}</label>
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    {prefix && <span className="text-blue-600 font-bold mr-1">{prefix}</span>}
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) onChange(val);
                        }}
                        className="w-24 bg-transparent text-right font-bold text-slate-900 border-none outline-none focus:ring-0 p-0"
                    />
                    {suffix && <span className="text-slate-500 font-medium ml-1 text-sm">{suffix}</span>}
                </div>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>{prefix}{min.toLocaleString()}{suffix}</span>
                <span>{prefix}{max.toLocaleString()}{suffix}</span>
            </div>
        </div>
    );
}
