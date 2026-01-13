'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    className?: string;
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
    layoutKey?: string;
    placement?: string;
}

const AdUnit = ({
    className = "",
    slot,
    format = 'auto',
    responsive = true,
    style = { display: 'block' },
    layoutKey,
    placement
}: AdUnitProps) => {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            const ads = (window as any).adsbygoogle;
            if (ads) {
                // Check if this specific ad slot is already filled to prevent errors
                if (adRef.current && adRef.current.innerHTML === "") {
                    ads.push({});
                }
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    if (process.env.NODE_ENV === 'development') {
        return (
            <div className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center ${className}`}>
                <p className="text-xs text-slate-500 font-mono">AdSense Placeholder (Dev Mode)</p>
                <p className="text-xs text-slate-400 mt-1">Slot: {slot || 'Auto'}</p>
            </div>
        );
    }

    return (
        <div className={`ad-container my-8 ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-3761489603441542"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
};

export default AdUnit;
