import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe,
  Layers,
  ShieldCheck,
  Sliders,
  Trophy,
} from 'lucide-react';
import heroMarketupImg from '../assets/images/hero_marketup_learning_1794665218339.jpg';
import {
  TOTAL_CHAPTERS_COUNT,
  TOTAL_DOMAINS_COUNT,
  TOTAL_EXERCISES_COUNT,
  TOTAL_LESSONS_COUNT,
} from '../data/curriculum';
import { UI_TEXT } from '../i18n/translations';
import { Language, UserProgress } from '../types/marketup';
import { MarkyCoach } from './MarkyCoach';

interface HomeViewProps {
  progress: UserProgress;
  onStartLearning: () => void;
  onExploreDomains: () => void;
  onOpenSimulators: () => void;
  onOpenPlacementTest: () => void;
  onChangeLanguage: (lang: Language) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  onStartLearning,
  onExploreDomains,
  onOpenSimulators,
  onOpenPlacementTest,
  onChangeLanguage,
}) => {
  const [heroError, setHeroError] = useState(false);
  const lang: Language = progress.language === 'en' ? 'en' : 'fr';
  const t = UI_TEXT[lang].home;
  const hasStarted = progress.completedLessonIds.length > 0 || progress.xp > 0;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-gradient-to-b from-violet-50/70 via-slate-50 to-sky-50/60 text-slate-900">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
          <button
            type="button"
            onClick={onStartLearning}
            className="flex items-center gap-1.5 font-display text-base font-extrabold tracking-tight text-violet-950 whitespace-nowrap shrink-0 sm:gap-2 sm:text-xl"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-blue-600 text-amber-300 shadow-xs sm:h-8 sm:w-8">
              <Compass className="h-4 w-4" />
            </span>
            MARKETUP
          </button>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <button
              type="button"
              onClick={onExploreDomains}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-violet-700"
            >
              {t.topDomains}
            </button>
            <button
              type="button"
              onClick={onOpenSimulators}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-blue-600"
            >
              {t.topSimulators}
            </button>
            <button
              type="button"
              onClick={onOpenPlacementTest}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-violet-700"
            >
              {t.topLevelTest}
            </button>
            <a
              href="#avantages"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-blue-600"
            >
              {t.topMethod}
            </a>
          </nav>

          <div className="flex items-center gap-1.5 shrink-0 sm:gap-2.5">
            <div
              className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-[11px] font-bold sm:text-xs"
              role="group"
              aria-label="Language"
            >
              <Globe className="ml-1 mr-0.5 hidden h-3.5 w-3.5 text-violet-700 sm:inline" />
              {(['fr', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeLanguage(code)}
                  className={`rounded-lg px-1.5 py-1 uppercase transition-colors sm:px-2 ${
                    lang === code
                      ? 'bg-violet-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onStartLearning}
              className="rounded-xl border-b-4 border-violet-950 bg-violet-700 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-violet-600 active:translate-y-0.5 active:border-b-0 whitespace-nowrap shrink-0 sm:px-4 sm:py-2 sm:text-sm"
            >
              {hasStarted ? t.topContinue : t.topStart}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10 lg:py-14">
        {/* Hero Split */}
        <section className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 flex flex-col justify-between rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-blue-50/40 p-5 shadow-sm sm:p-10 lg:col-span-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                {t.heroTag}
              </p>

              <h1
                className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                {t.heroTitle}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                {t.heroSubtitle}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={onStartLearning}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-gradient-to-r from-violet-700 to-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-0 sm:w-auto sm:whitespace-nowrap sm:shrink-0"
                >
                  {hasStarted ? t.ctaContinue : t.ctaStart}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={onExploreDomains}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-200 border-b-4 border-b-blue-300 bg-white px-5 py-3 text-sm font-bold text-blue-800 transition-all hover:bg-blue-50 active:translate-y-0.5 active:border-b-2 sm:w-auto sm:whitespace-nowrap sm:shrink-0"
                >
                  {t.ctaExplore}
                </button>
              </div>
            </div>

            <div className="mt-7 border-t border-violet-100 pt-4 sm:mt-8 sm:pt-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  {t.trustFree}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.trustNoAccount}</span>
                <span aria-hidden="true">·</span>
                <span>{t.trustLocalSave}</span>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex flex-col gap-4 lg:col-span-6">
            <div className="relative flex-1 overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-sm">
              {!heroError ? (
                <img
                  src={heroMarketupImg}
                  alt="Illustration éditoriale de l'apprentissage ludique du marketing avec MARKETUP"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroError(true)}
                  className="h-full min-h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-violet-800 via-blue-700 to-amber-500 p-8 text-center text-white">
                  <Compass className="h-12 w-12 text-amber-300" />
                  <p className="font-display mt-3 text-xl font-bold">
                    MARKETUP · Learn Marketing by Playing
                  </p>
                </div>
              )}
            </div>

            <MarkyCoach
              lang={lang}
              mood="welcome"
              title={t.markyTitle}
              message={
                hasStarted
                  ? t.markyWelcomeBack(
                      progress.xp,
                      progress.completedLessonIds.length
                    )
                  : t.markyWelcomeNew
              }
              compact
            />
          </div>
        </section>

        {/* Proof Metrics Strip with vibrant playful accents */}
        <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-600 to-violet-800 p-5 text-white shadow-xs">
            <p className="font-mono-num text-2xl font-extrabold text-amber-300">
              {TOTAL_DOMAINS_COUNT}
            </p>
            <p className="mt-1 text-xs font-semibold text-violet-100">
              {t.metricDomains}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-600 to-sky-600 p-5 text-white shadow-xs">
            <p className="font-mono-num text-2xl font-extrabold text-white">
              {TOTAL_CHAPTERS_COUNT}
            </p>
            <p className="mt-1 text-xs font-semibold text-blue-100">
              {t.metricChapters}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-xs">
            <p className="font-mono-num text-2xl font-extrabold text-white">
              {TOTAL_LESSONS_COUNT}
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-50">
              {t.metricLessons}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-slate-950 shadow-xs">
            <p className="font-mono-num text-2xl font-extrabold">
              {TOTAL_EXERCISES_COUNT.toLocaleString(
                lang === 'fr' ? 'fr-FR' : 'en-US'
              )}
            </p>
            <p className="mt-1 text-xs font-bold text-amber-950">
              {t.metricExercises}
            </p>
          </div>
        </section>

        {/* Advantages / How it works */}
        <section id="avantages" className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-slate-950">
                {t.whyTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{t.whySubtitle}</p>
            </div>
            <button
              type="button"
              onClick={onOpenPlacementTest}
              className="text-sm font-bold text-violet-700 hover:text-blue-600 hover:underline"
            >
              {t.whyPlacement}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-violet-200 bg-white p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-bold text-slate-900">
                {t.adv1Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.adv1Desc}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-sky-200 bg-white p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-bold text-slate-900">
                {t.adv2Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.adv2Desc}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-amber-200 bg-white p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xs">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-bold text-slate-900">
                {t.adv3Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.adv3Desc}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-bold text-slate-900">
                {t.adv4Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.adv4Desc}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
