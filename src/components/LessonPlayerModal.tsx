import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { UI_TEXT } from '../i18n/translations';
import {
  Language,
  LearnerProfile,
  LearningMode,
  Lesson,
  VisualSchema,
} from '../types/marketup';
import {
  IntakeDispatchStatus,
  sendCourseIntakeEmail,
} from '../utils/intakeMailer';
import { ExerciseRunner } from './ExerciseRunner';
import { MarketupLogo } from './MarketupLogo';
import { MarkyCoach } from './MarkyCoach';

interface LessonPlayerModalProps {
  lesson: Lesson;
  domainTitle: string;
  chapterTitle: string;
  learningMode: LearningMode;
  heartsEnabled: boolean;
  hearts: number;
  alreadyCompleted: boolean;
  lang: Language;
  initialProfile: LearnerProfile;
  onSaveLearnerProfile: (profile: LearnerProfile) => void;
  onLoseHeart: () => void;
  onRechargeHearts: () => void;
  onAnswerXp: (xp: number) => void;
  onCompleteLesson: (lesson: Lesson, scoreOutOfFive: number) => void;
  onClose: () => void;
  onNextLesson?: (next: Lesson) => void;
  nextLesson?: Lesson | null;
}

const VisualSchemaCard: React.FC<{ schema: VisualSchema; prefix: string }> = ({
  schema,
  prefix,
}) => {
  return (
    <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/60 p-5">
      <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
        {prefix} · {schema.title}
      </p>

      {schema.type === 'funnel' && (
        <div className="mt-4 flex flex-col items-center space-y-2">
          {schema.items.map((item, idx) => {
            const widths = [
              'w-full',
              'w-11/12 sm:w-5/6',
              'w-10/12 sm:w-4/6',
              'w-9/12 sm:w-3/6',
            ];
            const colors = [
              'bg-violet-700 text-white',
              'bg-blue-600 text-white',
              'bg-emerald-500 text-white',
              'bg-amber-400 text-slate-950',
            ];
            return (
              <div
                key={idx}
                className={`${widths[idx % widths.length]} ${colors[idx % colors.length]} rounded-xl px-4 py-2.5 text-center shadow-xs`}
              >
                <p className="text-xs font-extrabold">{item.label}</p>
                <p className="text-[11px] opacity-95">{item.detail}</p>
              </div>
            );
          })}
        </div>
      )}

      {schema.type === 'matrix2x2' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {schema.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border-2 border-white bg-white p-3.5 shadow-xs"
            >
              <p className="font-mono-num text-[11px] font-extrabold text-violet-700">
                {item.value ?? `Quadrant ${idx + 1}`}
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      {schema.type === 'cycle' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {schema.items.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border-2 border-blue-200 bg-white p-3.5 shadow-xs"
            >
              <span className="font-mono-num inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-extrabold text-white">
                {idx + 1}
              </span>
              <p className="mt-2 text-sm font-bold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      {schema.type === 'bars' && (
        <div className="mt-4 space-y-3">
          {schema.items.map((item, idx) => {
            const pcts = [35, 60, 82, 95];
            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{item.label}</span>
                  <span className="text-slate-600">{item.detail}</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500"
                    style={{ width: `${pcts[idx % pcts.length]}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {schema.type === 'comparison' && (
        <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border-2 border-white bg-white shadow-xs">
          {schema.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-1 px-4 py-3 sm:flex-row sm:items-center"
            >
              <span className="text-sm font-bold text-slate-900">{item.label}</span>
              <span className="text-xs font-semibold text-blue-700">{item.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  lesson,
  domainTitle,
  chapterTitle,
  learningMode,
  heartsEnabled,
  hearts,
  alreadyCompleted,
  lang,
  initialProfile,
  onSaveLearnerProfile,
  onLoseHeart,
  onRechargeHearts,
  onAnswerXp,
  onCompleteLesson,
  onClose,
  onNextLesson,
  nextLesson,
}) => {
  const t = UI_TEXT[lang].lessonPlayer;
  const [phase, setPhase] = useState<'intake' | 'theory' | 'exercises' | 'summary'>('intake');
  const [exIndex, setExIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showTheoryPeek, setShowTheoryPeek] = useState(false);

  const [lastName, setLastName] = useState(initialProfile.lastName);
  const [firstName, setFirstName] = useState(initialProfile.firstName);
  const [email, setEmail] = useState(initialProfile.email);
  const [city, setCity] = useState(initialProfile.city);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LearnerProfile, string>>>({});
  const [isSubmittingIntake, setIsSubmittingIntake] = useState(false);
  const [intakeDispatchStatus, setIntakeDispatchStatus] = useState<IntakeDispatchStatus | null>(
    null
  );

  const totalSteps = lesson.exercises.length + 2;
  const currentStep =
    phase === 'intake'
      ? 1
      : phase === 'theory'
      ? 2
      : phase === 'exercises'
      ? exIndex + 3
      : totalSteps;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  const handleSubmitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingIntake) return;

    const cleanLast = lastName.trim();
    const cleanFirst = firstName.trim();
    const cleanEmail = email.trim();
    const cleanCity = city.trim();

    const errors: Partial<Record<keyof LearnerProfile, string>> = {};
    if (!cleanLast) errors.lastName = t.intakeErrRequired;
    if (!cleanFirst) errors.firstName = t.intakeErrRequired;
    if (!cleanEmail) {
      errors.email = t.intakeErrRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = t.intakeErrEmail;
    }
    if (!cleanCity) errors.city = t.intakeErrRequired;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const profile: LearnerProfile = {
      lastName: cleanLast,
      firstName: cleanFirst,
      email: cleanEmail,
      city: cleanCity,
    };

    setFormErrors({});
    setIsSubmittingIntake(true);
    onSaveLearnerProfile(profile);

    try {
      const dispatch = await sendCourseIntakeEmail({
        profile,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        domainTitle,
        chapterTitle,
        language: lang,
        submittedAt: new Date().toISOString(),
      });
      setIntakeDispatchStatus(dispatch.status);
    } finally {
      setIsSubmittingIntake(false);
      setPhase(learningMode === 'challenge' ? 'exercises' : 'theory');
    }
  };

  const handleExerciseAnswered = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      onAnswerXp(10);
    } else if (heartsEnabled) {
      onLoseHeart();
    }
  };

  const handleNextExercise = () => {
    if (exIndex + 1 < lesson.exercises.length) {
      setExIndex((i) => i + 1);
    } else {
      setPhase('summary');
      onCompleteLesson(lesson, correctCount);
    }
  };

  const outOfHearts = heartsEnabled && hearts <= 0 && phase === 'exercises';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-xl">
        <header className="border-b border-violet-100 bg-gradient-to-r from-violet-50/80 via-white to-sky-50/80 px-5 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-blue-700">
                {domainTitle} · {chapterTitle}
              </p>
              <h2 className="font-display truncate text-lg font-extrabold text-slate-950">
                {lesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {heartsEnabled && (
                <span className="font-mono-num inline-flex items-center gap-1 text-xs font-extrabold text-rose-600">
                  <Heart className="h-4 w-4 fill-rose-600" />
                  {hearts}/5
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label={t.closeLabel}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-mono-num text-xs font-bold text-slate-600">
              {phase === 'intake'
                ? t.intakeBadge
                : phase === 'theory'
                ? t.sheetBadge
                : phase === 'exercises'
                ? t.exerciseCounter(exIndex + 1, lesson.exercises.length)
                : t.finishedBadge}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {intakeDispatchStatus && phase !== 'intake' && phase !== 'summary' && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                intakeDispatchStatus === 'sent'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {intakeDispatchStatus === 'sent'
                  ? t.intakeSentBanner
                  : intakeDispatchStatus === 'needs_activation'
                  ? t.intakeActivationBanner
                  : t.intakeQueuedBanner}
              </span>
            </div>
          )}

          {t.bilingualNote && phase !== 'summary' && phase !== 'intake' && (
            <p className="mb-4 text-xs font-semibold text-blue-700">
              {t.bilingualNote}
            </p>
          )}

          {phase === 'intake' && (
            <form onSubmit={handleSubmitIntake} noValidate className="space-y-5">
              <div className="flex items-start gap-3.5 rounded-2xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 via-white to-sky-50 p-4">
                <MarketupLogo size="md" className="shadow-xs" />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                    {t.intakeBadge}
                  </p>
                  <h3 className="font-display mt-0.5 text-lg font-extrabold text-slate-950">
                    {t.intakeTitle}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {t.intakeSubtitle}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="course-intake-lastname"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-slate-800"
                  >
                    <User className="h-3.5 w-3.5 text-violet-600" />
                    {t.intakeLastNameLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="course-intake-lastname"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (formErrors.lastName) {
                        setFormErrors((prev) => ({ ...prev, lastName: undefined }));
                      }
                    }}
                    placeholder={t.intakeLastNamePlaceholder}
                    className={`min-h-[44px] w-full rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                      formErrors.lastName
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 bg-white focus:border-violet-600'
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="course-intake-firstname"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-slate-800"
                  >
                    <User className="h-3.5 w-3.5 text-blue-600" />
                    {t.intakeFirstNameLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="course-intake-firstname"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formErrors.firstName) {
                        setFormErrors((prev) => ({ ...prev, firstName: undefined }));
                      }
                    }}
                    placeholder={t.intakeFirstNamePlaceholder}
                    className={`min-h-[44px] w-full rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                      formErrors.firstName
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 bg-white focus:border-violet-600'
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="course-intake-email"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-slate-800"
                  >
                    <Mail className="h-3.5 w-3.5 text-emerald-600" />
                    {t.intakeEmailLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="course-intake-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder={t.intakeEmailPlaceholder}
                    className={`min-h-[44px] w-full rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                      formErrors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 bg-white focus:border-violet-600'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="course-intake-city"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-slate-800"
                  >
                    <MapPin className="h-3.5 w-3.5 text-amber-600" />
                    {t.intakeCityLabel} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="course-intake-city"
                    type="text"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (formErrors.city) {
                        setFormErrors((prev) => ({ ...prev, city: undefined }));
                      }
                    }}
                    placeholder={t.intakeCityPlaceholder}
                    className={`min-h-[44px] w-full rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                      formErrors.city
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 bg-white focus:border-violet-600'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{t.intakePrivacyNote}</span>
                </p>

                <button
                  type="submit"
                  disabled={isSubmittingIntake}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-gradient-to-r from-violet-700 to-blue-600 px-6 py-3 text-sm font-extrabold text-white transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-0 disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:whitespace-nowrap sm:shrink-0"
                >
                  {isSubmittingIntake ? (
                    <>
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      {t.intakeSendingBtn}
                    </>
                  ) : (
                    <>
                      {t.intakeStartBtn}
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {phase === 'theory' && (
            <div className="space-y-6">
              <section>
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                  {t.introHeading}
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate-800">
                  {lesson.intro}
                </p>
              </section>

              <section className="rounded-2xl border-2 border-violet-100 bg-white p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                  {t.explanationHeading}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {lesson.explanation}
                </p>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  {lesson.keyTakeaways.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {t.schemaHeading}
                </p>
                <VisualSchemaCard
                  schema={lesson.visualSchema}
                  prefix={t.schemaTitlePrefix}
                />
              </section>

              <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/60 p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  <Briefcase className="h-4 w-4" />
                  {t.exampleHeading(
                    lesson.realExample.company,
                    lesson.realExample.sector
                  )}
                </div>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3.5 shadow-xs">
                    <p className="text-xs font-bold text-slate-500">{t.situation}</p>
                    <p className="mt-1 text-slate-800">
                      {lesson.realExample.situation}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 shadow-xs">
                    <p className="text-xs font-bold text-blue-700">
                      {t.actionTaken}
                    </p>
                    <p className="mt-1 text-slate-800">{lesson.realExample.action}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 shadow-xs">
                    <p className="text-xs font-bold text-emerald-700">
                      {t.outcome}
                    </p>
                    <p className="mt-1 text-slate-800">{lesson.realExample.outcome}</p>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setPhase('exercises')}
                  className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-gradient-to-r from-violet-700 to-blue-600 px-6 py-3 text-sm font-extrabold text-white transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-0"
                >
                  {t.goPractice(lesson.exercises.length)}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {phase === 'exercises' && (
            <div className="space-y-4">
              {learningMode === 'challenge' && (
                <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-2.5 text-xs">
                  <span className="font-semibold text-amber-900">
                    {t.challengeHint}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTheoryPeek((v) => !v)}
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {showTheoryPeek ? t.hideMemo : t.showMemo}
                  </button>
                </div>
              )}

              {showTheoryPeek && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">{lesson.title}</p>
                  <p className="mt-1">{lesson.explanation}</p>
                </div>
              )}

              {outOfHearts ? (
                <div className="space-y-4 rounded-2xl border-2 border-rose-200 bg-rose-50/70 p-6 text-center">
                  <Heart className="mx-auto h-10 w-10 text-rose-500" />
                  <h3 className="font-display text-xl font-bold text-slate-950">
                    {t.noHeartsTitle}
                  </h3>
                  <p className="mx-auto max-w-md text-sm text-slate-600">
                    {t.noHeartsDesc}
                  </p>
                  <button
                    type="button"
                    onClick={onRechargeHearts}
                    className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-violet-600"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t.rechargeHeartsBtn}
                  </button>
                </div>
              ) : (
                <ExerciseRunner
                  exercise={lesson.exercises[exIndex]}
                  lang={lang}
                  onAnswered={handleExerciseAnswered}
                  onNext={handleNextExercise}
                  isLastExercise={exIndex === lesson.exercises.length - 1}
                />
              )}
            </div>
          )}

          {phase === 'summary' && (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950 shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                  {t.rewardTag}
                </p>
                <h3 className="font-display mt-1 text-2xl font-extrabold text-slate-950">
                  {t.lessonCompleteTitle}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t.lessonScoreText(
                    correctCount,
                    lesson.exercises.length,
                    lesson.title
                  )}
                </p>
              </div>

              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
                  <p className="text-xs font-semibold text-violet-800">
                    {t.lessonBonus}
                  </p>
                  <p className="font-mono-num mt-1 text-xl font-extrabold text-violet-900">
                    {alreadyCompleted ? '+10 XP' : `+${lesson.xpReward} XP`}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-800">
                    {t.exercisesXp}
                  </p>
                  <p className="font-mono-num mt-1 text-xl font-extrabold text-blue-700">
                    +{correctCount * 10} XP
                  </p>
                </div>
              </div>

              <div className="mx-auto max-w-lg text-left">
                <MarkyCoach
                  lang={lang}
                  mood="celebrate"
                  message={correctCount >= 4 ? t.markyGreat : t.markyGood}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  {t.backToPath}
                </button>
                {nextLesson && onNextLesson && (
                  <button
                    type="button"
                    onClick={() => {
                      onNextLesson(nextLesson);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-gradient-to-r from-violet-700 to-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:brightness-110"
                  >
                    {t.nextLessonBtn(nextLesson.title)}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
