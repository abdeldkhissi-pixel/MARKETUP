import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Image as ImageIcon,
  XCircle,
} from 'lucide-react';
import { UI_TEXT } from '../i18n/translations';
import { Exercise, Language } from '../types/marketup';
import { MarkyCoach } from './MarkyCoach';

interface ExerciseRunnerProps {
  exercise: Exercise;
  lang: Language;
  onAnswered: (isCorrect: boolean) => void;
  onNext: () => void;
  isLastExercise: boolean;
}

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  exercise,
  lang,
  onAnswered,
  onNext,
  isLastExercise,
}) => {
  const t = UI_TEXT[lang].exercise;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [orderedList, setOrderedList] = useState<string[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [pairAssignments, setPairAssignments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [adImgError, setAdImgError] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setSelectedBool(null);
    setSelectedWord(null);
    setOrderedList(exercise.shuffledSteps ? [...exercise.shuffledSteps] : []);
    setSelectedConceptId(null);
    setPairAssignments({});
    setSubmitted(false);
    setIsCorrect(false);
    setAdImgError(false);
  }, [exercise]);

  const shuffledDefinitions = useMemo(() => {
    if (!exercise.pairs) return [];
    const arr = exercise.pairs.map((p) => ({ id: p.id, definition: p.definition }));
    if (arr.length >= 2) {
      return [...arr.slice(1), arr[0]];
    }
    return arr;
  }, [exercise.pairs]);

  const canSubmit = useMemo(() => {
    if (submitted) return false;
    switch (exercise.type) {
      case 'qcm':
      case 'spot_error':
      case 'case_study':
      case 'image_analysis':
      case 'strategy_match':
        return selectedOption !== null;
      case 'true_false':
        return selectedBool !== null;
      case 'fill_blank':
        return selectedWord !== null;
      case 'order':
        return orderedList.length > 0;
      case 'match':
        return (
          Boolean(exercise.pairs) &&
          Object.keys(pairAssignments).length === (exercise.pairs?.length ?? 0)
        );
    }
  }, [
    submitted,
    exercise.type,
    exercise.pairs,
    selectedOption,
    selectedBool,
    selectedWord,
    orderedList.length,
    pairAssignments,
  ]);

  const handleMoveStep = (index: number, direction: -1 | 1) => {
    if (submitted) return;
    const target = index + direction;
    if (target < 0 || target >= orderedList.length) return;
    const copy = [...orderedList];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    setOrderedList(copy);
  };

  const handleAssignDefinition = (defId: string) => {
    if (submitted || !selectedConceptId) return;
    setPairAssignments((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key] === defId) delete next[key];
      }
      next[selectedConceptId] = defId;
      return next;
    });
    setSelectedConceptId(null);
  };

  const handleValidate = () => {
    if (!canSubmit) return;
    let correct = false;

    switch (exercise.type) {
      case 'qcm':
      case 'spot_error':
      case 'case_study':
      case 'image_analysis':
      case 'strategy_match':
        correct = selectedOption === exercise.correctIndex;
        break;
      case 'true_false':
        correct = selectedBool === exercise.isTrue;
        break;
      case 'fill_blank':
        correct = selectedWord === exercise.correctWord;
        break;
      case 'order':
        correct = Boolean(
          exercise.orderedSteps &&
            orderedList.every((step, idx) => step === exercise.orderedSteps?.[idx])
        );
        break;
      case 'match':
        correct = Boolean(
          exercise.pairs &&
            exercise.pairs.every((p) => pairAssignments[p.id] === p.id)
        );
        break;
    }

    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered(correct);
  };

  const correctAnswerSummary = useMemo(() => {
    switch (exercise.type) {
      case 'qcm':
      case 'spot_error':
      case 'case_study':
      case 'image_analysis':
      case 'strategy_match':
        return exercise.options && exercise.correctIndex !== undefined
          ? exercise.options[exercise.correctIndex]
          : '';
      case 'true_false':
        return exercise.isTrue ? t.trueBtn : t.falseBtn;
      case 'fill_blank':
        return exercise.correctWord ?? '';
      case 'order':
        return exercise.orderedSteps ? exercise.orderedSteps.join(' → ') : '';
      case 'match':
        return exercise.pairs
          ? exercise.pairs.map((p) => `${p.concept} = ${p.definition}`).join(' · ')
          : '';
    }
  }, [exercise, t.trueBtn, t.falseBtn]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
          {t.labelPrefix} · {t.types[exercise.type]}
        </p>
        <h3 className="font-display mt-1 text-lg font-extrabold text-slate-950 sm:text-xl">
          {exercise.prompt}
        </h3>
        {exercise.context && (
          <div className="mt-3 rounded-2xl border-2 border-violet-100 bg-violet-50/50 p-4 text-sm leading-relaxed text-slate-800">
            {exercise.context}
          </div>
        )}
      </div>

      {exercise.type === 'image_analysis' && exercise.adMockup && (
        <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-xs">
          <div className="grid sm:grid-cols-12">
            <div className="bg-slate-100 sm:col-span-5">
              {exercise.adMockup.imageUrl && !adImgError ? (
                <img
                  src={exercise.adMockup.imageUrl}
                  alt={exercise.adMockup.headline}
                  referrerPolicy="no-referrer"
                  onError={() => setAdImgError(true)}
                  className="h-48 w-full object-cover sm:h-full"
                />
              ) : (
                <div className="flex h-48 flex-col items-center justify-center bg-gradient-to-br from-violet-800 to-blue-600 p-4 text-center text-white sm:h-full">
                  <ImageIcon className="h-8 w-8 text-amber-300" />
                  <p className="mt-2 text-xs font-semibold">
                    {exercise.adMockup.brandName}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between p-5 sm:col-span-7">
              <div>
                <p className="text-xs font-bold text-violet-700">
                  {t.sponsoredAd} · {exercise.adMockup.brandName}
                </p>
                <p className="font-display mt-1.5 text-base font-bold text-slate-950">
                  {exercise.adMockup.headline}
                </p>
                <p className="mt-1.5 text-sm text-slate-600">
                  {exercise.adMockup.subline}
                </p>
              </div>
              <div className="mt-4">
                <span className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white">
                  {exercise.adMockup.ctaLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(exercise.type === 'qcm' ||
        exercise.type === 'spot_error' ||
        exercise.type === 'case_study' ||
        exercise.type === 'image_analysis' ||
        exercise.type === 'strategy_match') &&
        exercise.options && (
          <div className="space-y-2.5">
            {exercise.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isRight = idx === exercise.correctIndex;
              let styleClass =
                'border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-sky-50/40';
              if (submitted) {
                if (isRight) {
                  styleClass =
                    'border-2 border-emerald-500 bg-emerald-50 text-emerald-950';
                } else if (isSelected && !isRight) {
                  styleClass = 'border-2 border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  styleClass = 'border-2 border-slate-200 bg-white text-slate-400';
                }
              } else if (isSelected) {
                styleClass =
                  'border-2 border-violet-600 border-b-4 border-b-violet-800 bg-violet-50 text-violet-950';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left text-sm font-semibold transition-all ${styleClass}`}
                >
                  <span className="font-mono-num flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

      {exercise.type === 'true_false' && (
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const isSelected = selectedBool === val;
            const isRight = val === exercise.isTrue;
            let styleClass =
              'border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white text-slate-800 hover:border-blue-400';
            if (submitted) {
              if (isRight)
                styleClass =
                  'border-2 border-emerald-500 bg-emerald-50 text-emerald-950';
              else if (isSelected)
                styleClass = 'border-2 border-rose-400 bg-rose-50 text-rose-950';
            } else if (isSelected) {
              styleClass =
                'border-2 border-violet-600 border-b-4 border-b-violet-800 bg-violet-50 text-violet-950';
            }

            return (
              <button
                key={String(val)}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedBool(val)}
                className={`rounded-2xl p-5 text-center font-display text-base font-extrabold transition-all ${styleClass}`}
              >
                {val ? t.trueBtn : t.falseBtn}
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === 'fill_blank' && exercise.wordBank && (
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/50 p-5 text-base leading-relaxed text-slate-800">
            <span>{exercise.sentenceBefore} </span>
            <span
              className={`mx-1 inline-block min-w-[72px] max-w-full break-words rounded-xl border-b-2 px-3 py-0.5 text-center font-extrabold ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-600 bg-emerald-100 text-emerald-900'
                    : 'border-rose-600 bg-rose-100 text-rose-900'
                  : selectedWord
                  ? 'border-violet-700 bg-violet-100 text-violet-950'
                  : 'border-slate-400 bg-white text-slate-400'
              }`}
            >
              {selectedWord ?? '_______'}
            </span>
            <span> {exercise.sentenceAfter}</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {exercise.wordBank.map((word) => {
              const active = selectedWord === word;
              return (
                <button
                  key={word}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedWord(word)}
                  className={`rounded-xl border-2 border-b-4 px-4 py-2.5 text-sm font-bold transition-all ${
                    active
                      ? 'border-violet-800 border-b-violet-950 bg-violet-700 text-white'
                      : 'border-slate-200 border-b-slate-300 bg-white text-slate-800 hover:border-blue-400'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {exercise.type === 'order' && (
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-slate-500">{t.orderHint}</p>
          {orderedList.map((step, idx) => (
            <div
              key={step}
              className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-3.5 ${
                submitted
                  ? step === exercise.orderedSteps?.[idx]
                    ? 'border-emerald-400 bg-emerald-50/70'
                    : 'border-rose-300 bg-rose-50/70'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-extrabold text-violet-800">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-slate-800">{step}</span>
              </div>
              {!submitted && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={t.moveUp}
                    disabled={idx === 0}
                    onClick={() => handleMoveStep(idx, -1)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-violet-50 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={t.moveDown}
                    disabled={idx === orderedList.length - 1}
                    onClick={() => handleMoveStep(idx, 1)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-violet-50 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {exercise.type === 'match' && exercise.pairs && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500">{t.matchHint}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2.5">
              {exercise.pairs.map((p, idx) => {
                const isSelected = selectedConceptId === p.id;
                const assignedDefId = pairAssignments[p.id];
                const defIndex = shuffledDefinitions.findIndex(
                  (d) => d.id === assignedDefId
                );

                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelectedConceptId(p.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-2xl border-2 p-3.5 text-left text-sm font-bold transition-colors ${
                      submitted
                        ? assignedDefId === p.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                          : 'border-rose-400 bg-rose-50 text-rose-950'
                        : isSelected
                        ? 'border-violet-600 bg-violet-50 text-violet-950'
                        : assignedDefId
                        ? 'border-blue-300 bg-blue-50/50 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <span>
                      <span className="font-mono-num mr-2 text-xs text-slate-400">
                        {idx + 1}.
                      </span>
                      {p.concept}
                    </span>
                    {defIndex >= 0 && (
                      <span className="font-mono-num text-xs font-extrabold text-blue-700">
                        → {String.fromCharCode(65 + defIndex)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              {shuffledDefinitions.map((d, idx) => {
                const isAssigned = Object.values(pairAssignments).includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={submitted || !selectedConceptId}
                    onClick={() => handleAssignDefinition(d.id)}
                    className={`flex w-full items-start gap-2.5 rounded-2xl border-2 p-3.5 text-left text-xs leading-relaxed transition-colors ${
                      isAssigned
                        ? 'border-blue-300 bg-blue-50/50 text-slate-800'
                        : selectedConceptId
                        ? 'border-slate-300 bg-white text-slate-700 hover:border-violet-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-mono-num font-extrabold text-violet-700">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{d.definition}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div
          className={`rounded-2xl border-2 p-4 ${
            isCorrect
              ? 'border-emerald-400 bg-emerald-50/90'
              : 'border-rose-300 bg-rose-50/90'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
            )}
            <div className="space-y-1.5 text-sm">
              <p
                className={`font-extrabold ${
                  isCorrect ? 'text-emerald-950' : 'text-rose-950'
                }`}
              >
                {isCorrect ? t.correctTitle : t.wrongTitle}
              </p>
              {!isCorrect && (
                <>
                  <p className="text-rose-900">{exercise.wrongHint}</p>
                  <p className="font-bold text-slate-900">
                    {t.expectedAnswer} {correctAnswerSummary}
                  </p>
                </>
              )}
              <p className="leading-relaxed text-slate-700">{exercise.explanation}</p>
            </div>
          </div>

          <div className="mt-3">
            <MarkyCoach
              lang={lang}
              compact
              mood={isCorrect ? 'celebrate' : 'encourage'}
              message={isCorrect ? t.markyCorrect : t.markyWrong}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end border-t border-slate-100 pt-4">
        {!submitted ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleValidate}
            className="rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-violet-600 active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300"
          >
            {t.validate}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-2xl border-b-4 border-emerald-800 bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-emerald-500 active:translate-y-0.5 active:border-b-0"
          >
            {isLastExercise ? t.finish : t.next}
          </button>
        )}
      </div>
    </div>
  );
};
