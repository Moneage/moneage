"use client";

interface DonutChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
}

export default function DonutChart({ data }: DonutChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        return {
            ...item,
            percentage,
            startAngle,
            endAngle: currentAngle,
        };
    });

    const createArc = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(50, 50, 40, endAngle);
        const end = polarToCartesian(50, 50, 40, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M', start.x, start.y,
            'A', 40, 40, 0, largeArcFlag, 0, end.x, end.y,
            'L', 50, 50,
            'Z'
        ].join(' ');
    };

    function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    return (
        <div className="w-full">
            <svg viewBox="0 0 100 100" className="w-full h-auto max-w-xs mx-auto">
                {segments.map((segment, index) => (
                    <path
                        key={index}
                        d={createArc(segment.startAngle, segment.endAngle)}
                        fill={segment.color}
                    />
                ))}
                <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
            <div className="mt-4 space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                            {((item.value / total) * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
