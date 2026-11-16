import React from 'react';

interface MarketupLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withBadge?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<MarketupLogoProps['size']>, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
};

export const MarketupLogo: React.FC<MarketupLogoProps> = ({
  className = '',
  size = 'sm',
  withBadge = true,
}) => {
  const dimensionClass = SIZE_CLASSES[size];

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dimensionClass} shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mu-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="55%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="mu-arrow" x1="16" y1="44" x2="50" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>

      {withBadge && (
        <>
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#mu-bg)" />
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="15"
            stroke="#FFFFFF"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
        </>
      )}

      {/* Three ascending marketing growth bars */}
      <rect x="13" y="37" width="8" height="14" rx="3" fill="#38BDF8" />
      <rect x="26" y="30" width="8" height="21" rx="3" fill="#34D399" />
      <rect x="39" y="22" width="8" height="29" rx="3" fill="#FBBF24" />

      {/* Dynamic M-wave + upward breakthrough arrow */}
      <path
        d="M12 31L22 21L30 28L47 13"
        stroke="url(#mu-arrow)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.5 12.5H48.5V22.5"
        stroke="url(#mu-arrow)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Playful mastery spark */}
      <path
        d="M52 10L53.4 13.1L56.5 14.5L53.4 15.9L52 19L50.6 15.9L47.5 14.5L50.6 13.1L52 10Z"
        fill="#FDE047"
      />
    </svg>
  );
};
