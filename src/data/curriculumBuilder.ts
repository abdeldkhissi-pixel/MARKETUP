import {
  Chapter,
  Domain,
  ExamQuestion,
  Exercise,
  ExerciseType,
  Lesson,
  SkillLevel,
  VisualSchemaType,
} from '../types/marketup';
import adSneakersImg from '../assets/images/ad_analysis_sneakers_1794665220603.jpg';
import adCoffeeImg from '../assets/images/ad_analysis_coffee_1794665220012.jpg';

export interface LessonBlueprint {
  title: string;
  intro?: string;
  concept: string;
  definition: string;
  explanation: string;
  keyTakeaways: [string, string, string];
  schemaType: VisualSchemaType;
  schemaItems: { label: string; value?: string; detail: string }[];
  company: string;
  sector: string;
  situation: string;
  action: string;
  outcome: string;
  orderedSteps: [string, string, string, string];
  pairings: [
    { concept: string; definition: string },
    { concept: string; definition: string },
    { concept: string; definition: string },
  ];
  mistakeText: string;
  mistakeFix: string;
  mistakeDistractors: [string, string];
  fillSentence: {
    before: string;
    missing: string;
    after: string;
    distractors: [string, string, string];
  };
  trueFalse: {
    statement: string;
    isTrue: boolean;
    rationale: string;
  };
  caseChoice: {
    question: string;
    bestOption: string;
    wrongOptions: [string, string];
    explanation: string;
  };
  imageAnalysis?: {
    kind: 'generated_image' | 'social_ad' | 'landing_card' | 'email_preview';
    imageUrl?: string;
    brandName: string;
    headline: string;
    subline: string;
    ctaLabel: string;
    question: string;
    bestOption: string;
    wrongOptions: [string, string];
    explanation: string;
  };
}

export interface ChapterBlueprint {
  title: string;
  description: string;
  lessons: [
    LessonBlueprint,
    LessonBlueprint,
    LessonBlueprint,
    LessonBlueprint,
    LessonBlueprint,
  ];
}

export interface DomainBlueprint {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  objectives: [string, string, string, string];
  recommendedLevel: SkillLevel;
  accentColor: 'violet' | 'blue' | 'amber';
  chapters: [
    ChapterBlueprint,
    ChapterBlueprint,
    ChapterBlueprint,
    ChapterBlueprint,
    ChapterBlueprint,
  ];
}

const EXERCISE_ROTATIONS: ExerciseType[][] = [
  ['qcm', 'true_false', 'match', 'fill_blank', 'case_study'],
  ['order', 'spot_error', 'qcm', 'image_analysis', 'strategy_match'],
  ['fill_blank', 'match', 'true_false', 'case_study', 'order'],
  ['spot_error', 'qcm', 'image_analysis', 'fill_blank', 'strategy_match'],
  ['match', 'order', 'case_study', 'true_false', 'qcm'],
];

const AD_IMAGES = [adSneakersImg, adCoffeeImg];

