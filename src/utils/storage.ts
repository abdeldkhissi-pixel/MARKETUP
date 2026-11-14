import { ALL_DOMAINS, getDomainById } from '../data/curriculum';
import { BADGES, LEVELS } from '../data/glossaryAndGamification';
import { ExamResult, LevelDefinition, UserProgress } from '../types/marketup';

const STORAGE_KEY = 'marketup_progress_v1';

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayKey(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createInitialProgress(): UserProgress {
  const today = getTodayKey();
  return {
    xp: 0,
    dailyGoalXp: 60,
    dailyXpToday: 0,
    lastActiveDate: today,
    streakDays: 1,
    completedLessonIds: [],
    completedChapterIds: [],
    examResults: {},
    unlockedBadgeIds: [],
    completedChallengeDates: [],
    completedSimulatorIds: [],
    favoriteGlossaryIds: [],
    lastVisitedDomainId: ALL_DOMAINS[0].id,
    lastVisitedLessonId: ALL_DOMAINS[0].chapters[0].lessons[0].id,
    skillLevel: 'debutant',
    hasTakenPlacementTest: false,
    learningMode: 'apprentissage',
    heartsEnabled: false,
    hearts: 5,
    history: [],
    xpHistoryByDay: { [today]: 0 },
    learnerName: 'Apprenant MARKETUP',
    language: 'fr',
  };
}

function sanitizeProgressCandidate(
  parsed: Partial<UserProgress> | null | undefined,
  base: UserProgress
): UserProgress {
  const safeObj =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  const today = getTodayKey();
  const validDomain =
    typeof safeObj.lastVisitedDomainId === 'string' &&
    getDomainById(safeObj.lastVisitedDomainId)
      ? safeObj.lastVisitedDomainId
      : base.lastVisitedDomainId;

  const examResults =
    safeObj.examResults &&
    typeof safeObj.examResults === 'object' &&
    !Array.isArray(safeObj.examResults)
      ? (safeObj.examResults as Record<string, ExamResult>)
      : {};

  const xpHistoryByDay =
    safeObj.xpHistoryByDay &&
    typeof safeObj.xpHistoryByDay === 'object' &&
    !Array.isArray(safeObj.xpHistoryByDay)
      ? (safeObj.xpHistoryByDay as Record<string, number>)
      : { [today]: 0 };

  return {
    ...base,
    ...safeObj,
    xp: typeof safeObj.xp === 'number' && Number.isFinite(safeObj.xp) ? Math.max(0, safeObj.xp) : base.xp,
    dailyGoalXp:
      typeof safeObj.dailyGoalXp === 'number' &&
      Number.isFinite(safeObj.dailyGoalXp) &&
      safeObj.dailyGoalXp > 0
        ? safeObj.dailyGoalXp
        : base.dailyGoalXp,
    dailyXpToday:
      typeof safeObj.dailyXpToday === 'number' && Number.isFinite(safeObj.dailyXpToday)
        ? Math.max(0, safeObj.dailyXpToday)
        : base.dailyXpToday,
    streakDays:
      typeof safeObj.streakDays === 'number' && Number.isFinite(safeObj.streakDays)
        ? Math.max(1, safeObj.streakDays)
        : base.streakDays,
    hearts:
      typeof safeObj.hearts === 'number' && Number.isFinite(safeObj.hearts)
        ? Math.min(5, Math.max(0, safeObj.hearts))
        : base.hearts,
    lastActiveDate:
      typeof safeObj.lastActiveDate === 'string' && safeObj.lastActiveDate
        ? safeObj.lastActiveDate
        : today,
    language: safeObj.language === 'en' ? 'en' : 'fr',
    skillLevel:
      safeObj.skillLevel === 'intermediaire' || safeObj.skillLevel === 'avance'
        ? safeObj.skillLevel
        : 'debutant',
    learningMode:
      safeObj.learningMode === 'challenge' ? 'challenge' : 'apprentissage',
    heartsEnabled: Boolean(safeObj.heartsEnabled),
    hasTakenPlacementTest: Boolean(safeObj.hasTakenPlacementTest),
    learnerName:
      typeof safeObj.learnerName === 'string' && safeObj.learnerName.trim()
        ? safeObj.learnerName
        : base.learnerName,
    lastVisitedDomainId: validDomain,
    lastVisitedLessonId:
      typeof safeObj.lastVisitedLessonId === 'string' && safeObj.lastVisitedLessonId
        ? safeObj.lastVisitedLessonId
        : base.lastVisitedLessonId,
    examResults,
    completedLessonIds: Array.isArray(safeObj.completedLessonIds)
      ? safeObj.completedLessonIds.filter((x): x is string => typeof x === 'string')
      : [],
    completedChapterIds: Array.isArray(safeObj.completedChapterIds)
      ? safeObj.completedChapterIds.filter((x): x is string => typeof x === 'string')
      : [],
    unlockedBadgeIds: Array.isArray(safeObj.unlockedBadgeIds)
      ? safeObj.unlockedBadgeIds.filter((x): x is string => typeof x === 'string')
      : [],
    completedChallengeDates: Array.isArray(safeObj.completedChallengeDates)
      ? safeObj.completedChallengeDates.filter((x): x is string => typeof x === 'string')
      : [],
    completedSimulatorIds: Array.isArray(safeObj.completedSimulatorIds)
      ? safeObj.completedSimulatorIds.filter((x): x is string => typeof x === 'string')
      : [],
    favoriteGlossaryIds: Array.isArray(safeObj.favoriteGlossaryIds)
      ? safeObj.favoriteGlossaryIds.filter((x): x is string => typeof x === 'string')
      : [],
    history: Array.isArray(safeObj.history) ? safeObj.history : [],
    xpHistoryByDay,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const base = createInitialProgress();
    const merged = sanitizeProgressCandidate(parsed, base);

    const today = getTodayKey();
    if (merged.lastActiveDate !== today) {
      const yesterday = getYesterdayKey();
      merged.dailyXpToday = 0;
      if (merged.lastActiveDate === yesterday) {
        merged.streakDays = Math.max(1, merged.streakDays + 1);
      } else if (merged.xp > 0) {
        merged.streakDays = 1;
      }
      merged.lastActiveDate = today;
      merged.hearts = 5;
    }

    return merged;
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function getLevelForXp(xp: number): {
  current: LevelDefinition;
  next: LevelDefinition | null;
  progressPercent: number;
} {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl;
  }
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  if (!next) {
    return { current, next: null, progressPercent: 100 };
  }
  const span = next.minXp - current.minXp;
  const gained = xp - current.minXp;
  const pct = Math.min(100, Math.max(0, Math.round((gained / span) * 100)));
  return { current, next, progressPercent: pct };
}

export function evaluateUnlockedBadges(progress: UserProgress): string[] {
  const unlocked = new Set(progress.unlockedBadgeIds);

  const countInDomain = (domainId: string) =>
    progress.completedLessonIds.filter((id) => id.startsWith(domainId + '-')).length;

  const passedExam = (domainId: string) =>
    Boolean(progress.examResults[domainId]?.passed);

  if (progress.completedLessonIds.length >= 1) unlocked.add('premier-pas');
  if (passedExam('marketing-fondamental')) unlocked.add('roi-fondamentaux');
  if (countInDomain('marketing-digital') >= 5 || passedExam('marketing-digital')) {
    unlocked.add('expert-digital');
  }
  if (countInDomain('seo-et-sea') >= 5 || passedExam('seo-et-sea')) {
    unlocked.add('maitre-seo');
  }
  if (
    countInDomain('branding-et-identite') >= 5 ||
    passedExam('branding-et-identite') ||
    progress.completedSimulatorIds.includes('sim-marque')
  ) {
    unlocked.add('stratege-marque');
  }
  if (
    countInDomain('social-media-marketing') >= 5 ||
    passedExam('social-media-marketing') ||
    progress.completedSimulatorIds.includes('sim-social')
  ) {
    unlocked.add('expert-reseaux');
  }
  if (
    countInDomain('marketing-analytique-kpi') >= 5 ||
    passedExam('marketing-analytique-kpi') ||
    progress.completedSimulatorIds.includes('sim-kpis')
  ) {
    unlocked.add('analyste-marketing');
  }

  const passedExamsCount = Object.values(progress.examResults).filter((e) => e.passed).length;
  if (progress.xp >= 1000 && passedExamsCount >= 3) {
    unlocked.add('champion-marketing');
  }

  return Array.from(unlocked);
}

export function addXpAndEvaluate(
  prev: UserProgress,
  xpDelta: number,
  historyLabel: string,
  historyType: 'lesson' | 'chapter' | 'exam' | 'challenge' | 'simulator',
  extra?: Partial<UserProgress>
): {
  next: UserProgress;
  leveledUpTo: LevelDefinition | null;
  newlyUnlockedBadges: string[];
} {
  const today = getTodayKey();
  const prevLevel = getLevelForXp(prev.xp).current.level;

  const merged: UserProgress = {
    ...prev,
    ...extra,
    xp: prev.xp + xpDelta,
    dailyXpToday: (prev.lastActiveDate === today ? prev.dailyXpToday : 0) + xpDelta,
    lastActiveDate: today,
    xpHistoryByDay: {
      ...prev.xpHistoryByDay,
      [today]: (prev.xpHistoryByDay[today] ?? 0) + xpDelta,
    },
    history: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        dateIso: new Date().toISOString(),
        label: historyLabel,
        xpEarned: xpDelta,
        type: historyType,
      },
      ...prev.history,
    ].slice(0, 60),
  };

  // Check newly completed chapters
  const updatedCompletedChapters = new Set(merged.completedChapterIds);
  const completedLessonsSet = new Set(merged.completedLessonIds);
  for (const domain of ALL_DOMAINS) {
    for (const ch of domain.chapters) {
      if (ch.lessons.every((l) => completedLessonsSet.has(l.id))) {
        updatedCompletedChapters.add(ch.id);
      }
    }
  }
  merged.completedChapterIds = Array.from(updatedCompletedChapters);

  const nextBadges = evaluateUnlockedBadges(merged);
  const prevBadgesSet = new Set(prev.unlockedBadgeIds);
  const newlyUnlockedBadges = nextBadges
    .filter((id) => !prevBadgesSet.has(id))
    .map((id) => BADGES.find((b) => b.id === id)?.title ?? id);
  merged.unlockedBadgeIds = nextBadges;

  const nextLevelObj = getLevelForXp(merged.xp).current;
  const leveledUpTo = nextLevelObj.level > prevLevel ? nextLevelObj : null;

  saveProgress(merged);
  return { next: merged, leveledUpTo, newlyUnlockedBadges };
}

