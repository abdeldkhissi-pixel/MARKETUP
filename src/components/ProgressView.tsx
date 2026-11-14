import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Download,
  History,
  RotateCcw,
  Target,
  Upload,
} from 'lucide-react';
import {
  ALL_DOMAINS,
  TOTAL_CHAPTERS_COUNT,
  TOTAL_LESSONS_COUNT,
} from '../data/curriculum';
import { getDomainLocalized } from '../i18n/domainTranslations';
import { LEVEL_EN_MAP, UI_TEXT } from '../i18n/translations';
import { Domain, UserProgress } from '../types/marketup';
import {
  exportProgressJson,
  getLevelForXp,
  parseImportedProgress,
} from '../utils/storage';

interface ProgressViewProps {
  progress: UserProgress;
  onChangeDailyGoal: (xp: number) => void;
  onImportProgress: (imported: UserProgress) => void;
  onResetProgress: () => void;
  onOpenDomainPath: (domainId: string) => void;
  onOpenCertificate: (domain: Domain) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onChangeDailyGoal,
  onImportProgress,
  onResetProgress,
  onOpenDomainPath,
  onOpenCertificate,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].progress;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importMessage, setImportMessage] = useState<{
    kind: 'ok' | 'err';
    text: string;
  } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const levelInfo = getLevelForXp(progress.xp);
  const levelTitle =
    lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.current.level]?.title ?? levelInfo.current.title
      : levelInfo.current.title;
  const completedSet = new Set(progress.completedLessonIds);
  const passedExams = Object.values(progress.examResults).filter((e) => e.passed);

  const completedDomainsCount = ALL_DOMAINS.filter((d) =>
    d.chapters.every((c) => c.lessons.every((l) => completedSet.has(l.id)))
  ).length;

  const handleExport = () => {
    const json = exportProgressJson(progress);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketup-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImportedProgress(text);
      if (!parsed) {
        setImportMessage({ kind: 'err', text: t.importErrorInvalid });
      } else {
        onImportProgress(parsed);
        setImportMessage({
          kind: 'ok',
          text: t.importSuccess(parsed.xp, parsed.completedLessonIds.length),
        });
      }
    } catch {
      setImportMessage({ kind: 'err', text: t.importErrorRead });
    } finally {
      e.target.value = '';
    }
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
    const label = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short',
    });
    const xp = progress.xpHistoryByDay[key] ?? 0;
    return { key, label, xp };
  });
  const maxDayXp = Math.max(progress.dailyGoalXp, ...last7Days.map((d) => d.xp));

  const goalOptions =
    lang === 'fr'
      ? [
          { xp: 30, label: 'Tranquille (30 XP)' },
          { xp: 60, label: 'Régulier (60 XP)' },
          { xp: 100, label: 'Soutenu (100 XP)' },
          { xp: 150, label: 'Intensif (150 XP)' },
        ]
      : [
          { xp: 30, label: 'Casual (30 XP)' },
          { xp: 60, label: 'Steady (60 XP)' },
          { xp: 100, label: 'Serious (100 XP)' },
          { xp: 150, label: 'Intense (150 XP)' },
        ];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-sky-50/40 p-6 shadow-xs sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
          {t.tag}
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-4">
            <p className="text-xs font-semibold text-violet-800">
              {t.currentLevel}
            </p>
            <p className="font-display mt-1 text-lg font-extrabold text-violet-950">
              {lang === 'fr' ? 'Niv.' : 'Lv.'} {levelInfo.current.level} ·{' '}
              {levelTitle}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              {t.lessonsValidated}
            </p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-slate-900">
              {progress.completedLessonIds.length} / {TOTAL_LESSONS_COUNT}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4">
            <p className="text-xs font-semibold text-blue-800">
              {t.chaptersDone}
            </p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-blue-700">
              {progress.completedChapterIds.length} / {TOTAL_CHAPTERS_COUNT}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-semibold text-emerald-800">
              {t.domainsExams}
            </p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-emerald-700">
              {completedDomainsCount}/18 · {passedExams.length} {t.certifSuffix}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 lg:col-span-7">
          <h2 className="font-display text-lg font-extrabold text-slate-950">
            {t.weeklyChart}
          </h2>
          <div className="mt-6 grid h-44 grid-cols-7 items-end gap-1.5 sm:gap-3">
            {last7Days.map((d) => {
              const heightPct = Math.max(6, Math.round((d.xp / maxDayXp) * 100));
              return (
                <div
                  key={d.key}
                  className="flex h-full flex-col items-center justify-end gap-2"
                >
                  <span className="font-mono-num text-[11px] font-bold text-slate-600">
                    {d.xp}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        d.xp >= progress.dailyGoalXp
                          ? 'bg-gradient-to-t from-violet-700 to-blue-500'
                          : d.xp > 0
                          ? 'bg-sky-500'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold capitalize text-slate-500">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Target className="h-5 w-5" />
              <h2 className="font-display text-lg font-extrabold text-slate-950">
                {t.dailyGoalTitle}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">{t.dailyGoalDesc}</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {goalOptions.map((opt) => (
                <button
                  key={opt.xp}
                  type="button"
                  onClick={() => onChangeDailyGoal(opt.xp)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-colors ${
                    progress.dailyGoalXp === opt.xp
                      ? 'border-violet-700 bg-violet-700 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            {t.todayProgress}{' '}
            <span className="font-mono-num font-bold text-slate-900">
              {progress.dailyXpToday} / {progress.dailyGoalXp} XP
            </span>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-extrabold text-slate-950">
          {t.domainOverview}
        </h2>
        <div className="mt-4 divide-y divide-slate-100">
          {ALL_DOMAINS.map((domain) => {
            const loc = getDomainLocalized(domain, lang);
            const total = domain.chapters.reduce(
              (acc, c) => acc + c.lessons.length,
              0
            );
            const done = domain.chapters
              .flatMap((c) => c.lessons)
              .filter((l) => completedSet.has(l.id)).length;
            const pct = Math.round((done / total) * 100);
            const exam = progress.examResults[domain.id];

            return (
              <div
                key={domain.id}
                className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num text-xs font-bold text-slate-400">
                      {String(domain.order).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDomainPath(domain.id)}
                      className="truncate text-sm font-bold text-slate-900 hover:text-violet-800"
                    >
                      {loc.title}
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono-num text-xs text-slate-500">
                      {done}/{total} ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {exam ? (
                    exam.passed ? (
                      <button
                        type="button"
                        onClick={() => onOpenCertificate(domain)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {UI_TEXT[lang].domains.certificate} ({exam.score}/100)
                      </button>
                    ) : (
                      <span className="font-mono-num text-xs font-semibold text-amber-700">
                        {t.examRetry(exam.score)}
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenDomainPath(domain.id)}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      {t.openLink}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-violet-700" />
          <h2 className="font-display text-lg font-extrabold text-slate-950">
            {t.recentHistory}
          </h2>
        </div>

        {progress.history.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t.noHistory}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {progress.history.slice(0, 12).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="truncate font-medium text-slate-800">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(item.dateIso).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'en-US'
                    )}
                  </span>
                  <span className="font-mono-num text-xs font-extrabold text-violet-700">
                    +{item.xpEarned} XP
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-extrabold text-slate-950">
          {t.backupTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t.backupDesc}</p>

        {importMessage && (
          <div
            className={`mt-4 rounded-2xl border p-3.5 text-sm font-medium ${
              importMessage.kind === 'ok'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-rose-300 bg-rose-50 text-rose-900'
            }`}
          >
            {importMessage.text}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border-b-4 border-violet-950 bg-violet-700 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-violet-600 whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            {t.exportBtn}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <Upload className="h-4 w-4" />
            {t.importBtn}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            {t.resetBtn}
          </button>
        </div>
      </section>

      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="font-display mt-4 text-xl font-bold text-slate-950">
              {t.resetModalTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t.resetModalDesc}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmResetOpen(false);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
              >
                {t.confirmReset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
