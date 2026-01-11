import { NextRequest, NextResponse } from 'next/server';

// Use v10 API which is more reliable
const YAHOO_QUOTE_API = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary';

export const runtime = 'edge'; // Use edge runtime for better performance
export const dynamic = 'force-dynamic'; // Always run dynamically

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

        // Fetch each symbol individually (more reliable than batch)
        for (const symbol of symbolList) {
            try {
                const url = `${YAHOO_QUOTE_API}/${symbol}?modules=price,summaryDetail`;
                console.log('[API] Fetching:', symbol);

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': '*/*',
                        'Accept-Language': 'en-US,en;q=0.9',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const quoteSummary = data.quoteSummary?.result?.[0];

                    if (quoteSummary) {
                        const price = quoteSummary.price;
                        const summary = quoteSummary.summaryDetail;

                        const stockData = {
                            symbol: price.symbol,
                            longName: price.longName,
                            shortName: price.shortName,
                            regularMarketPrice: price.regularMarketPrice?.raw || 0,
                            regularMarketChange: price.regularMarketChange?.raw || 0,
                            regularMarketChangePercent: price.regularMarketChangePercent?.raw || 0,
                            regularMarketVolume: price.regularMarketVolume?.raw || 0,
                            marketCap: price.marketCap?.raw || 0,
                            trailingPE: summary?.trailingPE?.raw || null,
                            forwardPE: summary?.forwardPE?.raw || null,
                        };

                        results.push(stockData);
                        console.log('[API] Successfully fetched:', symbol, stockData);
                    } else {
                        console.log('[API] No quote summary for:', symbol);
                    }
                } else {
                    console.error(`[API] Failed to fetch ${symbol}: ${response.status}`);
                }
            } catch (err) {
                console.error(`[API] Error fetching ${symbol}:`, err);
            }
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
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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
                }
            },
            {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
}
