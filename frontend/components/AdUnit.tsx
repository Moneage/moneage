import React from 'react';

type AdUnitProps = {
    slotId?: string;
    layout?: string;
    format?: string;
    responsive?: string;
    className?: string;
};

const AdUnit: React.FC<AdUnitProps> = ({
    slotId = '',
    layout = '',
    format = 'auto',
    responsive = 'true',
    className = '',
}) => {
    // Basic AdSense implementation placeholder
    if (!slotId) return null;

    return (
        <div className={`ad-container ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive}></ins>
        </div>
    );
};

export default AdUnit;
