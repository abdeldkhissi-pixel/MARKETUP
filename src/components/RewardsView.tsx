import React from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Crown,
  Footprints,
  Globe,
  Lock,
  Search,
  Share2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { BADGES, LEVELS } from '../data/glossaryAndGamification';
import { BADGE_EN_MAP, LEVEL_EN_MAP, UI_TEXT } from '../i18n/translations';
import { UserProgress } from '../types/marketup';
import { getLevelForXp } from '../utils/storage';

interface RewardsViewProps {
  progress: UserProgress;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Crown,
  Globe,
  Search,
  Award,
  Share2,
  BarChart3,
  Trophy,
};

const XP_CARD_COLORS = [
  'border-violet-200 bg-violet-50 text-violet-900',
  'border-blue-200 bg-blue-50 text-blue-900',
  'border-emerald-200 bg-emerald-50 text-emerald-900',
  'border-amber-200 bg-amber-50 text-amber-900',
  'border-rose-200 bg-rose-50 text-rose-900',
];

export const RewardsView: React.FC<RewardsViewProps> = ({ progress }) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].rewards;
  const levelInfo = getLevelForXp(progress.xp);
  const unlockedSet = new Set(progress.unlockedBadgeIds);

  const currentLevelTitle =
    lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.current.level]?.title ?? levelInfo.current.title
      : levelInfo.current.title;
  const currentLevelDesc =
    lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.current.level]?.description ??
        levelInfo.current.description
      : levelInfo.current.description;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-xs sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
          {t.tag}
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.subtitle}</p>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-800 via-indigo-800 to-blue-700 p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold text-amber-300">
                {t.currentRank(levelInfo.current.level)}
              </p>
              <h2 className="font-display mt-1 text-2xl font-extrabold">
                {currentLevelTitle}
              </h2>
              <p className="mt-1 text-xs text-violet-100">{currentLevelDesc}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-mono-num text-3xl font-extrabold text-amber-300">
                {progress.xp.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} XP
              </p>
              <p className="text-xs text-violet-100">
                {levelInfo.next ? t.nextAt(levelInfo.next.minXp) : t.maxRank}
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6">
        <h2 className="font-display text-lg font-extrabold text-slate-950">
          {t.howXpTitle}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {t.xpSources.map((row, idx) => (
            <div
              key={row.label}
              className={`rounded-2xl border-2 p-4 ${
                XP_CARD_COLORS[idx % XP_CARD_COLORS.length]
              }`}
            >
              <p className="font-mono-num text-lg font-extrabold">{row.xp}</p>
              <p className="mt-1 text-xs font-bold">{row.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-extrabold text-slate-950">
          {t.badgesTitle(progress.unlockedBadgeIds.length, BADGES.length)}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge) => {
            const unlocked = unlockedSet.has(badge.id);
            const Icon = ICON_MAP[badge.iconName] ?? Trophy;
            const en = lang === 'en' ? BADGE_EN_MAP[badge.id] : undefined;

            return (
              <div
                key={badge.id}
                className={`flex flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
                  unlocked
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        unlocked
                          ? 'bg-gradient-to-br from-violet-700 to-blue-600 text-amber-300 shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {unlocked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                  </div>

                  <h3 className="font-display mt-3 text-base font-extrabold text-slate-950">
                    {en?.title ?? badge.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {en?.description ?? badge.description}
                  </p>
                </div>

                <p className="mt-4 border-t border-slate-200/70 pt-3 text-[11px] font-bold text-blue-700">
                  {t.conditionLabel(en?.criteriaText ?? badge.criteriaText)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-extrabold text-slate-950">
          {t.ladderTitle}
        </h2>
        <div className="mt-5 space-y-3">
          {LEVELS.map((lvl) => {
            const reached = progress.xp >= lvl.minXp;
            const isCurrent = levelInfo.current.level === lvl.level;
            const en = lang === 'en' ? LEVEL_EN_MAP[lvl.level] : undefined;

            return (
              <div
                key={lvl.level}
                className={`flex flex-col justify-between gap-2 rounded-2xl border-2 p-4 sm:flex-row sm:items-center ${
                  isCurrent
                    ? 'border-violet-600 bg-violet-50'
                    : reached
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono-num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      reached
                        ? 'bg-gradient-to-br from-violet-700 to-blue-600 text-amber-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {lvl.level}
                  </span>
                  <div>
                    <p className="font-display text-sm font-extrabold text-slate-950">
                      {en?.title ?? lvl.title}
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                          <Sparkles className="h-3.5 w-3.5" />
                          {t.currentBadge}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-600">
                      {en?.description ?? lvl.description}
                    </p>
                  </div>
                </div>

                <span className="font-mono-num text-xs font-extrabold text-slate-700 whitespace-nowrap shrink-0">
                  {t.xpRequired(lvl.minXp)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
