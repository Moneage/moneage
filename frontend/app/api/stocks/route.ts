import { NextRequest, NextResponse } from 'next/server';

// Use v10 API which is more reliable
const YAHOO_QUOTE_API = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols');

    if (!symbols) {
        return NextResponse.json(
            { error: 'Missing symbols parameter' },
            { status: 400 }
        );
    }

    try {
        const symbolList = symbols.split(',');
        const results: any[] = [];

        // Fetch each symbol individually (more reliable than batch)
        for (const symbol of symbolList) {
            try {
                const url = `${YAHOO_QUOTE_API}/${symbol}?modules=price,summaryDetail`;
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

                        results.push({
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
                        });
                    }
                } else {
                    console.error(`Failed to fetch ${symbol}: ${response.status}`);
                }
            } catch (err) {
                console.error(`Error fetching ${symbol}:`, err);
            }
        }

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
                },
            }
        );
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json(
            {
                quoteResponse: {
                    result: [],
                    error: 'Failed to fetch stock data',
                }
            },
            { status: 200 } // Return 200 with empty results instead of 500
        );
    }
}
