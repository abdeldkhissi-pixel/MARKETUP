import { Language, LearnerProfile } from '../types/marketup';

export const INTAKE_RECIPIENT_EMAIL = 'abdel.dkhissi@edu.umi.ac.ma';
const FORMSUBMIT_AJAX_ENDPOINT = `https://formsubmit.co/ajax/${INTAKE_RECIPIENT_EMAIL}`;
const PENDING_INTAKES_KEY = 'marketup_pending_intakes_v1';

export interface CourseIntakeSubmission {
  profile: LearnerProfile;
  lessonId: string;
  lessonTitle: string;
  domainTitle: string;
  chapterTitle: string;
  language: Language;
  submittedAt: string;
}

export type IntakeDispatchStatus = 'sent' | 'needs_activation' | 'queued';

export interface IntakeDispatchResult {
  status: IntakeDispatchStatus;
  message?: string;
}

function readPendingQueue(): CourseIntakeSubmission[] {
  try {
    const raw = window.localStorage.getItem(PENDING_INTAKES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePendingQueue(items: CourseIntakeSubmission[]): void {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(PENDING_INTAKES_KEY);
    } else {
      window.localStorage.setItem(PENDING_INTAKES_KEY, JSON.stringify(items.slice(-20)));
    }
  } catch {
    // Ignore storage quota errors
  }
}

function enqueueIntake(item: CourseIntakeSubmission): void {
  const existing = readPendingQueue();
  writePendingQueue([...existing, item]);
}

async function postToFormSubmit(
  payload: CourseIntakeSubmission,
  timeoutMs = 7000
): Promise<IntakeDispatchResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fullName = `${payload.profile.firstName} ${payload.profile.lastName}`.trim();
    const response = await fetch(FORMSUBMIT_AJAX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        Nom: payload.profile.lastName,
        Prenom: payload.profile.firstName,
        Email: payload.profile.email,
        Ville: payload.profile.city,
        Cours: payload.lessonTitle,
        Domaine: payload.domainTitle,
        Chapitre: payload.chapterTitle,
        Langue: payload.language.toUpperCase(),
        Date: payload.submittedAt,
        _replyto: payload.profile.email,
        _subject: `MARKETUP · Inscription cours : ${fullName} (${payload.profile.city}) — ${payload.lessonTitle}`,
        _template: 'table',
        _captcha: 'false',
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    const rawMsg = typeof data?.message === 'string' ? data.message : '';
    const normalizedMsg = rawMsg.toLowerCase();

    if (normalizedMsg.includes('activation') || normalizedMsg.includes('activate')) {
      return { status: 'needs_activation', message: rawMsg };
    }

    if (
      response.ok &&
      (data?.success === true || data?.success === 'true' || data?.ok === true || normalizedMsg.includes('success'))
    ) {
      return { status: 'sent', message: rawMsg };
    }

    if (!response.ok) {
      throw new Error(rawMsg || `HTTP ${response.status}`);
    }

    return { status: 'sent', message: rawMsg };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function sendCourseIntakeEmail(
  submission: CourseIntakeSubmission
): Promise<IntakeDispatchResult> {
  try {
    const result = await postToFormSubmit(submission);
    // Also attempt to flush any previously queued offline intakes
    if (result.status !== 'queued') {
      void flushPendingCourseIntakes();
    }
    return result;
  } catch (err) {
    enqueueIntake(submission);
    return {
      status: 'queued',
      message: err instanceof Error ? err.message : undefined,
    };
  }
}

export async function flushPendingCourseIntakes(): Promise<number> {
  const queue = readPendingQueue();
  if (queue.length === 0) return 0;

  const remaining: CourseIntakeSubmission[] = [];
  let sentCount = 0;

  for (const item of queue) {
    try {
      const res = await postToFormSubmit(item, 6000);
      if (res.status === 'sent' || res.status === 'needs_activation') {
        sentCount += 1;
      } else {
        remaining.push(item);
      }
    } catch {
      remaining.push(item);
      break;
    }
  }

  writePendingQueue(remaining);
  return sentCount;
}
