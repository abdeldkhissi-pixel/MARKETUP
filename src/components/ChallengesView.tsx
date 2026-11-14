import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { DAILY_CHALLENGES } from '../data/glossaryAndGamification';
import { DAILY_CHALLENGE_EN_MAP, UI_TEXT } from '../i18n/translations';
import { UserProgress } from '../types/marketup';
import { getTodayKey } from '../utils/storage';
import { MarkyCoach } from './MarkyCoach';

interface ChallengesViewProps {
  progress: UserProgress;
  onCompleteDailyChallenge: (challengeId: string, xp: number) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  progress,
  onCompleteDailyChallenge,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].challenges;
  const todayKey = getTodayKey();
  const alreadyDoneToday = progress.completedChallengeDates.includes(todayKey);

  const dayNum = Number(todayKey.replace(/-/g, '')) || 0;
  const defaultIndex = dayNum % DAILY_CHALLENGES.length;
  const [activeIdx, setActiveIdx] = useState(defaultIndex);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const rawChallenge = DAILY_CHALLENGES[activeIdx];
  const enData =
    lang === 'en' ? DAILY_CHALLENGE_EN_MAP[rawChallenge.id] : undefined;

  const challenge = {
    ...rawChallenge,
    kind: enData?.kind ?? rawChallenge.kind,
    prompt: enData?.prompt ?? rawChallenge.prompt,
    scenario: enData?.scenario ?? rawChallenge.scenario,
    takeaway: enData?.takeaway ?? rawChallenge.takeaway,
    options: rawChallenge.options.map((o, idx) => ({
      ...o,
      label: enData?.options[idx]?.label ?? o.label,
      pros: enData?.options[idx]?.pros ?? o.pros,
      cons: enData?.options[idx]?.cons ?? o.cons,
    })),
  };

  const handleSelectScenario = (idx: number) => {
    setActiveIdx(idx);
    setSelectedOptIdx(null);
    setSubmitted(false);
  };

  const handleValidate = () => {
    if (selectedOptIdx === null || submitted) return;
    setSubmitted(true);
    const chosen = rawChallenge.options[selectedOptIdx];
    const xp = alreadyDoneToday ? 10 : chosen.isBest ? 30 : 15;
    onCompleteDailyChallenge(rawChallenge.id, xp);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-violet-50/40 p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
              {t.tag}
            </p>
            <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.subtitle}</p>
          </div>

          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-300 to-orange-400 px-5 py-3 text-right text-slate-950 shadow-xs">
            <p className="text-xs font-extrabold">{t.todayLabel}</p>
            <p className="font-mono-num mt-0.5 flex items-center justify-end gap-1.5 text-lg font-extrabold">
              <Flame className="h-4 w-4" />
              {alreadyDoneToday ? t.doneToday : t.earnToday}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {DAILY_CHALLENGES.map((dc, idx) => {
            const dcKind =
              lang === 'en'
                ? DAILY_CHALLENGE_EN_MAP[dc.id]?.kind ?? dc.kind
                : dc.kind;
            return (
              <button
                key={dc.id}
                type="button"
                onClick={() => handleSelectScenario(idx)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeIdx === idx
                    ? 'bg-gradient-to-r from-violet-700 to-blue-600 text-white shadow-xs'
                    : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-violet-300'
                }`}
              >
                {t.challengeTab(idx + 1, dcKind)}
              </button>
            );
          })}
        </div>
      </header>

      <section className="rounded-3xl border-2 border-violet-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-violet-700">
          <Zap className="h-4 w-4 text-amber-500" />
          {challenge.kind}
          {activeIdx === defaultIndex && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600">{t.todayPick}</span>
            </>
          )}
        </div>

        <h2 className="font-display mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">
          {challenge.prompt}
        </h2>

        <div className="mt-4 rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-5 text-sm leading-relaxed text-slate-800">
          {challenge.scenario}
        </div>

        <div className="mt-6 space-y-3">
          {challenge.options.map((opt, idx) => {
            const isSelected = selectedOptIdx === idx;
            let borderCls =
              'border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white hover:border-blue-400 hover:bg-sky-50/30';

            if (submitted) {
              if (opt.isBest) {
                borderCls = 'border-2 border-emerald-500 bg-emerald-50/80';
              } else if (isSelected) {
                borderCls = 'border-2 border-amber-400 bg-amber-50/80';
              } else {
                borderCls = 'border-2 border-slate-200 bg-slate-50/60';
              }
            } else if (isSelected) {
              borderCls =
                'border-2 border-violet-600 border-b-4 border-b-violet-800 bg-violet-50/80';
            }

            return (
              <div
                key={idx}
                className={`rounded-2xl p-4 transition-all ${borderCls}`}
              >
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOptIdx(idx)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="font-mono-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {opt.label}
                      </span>
                      {submitted && opt.isBest && (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          {t.bestChoice}
                        </span>
                      )}
                    </div>

                    {submitted && (
                      <div className="mt-3 grid gap-2 border-t border-slate-200/70 pt-3 text-xs sm:grid-cols-2">
                        <div className="flex items-start gap-1.5 text-emerald-900">
                          <ThumbsUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>
                            <strong>{t.pros}</strong> {opt.pros}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <ThumbsDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                          <span>
                            <strong>{t.cons}</strong> {opt.cons}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-5">
          {!submitted ? (
            <button
              type="button"
              disabled={selectedOptIdx === null}
              onClick={handleValidate}
              className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-6 py-3 text-sm font-extrabold text-white hover:bg-violet-600 disabled:border-slate-400 disabled:bg-slate-300"
            >
              <Sparkles className="h-4 w-4" />
              {t.validate}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                handleSelectScenario((activeIdx + 1) % DAILY_CHALLENGES.length)
              }
              className="rounded-2xl border-b-4 border-blue-800 bg-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-500"
            >
              {t.tryAnother}
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-5">
            <MarkyCoach
              lang={lang}
              mood={
                selectedOptIdx !== null && challenge.options[selectedOptIdx].isBest
                  ? 'celebrate'
                  : 'tip'
              }
              title={t.takeawayTitle}
              message={challenge.takeaway}
            />
          </div>
        )}
      </section>
    </div>
  );
};
