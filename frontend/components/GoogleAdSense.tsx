import Script from "next/script";

const GoogleAdSense = () => {
    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
};

export default GoogleAdSense;
