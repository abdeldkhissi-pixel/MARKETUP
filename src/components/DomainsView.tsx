import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  Search,
} from 'lucide-react';
import { ALL_DOMAINS } from '../data/curriculum';
import { getDomainLocalized } from '../i18n/domainTranslations';
import { UI_TEXT } from '../i18n/translations';
import { Domain, SkillLevel, UserProgress } from '../types/marketup';

interface DomainsViewProps {
  progress: UserProgress;
  onOpenDomainPath: (domainId: string) => void;
  onOpenExam: (domain: Domain) => void;
  onOpenCertificate: (domain: Domain) => void;
}

const ACCENT_PALETTE = [
  {
    border: 'border-violet-200',
    strip: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    bar: 'bg-violet-600',
    tag: 'text-violet-700',
    btn: 'border-violet-900 bg-violet-700 hover:bg-violet-600',
  },
  {
    border: 'border-sky-200',
    strip: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    bar: 'bg-blue-600',
    tag: 'text-blue-700',
    btn: 'border-blue-900 bg-blue-600 hover:bg-blue-500',
  },
  {
    border: 'border-amber-200',
    strip: 'bg-gradient-to-r from-amber-500 to-orange-500',
    bar: 'bg-amber-500',
    tag: 'text-amber-700',
    btn: 'border-amber-700 bg-amber-500 hover:bg-amber-400 text-slate-950',
  },
  {
    border: 'border-emerald-200',
    strip: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    bar: 'bg-emerald-500',
    tag: 'text-emerald-700',
    btn: 'border-emerald-800 bg-emerald-600 hover:bg-emerald-500',
  },
  {
    border: 'border-rose-200',
    strip: 'bg-gradient-to-r from-rose-500 to-pink-600',
    bar: 'bg-rose-500',
    tag: 'text-rose-700',
    btn: 'border-rose-800 bg-rose-600 hover:bg-rose-500',
  },
];

export const DomainsView: React.FC<DomainsViewProps> = ({
  progress,
  onOpenDomainPath,
  onOpenExam,
  onOpenCertificate,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].domains;
  const levelNames = UI_TEXT[lang].levels;

  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | SkillLevel>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedSet = useMemo(
    () => new Set(progress.completedLessonIds),
    [progress.completedLessonIds]
  );

  const filteredDomains = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_DOMAINS.filter((d) => {
      if (levelFilter !== 'all' && d.recommendedLevel !== levelFilter) return false;
      if (!q) return true;
      const loc = getDomainLocalized(d, lang);
      return (
        loc.title.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q) ||
        loc.objectives.some((o) => o.toLowerCase().includes(q)) ||
        d.title.toLowerCase().includes(q)
      );
    });
  }, [query, levelFilter, lang]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-sky-50/40 p-6 shadow-xs sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
          {t.headerTag}
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.subtitle}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border-2 border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['all', 'debutant', 'intermediaire', 'avance'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  levelFilter === lvl
                    ? 'bg-violet-700 text-white shadow-xs'
                    : 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lvl === 'all' ? t.allLevels : levelNames[lvl]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredDomains.length === 0 ? (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-10 text-center">
          <p className="font-display text-lg font-bold text-slate-900">
            {t.noMatch(query)}
          </p>
          <p className="mt-1 text-sm text-slate-500">{t.noMatchHint}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setLevelFilter('all');
            }}
            className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredDomains.map((domain) => {
            const palette = ACCENT_PALETTE[(domain.order - 1) % ACCENT_PALETTE.length];
            const loc = getDomainLocalized(domain, lang);
            const lessons = domain.chapters.flatMap((c) => c.lessons);
            const doneCount = lessons.filter((l) => completedSet.has(l.id)).length;
            const pct = Math.round((doneCount / lessons.length) * 100);
            const exam = progress.examResults[domain.id];
            const isExpanded = expandedId === domain.id;

            return (
              <article
                key={domain.id}
                className={`flex flex-col justify-between overflow-hidden rounded-3xl border-2 ${palette.border} bg-white shadow-xs transition-transform hover:-translate-y-0.5`}
              >
                <div>
                  <div className={`h-2 w-full ${palette.strip}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-xs font-extrabold ${palette.tag}`}>
                          {t.domainBadge(
                            domain.order,
                            levelNames[domain.recommendedLevel]
                          )}
                        </p>
                        <h2 className="font-display mt-1 text-xl font-extrabold text-slate-950">
                          {loc.title}
                        </h2>
                      </div>

                      <span className="font-mono-num text-sm font-extrabold text-violet-800">
                        {pct}%
                      </span>
                    </div>

                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {loc.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono-num font-semibold">
                          {t.chaptersLessons(doneCount, lessons.length)}
                        </span>
                        {exam && (
                          <span
                            className={`font-mono-num font-bold ${
                              exam.passed ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {t.examScore(exam.score)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${palette.bar} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : domain.id)}
                        className="text-xs font-bold text-slate-600 hover:text-violet-800"
                      >
                        {isExpanded ? t.hideDetails : t.showDetails}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 rounded-2xl bg-slate-50 p-4">
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {t.objectives}
                            </p>
                            <ul className="mt-1.5 space-y-1">
                              {loc.objectives.map((obj, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-slate-600"
                                >
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {t.chaptersIncluded}
                            </p>
                            <ol className="mt-1.5 space-y-1 text-xs text-slate-600">
                              {domain.chapters.map((c) => (
                                <li key={c.id}>
                                  <span className="font-mono-num font-semibold text-slate-800">
                                    {c.order}.
                                  </span>{' '}
                                  {c.title}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenDomainPath(domain.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border-b-4 px-4 py-2 text-xs font-extrabold text-white transition-all active:translate-y-0.5 active:border-b-0 whitespace-nowrap shrink-0 ${palette.btn}`}
                  >
                    {t.openPath}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenExam(domain)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 whitespace-nowrap shrink-0"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    {t.finalExam}
                  </button>

                  {exam?.passed && (
                    <button
                      type="button"
                      onClick={() => onOpenCertificate(domain)}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 whitespace-nowrap shrink-0"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {t.certificate}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
