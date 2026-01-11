import { NextRequest, NextResponse } from 'next/server';

// Finnhub API - Free tier: 60 API calls/minute
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo'; // Use demo key for testing
const FINNHUB_API = 'https://finnhub.io/api/v1';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols');

    console.log('[API] Received request for symbols:', symbols);

    if (!symbols) {
        return NextResponse.json(
            { error: 'Missing symbols parameter' },
            { status: 400 }
        );
    }

    try {
        const symbolList = symbols.split(',').map(s => s.trim()).filter(Boolean);
        const results: any[] = [];

        console.log('[API] Fetching data for symbols:', symbolList);

        // Fetch each symbol from Finnhub
        for (const symbol of symbolList) {
            try {
                // Fetch quote data
                const quoteUrl = `${FINNHUB_API}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
                const profileUrl = `${FINNHUB_API}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;

                const [quoteRes, profileRes] = await Promise.all([
                    fetch(quoteUrl),
                    fetch(profileUrl)
                ]);

                if (quoteRes.ok && profileRes.ok) {
                    const quote = await quoteRes.json();
                    const profile = await profileRes.json();

                    // Only add if we got valid data
                    if (quote.c && quote.c > 0) {
                        const stockData = {
                            symbol: symbol,
                            longName: profile.name || symbol,
                            shortName: profile.name || symbol,
                            regularMarketPrice: quote.c, // Current price
                            regularMarketChange: quote.d, // Change
                            regularMarketChangePercent: quote.dp, // Change percent
                            regularMarketVolume: 0, // Finnhub doesn't provide volume in quote
                            marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : 0, // Convert from millions
                            trailingPE: profile.finnhubIndustry ? null : null, // PE not in free tier
                            forwardPE: null,
                        };

                        results.push(stockData);
                        console.log('[API] Successfully fetched:', symbol);
                    }
                } else {
                    console.error(`[API] Failed to fetch ${symbol}: quote ${quoteRes.status}, profile ${profileRes.status}`);
                }
            } catch (err) {
                console.error(`[API] Error fetching ${symbol}:`, err);
            }

            // Small delay to respect rate limits (60/min = 1 per second)
            await new Promise(resolve => setTimeout(resolve, 1100));
        }

        console.log('[API] Returning', results.length, 'results');

        // Return in Yahoo Finance v7 format for compatibility
        return NextResponse.json(
            {
                quoteResponse: {
                    result: results,
                    error: null,
                },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('[API] Error fetching stock data:', error);
        return NextResponse.json(
            {
                quoteResponse: {
                    result: [],
                    error: 'Failed to fetch stock data',
                },
            },
            {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}