function rotateArray<T>(arr: T[], shift: number): T[] {
  const n = arr.length;
  if (n === 0) return arr;
  const s = ((shift % n) + n) % n;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

function buildExercisesForLesson(
  domainId: string,
  chapterIdx: number,
  lessonIdx: number,
  bp: LessonBlueprint
): Exercise[] {
  const rotation = EXERCISE_ROTATIONS[(chapterIdx + lessonIdx) % EXERCISE_ROTATIONS.length];
  const baseId = `${domainId}-c${chapterIdx + 1}-l${lessonIdx + 1}`;

  return rotation.map((type, exIdx): Exercise => {
    const id = `${baseId}-e${exIdx + 1}`;
    const shift = (chapterIdx * 3 + lessonIdx + exIdx) % 3;

    switch (type) {
      case 'qcm': {
        const rawOptions = [
          bp.definition,
          `Une technique consistant uniquement à baisser les prix sans étudier le besoin client`,
          `Un indicateur comptable interne réservé aux bilans fiscaux annuels`,
          `Une publicité ponctuelle diffusée sans objectif ni ciblage préalable`,
        ];
        const correctOpt = rawOptions[0];
        const rotated = rotateArray(rawOptions, shift);
        return {
          id,
          type: 'qcm',
          prompt: `Quelle proposition définit le mieux « ${bp.concept} » dans le cadre de « ${bp.title} » ?`,
          options: rotated,
          correctIndex: rotated.indexOf(correctOpt),
          explanation: `Exact ! ${bp.concept} : ${bp.definition} ${bp.keyTakeaways[0]}`,
          wrongHint: `Relisez le principe central : « ${bp.concept} » sert à structurer la valeur perçue et la décision marketing, pas simplement à brader ou improviser.`,
        };
      }

      case 'true_false': {
        return {
          id,
          type: 'true_false',
          prompt: `Affirmer ou infirmer cette proposition sur « ${bp.title} » :`,
          context: `« ${bp.trueFalse.statement} »`,
          isTrue: bp.trueFalse.isTrue,
          explanation: bp.trueFalse.rationale,
          wrongHint: `Attention aux nuances pratiques : ${bp.trueFalse.rationale}`,
        };
      }

      case 'match': {
        return {
          id,
          type: 'match',
          prompt: `Associez chaque notion clé de « ${bp.title} » à sa définition exacte :`,
          pairs: bp.pairings.map((p, idx) => ({
            id: `${id}-p${idx + 1}`,
            concept: p.concept,
            definition: p.definition,
          })),
          explanation: `Parfait ! Vous distinguez clairement ${bp.pairings.map((p) => p.concept).join(', ')}.`,
          wrongHint: `Prenez un instant pour relier chaque terme à son rôle précis dans la démarche.`,
        };
      }

      case 'fill_blank': {
        const uniqueDistractors = bp.fillSentence.distractors.filter(
          (d) => d.toLowerCase() !== bp.fillSentence.missing.toLowerCase()
        );
        const fallbackPool = ['stratégie', 'budget', 'cible', 'valeur'];
        while (uniqueDistractors.length < 3) {
          const nextFallback = fallbackPool.find(
            (w) =>
              w.toLowerCase() !== bp.fillSentence.missing.toLowerCase() &&
              !uniqueDistractors.includes(w)
          );
          if (!nextFallback) break;
          uniqueDistractors.push(nextFallback);
        }
        const bank = rotateArray(
          [bp.fillSentence.missing, ...uniqueDistractors.slice(0, 3)],
          shift + 1
        );
        return {
          id,
          type: 'fill_blank',
          prompt: `Complétez cette règle essentielle liée à « ${bp.title} » :`,
          sentenceBefore: bp.fillSentence.before,
          sentenceAfter: bp.fillSentence.after,
          wordBank: bank,
          correctWord: bp.fillSentence.missing,
          explanation: `Bien joué ! Le terme « ${bp.fillSentence.missing} » donne tout son sens stratégique à cette phrase.`,
          wrongHint: `Le mot recherché correspond au mécanisme central étudié dans « ${bp.concept} ».`,
        };
      }

      case 'order': {
        const shuffled = rotateArray([...bp.orderedSteps], 2);
        if (shuffled[0] === bp.orderedSteps[0]) {
          const tmp = shuffled[0];
          shuffled[0] = shuffled[shuffled.length - 1];
          shuffled[shuffled.length - 1] = tmp;
        }
        return {
          id,
          type: 'order',
          prompt: `Remettez dans l’ordre logique ces 4 étapes pour déployer « ${bp.title} » :`,
          orderedSteps: [...bp.orderedSteps],
          shuffledSteps: shuffled,
          explanation: `Excellente séquence ! On commence toujours par observer et cadrer (${bp.orderedSteps[0]}) avant d’exécuter et mesurer.`,
          wrongHint: `Astuce de Marky : vérifiez ce qui relève de l’analyse préalable par rapport à l’exécution puis la mesure.`,
        };
      }

      case 'spot_error': {
        const opts = rotateArray(
          [bp.mistakeText, bp.mistakeDistractors[0], bp.mistakeDistractors[1]],
          shift
        );
        return {
          id,
          type: 'spot_error',
          prompt: `Identifiez l’erreur marketing majeure dans ce mini-brief pour « ${bp.company} » :`,
          context: `Secteur : ${bp.sector}. L’équipe prépare une action sur « ${bp.title} ».`,
          options: opts,
          correctIndex: opts.indexOf(bp.mistakeText),
          explanation: `Erreur repérée ! ${bp.mistakeText} — Correctif recommandé : ${bp.mistakeFix}`,
          wrongHint: `Cherchez la décision qui contredit l’intérêt du client cible ou empêche de mesurer le résultat.`,
        };
      }

      case 'case_study': {
        const opts = rotateArray(
          [bp.caseChoice.bestOption, ...bp.caseChoice.wrongOptions],
          shift + 1
        );
        return {
          id,
          type: 'case_study',
          prompt: bp.caseChoice.question,
          context: `Cas fictif — ${bp.company} (${bp.sector}) : ${bp.situation}`,
          options: opts,
          correctIndex: opts.indexOf(bp.caseChoice.bestOption),
          explanation: bp.caseChoice.explanation,
          wrongHint: `Comparez les options selon leur impact durable sur le client cible et la rentabilité de ${bp.company}.`,
        };
      }

      case 'image_analysis': {
        const defaultAd = {
          kind: ((chapterIdx + lessonIdx) % 2 === 0 ? 'generated_image' : 'social_ad') as
            | 'generated_image'
            | 'social_ad',
          imageUrl: AD_IMAGES[(chapterIdx + lessonIdx) % AD_IMAGES.length],
          brandName: bp.company,
          headline: `${bp.company} · ${bp.concept}`,
          subline: bp.action,
          ctaLabel: 'Découvrir l’offre',
        };
        const imgData = bp.imageAnalysis ?? {
          ...defaultAd,
          question: `En observant ce visuel de campagne pour ${bp.company}, quel levier de « ${bp.title} » explique son efficacité ?`,
          bestOption: `La cohérence entre le visuel produit épuré, la promesse claire (« ${bp.concept} ») et un appel à l’action unique`,
          wrongOptions: [
            `L’accumulation d’au moins six slogans différents pour rassurer tout le monde`,
            `L’absence totale de hiérarchie visuelle afin de laisser le visiteur deviner l’offre`,
          ] as [string, string],
          explanation: `Très bonne lecture visuelle ! Un support efficace isole un bénéfice clair, reste cohérent avec l’identité de ${bp.company} et guide le regard vers une action simple.`,
        };
        const opts = rotateArray(
          [imgData.bestOption, ...imgData.wrongOptions],
          shift
        );
        return {
          id,
          type: 'image_analysis',
          prompt: imgData.question,
          adMockup: {
            kind: imgData.kind,
            imageUrl: imgData.imageUrl,
            brandName: imgData.brandName,
            headline: imgData.headline,
            subline: imgData.subline,
            ctaLabel: imgData.ctaLabel,
          },
          options: opts,
          correctIndex: opts.indexOf(imgData.bestOption),
          explanation: imgData.explanation,
          wrongHint: `Observez la hiérarchie visuelle, la lisibilité de la promesse et la clarté du bouton d’action.`,
        };
      }

      case 'strategy_match': {
        const bestStrategy = `Adapter « ${bp.concept} » au profil de ${bp.company} : ${bp.action}`;
        const wrong1 = `Copier à l’identique la campagne TV d’un géant de la grande distribution sans ciblage`;
        const wrong2 = `Supprimer toute communication directe et attendre uniquement le bouche-à-oreille passif`;
        const opts = rotateArray([bestStrategy, wrong1, wrong2], shift + 1);
        return {
          id,
          type: 'strategy_match',
          prompt: `Associez l’entreprise fictive « ${bp.company} » (${bp.sector}) à la stratégie la plus adaptée :`,
          context: `Situation : ${bp.situation}`,
          options: opts,
          correctIndex: opts.indexOf(bestStrategy),
          explanation: `Choix stratégique solide ! Résultat observé : ${bp.outcome}`,
          wrongHint: `Vérifiez que la stratégie répond précisément aux contraintes du secteur (${bp.sector}).`,
        };
      }
    }
  });
}

function buildDomainExam(bp: DomainBlueprint): ExamQuestion[] {
  const categories: ExamQuestion['category'][] = [
    'Theorie',
    'Pratique',
    'Etude de cas',
    'Reflexion',
  ];
  const questions: ExamQuestion[] = [];

  bp.chapters.forEach((chap, cIdx) => {
    const l1 = chap.lessons[0];
    const l2 = chap.lessons[2];

    const q1Opts = rotateArray(
      [
        l1.definition,
        `Une action isolée qui ignore les attentes des segments clients`,
        `Un coût fixe administratif sans lien avec la proposition de valeur`,
      ],
      cIdx
    );
    questions.push({
      id: `${bp.id}-exam-q${questions.length + 1}`,
      category: categories[questions.length % 4],
      notion: `${chap.title} · ${l1.concept}`,
      prompt: `Dans « ${chap.title} », quel énoncé décrit exactement « ${l1.concept} » ?`,
      options: q1Opts,
      correctIndex: q1Opts.indexOf(l1.definition),
      explanation: `${l1.concept} : ${l1.definition}`,
    });

    const q2Opts = rotateArray(
      [
        l2.caseChoice.bestOption,
        l2.caseChoice.wrongOptions[0],
        l2.caseChoice.wrongOptions[1],
      ],
      cIdx + 1
    );
    questions.push({
      id: `${bp.id}-exam-q${questions.length + 1}`,
      category: categories[(questions.length + 1) % 4],
      notion: `${chap.title} · ${l2.title}`,
      context: `${l2.company} (${l2.sector}) : ${l2.situation}`,
      prompt: l2.caseChoice.question,
      options: q2Opts,
      correctIndex: q2Opts.indexOf(l2.caseChoice.bestOption),
      explanation: l2.caseChoice.explanation,
    });
  });

  return questions;
}

export function buildDomainFromBlueprint(bp: DomainBlueprint): Domain {
  const chapters: Chapter[] = bp.chapters.map((chapBp, cIdx) => {
    const chapterId = `${bp.id}-c${cIdx + 1}`;
    const lessons: Lesson[] = chapBp.lessons.map((lessonBp, lIdx) => {
      const lessonId = `${chapterId}-l${lIdx + 1}`;
      return {
        id: lessonId,
        domainId: bp.id,
        chapterId,
        order: lIdx + 1,
        title: lessonBp.title,
        durationMin: 4 + (lIdx % 3),
        xpReward: 25,
        intro:
          lessonBp.intro ??
          `Cette leçon vous fait découvrir « ${lessonBp.concept} » : ${lessonBp.definition}`,
        explanation: lessonBp.explanation,
        keyTakeaways: [...lessonBp.keyTakeaways],
        visualSchema: {
          type: lessonBp.schemaType,
          title: `Schéma clé · ${lessonBp.concept}`,
          items: lessonBp.schemaItems,
        },
        realExample: {
          company: lessonBp.company,
          sector: lessonBp.sector,
          situation: lessonBp.situation,
          action: lessonBp.action,
          outcome: lessonBp.outcome,
        },
        exercises: buildExercisesForLesson(bp.id, cIdx, lIdx, lessonBp),
      };
    });

    return {
      id: chapterId,
      domainId: bp.id,
      order: cIdx + 1,
      title: chapBp.title,
      description: chapBp.description,
      lessons,
    };
  });

  return {
    id: bp.id,
    order: bp.order,
    title: bp.title,
    shortTitle: bp.shortTitle,
    description: bp.description,
    objectives: [...bp.objectives],
    recommendedLevel: bp.recommendedLevel,
    accentColor: bp.accentColor,
    chapters,
    exam: buildDomainExam(bp),
  };
}

export interface CompactTopic {
  title: string;
  concept: string;
  definition: string;
  explanation: string;
  company: string;
  sector: string;
  situation: string;
  action: string;
  outcome: string;
  steps: [string, string, string, string];
  missingWord: string;
  sentenceBefore: string;
  sentenceAfter: string;
  mistake: string;
  fix: string;
}

export function createLessonBlueprint(t: CompactTopic, idx: number): LessonBlueprint {
  const schemaTypes: VisualSchemaType[] = ['funnel', 'matrix2x2', 'cycle', 'bars', 'comparison'];
  const schemaType = schemaTypes[idx % schemaTypes.length];

  return {
    title: t.title,
    concept: t.concept,
    definition: t.definition,
    explanation: t.explanation,
    keyTakeaways: [
      `Comprendre le rôle exact de « ${t.concept} » dans la décision du client.`,
      `Toujours relier l’action (« ${t.action.slice(0, 62)}${t.action.length > 62 ? '...' : ''} ») à un objectif mesurable.`,
      `Éviter l’écueil classique : ${t.mistake.charAt(0).toLowerCase() + t.mistake.slice(1)}`,
    ],
    schemaType,
    schemaItems: [
      { label: t.steps[0], value: 'Étape 1', detail: 'Observation et cadrage' },
      { label: t.steps[1], value: 'Étape 2', detail: 'Conception de la réponse' },
      { label: t.steps[2], value: 'Étape 3', detail: 'Déploiement ciblé' },
      { label: t.steps[3], value: 'Étape 4', detail: 'Mesure et ajustement' },
    ],
    company: t.company,
    sector: t.sector,
    situation: t.situation,
    action: t.action,
    outcome: t.outcome,
    orderedSteps: t.steps,
    pairings: [
      { concept: t.concept, definition: t.definition },
      {
        concept: 'Objectif mesurable',
        definition: `Indicateur vérifiant l’impact réel de « ${t.title} »`,
      },
      {
        concept: 'Erreur à éviter',
        definition: t.mistake,
      },
    ],
    mistakeText: t.mistake,
    mistakeFix: t.fix,
    mistakeDistractors: [
      `Formuler une promesse claire alignée sur le besoin du segment visé`,
      `Mesurer l’efficacité de l’action après le lancement pour ajuster`,
    ],
    fillSentence: {
      before: t.sentenceBefore,
      missing: t.missingWord,
      after: t.sentenceAfter,
      distractors: ['hasard', 'escompte', 'logo'],
    },
    trueFalse: {
      statement: `Pour réussir « ${t.title} », ${t.fix.charAt(0).toLowerCase() + t.fix.slice(1)}`,
      isTrue: true,
      rationale: `Vrai ! En pratique chez ${t.company}, cette rigueur permet d’obtenir un résultat concret : ${t.outcome}`,
    },
    caseChoice: {
      question: `Face au défi de ${t.company}, quelle décision applique le mieux « ${t.concept} » ?`,
      bestOption: t.action,
      wrongOptions: [
        `Ignorer le diagnostic initial et copier une offre générique à bas prix`,
        `Lancer l’opération auprès d’une audience non ciblée sans suivi des résultats`,
      ],
      explanation: `Bravo ! En choisissant d’agir ainsi (« ${t.action} »), ${t.company} obtient : ${t.outcome}`,
    },
  };
}
