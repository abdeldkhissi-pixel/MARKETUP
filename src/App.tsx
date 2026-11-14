import React, { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  BookMarked,
  Compass,
  Flame,
  Globe,
  Home,
  LayoutGrid,
  Map as MapIcon,
  MoreHorizontal,
  Sliders,
  X,
  Zap,
} from 'lucide-react';
import {
  ALL_DOMAINS,
  getChapterById,
  getDomainById,
  getNextLessonInDomain,
} from './data/curriculum';
import { getDomainLocalized } from './i18n/domainTranslations';
import { BADGE_EN_MAP, LEVEL_EN_MAP, UI_TEXT } from './i18n/translations';
import {
  Domain,
  ExamResult,
  Language,
  Lesson,
  NavTab,
  SkillLevel,
  UserProgress,
} from './types/marketup';
import {
  addXpAndEvaluate,
  createInitialProgress,
  getLevelForXp,
  getTodayKey,
  loadProgress,
  saveProgress,
} from './utils/storage';
import {
  CelebrationPayload,
  CelebrationToast,
} from './components/CelebrationToast';
import { CertificateModal } from './components/CertificateModal';
import { ChallengesView } from './components/ChallengesView';
import { DomainsView } from './components/DomainsView';
import { ExamModal } from './components/ExamModal';
import { GlossaryView } from './components/GlossaryView';
import { HomeView } from './components/HomeView';
import { LearningPathView } from './components/LearningPathView';
import { LevelTestModal } from './components/LevelTestModal';
import { LessonPlayerModal } from './components/LessonPlayerModal';
import { ProgressView } from './components/ProgressView';
import { RewardsView } from './components/RewardsView';
import { SimulatorsView } from './components/SimulatorsView';
import { BADGES } from './data/glossaryAndGamification';

