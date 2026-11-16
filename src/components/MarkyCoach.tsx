import React, { useState } from 'react';
import mascotMarkyImg from '../assets/images/mascot_marky_1794665219034.jpg';
import { UI_TEXT } from '../i18n/translations';
import { Language } from '../types/marketup';
import { MarketupLogo } from './MarketupLogo';

export type MarkyMood = 'welcome' | 'tip' | 'celebrate' | 'encourage';

interface MarkyCoachProps {
  mood?: MarkyMood;
  title?: string;
  message: string;
  compact?: boolean;
  lang?: Language;
}

const MOOD_STYLES: Record<MarkyMood, string> = {
  welcome:
    'bg-gradient-to-r from-violet-100/90 via-fuchsia-50/80 to-blue-50 border-violet-300',
  tip: 'bg-gradient-to-r from-sky-100/80 to-indigo-50/80 border-sky-300',
  celebrate:
    'bg-gradient-to-r from-amber-100/90 via-yellow-50 to-emerald-50 border-amber-300',
  encourage:
    'bg-gradient-to-r from-rose-50/90 via-orange-50/70 to-amber-50/70 border-rose-200',
};

const MOOD_TITLE_COLOR: Record<MarkyMood, string> = {
  welcome: 'text-violet-900',
  tip: 'text-blue-900',
  celebrate: 'text-amber-900',
  encourage: 'text-rose-900',
};

export const MarkyCoach: React.FC<MarkyCoachProps> = ({
  mood = 'tip',
  title,
  message,
  compact = false,
  lang = 'fr',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border-2 p-4 shadow-xs ${MOOD_STYLES[mood]} transition-colors`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm ${
          compact ? 'h-12 w-12' : 'h-16 w-16'
        } flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src={mascotMarkyImg}
            alt="Marky, mascotte de MARKETUP"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <MarketupLogo size="sm" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-extrabold ${MOOD_TITLE_COLOR[mood]}`}>
          {title ?? UI_TEXT[lang].markyMoods[mood]}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-800">{message}</p>
      </div>
    </div>
  );
};
