import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  const [location] = useLocation();

  useEffect(() => {
    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    };

    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-4790736891747221"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
      data-testid="adsense-ad"
    />
  );
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
