import { NextResponse } from 'next/server';

// Simple in-memory cache
let cachedData: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
    try {
        // Check cache
        if (cachedData && Date.now() - cacheTime < CACHE_DURATION) {
            return NextResponse.json({
                ...cachedData,
                cached: true,
            });
        }

        // Fetch market data (using Yahoo Finance API - free, no key needed)
        const marketData = await fetchMarketData();

        // Fetch Yahoo Finance summary
        const yfinanceSummary = await fetchYahooFinanceSummary();

        // Generate AI summary using Gemini
        const aiSummary = await generateAISummary(marketData);

        const response = {
            indices: marketData.indices,
            sectors: marketData.sectors,
            commodities: marketData.commodities,
            topGainers: marketData.topGainers,
            topLosers: marketData.topLosers,
            aiSummary,
            yfinanceSummary,
            lastUpdated: new Date().toISOString(),
            cached: false,
        };

        // Update cache
        cachedData = response;
        cacheTime = Date.now();

        return NextResponse.json(response);
    } catch (error) {
        console.error('Market summary error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch market summary' },
            { status: 500 }
        );
    }
}

async function fetchMarketData() {
    // Fetch major indices (including VIX)
    const indices = await fetchIndices();

    // Fetch sector performance
    const sectors = await fetchSectors();

    // Fetch commodities
    const commodities = await fetchCommodities();

    // Fetch top movers (gainers/losers)
    const movers = await fetchTopMovers();

    return {
        indices,
        sectors,
        commodities,
        topGainers: movers.gainers,
        topLosers: movers.losers,
    };
}

async function fetchIndices() {
    // Using Yahoo Finance API (free alternative)
    const symbols = ['^GSPC', '^DJI', '^IXIC', '^VIX']; // Added VIX
    const indices: any = {};

    try {
        // Fetch data for each index
        for (const symbol of symbols) {
            // Fetch 5-day data for charts
            const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
                { next: { revalidate: 3600 } } // Cache for 1 hour
            );
            const data = await response.json();

            const quote = data.chart.result[0];
            const meta = quote.meta;
            const current = meta.regularMarketPrice;
            const previous = meta.chartPreviousClose;
            const change = current - previous;
            const changePercent = (change / previous) * 100;

            // Extract historical data for charts
            const timestamps = quote.timestamp || [];
            const prices = quote.indicators.quote[0].close || [];

            const chartData = timestamps.map((timestamp: number, index: number) => ({
                date: new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: prices[index] ? parseFloat(prices[index].toFixed(2)) : null,
            })).filter((item: any) => item.value !== null);

            let key = 'sp500';
            if (symbol === '^GSPC') key = 'sp500';
            else if (symbol === '^DJI') key = 'dow';
            else if (symbol === '^IXIC') key = 'nasdaq';
            else if (symbol === '^VIX') key = 'vix';

            indices[key] = {
                value: current.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
                chartData, // Add historical data
            };
        }
    } catch (error) {
        console.error('Error fetching indices:', error);
        // Return mock data as fallback
        return {
            sp500: { value: '4500.00', change: '15.50', changePercent: '0.35', chartData: [] },
            dow: { value: '35000.00', change: '120.00', changePercent: '0.34', chartData: [] },
            nasdaq: { value: '14000.00', change: '-25.00', changePercent: '-0.18', chartData: [] },
            vix: { value: '18.50', change: '-0.75', changePercent: '-3.90', chartData: [] },
        };
    }

    return indices;
}

async function fetchSectors() {
    // Sector ETF symbols
    const sectorETFs = {
        'XLK': 'Technology',
        'XLF': 'Financials',
        'XLV': 'Healthcare',
        'XLE': 'Energy',
        'XLI': 'Industrials',
        'XLY': 'Consumer Discretionary',
        'XLP': 'Consumer Staples',
        'XLB': 'Materials',
        'XLRE': 'Real Estate',
        'XLU': 'Utilities',
        'XLC': 'Communication Services',
    };

    const sectors: any[] = [];

    try {
        for (const [symbol, name] of Object.entries(sectorETFs)) {
            const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
                { next: { revalidate: 3600 } }
            );
            const data = await response.json();

            const quote = data.chart.result[0];
            const meta = quote.meta;
            const current = meta.regularMarketPrice;
            const previous = meta.chartPreviousClose;
            const change = current - previous;
            const changePercent = (change / previous) * 100;

            sectors.push({
                symbol,
                name,
                changePercent: changePercent.toFixed(2),
            });
        }

        // Sort by performance
        sectors.sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent));
    } catch (error) {
        console.error('Error fetching sectors:', error);
        // Return mock data
        return [
            { symbol: 'XLK', name: 'Technology', changePercent: '1.25' },
            { symbol: 'XLF', name: 'Financials', changePercent: '0.85' },
            { symbol: 'XLV', name: 'Healthcare', changePercent: '0.45' },
            { symbol: 'XLE', name: 'Energy', changePercent: '-0.35' },
            { symbol: 'XLI', name: 'Industrials', changePercent: '-0.55' },
        ];
    }

    return sectors;
}

