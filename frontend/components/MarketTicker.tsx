"use client";

import { useEffect, useRef, memo } from 'react';

function MarketTicker() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clean up existing script if any (though React usually handles this with empty dep array for mount only, 
        // strict mode might trigger twice, so checking for children is good practice)
        if (container.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
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
            ],
            "showSymbolLogo": true,
            "colorTheme": "light",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "en"
        });

        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container mb-8" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright text-xs text-slate-400 mt-2 text-center">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" className="hover:text-blue-600 transition-colors">
                    Market Data by TradingView
                </a>
            </div>
        </div>
    );
}

export default memo(MarketTicker);