export function isChapterUnlocked(
  domainId: string,
  chapterOrder: number,
  progress: UserProgress
): boolean {
  if (chapterOrder === 1) return true;
  if (progress.learningMode === 'challenge' || progress.skillLevel === 'avance') {
    return true;
  }
  const domain = getDomainById(domainId);
  if (!domain) return true;
  const prevChapter = domain.chapters.find((c) => c.order === chapterOrder - 1);
  if (!prevChapter) return true;
  // Unlock next chapter if at least 3 of 5 lessons in previous chapter are done OR previous chapter is completed
  const doneCount = prevChapter.lessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length;
  return doneCount >= 3 || progress.completedChapterIds.includes(prevChapter.id);
}

export function exportProgressJson(progress: UserProgress): string {
  return JSON.stringify(
    {
      app: 'MARKETUP',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
    },
    null,
    2
  );
}

export function parseImportedProgress(jsonText: string): UserProgress | null {
  try {
    const parsed = JSON.parse(jsonText);
    const candidate = parsed?.progress ?? parsed;
    if (
      typeof candidate !== 'object' ||
      candidate === null ||
      typeof candidate.xp !== 'number' ||
      !Array.isArray(candidate.completedLessonIds)
    ) {
      return null;
    }
    const base = createInitialProgress();
    return sanitizeProgressCandidate(candidate, base);
  } catch {
    return null;
  }
}