const NAV_CONFIG: {
  id: NavTab;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}[] = [
  { id: 'home', icon: Home, activeClass: 'bg-violet-700 text-white' },
  { id: 'path', icon: MapIcon, activeClass: 'bg-gradient-to-r from-violet-700 to-blue-600 text-white' },
  { id: 'domains', icon: LayoutGrid, activeClass: 'bg-blue-600 text-white' },
  { id: 'challenges', icon: Zap, activeClass: 'bg-amber-500 text-slate-950' },
  { id: 'simulators', icon: Sliders, activeClass: 'bg-emerald-600 text-white' },
  { id: 'rewards', icon: Award, activeClass: 'bg-rose-600 text-white' },
  { id: 'progress', icon: BarChart3, activeClass: 'bg-indigo-600 text-white' },
  { id: 'glossary', icon: BookMarked, activeClass: 'bg-cyan-600 text-white' },
];

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedDomainId, setSelectedDomainId] = useState<string>(
    () => loadProgress().lastVisitedDomainId || ALL_DOMAINS[0].id
  );

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeExamDomain, setActiveExamDomain] = useState<Domain | null>(null);
  const [certificateDomain, setCertificateDomain] = useState<Domain | null>(null);
  const [placementOpen, setPlacementOpen] = useState(false);

  const [toast, setToast] = useState<CelebrationPayload | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lang: Language = progress.language === 'en' ? 'en' : 'fr';
  const navStrings = UI_TEXT[lang].nav;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showCelebration = (payload: CelebrationPayload) => {
    setToast(payload);
  };

  const handleChangeLanguage = (nextLang: Language) => {
    setProgress((prev) => ({ ...prev, language: nextLang }));
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedDomainId(lesson.domainId);
    setProgress((prev) => ({
      ...prev,
      lastVisitedDomainId: lesson.domainId,
      lastVisitedLessonId: lesson.id,
    }));
    setActiveLesson(lesson);
  };

  const formatBadges = (badgeTitles: string[]) => {
    if (lang === 'fr') return badgeTitles.join(', ');
    return badgeTitles
      .map((frTitle) => {
        const match = BADGES.find((b) => b.title === frTitle);
        return match ? BADGE_EN_MAP[match.id]?.title ?? frTitle : frTitle;
      })
      .join(', ');
  };

  const handleAnswerXp = (xp: number) => {
    setProgress((prev) => {
      const { next, leveledUpTo, newlyUnlockedBadges } = addXpAndEvaluate(
        prev,
        xp,
        lang === 'fr' ? 'Bonne réponse en exercice' : 'Correct exercise answer',
        'lesson'
      );
      if (leveledUpTo) {
        const lvlTitle =
          lang === 'en'
            ? LEVEL_EN_MAP[leveledUpTo.level]?.title ?? leveledUpTo.title
            : leveledUpTo.title;
        showCelebration({
          kind: 'level',
          title:
            lang === 'fr'
              ? `Niveau ${leveledUpTo.level} atteint !`
              : `Level ${leveledUpTo.level} reached!`,
          subtitle:
            lang === 'fr'
              ? `Vous devenez ${lvlTitle}.`
              : `You are now ${lvlTitle}.`,
          xp,
        });
      } else if (newlyUnlockedBadges.length > 0) {
        showCelebration({
          kind: 'badge',
          title:
            lang === 'fr'
              ? 'Nouveau badge débloqué !'
              : 'New badge unlocked!',
          subtitle: formatBadges(newlyUnlockedBadges),
          xp,
        });
      }
      return next;
    });
  };

  const handleCompleteLesson = (lesson: Lesson, scoreOutOfFive: number) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedLessonIds.includes(lesson.id);
      const baseXp = alreadyDone ? 10 : lesson.xpReward;
      const updatedLessons = alreadyDone
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lesson.id];

      const chapter = getChapterById(lesson.chapterId);
      const chapterAlreadyDone = prev.completedChapterIds.includes(
        lesson.chapterId
      );
      const chapterNowDone =
        Boolean(chapter) &&
        !chapterAlreadyDone &&
        chapter!.lessons.every((l) => updatedLessons.includes(l.id));

      const totalDelta = baseXp + (chapterNowDone ? 50 : 0);

      const { next, leveledUpTo, newlyUnlockedBadges } = addXpAndEvaluate(
        prev,
        totalDelta,
        chapterNowDone
          ? `${lang === 'fr' ? 'Chapitre validé' : 'Chapter cleared'} : ${
              chapter?.title
            }`
          : `${lang === 'fr' ? 'Leçon terminée' : 'Lesson finished'} : ${
              lesson.title
            } (${scoreOutOfFive}/5)`,
        chapterNowDone ? 'chapter' : 'lesson',
        {
          completedLessonIds: updatedLessons,
          lastVisitedDomainId: lesson.domainId,
          lastVisitedLessonId: lesson.id,
        }
      );

      if (leveledUpTo) {
        const lvlTitle =
          lang === 'en'
            ? LEVEL_EN_MAP[leveledUpTo.level]?.title ?? leveledUpTo.title
            : leveledUpTo.title;
        showCelebration({
          kind: 'level',
          title: `${lang === 'fr' ? 'Niveau' : 'Level'} ${
            leveledUpTo.level
          } : ${lvlTitle}`,
          subtitle:
            lang === 'fr'
              ? 'Votre maîtrise du marketing franchit un nouveau cap !'
              : 'Your marketing mastery reached a new tier!',
          xp: totalDelta,
        });
      } else if (chapterNowDone) {
        showCelebration({
          kind: 'chapter',
          title: lang === 'fr' ? 'Chapitre complété !' : 'Chapter cleared!',
          subtitle: `${
            lang === 'fr' ? 'Bonus de +50 XP pour' : '+50 XP bonus for'
          } « ${chapter?.title} ».`,
          xp: totalDelta,
        });
      } else if (newlyUnlockedBadges.length > 0) {
        showCelebration({
          kind: 'badge',
          title: lang === 'fr' ? 'Badge débloqué !' : 'Badge unlocked!',
          subtitle: formatBadges(newlyUnlockedBadges),
          xp: totalDelta,
        });
      }

      return next;
    });
  };

  const handleFinishExam = (result: ExamResult) => {
    const domain = getDomainById(result.domainId);
    const domainName = domain
      ? getDomainLocalized(domain, lang).shortTitle
      : result.domainId;
    setProgress((prev) => {
      const prevBest = prev.examResults[result.domainId];
      const wasAlreadyPassed = Boolean(prevBest?.passed);
      const xpEarned = result.passed ? (wasAlreadyPassed ? 20 : 100) : 15;

      const bestResult: ExamResult =
        prevBest && prevBest.score > result.score
          ? { ...prevBest, passed: prevBest.passed || result.passed }
          : result;

      const { next, leveledUpTo, newlyUnlockedBadges } = addXpAndEvaluate(
        prev,
        xpEarned,
        `${lang === 'fr' ? 'Examen final' : 'Final Exam'} · ${domainName} (${
          result.score
        }/100)`,
        'exam',
        {
          examResults: {
            ...prev.examResults,
            [result.domainId]: bestResult,
          },
        }
      );

      if (leveledUpTo) {
        const lvlTitle =
          lang === 'en'
            ? LEVEL_EN_MAP[leveledUpTo.level]?.title ?? leveledUpTo.title
            : leveledUpTo.title;
        showCelebration({
          kind: 'level',
          title: `${lang === 'fr' ? 'Niveau' : 'Level'} ${
            leveledUpTo.level
          } !`,
          subtitle: lvlTitle,
          xp: xpEarned,
        });
      } else if (newlyUnlockedBadges.length > 0) {
        showCelebration({
          kind: 'badge',
          title:
            lang === 'fr'
              ? 'Nouveau badge débloqué !'
              : 'New badge unlocked!',
          subtitle: formatBadges(newlyUnlockedBadges),
          xp: xpEarned,
        });
      } else if (result.passed) {
        showCelebration({
          kind: 'chapter',
          title: lang === 'fr' ? 'Examen validé !' : 'Exam passed!',
          subtitle:
            lang === 'fr'
              ? `Votre certificat « ${domainName} » est prêt.`
              : `Your “${domainName}” certificate is ready.`,
          xp: xpEarned,
        });
      }

      return next;
    });
  };

  const handleCompleteDailyChallenge = (_challengeId: string, xp: number) => {
    const today = getTodayKey();
    setProgress((prev) => {
      const dates = prev.completedChallengeDates.includes(today)
        ? prev.completedChallengeDates
        : [...prev.completedChallengeDates, today];

      const { next, leveledUpTo } = addXpAndEvaluate(
        prev,
        xp,
        lang === 'fr' ? 'Marketing Challenge validé' : 'Marketing Challenge completed',
        'challenge',
        { completedChallengeDates: dates }
      );

      if (leveledUpTo) {
        const lvlTitle =
          lang === 'en'
            ? LEVEL_EN_MAP[leveledUpTo.level]?.title ?? leveledUpTo.title
            : leveledUpTo.title;
        showCelebration({
          kind: 'level',
          title: `${lang === 'fr' ? 'Niveau' : 'Level'} ${
            leveledUpTo.level
          } : ${lvlTitle}`,
          subtitle:
            lang === 'fr'
              ? 'Défi quotidien réussi avec montée de niveau !'
              : 'Daily challenge completed with level-up!',
          xp,
        });
      } else {
        showCelebration({
          kind: 'info',
          title: lang === 'fr' ? 'Défi enregistré !' : 'Challenge saved!',
          subtitle:
            lang === 'fr'
              ? 'Beau réflexe stratégique.'
              : 'Great strategic instinct.',
          xp,
        });
      }
      return next;
    });
  };

  const handleCompleteSimulator = (simId: string, label: string) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedSimulatorIds.includes(simId);
      const xp = alreadyDone ? 10 : 40;
      const sims = alreadyDone
        ? prev.completedSimulatorIds
        : [...prev.completedSimulatorIds, simId];

      const { next, newlyUnlockedBadges } = addXpAndEvaluate(
        prev,
        xp,
        label,
        'simulator',
        { completedSimulatorIds: sims }
      );

      if (newlyUnlockedBadges.length > 0) {
        showCelebration({
          kind: 'badge',
          title:
            lang === 'fr'
              ? 'Nouveau badge débloqué !'
              : 'New badge unlocked!',
          subtitle: formatBadges(newlyUnlockedBadges),
          xp,
        });
      } else {
        showCelebration({
          kind: 'info',
          title: lang === 'fr' ? 'Simulation validée' : 'Simulation validated',
          subtitle: label,
          xp,
        });
      }

      return next;
    });
  };

  const handleToggleGlossaryFavorite = (termId: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteGlossaryIds.includes(termId);
      return {
        ...prev,
        favoriteGlossaryIds: exists
          ? prev.favoriteGlossaryIds.filter((id) => id !== termId)
          : [...prev.favoriteGlossaryIds, termId],
      };
    });
  };

  const handleSaveSkillLevel = (level: SkillLevel) => {
    setProgress((prev) => ({
      ...prev,
      skillLevel: level,
      hasTakenPlacementTest: true,
    }));
  };

  const handleOpenDomainPath = (domainId: string) => {
    setSelectedDomainId(domainId);
    setProgress((prev) => ({ ...prev, lastVisitedDomainId: domainId }));
    setActiveTab('path');
  };

  const levelInfo = getLevelForXp(progress.xp);
  const currentLevelTitle =
    lang === 'en'
      ? LEVEL_EN_MAP[levelInfo.current.level]?.title ?? levelInfo.current.title
      : levelInfo.current.title;

  const activeLessonMeta = activeLesson
    ? (() => {
        const d = getDomainById(activeLesson.domainId);
        return {
          domainTitle: d
            ? getDomainLocalized(d, lang).shortTitle
            : lang === 'fr'
            ? 'Domaine'
            : 'Domain',
          chapterTitle:
            getChapterById(activeLesson.chapterId)?.title ??
            (lang === 'fr' ? 'Chapitre' : 'Chapter'),
          nextLesson: getNextLessonInDomain(
            activeLesson.domainId,
            progress.completedLessonIds.includes(activeLesson.id)
              ? progress.completedLessonIds
              : [...progress.completedLessonIds, activeLesson.id]
          ),
        };
      })()
    : null;

  return (
    <>
      <div className="no-print min-h-screen w-full max-w-full overflow-x-clip bg-gradient-to-br from-violet-50/60 via-slate-50 to-sky-50/70 text-slate-900">
        {activeTab === 'home' ? (
          <HomeView
            progress={progress}
            onStartLearning={() => setActiveTab('path')}
            onExploreDomains={() => setActiveTab('domains')}
            onOpenSimulators={() => setActiveTab('simulators')}
            onOpenPlacementTest={() => setPlacementOpen(true)}
            onChangeLanguage={handleChangeLanguage}
          />
        ) : (
          <div className="flex min-h-screen w-full max-w-full flex-col lg:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-68 shrink-0 flex-col justify-between border-r-2 border-violet-100 bg-white p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
              <div>
                <div className="flex items-center justify-between gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-blue-600 text-amber-300 shadow-xs">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-extrabold tracking-tight text-violet-950">
                        MARKETUP
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        Learn Marketing by Playing
                      </p>
                    </div>
                  </button>
                </div>

                {/* Language Switcher inside Sidebar */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Globe className="h-3.5 w-3.5 text-violet-700" />
                    {lang === 'fr' ? 'Langue' : 'Language'}
                  </span>
                  <div className="inline-flex gap-1">
                    {(['fr', 'en'] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleChangeLanguage(code)}
                        className={`rounded-lg px-2 py-0.5 text-xs font-extrabold uppercase transition-colors ${
                          lang === code
                            ? 'bg-violet-700 text-white'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                <nav className="mt-5 space-y-1" aria-label="Main navigation">
                  {NAV_CONFIG.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all whitespace-nowrap ${
                          active
                            ? `${item.activeClass} shadow-xs`
                            : 'text-slate-700 hover:bg-violet-50 hover:text-violet-950'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            active ? 'text-current' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{navStrings[item.id].label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50 p-4">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span>
                    {lang === 'fr' ? 'Niv.' : 'Lv.'} {levelInfo.current.level}
                  </span>
                  <span className="font-mono-num text-violet-800">
                    {progress.xp} XP
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-600">
                  {currentLevelTitle}
                </p>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1 font-bold text-orange-600">
                    <Flame className="h-3.5 w-3.5" />
                    {progress.streakDays} {lang === 'fr' ? 'j' : 'd'}
                  </span>
                  <span className="font-mono-num font-semibold">
                    {progress.dailyXpToday}/{progress.dailyGoalXp} XP
                  </span>
                </div>
              </div>
            </aside>

            {/* Mobile/Tablet Compact Top Bar with Language Toggle */}
            <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-2 border-b border-violet-100 bg-white/95 px-3 py-2 backdrop-blur-sm lg:hidden">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('home');
                }}
                className="font-display text-base font-extrabold text-violet-950 whitespace-nowrap shrink-0 sm:text-lg"
              >
                MARKETUP
              </button>
              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                  {(['fr', 'en'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleChangeLanguage(code)}
                      className={`rounded-md px-1.5 py-0.5 text-[11px] font-extrabold uppercase ${
                        lang === code
                          ? 'bg-violet-700 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <span className="font-mono-num text-orange-600 inline-flex items-center gap-0.5">
                  <Flame className="h-3.5 w-3.5" />
                  {progress.streakDays}
                </span>
                <span className="font-mono-num text-violet-800">
                  {progress.xp} XP
                </span>
              </div>
            </header>

            <main className="min-w-0 flex-1 px-3.5 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-10">
              <div className="mx-auto w-full min-w-0 max-w-5xl">
                {activeTab === 'path' && (
                  <LearningPathView
                    progress={progress}
                    selectedDomainId={selectedDomainId}
                    onSelectDomain={handleOpenDomainPath}
                    onOpenLesson={handleOpenLesson}
                    onOpenExam={(dom) => setActiveExamDomain(dom)}
                    onOpenCertificate={(dom) => setCertificateDomain(dom)}
                    onOpenPlacementTest={() => setPlacementOpen(true)}
                    onToggleMode={() =>
                      setProgress((prev) => ({
                        ...prev,
                        learningMode:
                          prev.learningMode === 'apprentissage'
                            ? 'challenge'
                            : 'apprentissage',
                      }))
                    }
                    onToggleHearts={() =>
                      setProgress((prev) => ({
                        ...prev,
                        heartsEnabled: !prev.heartsEnabled,
                        hearts: 5,
                      }))
                    }
                    onRechargeHearts={() =>
                      setProgress((prev) => ({ ...prev, hearts: 5 }))
                    }
                  />
                )}

                {activeTab === 'domains' && (
                  <DomainsView
                    progress={progress}
                    onOpenDomainPath={handleOpenDomainPath}
                    onOpenExam={(dom) => setActiveExamDomain(dom)}
                    onOpenCertificate={(dom) => setCertificateDomain(dom)}
                  />
                )}

                {activeTab === 'challenges' && (
                  <ChallengesView
                    progress={progress}
                    onCompleteDailyChallenge={handleCompleteDailyChallenge}
                  />
                )}

                {activeTab === 'simulators' && (
                  <SimulatorsView
                    progress={progress}
                    onCompleteSimulator={handleCompleteSimulator}
                  />
                )}

                {activeTab === 'rewards' && <RewardsView progress={progress} />}

                {activeTab === 'progress' && (
                  <ProgressView
                    progress={progress}
                    onChangeDailyGoal={(xp) =>
                      setProgress((prev) => ({ ...prev, dailyGoalXp: xp }))
                    }
                    onImportProgress={(imported) => {
                      setProgress(imported);
                      showCelebration({
                        kind: 'info',
                        title:
                          lang === 'fr'
                            ? 'Progression restaurée'
                            : 'Progress restored',
                        subtitle: `${imported.xp} XP · ${imported.completedLessonIds.length} ${
                          lang === 'fr' ? 'leçons' : 'lessons'
                        }.`,
                      });
                    }}
                    onResetProgress={() => {
                      const fresh = { ...createInitialProgress(), language: lang };
                      setProgress(fresh);
                      setSelectedDomainId(ALL_DOMAINS[0].id);
                      showCelebration({
                        kind: 'info',
                        title:
                          lang === 'fr'
                            ? 'Progression réinitialisée'
                            : 'Progress reset',
                        subtitle:
                          lang === 'fr'
                            ? 'Nouveau départ prêt sur MARKETUP.'
                            : 'Fresh start ready on MARKETUP.',
                      });
                    }}
                    onOpenDomainPath={handleOpenDomainPath}
                    onOpenCertificate={(dom) => setCertificateDomain(dom)}
                  />
                )}

                {activeTab === 'glossary' && (
                  <GlossaryView
                    progress={progress}
                    onToggleFavorite={handleToggleGlossaryFavorite}
                  />
                )}
              </div>
            </main>

            {mobileMenuOpen && (
              <div className="fixed inset-0 z-30 lg:hidden">
                <button
                  type="button"
                  aria-label={lang === 'fr' ? 'Fermer le menu' : 'Close menu'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
                />
                <div className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-3 right-3 rounded-3xl border-2 border-violet-200 bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <span className="font-display text-xs font-extrabold uppercase tracking-wider text-violet-800">
                      {lang === 'fr' ? 'Autres espaces' : 'More sections'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {NAV_CONFIG.slice(4).map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex min-h-[44px] items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                            active
                              ? `${item.activeClass} shadow-xs`
                              : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-violet-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{navStrings[item.id].label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <nav
              aria-label="Mobile navigation"
              className="fixed bottom-0 left-0 right-0 z-40 border-t border-violet-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
            >
              <div className="grid grid-cols-5 items-center gap-1 px-1.5 py-1.5">
                {NAV_CONFIG.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id && !mobileMenuOpen;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveTab(item.id);
                      }}
                      className={`flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold transition-colors ${
                        active
                          ? 'bg-violet-100 text-violet-900'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="w-full truncate text-center">
                        {navStrings[item.id].mobile}
                      </span>
                    </button>
                  );
                })}
                {(() => {
                  const secondaryActive = NAV_CONFIG.slice(4).some(
                    (i) => i.id === activeTab
                  );
                  return (
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen((v) => !v)}
                      className={`flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold transition-colors ${
                        mobileMenuOpen || secondaryActive
                          ? 'bg-violet-100 text-violet-900'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <MoreHorizontal className="h-4 w-4 shrink-0" />
                      <span className="w-full truncate text-center">
                        {lang === 'fr' ? 'Plus' : 'More'}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </nav>
          </div>
        )}

        {activeLesson && activeLessonMeta && (
          <LessonPlayerModal
            key={activeLesson.id}
            lesson={activeLesson}
            domainTitle={activeLessonMeta.domainTitle}
            chapterTitle={activeLessonMeta.chapterTitle}
            learningMode={progress.learningMode}
            heartsEnabled={progress.heartsEnabled}
            hearts={progress.hearts}
            alreadyCompleted={progress.completedLessonIds.includes(activeLesson.id)}
            lang={lang}
            onLoseHeart={() =>
              setProgress((prev) => ({
                ...prev,
                hearts: Math.max(0, prev.hearts - 1),
              }))
            }
            onRechargeHearts={() =>
              setProgress((prev) => ({ ...prev, hearts: 5 }))
            }
            onAnswerXp={handleAnswerXp}
            onCompleteLesson={handleCompleteLesson}
            onClose={() => setActiveLesson(null)}
            nextLesson={activeLessonMeta.nextLesson}
            onNextLesson={(next) => handleOpenLesson(next)}
          />
        )}

        {activeExamDomain && (
          <ExamModal
            key={activeExamDomain.id}
            domain={activeExamDomain}
            lang={lang}
            onFinishExam={handleFinishExam}
            onOpenCertificate={(dom) => {
              setActiveExamDomain(null);
              setCertificateDomain(dom);
            }}
            onClose={() => setActiveExamDomain(null)}
          />
        )}

        {placementOpen && (
          <LevelTestModal
            currentLevel={progress.skillLevel}
            lang={lang}
            onSaveLevel={handleSaveSkillLevel}
            onClose={() => setPlacementOpen(false)}
          />
        )}

        <CelebrationToast payload={toast} onClose={() => setToast(null)} />
      </div>

      {certificateDomain && progress.examResults[certificateDomain.id] && (
        <CertificateModal
          domain={certificateDomain}
          examResult={progress.examResults[certificateDomain.id]}
          learnerName={progress.learnerName}
          lang={lang}
          onChangeLearnerName={(name) =>
            setProgress((prev) => ({ ...prev, learnerName: name }))
          }
          onClose={() => setCertificateDomain(null)}
        />
      )}
    </>
  );
}
