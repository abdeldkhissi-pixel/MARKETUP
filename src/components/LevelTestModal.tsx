import React, { useState } from 'react';
import { CheckCircle2, Sliders, X } from 'lucide-react';
import { PLACEMENT_QUESTIONS } from '../data/glossaryAndGamification';
import { PLACEMENT_EN_MAP, UI_TEXT } from '../i18n/translations';
import { Language, SkillLevel } from '../types/marketup';
import { MarkyCoach } from './MarkyCoach';

interface LevelTestModalProps {
  currentLevel: SkillLevel;
  lang: Language;
  onSaveLevel: (level: SkillLevel) => void;
  onClose: () => void;
}

const LEVEL_DESC: Record<Language, Record<SkillLevel, string>> = {
  fr: {
    debutant:
      'Parcours progressif guidé depuis les notions fondamentales, sans prérequis.',
    intermediaire:
      'Parcours orienté cas concrets, acquisition digitale et arbitrage de canaux.',
    avance:
      'Accès libre à tous les chapitres dès le départ pour approfondir stratégie et KPI.',
  },
  en: {
    debutant:
      'Guided progressive path starting from core fundamentals, no prerequisites needed.',
    intermediaire:
      'Focused on practical cases, digital acquisition, and channel mix choices.',
    avance:
      'Open access to all chapters right away to dive deep into strategy and KPIs.',
  },
};

export const LevelTestModal: React.FC<LevelTestModalProps> = ({
  currentLevel,
  lang,
  onSaveLevel,
  onClose,
}) => {
  const t = UI_TEXT[lang].placement;
  const levelLabels = UI_TEXT[lang].levels;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [evaluatedLevel, setEvaluatedLevel] = useState<SkillLevel | null>(null);

  const allAnswered =
    Object.keys(answers).length === PLACEMENT_QUESTIONS.length;

  const handleEvaluate = () => {
    let score = 0;
    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score += 1;
    });
    const recommended: SkillLevel =
      score <= 1 ? 'debutant' : score <= 3 ? 'intermediaire' : 'avance';
    setEvaluatedLevel(recommended);
    onSaveLevel(recommended);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 to-sky-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-violet-700" />
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-950">
                {t.title}
              </h2>
              <p className="text-xs text-slate-500">{t.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {t.quickPick}
            </p>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              {(['debutant', 'intermediaire', 'avance'] as const).map((lvl) => {
                const active = (evaluatedLevel ?? currentLevel) === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      onSaveLevel(lvl);
                      setEvaluatedLevel(lvl);
                    }}
                    className={`rounded-2xl border-2 p-3.5 text-left transition-colors ${
                      active
                        ? 'border-violet-700 bg-violet-50 text-violet-950'
                        : 'border-slate-200 bg-white hover:border-blue-400'
                    }`}
                  >
                    <p className="font-display text-sm font-extrabold">
                      {levelLabels[lvl]}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-slate-600">
                      {LEVEL_DESC[lang][lvl]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
              {t.quizPick}
            </p>

            {PLACEMENT_QUESTIONS.map((q, qIdx) => {
              const enQ = lang === 'en' ? PLACEMENT_EN_MAP[qIdx] : undefined;
              return (
                <div
                  key={qIdx}
                  className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-4"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {qIdx + 1}. {enQ?.question ?? q.question}
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {(enQ?.options ?? q.options).map((opt, optIdx) => {
                      const selected = answers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                          }
                          className={`block w-full rounded-xl border-2 px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                            selected
                              ? 'border-violet-700 bg-violet-700 text-white'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-blue-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {evaluatedLevel && (
            <MarkyCoach
              lang={lang}
              mood="celebrate"
              title={t.configuredTitle(levelLabels[evaluatedLevel])}
              message={LEVEL_DESC[lang][evaluatedLevel]}
            />
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            {t.close}
          </button>
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleEvaluate}
            className="inline-flex items-center gap-2 rounded-xl border-b-4 border-violet-950 bg-violet-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-violet-600 disabled:border-slate-400 disabled:bg-slate-300"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t.computeBtn}
          </button>
        </footer>
      </div>
    </div>
  );
};