async function fetchCommodities() {
    const commoditySymbols = {
        'GC=F': 'Gold',
        'CL=F': 'Crude Oil',
        'BTC-USD': 'Bitcoin',
    };

    const commodities: any[] = [];

    try {
        for (const [symbol, name] of Object.entries(commoditySymbols)) {
            const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
                { next: { revalidate: 3600 } }
            );
            const data = await response.json();

            const quote = data.chart.result[0];
            const meta = quote.meta;
            const current = meta.regularMarketPrice;
            const previous = meta.chartPreviousClose;
            const change = current - previous;
            const changePercent = (change / previous) * 100;

            commodities.push({
                symbol,
                name,
                value: current.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
            });
        }
    } catch (error) {
        console.error('Error fetching commodities:', error);
        // Return mock data
        return [
            { symbol: 'GC=F', name: 'Gold', value: '2050.00', change: '12.50', changePercent: '0.61' },
            { symbol: 'CL=F', name: 'Crude Oil', value: '75.50', change: '-1.25', changePercent: '-1.63' },
            { symbol: 'BTC-USD', name: 'Bitcoin', value: '45000.00', change: '850.00', changePercent: '1.93' },
        ];
    }

    return commodities;
}

async function fetchTopMovers() {
    try {
        // Fetch top gainers and losers from Yahoo Finance screener
        const gainersResponse = await fetch(
            'https://query1.finance.yahoo.com/v1/finance/screener?scrIds=day_gainers&count=5',
            { next: { revalidate: 3600 } }
        );
        const losersResponse = await fetch(
            'https://query1.finance.yahoo.com/v1/finance/screener?scrIds=day_losers&count=5',
            { next: { revalidate: 3600 } }
        );

        const gainersData = await gainersResponse.json();
        const losersData = await losersResponse.json();

        const gainers = gainersData.finance.result[0].quotes.slice(0, 5).map((q: any) => ({
            symbol: q.symbol,
            name: q.shortName || q.longName,
            price: q.regularMarketPrice?.toFixed(2) || '0.00',
            change: q.regularMarketChange?.toFixed(2) || '0.00',
            changePercent: q.regularMarketChangePercent?.toFixed(2) || '0.00',
        }));

        const losers = losersData.finance.result[0].quotes.slice(0, 5).map((q: any) => ({
            symbol: q.symbol,
            name: q.shortName || q.longName,
            price: q.regularMarketPrice?.toFixed(2) || '0.00',
            change: q.regularMarketChange?.toFixed(2) || '0.00',
            changePercent: q.regularMarketChangePercent?.toFixed(2) || '0.00',
        }));

        return { gainers, losers };
    } catch (error) {
        console.error('Error fetching movers:', error);
        // Return mock data as fallback with 5 stocks each
        return {
            gainers: [
                { symbol: 'AAPL', name: 'Apple Inc.', price: '175.50', change: '8.25', changePercent: '4.93' },
                { symbol: 'MSFT', name: 'Microsoft Corp.', price: '380.00', change: '12.50', changePercent: '3.40' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '142.50', change: '4.75', changePercent: '3.45' },
                { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '155.00', change: '5.20', changePercent: '3.47' },
                { symbol: 'META', name: 'Meta Platforms Inc.', price: '385.00', change: '11.50', changePercent: '3.08' },
            ],
            losers: [
                { symbol: 'TSLA', name: 'Tesla Inc.', price: '245.00', change: '-15.50', changePercent: '-5.95' },
                { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '520.00', change: '-18.00', changePercent: '-3.35' },
                { symbol: 'AMD', name: 'Advanced Micro Devices', price: '145.00', change: '-4.50', changePercent: '-3.01' },
                { symbol: 'NFLX', name: 'Netflix Inc.', price: '485.00', change: '-12.00', changePercent: '-2.41' },
                { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: '62.50', change: '-1.50', changePercent: '-2.34' },
            ],
        };
    }
}

