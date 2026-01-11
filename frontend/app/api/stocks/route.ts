import { NextRequest, NextResponse } from 'next/server';

// Twelve Data API - Free tier: 8 calls/min, 800 calls/day
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || 'demo';
const TWELVE_DATA_API = 'https://api.twelvedata.com';

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

        // Fetch each symbol using Twelve Data
        for (const symbol of symbolList) {
            try {
                // Fetch quote and profile data
                const quoteUrl = `${TWELVE_DATA_API}/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
                const profileUrl = `${TWELVE_DATA_API}/profile?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;

                const [quoteRes, profileRes] = await Promise.all([
                    fetch(quoteUrl),
                    fetch(profileUrl)
                ]);

                if (quoteRes.ok) {
                    const quote = await quoteRes.json();
                    let profile: any = {};

                    if (profileRes.ok) {
                        profile = await profileRes.json();
                    }

                    // Only add if we got valid data
                    if (quote && quote.close && !quote.code) {
                        const stockData = {
                            symbol: quote.symbol || symbol,
                            longName: profile.name || quote.name || symbol,
                            shortName: profile.name || quote.name || symbol,
                            regularMarketPrice: parseFloat(quote.close) || 0,
                            regularMarketChange: parseFloat(quote.change) || 0,
                            regularMarketChangePercent: parseFloat(quote.percent_change) || 0,
                            regularMarketVolume: parseInt(quote.volume) || 0,
                            marketCap: parseInt(profile.market_cap) || 0,
                            trailingPE: parseFloat(profile.pe_ratio) || null,
                            forwardPE: null,
                        };

                        results.push(stockData);
                        console.log('[API] ✓ Successfully fetched:', symbol, `($${stockData.regularMarketPrice})`);
                    } else {
                        console.log('[API] ✗ No valid data for:', symbol, 'Error:', quote.code || quote.message);
                    }
                } else {
                    console.error(`[API] ✗ Failed to fetch ${symbol}: ${quoteRes.status}`);
                }
            } catch (err: any) {
                console.error(`[API] ✗ Error fetching ${symbol}:`, err.message || err);
            }

            // Rate limiting: 8 calls/min = 7.5s per call (we make 2 calls per symbol)
            // So wait 8 seconds between symbols
            await new Promise(resolve => setTimeout(resolve, 8000));
        }

        console.log('[API] Final results count:', results.length, 'out of', symbolList.length);

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
    } catch (error: any) {
        console.error('[API] Fatal error fetching stock data:', error.message || error);
        return NextResponse.json(
            {
                quoteResponse: {
                    result: [],
                    error: error.message || 'Failed to fetch stock data',
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
