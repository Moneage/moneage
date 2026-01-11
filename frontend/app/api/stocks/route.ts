import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export const runtime = 'nodejs';
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

        // Fetch each symbol using yahoo-finance2
        for (const symbol of symbolList) {
            try {
                console.log(`[API] Attempting to fetch ${symbol}...`);

                // Fetch quote data with error handling
                const quote: any = await yahooFinance.quote(symbol, {
                    return: 'object'
                });

                console.log(`[API] Raw response for ${symbol}:`, JSON.stringify(quote).substring(0, 200));

                if (quote && quote.regularMarketPrice) {
                    const stockData = {
                        symbol: quote.symbol,
                        longName: quote.longName || quote.shortName || quote.symbol,
                        shortName: quote.shortName || quote.symbol,
                        regularMarketPrice: quote.regularMarketPrice || 0,
                        regularMarketChange: quote.regularMarketChange || 0,
                        regularMarketChangePercent: quote.regularMarketChangePercent || 0,
                        regularMarketVolume: quote.regularMarketVolume || 0,
                        marketCap: quote.marketCap || 0,
                        trailingPE: quote.trailingPE || null,
                        forwardPE: quote.forwardPE || null,
                    };

                    results.push(stockData);
                    console.log('[API] ✓ Successfully fetched:', symbol, `($${stockData.regularMarketPrice})`);
                } else {
                    console.log('[API] ✗ No valid data for:', symbol, 'regularMarketPrice:', quote?.regularMarketPrice);
                }
            } catch (err: any) {
                console.error(`[API] ✗ Error fetching ${symbol}:`, err.message || err);
            }
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
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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
