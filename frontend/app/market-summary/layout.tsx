import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Market Summary - Daily Stock Market Analysis | Moneage',
    description: 'Get AI-powered daily stock market summary with real-time indices, top gainers, losers, and expert market analysis powered by Gemini AI.',
    keywords: 'stock market summary, market analysis, S&P 500, Dow Jones, Nasdaq, top gainers, top losers, AI market analysis',
    openGraph: {
        title: 'Market Summary - Daily Stock Market Analysis',
        description: 'AI-powered daily stock market summary with real-time data and expert analysis',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
