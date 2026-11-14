import React from 'react';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  Flame,
  GraduationCap,
  Heart,
  Lock,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import {
  ALL_DOMAINS,
  TOTAL_LESSONS_COUNT,
  getDomainById,
  getLessonById,
  getNextLessonInDomain,
} from '../data/curriculum';
import { getDomainLocalized } from '../i18n/domainTranslations';
import { LEVEL_EN_MAP, UI_TEXT } from '../i18n/translations';
import { Domain, Lesson, UserProgress } from '../types/marketup';
import { getLevelForXp, isChapterUnlocked } from '../utils/storage';
import { MarkyCoach } from './MarkyCoach';

interface LearningPathViewProps {
  progress: UserProgress;
  selectedDomainId: string;
  onSelectDomain: (domainId: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onOpenExam: (domain: Domain) => void;
  onOpenCertificate: (domain: Domain) => void;
  onOpenPlacementTest: () => void;
  onToggleMode: () => void;
  onToggleHearts: () => void;
  onRechargeHearts: () => void;
}

const CHAPTER_THEMES = [
  {
    border: 'border-violet-200',
    headerBg: 'bg-gradient-to-r from-violet-700 to-indigo-700 text-white',
    badgeText: 'text-amber-300',
    activeNode:
      'border-2 border-violet-600 border-b-4 border-b-violet-800 bg-violet-50 hover:bg-violet-100/70',
    playIcon: 'fill-violet-700 text-violet-700',
  },
  {
    border: 'border-sky-200',
    headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
    badgeText: 'text-amber-200',
    activeNode:
      'border-2 border-blue-600 border-b-4 border-b-blue-800 bg-sky-50 hover:bg-sky-100/70',
    playIcon: 'fill-blue-600 text-blue-600',
  },
  {
    border: 'border-emerald-200',
    headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    badgeText: 'text-amber-200',
    activeNode:
      'border-2 border-emerald-600 border-b-4 border-b-emerald-800 bg-emerald-50 hover:bg-emerald-100/70',
    playIcon: 'fill-emerald-600 text-emerald-600',
  },
  {
    border: 'border-amber-200',
    headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950',
    badgeText: 'text-violet-950',
    activeNode:
      'border-2 border-amber-500 border-b-4 border-b-amber-700 bg-amber-50 hover:bg-amber-100/70',
    playIcon: 'fill-amber-600 text-amber-600',
  },
  {
    border: 'border-rose-200',
    headerBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white',
    badgeText: 'text-amber-200',
    activeNode:
      'border-2 border-rose-600 border-b-4 border-b-rose-800 bg-rose-50 hover:bg-rose-100/70',
    playIcon: 'fill-rose-600 text-rose-600',
  },
];

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  progress,
  selectedDomainId,
  onSelectDomain,
  onOpenLesson,
  onOpenExam,
  onOpenCertificate,
  onOpenPlacementTest,
  onToggleMode,
  onToggleHearts,
  onRechargeHearts,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].path;
  const domainRaw = getDomainById(selectedDomainId) ?? ALL_DOMAINS[0];
  const domain = getDomainLocalized(domainRaw, lang);

  const levelInfo = getLevelForXp(progress.xp);
  const currentLevelTitle =
    lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.current.level]?.title ?? levelInfo.current.title
      : levelInfo.current.title;
  const nextLevelTitle = levelInfo.next
    ? lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.next.level]?.title ?? levelInfo.next.title
      : levelInfo.next.title
    : null;

  const completedSet = new Set(progress.completedLessonIds);

  const globalPct = Math.round(
    (progress.completedLessonIds.length / TOTAL_LESSONS_COUNT) * 100
  );
  const dailyGoalPct = Math.min(
    100,
    Math.round((progress.dailyXpToday / Math.max(1, progress.dailyGoalXp)) * 100)
  );

  const lastVisitedLesson = progress.lastVisitedLessonId
    ? getLessonById(progress.lastVisitedLessonId)
    : undefined;
  const lastVisitedDomainRaw = lastVisitedLesson
    ? getDomainById(lastVisitedLesson.domainId)
    : undefined;
  const lastVisitedDomain = lastVisitedDomainRaw
    ? getDomainLocalized(lastVisitedDomainRaw, lang)
    : undefined;

  const continueLesson =
    (lastVisitedLesson && !completedSet.has(lastVisitedLesson.id)
      ? lastVisitedLesson
      : null) ??
    getNextLessonInDomain(domainRaw.id, progress.completedLessonIds) ??
    domainRaw.chapters[0].lessons[0];

  const domainLessons = domainRaw.chapters.flatMap((c) => c.lessons);
  const domainDoneCount = domainLessons.filter((l) => completedSet.has(l.id)).length;
  const domainProgressPct = Math.round((domainDoneCount / domainLessons.length) * 100);
  const examResult = progress.examResults[domainRaw.id];

  const nextRecommendedInDomain =
    getNextLessonInDomain(domainRaw.id, progress.completedLessonIds) ??
    domainRaw.chapters[0].lessons[0];

  const dayUnit = lang === 'fr' ? 'j' : 'd';

  return (
    <div className="space-y-6">
      {/* Main Duolingo-inspired Progression Dashboard */}
      <section className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-sky-50/50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
              {t.levelPrefix} {levelInfo.current.level} · {currentLevelTitle}
            </p>
            <h1 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              {t.dashboardTitle}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              {levelInfo.next && nextLevelTitle
                ? t.xpToNext(levelInfo.next.minXp - progress.xp, nextLevelTitle)
                : t.maxLevelReached}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenLesson(continueLesson)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-gradient-to-r from-violet-700 to-blue-600 px-4 py-3 text-sm font-extrabold text-white transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-0 sm:flex-initial sm:px-5 whitespace-nowrap"
            >
              <Play className="h-4 w-4 fill-current shrink-0" />
              {t.continueBtn}
            </button>
            <button
              type="button"
              onClick={onOpenPlacementTest}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-blue-400 hover:text-blue-700 active:translate-y-0.5 active:border-b-2 sm:flex-initial whitespace-nowrap"
            >
              <Sliders className="h-4 w-4 shrink-0" />
              {t.levelTestBtn}
            </button>
          </div>
        </div>

        {/* Vibrant Metrics Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/70 p-4">
            <p className="text-xs font-semibold text-violet-800">{t.totalXp}</p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-violet-950">
              {progress.xp.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">{t.lessonsDone}</p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-slate-900">
              {progress.completedLessonIds.length}
              <span className="text-xs font-normal text-slate-500">
                /{TOTAL_LESSONS_COUNT}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-4">
            <p className="text-xs font-semibold text-blue-800">{t.globalProgress}</p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-blue-700">
              {globalPct}%
            </p>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-4">
            <p className="text-xs font-semibold text-amber-900">{t.badgesEarned}</p>
            <p className="font-mono-num mt-1 flex items-center gap-1.5 text-xl font-extrabold text-amber-600">
              <Trophy className="h-4 w-4" />
              {progress.unlockedBadgeIds.length}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/80 p-4">
            <p className="text-xs font-semibold text-orange-900">{t.activeStreak}</p>
            <p className="font-mono-num mt-1 flex items-center gap-1.5 text-xl font-extrabold text-orange-600">
              <Flame className="h-4 w-4" />
              {progress.streakDays} {dayUnit}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/80 p-4">
            <p className="text-xs font-semibold text-emerald-900">{t.dailyGoal}</p>
            <p className="font-mono-num mt-1 flex items-center gap-1.5 text-xl font-extrabold text-emerald-700">
              <Target className="h-4 w-4" />
              {progress.dailyXpToday}/{progress.dailyGoalXp}
            </p>
          </div>
        </div>

        {/* Daily Goal & Last Course Bar */}
        <div className="mt-5 grid gap-4 border-t border-violet-100 pt-5 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t.dailyGoalLabel(progress.dailyGoalXp)}</span>
              <span className="font-mono-num text-blue-700">{dailyGoalPct}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${dailyGoalPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">{t.lastCourse}</p>
              <p className="truncate text-sm font-bold text-slate-900">
                {lastVisitedLesson && lastVisitedDomain
                  ? `${lastVisitedDomain.shortTitle} · ${lastVisitedLesson.title}`
                  : `${domain.shortTitle} · ${domainRaw.chapters[0].lessons[0].title}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLesson(continueLesson)}
              className="rounded-xl bg-violet-100 px-3.5 py-1.5 text-xs font-extrabold text-violet-900 hover:bg-violet-200 whitespace-nowrap shrink-0"
            >
              {t.resumeBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Workspace Toolbar: Domain Switcher, Mode, Optional Hearts */}
      <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <label
            htmlFor="domain-switcher"
            className="text-xs font-bold text-slate-600 whitespace-nowrap"
          >
            {t.activeDomain}
          </label>
          <div className="relative min-w-0 w-full flex-1 sm:max-w-sm">
            <select
              id="domain-switcher"
              value={domainRaw.id}
              onChange={(e) => onSelectDomain(e.target.value)}
              className="w-full max-w-full appearance-none truncate rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-9 text-sm font-bold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none"
            >
              {ALL_DOMAINS.map((d) => {
                const loc = getDomainLocalized(d, lang);
                return (
                  <option key={d.id} value={d.id}>
                    {d.order}. {loc.title}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleMode}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              progress.learningMode === 'challenge'
                ? 'border-amber-400 bg-amber-100 text-amber-950'
                : 'border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.modeLabel}{' '}
            {progress.learningMode === 'challenge'
              ? t.modeChallenge
              : t.modeLearning}
          </button>

          <button
            type="button"
            onClick={onToggleHearts}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              progress.heartsEnabled
                ? 'border-rose-300 bg-rose-50 text-rose-800'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                progress.heartsEnabled ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
            {progress.heartsEnabled ? t.heartsOn(progress.hearts) : t.heartsOff}
          </button>

          {progress.heartsEnabled && progress.hearts < 5 && (
            <button
              type="button"
              onClick={onRechargeHearts}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 whitespace-nowrap shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t.recharge}
            </button>
          )}
        </div>
      </section>

      {/* Active Domain Overview + Marky Tip */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="min-w-0 rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-6 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                {t.domainOrderLabel(
                  domainRaw.order,
                  UI_TEXT[lang].levels[domainRaw.recommendedLevel]
                )}
              </p>
              <h2 className="font-display mt-1 text-2xl font-extrabold text-slate-950">
                {domain.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {domain.description}
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono-num text-2xl font-extrabold text-violet-700">
                {domainProgressPct}%
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {domainDoneCount}/{domainLessons.length} {t.lessonsLabel}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.objectivesHeading}
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {domain.objectives.map((obj, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex flex-col justify-between gap-4 lg:col-span-4">
          <MarkyCoach
            lang={lang}
            mood="tip"
            title={t.markyCourseHeader}
            message={
              domainDoneCount === 0
                ? t.markyEmpty(domainRaw.chapters[0].title)
                : domainDoneCount < domainLessons.length
                ? t.markyInProgress(nextRecommendedInDomain.title)
                : t.markyDone
            }
          />

          {/* Final Exam Card */}
          <div className="rounded-3xl border-2 border-violet-700 bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-800 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <GraduationCap className="h-7 w-7 text-amber-300" />
              {examResult && (
                <span className="font-mono-num text-sm font-extrabold text-amber-300">
                  {t.bestScore(examResult.score)}
                </span>
              )}
            </div>
            <h3 className="font-display mt-3 text-lg font-extrabold">
              {t.finalExamTitle}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-violet-100">
              {t.finalExamDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onOpenExam(domainRaw)}
                className="rounded-xl border-b-4 border-amber-600 bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 transition-all hover:bg-amber-300 active:translate-y-0.5 active:border-b-0 whitespace-nowrap shrink-0"
              >
                {examResult ? t.retakeExam : t.takeExam}
              </button>
              {examResult?.passed && (
                <button
                  type="button"
                  onClick={() => onOpenCertificate(domainRaw)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/25 whitespace-nowrap shrink-0"
                >
                  <Award className="h-3.5 w-3.5 text-amber-300" />
                  {t.certificateBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vibrant Progressive Chapters & Lesson Nodes */}
      <section className="space-y-6">
        {domainRaw.chapters.map((chapter, cIdx) => {
          const theme = CHAPTER_THEMES[cIdx % CHAPTER_THEMES.length];
          const unlocked = isChapterUnlocked(domainRaw.id, chapter.order, progress);
          const chapterDone = chapter.lessons.filter((l) =>
            completedSet.has(l.id)
          ).length;
          const isChapterFinished = chapterDone === chapter.lessons.length;

          return (
            <div
              key={chapter.id}
              className={`overflow-hidden rounded-3xl border-2 transition-colors ${
                unlocked
                  ? `${theme.border} bg-white shadow-xs`
                  : 'border-slate-200 bg-slate-100/70'
              }`}
            >
              <div
                className={`flex flex-wrap items-center justify-between gap-4 px-6 py-4 ${
                  unlocked ? theme.headerBg : 'bg-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={unlocked ? theme.badgeText : 'text-slate-600'}>
                      {t.chapterLabel(chapter.order)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">
                      {t.doneCount(chapterDone, chapter.lessons.length)}
                    </span>
                    {isChapterFinished && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-extrabold text-amber-200">
                          {t.chapterValidated}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display mt-1 text-lg font-extrabold">
                    {chapter.title}
                  </h3>
                  <p className="mt-0.5 text-xs opacity-90">{chapter.description}</p>
                </div>

                {!unlocked && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Lock className="h-4 w-4" />
                    {t.chapterLockHint}
                  </div>
                )}
              </div>

              {/* 5 Tactile Lesson Nodes */}
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5">
                {chapter.lessons.map((lesson) => {
                  const isDone = completedSet.has(lesson.id);
                  const isCurrent = nextRecommendedInDomain.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onOpenLesson(lesson)}
                      className={`group flex flex-col justify-between rounded-2xl p-4 text-left transition-all ${
                        !unlocked
                          ? 'cursor-not-allowed border border-slate-200 bg-slate-50 opacity-60'
                          : isDone
                          ? 'border-2 border-emerald-300 border-b-4 border-b-emerald-500 bg-emerald-50/60 hover:bg-emerald-50 active:translate-y-0.5 active:border-b-2'
                          : isCurrent
                          ? `${theme.activeNode} active:translate-y-0.5 active:border-b-2`
                          : 'border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-num text-xs font-extrabold text-slate-500">
                            {t.lessonLabel(chapter.order, lesson.order)}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : !unlocked ? (
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <Play
                              className={`h-4 w-4 ${
                                isCurrent ? theme.playIcon : 'text-blue-600'
                              }`}
                            />
                          )}
                        </div>
                        <p className="font-display mt-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-violet-900">
                          {lesson.title}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono-num">
                          {lesson.durationMin} {t.minUnit}
                        </span>
                        <span className="font-mono-num font-extrabold text-violet-700">
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
