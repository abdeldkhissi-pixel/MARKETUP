import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react';
import { getDomainLocalized } from '../i18n/domainTranslations';
import { UI_TEXT } from '../i18n/translations';
import { Domain, ExamResult, Language } from '../types/marketup';
import { MarkyCoach } from './MarkyCoach';

interface ExamModalProps {
  domain: Domain;
  lang: Language;
  onFinishExam: (result: ExamResult) => void;
  onOpenCertificate: (domain: Domain) => void;
  onClose: () => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  domain,
  lang,
  onFinishExam,
  onOpenCertificate,
  onClose,
}) => {
  const t = UI_TEXT[lang].exam;
  const locDomain = getDomainLocalized(domain, lang);
  const questions = domain.exam;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<ExamResult | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSelect = (qId: string, optionIdx: number) => {
    if (submittedResult) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitExam = () => {
    if (!allAnswered || submittedResult) return;

    let correctCount = 0;
    const mastered: string[] = [];
    const toReview: string[] = [];

    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1;
        mastered.push(q.notion);
      } else {
        toReview.push(q.notion);
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const result: ExamResult = {
      domainId: domain.id,
      score,
      passed: score >= 70,
      dateIso: new Date().toISOString(),
      masteredNotions: mastered,
      toReviewNotions: toReview,
    };

    setSubmittedResult(result);
    onFinishExam(result);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmittedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-xl">
        <header className="flex items-center justify-between gap-4 border-b border-violet-100 bg-gradient-to-r from-violet-50/70 to-sky-50/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-blue-600 text-amber-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-blue-700">{t.tag}</p>
              <h2 className="font-display truncate text-lg font-extrabold text-slate-950">
                {locDomain.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono-num text-xs font-bold text-slate-600">
              {t.answered(answeredCount, questions.length)}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {submittedResult && (
            <div
              className={`mb-6 rounded-3xl border-2 p-6 ${
                submittedResult.passed
                  ? 'border-emerald-400 bg-emerald-50/80'
                  : 'border-amber-300 bg-amber-50/80'
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    {t.resultHeading}
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-extrabold text-slate-950">
                    {t.scoreLabel}{' '}
                    <span className="font-mono-num">{submittedResult.score}/100</span>
                  </h3>
                  <p className="mt-1 text-sm text-slate-700">
                    {submittedResult.passed ? t.passedMsg : t.failedMsg}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  {submittedResult.passed && (
                    <button
                      type="button"
                      onClick={() => onOpenCertificate(domain)}
                      className="inline-flex items-center gap-2 rounded-xl border-b-4 border-violet-950 bg-violet-700 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-violet-600"
                    >
                      <Award className="h-4 w-4 text-amber-300" />
                      {t.viewCert}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t.retake}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold text-emerald-700">
                    {t.mastered(submittedResult.masteredNotions.length)}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {submittedResult.masteredNotions.length === 0 ? (
                      <li className="text-slate-400">{t.noMastered}</li>
                    ) : (
                      submittedResult.masteredNotions.map((n, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>{n}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold text-rose-700">
                    {t.toReview(submittedResult.toReviewNotions.length)}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {submittedResult.toReviewNotions.length === 0 ? (
                      <li className="text-emerald-700">{t.perfectScore}</li>
                    ) : (
                      submittedResult.toReviewNotions.map((n, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                          <span>{n}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <MarkyCoach
                  lang={lang}
                  compact
                  mood={submittedResult.passed ? 'celebrate' : 'encourage'}
                  message={submittedResult.passed ? t.markyPass : t.markyFail}
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border-2 border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono-num font-extrabold text-violet-800">
                      {t.qLabel(qIdx + 1, questions.length, q.category)}
                    </span>
                    <span className="text-slate-500">{q.notion}</span>
                  </div>

                  {q.context && (
                    <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                      {q.context}
                    </p>
                  )}

                  <p className="mt-2.5 text-sm font-bold text-slate-950">
                    {q.prompt}
                  </p>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const selected = chosen === optIdx;
                      const right = optIdx === q.correctIndex;
                      let cls =
                        'border-slate-200 bg-white text-slate-800 hover:border-blue-400';

                      if (submittedResult) {
                        if (right)
                          cls = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                        else if (selected && !right)
                          cls = 'border-rose-400 bg-rose-50 text-rose-950';
                        else cls = 'border-slate-200 bg-white text-slate-400';
                      } else if (selected) {
                        cls = 'border-violet-700 bg-violet-50 text-violet-950';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={Boolean(submittedResult)}
                          onClick={() => handleSelect(q.id, optIdx)}
                          className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-sm transition-colors ${cls}`}
                        >
                          <span className="font-mono-num mt-0.5 text-xs font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {submittedResult && (
                    <div
                      className={`mt-3 rounded-xl p-3 text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900'
                          : 'bg-rose-50 text-rose-900'
                      }`}
                    >
                      <span className="font-bold">
                        {isCorrect ? t.correctPrefix : t.wrongPrefix}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!submittedResult && (
          <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
            <p className="text-xs text-slate-600">
              {t.footerHint(questions.length)}
            </p>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmitExam}
              className="rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-violet-600 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300"
            >
              {t.submitExam}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