async function fetchYahooFinanceSummary() {
    try {
        // Fetch market summary from Yahoo Finance
        const response = await fetch(
            'https://query1.finance.yahoo.com/v1/finance/trending/US?count=10',
            { next: { revalidate: 3600 } }
        );
        const data = await response.json();

        // Extract market summary if available
        if (data.finance?.result?.[0]?.quotes) {
            const trendingStocks = data.finance.result[0].quotes.slice(0, 3);
            const symbols = trendingStocks.map((q: any) => q.symbol).join(', ');

            return `Market activity shows heightened interest in ${symbols} among trending securities. ` +
                `Trading volumes indicate active participation across major exchanges. ` +
                `Investors are monitoring key economic indicators and corporate earnings reports. ` +
                `Market sentiment reflects ongoing assessment of macroeconomic conditions and Federal Reserve policy outlook.`;
        }

        // Fallback summary
        return `U.S. markets are actively trading with investors monitoring economic data and corporate earnings. ` +
            `Major indices are reflecting mixed sentiment as market participants assess current economic conditions. ` +
            `Trading activity remains robust across technology, financial, and healthcare sectors. ` +
            `Investors continue to evaluate Federal Reserve policy decisions and their impact on market valuations.`;
    } catch (error) {
        console.error('Error fetching Yahoo Finance summary:', error);
        return `Market activity continues with investors monitoring key economic indicators. ` +
            `Trading volumes reflect ongoing market participation across major sectors. ` +
            `Market participants are assessing current economic conditions and policy developments.`;
    }
}

async function generateAISummary(marketData: any) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not set, using fallback summary');
        return generateFallbackSummary(marketData);
    }

    try {
        const prompt = `Analyze today's stock market performance based on the following data:

Major Indices:
- S&P 500: ${marketData.indices.sp500.value} (${marketData.indices.sp500.changePercent}%)
- Dow Jones: ${marketData.indices.dow.value} (${marketData.indices.dow.changePercent}%)
- Nasdaq: ${marketData.indices.nasdaq.value} (${marketData.indices.nasdaq.changePercent}%)

Top Gainers: ${marketData.topGainers.map((g: any) => `${g.symbol} (+${g.changePercent}%)`).join(', ')}
Top Losers: ${marketData.topLosers.map((l: any) => `${l.symbol} (${l.changePercent}%)`).join(', ')}

Provide a concise 3-4 sentence summary covering:
1. Overall market sentiment (bullish/bearish/mixed)
2. Key drivers of today's movements
3. Notable sector or stock trends

Keep it professional and informative for retail investors. Do not use markdown formatting.`;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }],
                    }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;

        return summary;
    } catch (error) {
        console.error('Error generating AI summary:', error);
        return generateFallbackSummary(marketData);
    }
}

function generateFallbackSummary(marketData: any) {
    const sp500Change = parseFloat(marketData.indices.sp500.changePercent);
    const sentiment = sp500Change > 0.5 ? 'bullish' : sp500Change < -0.5 ? 'bearish' : 'mixed';

    return `Today's market showed ${sentiment} sentiment with the S&P 500 ${sp500Change > 0 ? 'gaining' : 'losing'} ${Math.abs(sp500Change).toFixed(2)}%. ` +
        `The Dow Jones ${parseFloat(marketData.indices.dow.changePercent) > 0 ? 'rose' : 'fell'} ${Math.abs(parseFloat(marketData.indices.dow.changePercent)).toFixed(2)}%, ` +
        `while the Nasdaq ${parseFloat(marketData.indices.nasdaq.changePercent) > 0 ? 'advanced' : 'declined'} ${Math.abs(parseFloat(marketData.indices.nasdaq.changePercent)).toFixed(2)}%. ` +
        `Top performers included ${marketData.topGainers[0]?.symbol || 'technology stocks'}, while ${marketData.topLosers[0]?.symbol || 'energy stocks'} faced pressure. ` +
        `Investors are closely monitoring economic indicators and corporate earnings reports.`;
}
