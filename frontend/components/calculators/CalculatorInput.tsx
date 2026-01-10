"use client";

interface CalculatorInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    prefix?: string;
    suffix?: string;
}

export default function CalculatorInput({
    label,
    value,
    onChange,
    min,
    max,
    step,
    prefix = '',
    suffix = ''
}: CalculatorInputProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <span className="text-lg font-bold text-slate-900">
                    {prefix}{value.toLocaleString()}{suffix}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{prefix}{min.toLocaleString()}{suffix}</span>
                <span>{prefix}{max.toLocaleString()}{suffix}</span>
            </div>
        </div>
    );
}
