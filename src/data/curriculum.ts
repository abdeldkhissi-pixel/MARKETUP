import { Domain, Lesson, Chapter } from '../types/marketup';
import { DOMAINS_01_03 } from './domains01_03';
import { DOMAINS_04_06 } from './domains04_06';
import { DOMAINS_07_09 } from './domains07_09';
import { DOMAINS_10_12 } from './domains10_12';
import { DOMAINS_13_15 } from './domains13_15';
import { DOMAINS_16_18 } from './domains16_18';

export const ALL_DOMAINS: Domain[] = [
  ...DOMAINS_01_03,
  ...DOMAINS_04_06,
  ...DOMAINS_07_09,
  ...DOMAINS_10_12,
  ...DOMAINS_13_15,
  ...DOMAINS_16_18,
];

export const TOTAL_DOMAINS_COUNT = ALL_DOMAINS.length;

export const ALL_CHAPTERS: Chapter[] = ALL_DOMAINS.flatMap((d) => d.chapters);
export const TOTAL_CHAPTERS_COUNT = ALL_CHAPTERS.length;

export const ALL_LESSONS: Lesson[] = ALL_CHAPTERS.flatMap((c) => c.lessons);
export const TOTAL_LESSONS_COUNT = ALL_LESSONS.length;

export const TOTAL_EXERCISES_COUNT = ALL_LESSONS.reduce(
  (sum, l) => sum + l.exercises.length,
  0
);

export function getDomainById(domainId: string): Domain | undefined {
  return ALL_DOMAINS.find((d) => d.id === domainId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === chapterId);
}

export function getNextLessonInDomain(
  domainId: string,
  completedLessonIds: string[]
): Lesson | undefined {
  const domain = getDomainById(domainId);
  if (!domain) return undefined;
  const completedSet = new Set(completedLessonIds);
  for (const ch of domain.chapters) {
    for (const lesson of ch.lessons) {
      if (!completedSet.has(lesson.id)) return lesson;
    }
  }
  return domain.chapters[0]?.lessons[0];
}
