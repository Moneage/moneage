import Link from 'next/link';
import { Calculator, TrendingUp, Landmark, Percent, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Financial Tools & Calculators - Moneage',
    description: 'Free financial calculators to help you plan your investments, loans, and savings. SIP, EMI, and Compound Interest calculators.',
};

export default function ToolsPage() {
    const tools = [
        {
            title: "SIP Calculator",
            description: "Calculate returns on your monthly mutual fund investments.",
            icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
            href: "/tools/sip-calculator",
            color: "bg-blue-50 border-blue-100"
        },
        {
            title: "EMI Calculator",
            description: "Plan your home or car loan repayments effectively.",
            icon: <Landmark className="w-8 h-8 text-green-600" />,
            href: "/tools/emi-calculator",
            color: "bg-green-50 border-green-100"
        },
        {
            title: "Compound Interest",
            description: "Visualize the power of compounding on your savings.",
            icon: <Percent className="w-8 h-8 text-purple-600" />,
            href: "/tools/compound-interest-calculator", // Placeholder for next step
            color: "bg-purple-50 border-purple-100"
        },
        {
            title: "ROI Calculator",
            description: "Calculate the future value of your lumpsum investment.",
            icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
            href: "/tools/roi-calculator",
            color: "bg-yellow-50 border-yellow-100"
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-4 inline-block">
                    Free Tools
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Financial Calculators</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Plan your financial future with our suite of free, easy-to-use calculators.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool) => (
                    <Link key={tool.title} href={tool.href} className="group">
                        <div className={`h-full p-8 rounded-2xl border ${tool.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                            <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 text-slate-700 group-hover:scale-110 transition-transform">
                                {tool.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                {tool.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {tool.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
