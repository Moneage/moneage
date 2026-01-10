"use client";

import { useEffect, useRef, memo, useState } from 'react';
import { getTickers } from '@/lib/api';

const DEFAULT_SYMBOLS = [
    {
        "proName": "FOREXCOM:SPXUSD",
        "title": "S&P 500"
    },
    {
        "proName": "FOREXCOM:NSXUSD",
        "title": "US 100"
    },
    {
        "proName": "FOREXCOM:DJI",
        "title": "Dow 30"
    },
    {
        "description": "Nifty 50",
        "proName": "NSE:NIFTY"
    },
    {
        "description": "Sensex",
        "proName": "BSE:SENSEX"
    },
    {
        "description": "DAX",
        "proName": "XETR:DAX"
    },
    {
        "description": "FTSE 100",
        "proName": "CURRENCYCOM:UK100"
    }
];

function MarketTicker() {
    const container = useRef<HTMLDivElement>(null);
    const [symbols, setSymbols] = useState(DEFAULT_SYMBOLS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSymbols() {
            try {
                const tickers = await getTickers();
                if (tickers && tickers.length > 0) {
                    const mapped = tickers.map((t: any) => ({
                        proName: t.symbol || t.proName, // Handle generic symbol field
                        title: t.title || t.description,
                        description: t.title || t.description
                    }));
                    setSymbols(mapped);
                }
            } catch (err) {
                // Fallback to default
            } finally {
                setLoading(false);
            }
        }
        fetchSymbols();
    }, []);

    useEffect(() => {
        if (!container.current || loading) return;

        // Clean up existing script/widget
        container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": symbols,
            "showSymbolLogo": true,
            "colorTheme": "light",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "en"
        });

        container.current.appendChild(script);
    }, [symbols, loading]);

    return (
        <div className="tradingview-widget-container mb-8 min-h-[72px]" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default memo(MarketTicker);
