export type NavTab =
  | 'home'
  | 'path'
  | 'domains'
  | 'challenges'
  | 'simulators'
  | 'rewards'
  | 'progress'
  | 'glossary';

export type SkillLevel = 'debutant' | 'intermediaire' | 'avance';
export type LearningMode = 'apprentissage' | 'challenge';
export type Language = 'fr' | 'en';

export type ExerciseType =
  | 'qcm'
  | 'true_false'
  | 'match'
  | 'fill_blank'
  | 'order'
  | 'spot_error'
  | 'case_study'
  | 'image_analysis'
  | 'strategy_match';

export interface MatchPair {
  id: string;
  concept: string;
  definition: string;
}

export interface AdMockupData {
  kind: 'generated_image' | 'social_ad' | 'landing_card' | 'email_preview';
  imageUrl?: string;
  brandName: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  flawNote?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  context?: string;
  // QCM, case_study, spot_error, image_analysis, strategy_match
  options?: string[];
  correctIndex?: number;
  // true_false
  isTrue?: boolean;
  // match
  pairs?: MatchPair[];
  // fill_blank
  sentenceBefore?: string;
  sentenceAfter?: string;
  wordBank?: string[];
  correctWord?: string;
  // order
  orderedSteps?: string[];
  shuffledSteps?: string[];
  // image_analysis
  adMockup?: AdMockupData;
  // Pedagogical feedback
  explanation: string;
  wrongHint: string;
}

export type VisualSchemaType =
  | 'funnel'
  | 'matrix2x2'
  | 'cycle'
  | 'bars'
  | 'comparison';

export interface VisualSchema {
  type: VisualSchemaType;
  title: string;
  items: { label: string; value?: string; detail: string }[];
}

export interface Lesson {
  id: string;
  domainId: string;
  chapterId: string;
  order: number;
  title: string;
  durationMin: number;
  xpReward: number;
  // A. Introduction
  intro: string;
  // B. Explication
  explanation: string;
  keyTakeaways: string[];
  // C. Illustration / Schéma
  visualSchema: VisualSchema;
  // D. Exemple réel (entreprise fictive)
  realExample: {
    company: string;
    sector: string;
    situation: string;
    action: string;
    outcome: string;
  };
  // E & F. Exercices interactifs avec correction détaillée
  exercises: Exercise[];
}

export interface Chapter {
  id: string;
  domainId: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface ExamQuestion {
  id: string;
  category: 'Theorie' | 'Pratique' | 'Etude de cas' | 'Reflexion';
  notion: string;
  prompt: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Domain {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  objectives: string[];
  recommendedLevel: SkillLevel;
  accentColor: 'violet' | 'blue' | 'amber';
  chapters: Chapter[];
  exam: ExamQuestion[];
}

export interface LevelDefinition {
  level: number;
  title: string;
  minXp: number;
  description: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaText: string;
  iconName: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  simplified: string;
  example: string;
}

export interface DailyChallengeItem {
  id: string;
  kind: 'Culture marketing' | 'Mini-cas pratique' | 'Defi strategie' | 'Analyse publicitaire' | 'Question de reflexion';
  prompt: string;
  scenario: string;
  options: {
    label: string;
    isBest: boolean;
    pros: string;
    cons: string;
  }[];
  takeaway: string;
}

export interface ActivityHistoryItem {
  id: string;
  dateIso: string;
  label: string;
  xpEarned: number;
  type: 'lesson' | 'chapter' | 'exam' | 'challenge' | 'simulator';
}

export interface ExamResult {
  domainId: string;
  score: number;
  passed: boolean;
  dateIso: string;
  masteredNotions: string[];
  toReviewNotions: string[];
}

export interface UserProgress {
  xp: number;
  dailyGoalXp: number;
  dailyXpToday: number;
  lastActiveDate: string;
  streakDays: number;
  completedLessonIds: string[];
  completedChapterIds: string[];
  examResults: Record<string, ExamResult>;
  unlockedBadgeIds: string[];
  completedChallengeDates: string[];
  completedSimulatorIds: string[];
  favoriteGlossaryIds: string[];
  lastVisitedDomainId: string;
  lastVisitedLessonId: string | null;
  skillLevel: SkillLevel;
  hasTakenPlacementTest: boolean;
  learningMode: LearningMode;
  heartsEnabled: boolean;
  hearts: number;
  history: ActivityHistoryItem[];
  xpHistoryByDay: Record<string, number>;
  learnerName: string;
  language: Language;
}
