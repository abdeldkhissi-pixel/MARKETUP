import { Language, NavTab, SkillLevel } from '../types/marketup';

export interface UIStrings {
  nav: Record<NavTab, { label: string; mobile: string }>;
  home: {
    topDomains: string;
    topSimulators: string;
    topLevelTest: string;
    topMethod: string;
    topStart: string;
    topContinue: string;
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaStart: string;
    ctaContinue: string;
    ctaExplore: string;
    trustFree: string;
    trustNoAccount: string;
    trustLocalSave: string;
    markyTitle: string;
    markyWelcomeNew: string;
    markyWelcomeBack: (xp: number, count: number) => string;
    metricDomains: string;
    metricChapters: string;
    metricLessons: string;
    metricExercises: string;
    whyTitle: string;
    whySubtitle: string;
    whyPlacement: string;
    adv1Title: string;
    adv1Desc: string;
    adv2Title: string;
    adv2Desc: string;
    adv3Title: string;
    adv3Desc: string;
    adv4Title: string;
    adv4Desc: string;
  };
  path: {
    levelPrefix: string;
    dashboardTitle: string;
    xpToNext: (xpLeft: number, nextTitle: string) => string;
    maxLevelReached: string;
    continueBtn: string;
    levelTestBtn: string;
    totalXp: string;
    lessonsDone: string;
    globalProgress: string;
    badgesEarned: string;
    activeStreak: string;
    dailyGoal: string;
    dailyGoalLabel: (xp: number) => string;
    lastCourse: string;
    resumeBtn: string;
    activeDomain: string;
    modeLabel: string;
    modeLearning: string;
    modeChallenge: string;
    heartsOn: (hearts: number) => string;
    heartsOff: string;
    recharge: string;
    domainOrderLabel: (order: number, levelLabel: string) => string;
    lessonsLabel: string;
    objectivesHeading: string;
    markyCourseHeader: string;
    markyEmpty: (chapTitle: string) => string;
    markyInProgress: (lessonTitle: string) => string;
    markyDone: string;
    bestScore: (score: number) => string;
    finalExamTitle: string;
    finalExamDesc: string;
    retakeExam: string;
    takeExam: string;
    certificateBtn: string;
    chapterLabel: (order: number) => string;
    doneCount: (done: number, total: number) => string;
    chapterValidated: string;
    chapterLockHint: string;
    lessonLabel: (chOrder: number, lOrder: number) => string;
    minUnit: string;
  };
  domains: {
    headerTag: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allLevels: string;
    noMatch: (q: string) => string;
    noMatchHint: string;
    resetFilters: string;
    domainBadge: (order: number, level: string) => string;
    chaptersLessons: (done: number, total: number) => string;
    examScore: (score: number) => string;
    showDetails: string;
    hideDetails: string;
    objectives: string;
    chaptersIncluded: string;
    openPath: string;
    finalExam: string;
    certificate: string;
  };
  levels: Record<SkillLevel, string>;
  lessonPlayer: {
    closeLabel: string;
    sheetBadge: string;
    exerciseCounter: (cur: number, total: number) => string;
    finishedBadge: string;
    introHeading: string;
    explanationHeading: string;
    schemaHeading: string;
    schemaTitlePrefix: string;
    exampleHeading: (company: string, sector: string) => string;
    situation: string;
    actionTaken: string;
    outcome: string;
    goPractice: (count: number) => string;
    challengeHint: string;
    showMemo: string;
    hideMemo: string;
    noHeartsTitle: string;
    noHeartsDesc: string;
    rechargeHeartsBtn: string;
    rewardTag: string;
    lessonCompleteTitle: string;
    lessonScoreText: (correct: number, total: number, title: string) => string;
    lessonBonus: string;
    exercisesXp: string;
    markyGreat: string;
    markyGood: string;
    backToPath: string;
    nextLessonBtn: (title: string) => string;
    bilingualNote: string;
  };
  exercise: {
    labelPrefix: string;
    types: {
      qcm: string;
      true_false: string;
      match: string;
      fill_blank: string;
      order: string;
      spot_error: string;
      case_study: string;
      image_analysis: string;
      strategy_match: string;
    };
    sponsoredAd: string;
    trueBtn: string;
    falseBtn: string;
    orderHint: string;
    moveUp: string;
    moveDown: string;
    matchHint: string;
    correctTitle: string;
    wrongTitle: string;
    expectedAnswer: string;
    markyCorrect: string;
    markyWrong: string;
    validate: string;
    next: string;
    finish: string;
  };
  challenges: {
    tag: string;
    title: string;
    subtitle: string;
    todayLabel: string;
    doneToday: string;
    earnToday: string;
    challengeTab: (idx: number, kind: string) => string;
    todayPick: string;
    bestChoice: string;
    pros: string;
    cons: string;
    validate: string;
    tryAnother: string;
    takeawayTitle: string;
  };
  glossary: {
    tag: (count: number) => string;
    title: string;
    subtitle: string;
    favoritesBtn: (count: number) => string;
    searchPlaceholder: string;
    allCat: string;
    emptyTitle: string;
    emptyHint: string;
    simpleLabel: string;
    exampleLabel: string;
  };
  rewards: {
    tag: string;
    title: string;
    subtitle: string;
    currentRank: (lvl: number) => string;
    nextAt: (xp: number) => string;
    maxRank: string;
    howXpTitle: string;
    xpSources: { label: string; xp: string }[];
    badgesTitle: (done: number, total: number) => string;
    conditionLabel: (text: string) => string;
    ladderTitle: string;
    currentBadge: string;
    xpRequired: (xp: number) => string;
  };
  progress: {
    tag: string;
    title: string;
    subtitle: string;
    currentLevel: string;
    lessonsValidated: string;
    chaptersDone: string;
    domainsExams: string;
    certifSuffix: string;
    weeklyChart: string;
    dailyGoalTitle: string;
    dailyGoalDesc: string;
    todayProgress: string;
    domainOverview: string;
    examRetry: (score: number) => string;
    openLink: string;
    recentHistory: string;
    noHistory: string;
    backupTitle: string;
    backupDesc: string;
    exportBtn: string;
    importBtn: string;
    resetBtn: string;
    importErrorInvalid: string;
    importErrorRead: string;
    importSuccess: (xp: number, lessons: number) => string;
    resetModalTitle: string;
    resetModalDesc: string;
    cancel: string;
    confirmReset: string;
  };
  exam: {
    tag: string;
    answered: (done: number, total: number) => string;
    resultHeading: string;
    scoreLabel: string;
    passedMsg: string;
    failedMsg: string;
    viewCert: string;
    retake: string;
    mastered: (count: number) => string;
    noMastered: string;
    toReview: (count: number) => string;
    perfectScore: string;
    markyPass: string;
    markyFail: string;
    qLabel: (idx: number, total: number, cat: string) => string;
    correctPrefix: string;
    wrongPrefix: string;
    footerHint: (total: number) => string;
    submitExam: string;
  };
  certificate: {
    modalTitle: (shortTitle: string) => string;
    nameInputLabel: string;
    namePlaceholder: string;
    downloadSvg: string;
    printPdf: string;
    brandLine: string;
    heading: string;
    certifiesThat: string;
    completedLine: string;
    finalScore: (score: number) => string;
    issuedOn: (date: string) => string;
  };
  placement: {
    title: string;
    subtitle: string;
    quickPick: string;
    quizPick: string;
    close: string;
    computeBtn: string;
    configuredTitle: (label: string) => string;
  };
  simulators: {
    tag: string;
    title: string;
    subtitle: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    tabs: { id: string; label: string; desc: string }[];
    s1Title: string;
    s1Desc: string;
    s1Company: string;
    s1Obj: string;
    s1Target: string;
    s1Pos: string;
    s1Channels: string;
    s1BudgetMix: string;
    s1Evaluate: string;
    s1ScoreLabel: string;
    s2Title: string;
    s2Desc: string;
    s2Product: string;
    s2Audience: string;
    s2Channel: string;
    s2Obj: string;
    s2Message: string;
    s2Budget: string;
    s2Impressions: string;
    s2Ctr: string;
    s2Clicks: string;
    s2Cpc: string;
    s2Conv: string;
    s2Roas: string;
    s2Validate: string;
    s3Title: string;
    s3Desc: string;
    s3Evaluate: string;
    s3Score: (score: number) => string;
    s4Title: string;
    s4Desc: string;
    s4Evaluate: string;
    s4ScoreLabel: string;
    s5Title: string;
    s5Desc: string;
    s5Scenario: (n: number) => string;
    s5Prompt: string;
    s5Validate: string;
    s5FeedbackTitle: string;
    s6Title: string;
    s6Desc: string;
    s6PreviewTitle: string;
    s6Validate: string;
    s6Score: (score: number) => string;
  };
  markyMoods: {
    welcome: string;
    tip: string;
    celebrate: string;
    encourage: string;
  };
}

export const UI_TEXT: Record<Language, UIStrings> = {
  fr: {
    nav: {
      home: { label: 'Accueil', mobile: 'Accueil' },
      path: { label: 'Parcours d’apprentissage', mobile: 'Parcours' },
      domains: { label: 'Domaines du marketing', mobile: 'Domaines' },
      challenges: { label: 'Défis', mobile: 'Défis' },
      simulators: { label: 'Simulations', mobile: 'Simuler' },
      rewards: { label: 'Récompenses', mobile: 'Badges' },
      progress: { label: 'Mon évolution', mobile: 'Évolution' },
      glossary: { label: 'Glossaire', mobile: 'Glossaire' },
    },
    home: {
      topDomains: '18 Domaines',
      topSimulators: 'Simulateurs',
      topLevelTest: 'Test de niveau',
      topMethod: 'Méthode',
      topStart: 'Commencer',
      topContinue: 'Continuer',
      heroTag: 'MARKETUP · Learn Marketing by Playing',
      heroTitle: 'Le marketing devient un jeu !',
      heroSubtitle:
        'Apprenez toutes les disciplines du marketing étape par étape, par la pratique et l’expérimentation. Des leçons courtes, des exercices immédiatement corrigés et des simulateurs professionnels.',
      ctaStart: 'Commencer à apprendre',
      ctaContinue: 'Continuer mon apprentissage',
      ctaExplore: 'Explorer les domaines',
      trustFree: '100 % gratuit',
      trustNoAccount: 'Aucune inscription requise',
      trustLocalSave: 'Sauvegarde automatique sur cet appareil',
      markyTitle: 'Salut, je suis Marky !',
      markyWelcomeNew:
        'Pas de compte à créer, pas de longs cours indigestes : cliquez sur Commencer pour débloquer votre première leçon en 10 secondes.',
      markyWelcomeBack: (xp, count) =>
        `Ravi de vous retrouver ! Vous avez déjà cumulé ${xp} XP et terminé ${count} leçon(s). Prêt pour la suite ?`,
      metricDomains: 'Domaines complets du marketing',
      metricChapters: 'Chapitres progressifs',
      metricLessons: 'Leçons courtes et structurées',
      metricExercises: 'Exercices interactifs corrigés',
      whyTitle: 'Pourquoi apprendre avec MARKETUP ?',
      whySubtitle:
        'La rigueur d’une école de marketing combinée à la fluidité d’un jeu éducatif.',
      whyPlacement: 'Passer le mini test de niveau (facultatif)',
      adv1Title: 'Leçons en 5 minutes',
      adv1Desc:
        'Introduction claire, schéma visuel, cas concret d’entreprise et pratique immédiate. Zéro pavé théorique indigeste.',
      adv2Title: '9 formats d’exercices',
      adv2Desc:
        'QCM, associations, phrases à compléter, étapes à ordonner, erreurs à repérer, analyse d’images et études de cas.',
      adv3Title: '6 simulateurs métiers',
      adv3Desc:
        'Créez une stratégie, lancez une campagne pub, réalisez un SWOT/PESTEL ou pilotez des KPI comme un vrai marketeur.',
      adv4Title: 'Progression sans compte',
      adv4Desc:
        'Niveaux, XP, badges, défis quotidiens et certificats imprimables sauvegardés localement avec export/import JSON.',
    },
    path: {
      levelPrefix: 'Niveau',
      dashboardTitle: 'Tableau de bord d’apprentissage',
      xpToNext: (xpLeft, nextTitle) =>
        `Encore ${xpLeft} XP pour atteindre « ${nextTitle} ».`,
      maxLevelReached: 'Vous avez atteint le rang maximal : Marketing Master.',
      continueBtn: 'Continuer mon apprentissage',
      levelTestBtn: 'Test de niveau',
      totalXp: 'Total XP',
      lessonsDone: 'Leçons terminées',
      globalProgress: 'Progression globale',
      badgesEarned: 'Badges obtenus',
      activeStreak: 'Série active',
      dailyGoal: 'Objectif du jour',
      dailyGoalLabel: (xp) => `Objectif quotidien (${xp} XP)`,
      lastCourse: 'Dernier cours consulté',
      resumeBtn: 'Reprendre',
      activeDomain: 'Domaine actif :',
      modeLabel: 'Mode :',
      modeLearning: 'Apprentissage',
      modeChallenge: 'Challenge',
      heartsOn: (h) => `Vies : ${h}/5`,
      heartsOff: 'Vies : Off',
      recharge: 'Recharger',
      domainOrderLabel: (order, levelLabel) =>
        `Domaine ${order} sur 18 · Niveau recommandé : ${levelLabel}`,
      lessonsLabel: 'leçons',
      objectivesHeading: 'Objectifs pédagogiques du domaine',
      markyCourseHeader: 'Cap sur ce domaine',
      markyEmpty: (chapTitle) =>
        `Commencez par le Chapitre 1 (« ${chapTitle} »). Chaque leçon dure environ 5 minutes et rapporte 25 XP + 10 XP par bonne réponse.`,
      markyInProgress: (lessonTitle) =>
        `Super rythme ! Prochaine étape conseillée : « ${lessonTitle} ». Complétez 3 leçons d’un chapitre pour débloquer le suivant.`,
      markyDone:
        'Vous avez terminé toutes les leçons de ce domaine ! Tentez l’examen final pour décrocher votre certificat.',
      bestScore: (s) => `Meilleur score : ${s}/100`,
      finalExamTitle: 'Examen final du domaine',
      finalExamDesc:
        '10 questions (théorie, pratique, cas réel, réflexion). Score minimal de 70/100 pour valider le certificat et gagner 100 XP.',
      retakeExam: 'Repasser l’examen',
      takeExam: 'Passer l’examen',
      certificateBtn: 'Certificat',
      chapterLabel: (o) => `Chapitre ${o}`,
      doneCount: (d, t) => `${d}/${t} terminées`,
      chapterValidated: 'Chapitre validé (+50 XP)',
      chapterLockHint:
        'Terminez 3 leçons du chapitre précédent (ou passez en Mode Challenge)',
      lessonLabel: (c, l) => `Leçon ${c}.${l}`,
      minUnit: 'min',
    },
    domains: {
      headerTag: 'Programme complet · 18 disciplines',
      title: 'Les 18 domaines du marketing',
      subtitle:
        'Chaque domaine comprend une présentation, des objectifs précis, 5 chapitres progressifs, 25 leçons interactives, des études de cas, un examen final et un certificat imprimable.',
      searchPlaceholder: 'Rechercher un domaine (SEO, branding, email, KPI...)',
      allLevels: 'Tous niveaux',
      noMatch: (q) => `Aucun domaine ne correspond à « ${q} »`,
      noMatchHint: 'Essayez un autre mot-clé ou réinitialisez les filtres.',
      resetFilters: 'Afficher les 18 domaines',
      domainBadge: (o, lvl) => `Domaine ${o} · ${lvl}`,
      chaptersLessons: (d, t) => `5 chapitres · ${d}/${t} leçons`,
      examScore: (s) => `Examen : ${s}/100`,
      showDetails: 'Voir les objectifs et chapitres',
      hideDetails: 'Masquer les objectifs pédagogiques',
      objectives: 'Objectifs pédagogiques :',
      chaptersIncluded: 'Chapitres inclus :',
      openPath: 'Ouvrir le parcours',
      finalExam: 'Examen final',
      certificate: 'Certificat',
    },
    levels: {
      debutant: 'Débutant',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé',
    },
    lessonPlayer: {
      closeLabel: 'Fermer la leçon',
      sheetBadge: 'Fiche A–D',
      exerciseCounter: (cur, tot) => `Exercice ${cur}/${tot}`,
      finishedBadge: 'Terminé',
      introHeading: 'A · Introduction',
      explanationHeading: 'B · Explication claire',
      schemaHeading: 'C · Représentation visuelle',
      schemaTitlePrefix: 'Illustration & Schéma',
      exampleHeading: (c, s) => `D · Exemple concret · ${c} (${s})`,
      situation: 'Situation',
      actionTaken: 'Action menée',
      outcome: 'Résultat',
      goPractice: (count) => `Passer à la pratique (${count} exercices)`,
      challengeHint: 'Mode Challenge actif : accès direct aux exercices',
      showMemo: 'Consulter le mémo',
      hideMemo: 'Masquer le mémo',
      noHeartsTitle: 'Plus de cœurs disponibles !',
      noHeartsDesc:
        'Pas d’inquiétude : sur MARKETUP, rien ne bloque jamais votre envie d’apprendre. Rechargez vos 5 cœurs gratuitement en un clic pour continuer.',
      rechargeHeartsBtn: 'Recharger mes 5 cœurs et continuer',
      rewardTag: 'G · Récompense obtenue',
      lessonCompleteTitle: 'Leçon terminée !',
      lessonScoreText: (c, t, title) =>
        `Vous avez réussi ${c}/${t} exercices sur « ${title} ».`,
      lessonBonus: 'Bonus leçon',
      exercisesXp: 'XP exercices',
      markyGreat:
        'Excellente maîtrise ! Vos réflexes marketing deviennent de plus en plus précis.',
      markyGood:
        'Bravo d’être allé jusqu’au bout ! N’hésitez pas à revoir le schéma de la leçon si besoin.',
      backToPath: 'Retour au parcours',
      nextLessonBtn: (title) => `Leçon suivante : ${title}`,
      bilingualNote: '',
    },
    exercise: {
      labelPrefix: 'Exercice',
      types: {
        qcm: 'Choix multiple',
        true_false: 'Vrai ou faux',
        match: 'Associer les concepts',
        fill_blank: 'Compléter la phrase',
        order: 'Remettre dans l’ordre',
        spot_error: 'Identifier l’erreur',
        case_study: 'Étude de cas',
        image_analysis: 'Analyse visuelle',
        strategy_match: 'Association stratégique',
      },
      sponsoredAd: 'Création sponsorisée',
      trueBtn: 'Vrai',
      falseBtn: 'Faux',
      orderHint:
        'Utilisez les flèches pour placer la 1re étape en haut et la 4e en bas.',
      moveUp: 'Monter l’étape',
      moveDown: 'Descendre l’étape',
      matchHint:
        '1) Cliquez sur un concept à gauche, puis 2) cliquez sur sa définition à droite.',
      correctTitle: 'Bonne réponse ! +10 XP',
      wrongTitle: 'Pas tout à fait — voici l’explication pédagogique :',
      expectedAnswer: 'Réponse attendue :',
      markyCorrect: 'Beau réflexe de marketeur ! Continuez sur cette lancée.',
      markyWrong:
        'Se tromper fait partie du jeu : retenez le mécanisme ci-dessus et passez à la suite.',
      validate: 'Valider ma réponse',
      next: 'Exercice suivant',
      finish: 'Terminer la leçon',
    },
    challenges: {
      tag: 'Marketing Challenge · Entraînement rapide',
      title: 'Défis quotidiens & Mises en situation',
      subtitle:
        'Un cas stratégique court par jour pour affûter vos réflexes. Chaque option dévoile ses avantages et ses limites.',
      todayLabel: 'Défi du jour',
      doneToday: 'Validé (+30 XP)',
      earnToday: '+30 XP à gagner',
      challengeTab: (i, k) => `Défi ${i} · ${k}`,
      todayPick: 'Sélection du jour',
      bestChoice: 'Meilleur choix',
      pros: 'Avantages :',
      cons: 'Limites :',
      validate: 'Valider ma décision',
      tryAnother: 'Tester un autre défi',
      takeawayTitle: 'À retenir de ce défi',
    },
    glossary: {
      tag: (c) => `Dictionnaire interactif · ${c} termes essentiels`,
      title: 'Glossaire du marketing',
      subtitle:
        'Définition officielle, explication vulgarisée et exemple concret pour chaque sigle et concept clé.',
      favoritesBtn: (c) => `Mes favoris (${c})`,
      searchPlaceholder: 'Rechercher un terme (SEO, ROI, Funnel, Churn, NPS...)',
      allCat: 'Tous',
      emptyTitle: 'Aucun terme trouvé',
      emptyHint: 'Modifiez votre recherche ou désactivez le filtre favoris.',
      simpleLabel: 'En mots simples : ',
      exampleLabel: 'Exemple : ',
    },
    rewards: {
      tag: 'Gamification & Distinctions',
      title: 'Niveaux, XP et badges MARKETUP',
      subtitle:
        'Chaque bonne réponse, leçon validée, chapitre terminé, défi quotidien ou examen réussi vous rapproche du rang de Marketing Master.',
      currentRank: (l) => `Votre rang actuel · Niveau ${l}/7`,
      nextAt: (xp) => `Prochain palier à ${xp} XP`,
      maxRank: 'Palier maximal atteint',
      howXpTitle: 'Comment gagner des points XP ?',
      xpSources: [
        { label: 'Bonne réponse', xp: '+10 XP' },
        { label: 'Leçon terminée', xp: '+25 XP' },
        { label: 'Chapitre complété', xp: '+50 XP' },
        { label: 'Défi du jour', xp: '+30 XP' },
        { label: 'Examen réussi (≥ 70)', xp: '+100 XP' },
      ],
      badgesTitle: (d, t) => `Badges de maîtrise (${d}/${t})`,
      conditionLabel: (text) => `Condition : ${text}`,
      ladderTitle: 'Échelle des 7 niveaux',
      currentBadge: 'Actuel',
      xpRequired: (xp) => `${xp.toLocaleString('fr-FR')} XP requis`,
    },
    progress: {
      tag: 'Statistiques & Sauvegarde locale',
      title: 'Mon évolution sur MARKETUP',
      subtitle:
        'Suivez vos progrès en temps réel. Toutes vos données sont enregistrées automatiquement sur votre navigateur, sans compte ni inscription.',
      currentLevel: 'Niveau actuel',
      lessonsValidated: 'Leçons validées',
      chaptersDone: 'Chapitres complétés',
      domainsExams: 'Domaines & Examens',
      certifSuffix: 'certif.',
      weeklyChart: 'Activité XP des 7 derniers jours',
      dailyGoalTitle: 'Objectif quotidien',
      dailyGoalDesc: 'Choisissez votre rythme journalier d’apprentissage :',
      todayProgress: 'Objectif du jour :',
      domainOverview: 'Avancement par domaine & Examens',
      examRetry: (s) => `Examen : ${s}/100 (à retenter)`,
      openLink: 'Ouvrir',
      recentHistory: 'Historique récent d’activité',
      noHistory:
        'Aucune activité enregistrée pour le moment. Terminez votre première leçon ou un défi pour voir apparaître votre historique.',
      backupTitle: 'Sauvegarde et transfert entre appareils',
      backupDesc:
        'Exportez votre progression au format JSON pour la conserver ou l’importer sur un autre ordinateur ou smartphone.',
      exportBtn: 'Exporter ma progression (.json)',
      importBtn: 'Importer une sauvegarde (.json)',
      resetBtn: 'Réinitialiser ma progression',
      importErrorInvalid:
        'Fichier invalide. Veuillez sélectionner une sauvegarde JSON exportée depuis MARKETUP.',
      importErrorRead: 'Impossible de lire le fichier sélectionné.',
      importSuccess: (xp, l) =>
        `Sauvegarde restaurée avec succès (${xp} XP, ${l} leçons).`,
      resetModalTitle: 'Confirmer la réinitialisation ?',
      resetModalDesc:
        'Cette action efface vos points XP, leçons terminées, badges et certificats enregistrés dans ce navigateur. Pensez à exporter votre sauvegarde JSON avant si vous souhaitez la conserver.',
      cancel: 'Annuler',
      confirmReset: 'Oui, tout réinitialiser',
    },
    exam: {
      tag: 'Examen final · Seuil de réussite 70/100',
      answered: (d, t) => `${d}/${t} répondues`,
      resultHeading: 'Résultat de l’évaluation',
      scoreLabel: 'Score obtenu :',
      passedMsg:
        'Félicitations ! Vous validez ce domaine (+100 XP) et débloquez votre certificat symbolique.',
      failedMsg:
        'Encore un petit effort : il faut au moins 70/100 pour décrocher le certificat. Revoyez les notions ciblées ci-dessous et retentez votre chance.',
      viewCert: 'Voir mon certificat',
      retake: 'Repasser l’examen',
      mastered: (c) => `Notions maîtrisées (${c})`,
      noMastered: 'Aucune notion validée pour le moment.',
      toReview: (c) => `Notions à revoir (${c})`,
      perfectScore: 'Aucune lacune détectée, sans faute !',
      markyPass:
        'Bravo pour cette validation ! Vous pouvez imprimer ou télécharger votre certificat personnalisé.',
      markyFail:
        'Analysez la correction de chaque question ci-dessous : chaque erreur devient un repère durable.',
      qLabel: (i, t, cat) => `Question ${i}/${t} · ${cat}`,
      correctPrefix: 'Correct : ',
      wrongPrefix: 'Correction : ',
      footerHint: (t) =>
        `Répondez aux ${t} questions pour calculer votre note sur 100.`,
      submitExam: 'Valider l’examen',
    },
    certificate: {
      modalTitle: (s) => `Certificat de réussite · ${s}`,
      nameInputLabel: 'Nom affiché sur le certificat (personnalisable)',
      namePlaceholder: 'Votre prénom et nom',
      downloadSvg: 'Télécharger (.svg)',
      printPdf: 'Imprimer / PDF',
      brandLine: 'MARKETUP · Learn Marketing by Playing',
      heading: 'Certificat symbolique de réussite',
      certifiesThat: 'Ce certificat atteste que',
      completedLine:
        'a validé l’ensemble des compétences évaluées à l’examen final du domaine',
      finalScore: (s) => `Note finale : ${s}/100`,
      issuedOn: (d) =>
        `Délivré le ${d} · Attestation pédagogique symbolique générée localement par MARKETUP`,
    },
    placement: {
      title: 'Test de positionnement (facultatif)',
      subtitle: 'Adapte la difficulté recommandée sans jamais vous bloquer',
      quickPick: 'Option rapide : choisir directement votre profil',
      quizPick: 'Ou évaluez-vous avec ces 4 questions rapides',
      close: 'Fermer',
      computeBtn: 'Calculer mon niveau',
      configuredTitle: (l) => `Niveau configuré : ${l}`,
    },
    simulators: {
      tag: 'Laboratoire pratique · 6 ateliers interactifs',
      title: 'Simulateurs professionnels de marketing',
      subtitle:
        'Mettez en pratique vos connaissances sur des cas concrets sans aucun risque financier. Chaque atelier validé pour la première fois rapporte +40 XP.',
      disclaimerTitle: 'Simulation pédagogique :',
      disclaimerBody:
        'les métriques, coûts et prévisions affichés dans ces simulateurs reposent sur des modèles éducatifs indicatifs et ne constituent pas des garanties commerciales réelles.',
      tabs: [
        {
          id: 'sim-strategie',
          label: '1. Stratégie marketing',
          desc: 'Cible, positionnement, canaux et mix budgétaire',
        },
        {
          id: 'sim-campagne',
          label: '2. Campagne publicitaire',
          desc: 'Message, canal, budget et simulation de résultats',
        },
        {
          id: 'sim-etude',
          label: '3. Étude de marché',
          desc: 'SWOT, PESTEL, segmentation et concurrence',
        },
        {
          id: 'sim-social',
          label: '4. Réseaux sociaux',
          desc: 'Calendrier éditorial sur 7 jours et équilibre des formats',
        },
        {
          id: 'sim-kpis',
          label: '5. Analyse des KPI',
          desc: 'Diagnostic de tableau de bord et plan d’optimisation',
        },
        {
          id: 'sim-marque',
          label: '6. Gestion de marque',
          desc: 'Identité, ton, promesse et proposition de valeur',
        },
      ],
      s1Title: '1. Création d’une stratégie marketing complète',
      s1Desc:
        'Définissez les piliers stratégiques de votre entreprise fictive pour évaluer la cohérence de votre plan.',
      s1Company: 'Nom de l’entreprise',
      s1Obj: 'Objectif prioritaire',
      s1Target: 'Cible principale (Persona)',
      s1Pos: 'Positionnement différenciant',
      s1Channels: 'Canaux sélectionnés (recommandé : 2 à 4 canaux complémentaires)',
      s1BudgetMix: 'Répartition budget : Digital vs Terrain/Traditionnel',
      s1Evaluate: 'Évaluer ma stratégie',
      s1ScoreLabel: 'Indice de cohérence stratégique',
      s2Title: '2. Création d’une campagne publicitaire',
      s2Desc:
        'Ajustez le canal, le budget et le message pour observer l’impact estimé sur les clics, le CPC et le ROAS (modèle pédagogique).',
      s2Product: 'Produit ou service promu',
      s2Audience: 'Audience ciblée',
      s2Channel: 'Canal publicitaire',
      s2Obj: 'Objectif de campagne',
      s2Message: 'Accroche publicitaire (bénéfice + appel à l’action)',
      s2Budget: 'Budget alloué à la campagne',
      s2Impressions: 'Impressions',
      s2Ctr: 'CTR estimé',
      s2Clicks: 'Clics générés',
      s2Cpc: 'CPC moyen',
      s2Conv: 'Conversions',
      s2Roas: 'ROAS indicatif',
      s2Validate: 'Valider le brief publicitaire',
      s3Title: '3. Simulateur d’étude de marché (SWOT, PESTEL, Segmentation)',
      s3Desc:
        'Structurez votre diagnostic complet avant le lancement d’une nouvelle offre.',
      s3Evaluate: 'Auditer mon étude de marché',
      s3Score: (s) => `Complétude : ${s}%`,
      s4Title: '4. Gestion des réseaux sociaux & Calendrier éditorial',
      s4Desc:
        'Planifiez votre semaine de publication en équilibrant les formats (éducatif, preuve sociale, coulisses) et les objectifs.',
      s4Evaluate: 'Analyser l’équilibre éditorial',
      s4ScoreLabel: 'Score d’équilibre éditorial',
      s5Title: '5. Analyse des performances & Tableau de bord KPI',
      s5Desc:
        'Lisez les métriques du scénario et sélectionnez la décision d’optimisation la plus rentable.',
      s5Scenario: (n) => `Scénario ${n}`,
      s5Prompt: 'Quel diagnostic tirez-vous de ces indicateurs ?',
      s5Validate: 'Valider mon diagnostic',
      s5FeedbackTitle: 'Correction d’analyse KPI',
      s6Title: '6. Atelier de gestion et plateforme de marque',
      s6Desc:
        'Assemblez l’identité complète d’une marque mémorable et testez sa cohérence.',
      s6PreviewTitle: 'Aperçu plateforme de marque',
      s6Validate: 'Valider ma plateforme de marque',
      s6Score: (s) => `Cohérence : ${s}/100`,
    },
    markyMoods: {
      welcome: 'Bienvenue avec Marky',
      tip: 'Conseil de Marky',
      celebrate: 'Bravo de Marky',
      encourage: 'Astuce de Marky',
    },
  },
  en: {
    nav: {
      home: { label: 'Home', mobile: 'Home' },
      path: { label: 'Learning Path', mobile: 'Path' },
      domains: { label: 'Marketing Domains', mobile: 'Domains' },
      challenges: { label: 'Challenges', mobile: 'Challenges' },
      simulators: { label: 'Simulators', mobile: 'Simulate' },
      rewards: { label: 'Rewards', mobile: 'Rewards' },
      progress: { label: 'My Progress', mobile: 'Progress' },
      glossary: { label: 'Glossary', mobile: 'Glossary' },
    },
    home: {
      topDomains: '18 Domains',
      topSimulators: 'Simulators',
      topLevelTest: 'Level Test',
      topMethod: 'Method',
      topStart: 'Start',
      topContinue: 'Continue',
      heroTag: 'MARKETUP · Learn Marketing by Playing',
      heroTitle: 'Marketing becomes a game!',
      heroSubtitle:
        'Master every marketing discipline step by step through hands-on practice. Short bite-sized lessons, instant pedagogical feedback, and realistic professional simulators.',
      ctaStart: 'Start Learning',
      ctaContinue: 'Continue Learning',
      ctaExplore: 'Explore Domains',
      trustFree: '100% Free',
      trustNoAccount: 'No sign-up required',
      trustLocalSave: 'Auto-saved on this device',
      markyTitle: 'Hi, I am Marky!',
      markyWelcomeNew:
        'No account to create, no heavy textbooks: click Start Learning to unlock your first 5-minute marketing quest right away.',
      markyWelcomeBack: (xp, count) =>
        `Welcome back! You already earned ${xp} XP and finished ${count} lesson(s). Ready for the next challenge?`,
      metricDomains: 'Complete marketing domains',
      metricChapters: 'Progressive chapters',
      metricLessons: 'Short structured lessons',
      metricExercises: 'Interactive graded exercises',
      whyTitle: 'Why learn with MARKETUP?',
      whySubtitle:
        'Business-school rigor combined with the fun momentum of an interactive game.',
      whyPlacement: 'Take the quick placement test (optional)',
      adv1Title: '5-minute lessons',
      adv1Desc:
        'Crisp intro, visual diagram, fictional company case, and immediate practice. Zero walls of dry theory.',
      adv2Title: '9 exercise formats',
      adv2Desc:
        'MCQs, concept matching, fill-in-the-blanks, step ordering, mistake spotting, ad visuals, and case studies.',
      adv3Title: '6 pro simulators',
      adv3Desc:
        'Build a strategy, launch an ad campaign, run SWOT/PESTEL research, or diagnose KPIs like a real marketer.',
      adv4Title: 'Zero-friction progress',
      adv4Desc:
        'Levels, XP, badges, daily challenges, and printable certificates saved locally with JSON export & import.',
    },
    path: {
      levelPrefix: 'Level',
      dashboardTitle: 'Learning Dashboard',
      xpToNext: (xpLeft, nextTitle) =>
        `${xpLeft} XP remaining to reach “${nextTitle}”.`,
      maxLevelReached: 'You reached the top rank: Marketing Master.',
      continueBtn: 'Continue Learning',
      levelTestBtn: 'Level Test',
      totalXp: 'Total XP',
      lessonsDone: 'Lessons Completed',
      globalProgress: 'Overall Progress',
      badgesEarned: 'Badges Earned',
      activeStreak: 'Active Streak',
      dailyGoal: 'Daily Goal',
      dailyGoalLabel: (xp) => `Daily goal (${xp} XP)`,
      lastCourse: 'Last visited lesson',
      resumeBtn: 'Resume',
      activeDomain: 'Active domain:',
      modeLabel: 'Mode:',
      modeLearning: 'Learning',
      modeChallenge: 'Challenge',
      heartsOn: (h) => `Hearts: ${h}/5`,
      heartsOff: 'Hearts: Off',
      recharge: 'Refill',
      domainOrderLabel: (order, levelLabel) =>
        `Domain ${order} of 18 · Recommended level: ${levelLabel}`,
      lessonsLabel: 'lessons',
      objectivesHeading: 'Domain learning objectives',
      markyCourseHeader: 'Domain guide',
      markyEmpty: (chapTitle) =>
        `Start with Chapter 1 (“${chapTitle}”). Each lesson takes ~5 minutes and awards 25 XP + 10 XP per right answer.`,
      markyInProgress: (lessonTitle) =>
        `Great momentum! Recommended next step: “${lessonTitle}”. Finish 3 lessons in a chapter to unlock the next one.`,
      markyDone:
        'You completed every lesson in this domain! Take the final exam to earn your certificate.',
      bestScore: (s) => `Best score: ${s}/100`,
      finalExamTitle: 'Domain Final Exam',
      finalExamDesc:
        '10 questions (theory, practice, case study, reflection). Score at least 70/100 to earn your certificate and +100 XP.',
      retakeExam: 'Retake Exam',
      takeExam: 'Take Final Exam',
      certificateBtn: 'Certificate',
      chapterLabel: (o) => `Chapter ${o}`,
      doneCount: (d, t) => `${d}/${t} completed`,
      chapterValidated: 'Chapter cleared (+50 XP)',
      chapterLockHint:
        'Finish 3 lessons in the previous chapter (or switch to Challenge Mode)',
      lessonLabel: (c, l) => `Lesson ${c}.${l}`,
      minUnit: 'min',
    },
    domains: {
      headerTag: 'Full Curriculum · 18 Disciplines',
      title: 'The 18 Marketing Domains',
      subtitle:
        'Each domain includes an overview, 4 clear objectives, 5 progressive chapters, 25 interactive lessons, case studies, a final exam, and a printable certificate.',
      searchPlaceholder: 'Search a domain (SEO, branding, email, KPI...)',
      allLevels: 'All levels',
      noMatch: (q) => `No domain matches “${q}”`,
      noMatchHint: 'Try another keyword or reset your filters.',
      resetFilters: 'Show all 18 domains',
      domainBadge: (o, lvl) => `Domain ${o} · ${lvl}`,
      chaptersLessons: (d, t) => `5 chapters · ${d}/${t} lessons`,
      examScore: (s) => `Exam: ${s}/100`,
      showDetails: 'View objectives & chapters',
      hideDetails: 'Hide learning objectives',
      objectives: 'Learning objectives:',
      chaptersIncluded: 'Included chapters:',
      openPath: 'Open Path',
      finalExam: 'Final Exam',
      certificate: 'Certificate',
    },
    levels: {
      debutant: 'Beginner',
      intermediaire: 'Intermediate',
      avance: 'Advanced',
    },
    lessonPlayer: {
      closeLabel: 'Close lesson',
      sheetBadge: 'Guide A–D',
      exerciseCounter: (cur, tot) => `Exercise ${cur}/${tot}`,
      finishedBadge: 'Done',
      introHeading: 'A · Introduction',
      explanationHeading: 'B · Clear Explanation',
      schemaHeading: 'C · Visual Diagram',
      schemaTitlePrefix: 'Diagram & Visual',
      exampleHeading: (c, s) => `D · Real-World Case · ${c} (${s})`,
      situation: 'Situation',
      actionTaken: 'Action Taken',
      outcome: 'Outcome',
      goPractice: (count) => `Start Practice (${count} exercises)`,
      challengeHint: 'Challenge Mode active: direct access to exercises',
      showMemo: 'View study note',
      hideMemo: 'Hide study note',
      noHeartsTitle: 'Out of hearts!',
      noHeartsDesc:
        'No worries: on MARKETUP, nothing ever blocks your learning. Refill your 5 hearts for free in one click and keep going.',
      rechargeHeartsBtn: 'Refill 5 hearts & continue',
      rewardTag: 'G · Reward Earned',
      lessonCompleteTitle: 'Lesson Completed!',
      lessonScoreText: (c, t, title) =>
        `You scored ${c}/${t} on “${title}”.`,
      lessonBonus: 'Lesson Bonus',
      exercisesXp: 'Exercise XP',
      markyGreat:
        'Awesome mastery! Your marketing instincts are getting sharper every step.',
      markyGood:
        'Great job finishing! Feel free to revisit the visual diagram anytime.',
      backToPath: 'Back to Path',
      nextLessonBtn: (title) => `Next lesson: ${title}`,
      bilingualNote:
        'English interface active · Course case text is presented in its original French curriculum edition.',
    },
    exercise: {
      labelPrefix: 'Exercise',
      types: {
        qcm: 'Multiple Choice',
        true_false: 'True or False',
        match: 'Match Concepts',
        fill_blank: 'Fill in the Blank',
        order: 'Put in Order',
        spot_error: 'Spot the Mistake',
        case_study: 'Case Study',
        image_analysis: 'Visual Analysis',
        strategy_match: 'Strategic Match',
      },
      sponsoredAd: 'Sponsored Creative',
      trueBtn: 'True',
      falseBtn: 'False',
      orderHint:
        'Use the arrows to place Step 1 at the top and Step 4 at the bottom.',
      moveUp: 'Move step up',
      moveDown: 'Move step down',
      matchHint:
        '1) Click a concept on the left, then 2) click its matching definition on the right.',
      correctTitle: 'Great answer! +10 XP',
      wrongTitle: 'Not quite — here is the full explanation:',
      expectedAnswer: 'Expected answer:',
      markyCorrect: 'Sharp marketing thinking! Keep the streak rolling.',
      markyWrong:
        'Mistakes help lock in concepts: review the rule above and move forward.',
      validate: 'Check Answer',
      next: 'Next Exercise',
      finish: 'Finish Lesson',
    },
    challenges: {
      tag: 'Marketing Challenge · Daily Drill',
      title: 'Daily Challenges & Strategy Drills',
      subtitle:
        'One crisp business scenario every day to sharpen your instincts. Every choice reveals its pros and trade-offs.',
      todayLabel: 'Today’s Challenge',
      doneToday: 'Completed (+30 XP)',
      earnToday: '+30 XP available',
      challengeTab: (i, k) => `Challenge ${i} · ${k}`,
      todayPick: 'Today’s Pick',
      bestChoice: 'Best Choice',
      pros: 'Pros:',
      cons: 'Trade-offs:',
      validate: 'Lock In Decision',
      tryAnother: 'Try Another Challenge',
      takeawayTitle: 'Key Takeaway',
    },
    glossary: {
      tag: (c) => `Interactive Dictionary · ${c} Essential Terms`,
      title: 'Marketing Glossary',
      subtitle:
        'Clear definition, plain-language explanation, and concrete example for every key acronym and concept.',
      favoritesBtn: (c) => `Favorites (${c})`,
      searchPlaceholder: 'Search a term (SEO, ROI, Funnel, Churn, NPS...)',
      allCat: 'All',
      emptyTitle: 'No terms found',
      emptyHint: 'Adjust your search query or turn off the favorites filter.',
      simpleLabel: 'In plain words: ',
      exampleLabel: 'Example: ',
    },
    rewards: {
      tag: 'Gamification & Milestones',
      title: 'MARKETUP Levels, XP & Badges',
      subtitle:
        'Every right answer, completed lesson, cleared chapter, daily challenge, or passed exam brings you closer to Marketing Master.',
      currentRank: (l) => `Your current rank · Level ${l}/7`,
      nextAt: (xp) => `Next rank at ${xp} XP`,
      maxRank: 'Highest rank unlocked',
      howXpTitle: 'How to earn XP',
      xpSources: [
        { label: 'Right answer', xp: '+10 XP' },
        { label: 'Lesson finished', xp: '+25 XP' },
        { label: 'Chapter cleared', xp: '+50 XP' },
        { label: 'Daily challenge', xp: '+30 XP' },
        { label: 'Exam passed (≥ 70)', xp: '+100 XP' },
      ],
      badgesTitle: (d, t) => `Mastery Badges (${d}/${t})`,
      conditionLabel: (text) => `Unlock criteria: ${text}`,
      ladderTitle: '7-Level Progression Ladder',
      currentBadge: 'Current',
      xpRequired: (xp) => `${xp.toLocaleString('en-US')} XP required`,
    },
    progress: {
      tag: 'Analytics & Local Backup',
      title: 'My MARKETUP Progress',
      subtitle:
        'Track your growth in real time. Everything is saved automatically in your browser with zero sign-up required.',
      currentLevel: 'Current Level',
      lessonsValidated: 'Lessons Completed',
      chaptersDone: 'Chapters Cleared',
      domainsExams: 'Domains & Exams',
      certifSuffix: 'cert.',
      weeklyChart: 'Last 7 Days XP Activity',
      dailyGoalTitle: 'Daily XP Goal',
      dailyGoalDesc: 'Pick your preferred daily learning pace:',
      todayProgress: 'Today’s progress:',
      domainOverview: 'Domain Progress & Final Exams',
      examRetry: (s) => `Exam: ${s}/100 (retry)`,
      openLink: 'Open',
      recentHistory: 'Recent Activity History',
      noHistory:
        'No activity logged yet. Complete your first lesson or challenge to see your timeline here.',
      backupTitle: 'Backup & Cross-Device Transfer',
      backupDesc:
        'Export your progress as a JSON file to keep it safe or transfer it to another computer or phone.',
      exportBtn: 'Export Progress (.json)',
      importBtn: 'Import Backup (.json)',
      resetBtn: 'Reset Progress',
      importErrorInvalid:
        'Invalid file. Please choose a JSON backup exported from MARKETUP.',
      importErrorRead: 'Could not read the selected file.',
      importSuccess: (xp, l) =>
        `Backup restored successfully (${xp} XP, ${l} lessons).`,
      resetModalTitle: 'Confirm Progress Reset?',
      resetModalDesc:
        'This clears your XP, completed lessons, badges, and certificates stored in this browser. Consider exporting a JSON backup first.',
      cancel: 'Cancel',
      confirmReset: 'Yes, reset everything',
    },
    exam: {
      tag: 'Final Exam · Passing score 70/100',
      answered: (d, t) => `${d}/${t} answered`,
      resultHeading: 'Evaluation Result',
      scoreLabel: 'Final Score:',
      passedMsg:
        'Congratulations! You passed this domain (+100 XP) and unlocked your symbolic certificate.',
      failedMsg:
        'Almost there: you need at least 70/100 to earn the certificate. Review the topics flagged below and try again.',
      viewCert: 'View Certificate',
      retake: 'Retake Exam',
      mastered: (c) => `Mastered Topics (${c})`,
      noMastered: 'No topics mastered yet.',
      toReview: (c) => `Topics to Review (${c})`,
      perfectScore: 'Zero gaps detected — flawless score!',
      markyPass:
        'Awesome milestone! You can now print or download your personalized certificate.',
      markyFail:
        'Check the explanation under each question below — every miss becomes a lasting insight.',
      qLabel: (i, t, cat) => `Question ${i}/${t} · ${cat}`,
      correctPrefix: 'Correct: ',
      wrongPrefix: 'Explanation: ',
      footerHint: (t) =>
        `Answer all ${t} questions to calculate your score out of 100.`,
      submitExam: 'Submit Exam',
    },
    certificate: {
      modalTitle: (s) => `Certificate of Achievement · ${s}`,
      nameInputLabel: 'Learner name displayed on certificate (editable)',
      namePlaceholder: 'Your full name',
      downloadSvg: 'Download (.svg)',
      printPdf: 'Print / PDF',
      brandLine: 'MARKETUP · Learn Marketing by Playing',
      heading: 'Symbolic Certificate of Achievement',
      certifiesThat: 'This certifies that',
      completedLine:
        'has successfully passed all competencies in the final exam for',
      finalScore: (s) => `Final Score: ${s}/100`,
      issuedOn: (d) =>
        `Issued on ${d} · Educational symbolic certificate generated locally by MARKETUP`,
    },
    placement: {
      title: 'Placement Test (Optional)',
      subtitle: 'Tailors recommended difficulty without ever locking you out',
      quickPick: 'Quick option: choose your profile directly',
      quizPick: 'Or test yourself with 4 quick questions',
      close: 'Close',
      computeBtn: 'Calculate My Level',
      configuredTitle: (l) => `Level set to: ${l}`,
    },
    simulators: {
      tag: 'Practice Lab · 6 Interactive Workshops',
      title: 'Professional Marketing Simulators',
      subtitle:
        'Experiment with real-world marketing decisions with zero financial risk. Each simulator awards +40 XP on first completion.',
      disclaimerTitle: 'Educational Simulation:',
      disclaimerBody:
        'metrics, costs, and forecasts shown here are indicative learning models and not real commercial guarantees.',
      tabs: [
        {
          id: 'sim-strategie',
          label: '1. Marketing Strategy',
          desc: 'Target, positioning, channels & budget mix',
        },
        {
          id: 'sim-campagne',
          label: '2. Ad Campaign',
          desc: 'Copy, channel, budget & simulated metrics',
        },
        {
          id: 'sim-etude',
          label: '3. Market Research',
          desc: 'SWOT, PESTEL, segmentation & competition',
        },
        {
          id: 'sim-social',
          label: '4. Social Media',
          desc: '7-day editorial calendar & format balance',
        },
        {
          id: 'sim-kpis',
          label: '5. KPI Analytics',
          desc: 'Dashboard diagnosis & optimization plan',
        },
        {
          id: 'sim-marque',
          label: '6. Brand Building',
          desc: 'Identity, tone, promise & value proposition',
        },
      ],
      s1Title: '1. Build a Complete Marketing Strategy',
      s1Desc:
        'Define the strategic pillars of your fictional company to test your plan’s coherence.',
      s1Company: 'Company Name',
      s1Obj: 'Primary Objective',
      s1Target: 'Main Target (Persona)',
      s1Pos: 'Differentiating Positioning',
      s1Channels: 'Selected Channels (recommended: 2 to 4 complementary channels)',
      s1BudgetMix: 'Budget Split: Digital vs Field/Traditional',
      s1Evaluate: 'Evaluate Strategy',
      s1ScoreLabel: 'Strategic Coherence Index',
      s2Title: '2. Launch an Advertising Campaign',
      s2Desc:
        'Adjust channel, budget, and hook to observe estimated clicks, CPC, and ROAS (educational model).',
      s2Product: 'Promoted Product or Service',
      s2Audience: 'Target Audience',
      s2Channel: 'Advertising Channel',
      s2Obj: 'Campaign Objective',
      s2Message: 'Ad Headline (Benefit + Call to Action)',
      s2Budget: 'Allocated Campaign Budget',
      s2Impressions: 'Impressions',
      s2Ctr: 'Est. CTR',
      s2Clicks: 'Clicks',
      s2Cpc: 'Avg. CPC',
      s2Conv: 'Conversions',
      s2Roas: 'Est. ROAS',
      s2Validate: 'Validate Ad Brief',
      s3Title: '3. Market Research Builder (SWOT, PESTEL, Segmentation)',
      s3Desc:
        'Structure a complete market diagnosis before launching a new offer.',
      s3Evaluate: 'Audit Market Research',
      s3Score: (s) => `Completeness: ${s}%`,
      s4Title: '4. Social Media & Editorial Calendar',
      s4Desc:
        'Plan your 7-day publishing mix across formats (educational, social proof, behind-the-scenes) and goals.',
      s4Evaluate: 'Analyze Editorial Mix',
      s4ScoreLabel: 'Editorial Balance Score',
      s5Title: '5. Performance Analytics & KPI Dashboard',
      s5Desc:
        'Read the scenario metrics and select the most profitable optimization action.',
      s5Scenario: (n) => `Scenario ${n}`,
      s5Prompt: 'What diagnosis do you draw from these metrics?',
      s5Validate: 'Submit Diagnosis',
      s5FeedbackTitle: 'KPI Analysis Feedback',
      s6Title: '6. Brand Platform & Identity Studio',
      s6Desc:
        'Assemble a memorable brand identity and check consistency across touchpoints.',
      s6PreviewTitle: 'Brand Platform Preview',
      s6Validate: 'Validate Brand Platform',
      s6Score: (s) => `Consistency: ${s}/100`,
    },
    markyMoods: {
      welcome: 'Welcome with Marky',
      tip: 'Marky’s Tip',
      celebrate: 'Marky Cheers!',
      encourage: 'Marky’s Hint',
    },
  },
};

export const LEVEL_EN_MAP: Record<number, { title: string; description: string }> = {
  1: {
    title: 'Marketing Explorer',
    description: 'You are laying the first foundations and learning the core language of markets.',
  },
  2: {
    title: 'Marketing Apprentice',
    description: 'You grasp foundational concepts and know how to read a value proposition.',
  },
  3: {
    title: 'Junior Marketer',
    description: 'You structure coherent targets, messaging, and acquisition channels.',
  },
  4: {
    title: 'Marketing Specialist',
    description: 'You run targeted levers: SEO, content, social media, email, and paid ads.',
  },
  5: {
    title: 'Marketing Expert',
    description: 'You analyze performance, optimize funnels, and allocate budgets smartly.',
  },
  6: {
    title: 'Marketing Strategist',
    description: 'You orchestrate brand, acquisition, and retention across the whole company.',
  },
  7: {
    title: 'Marketing Master',
    description: 'You command all 18 disciplines with complete strategic vision.',
  },
};

export const BADGE_EN_MAP: Record<
  string,
  { title: string; description: string; criteriaText: string }
> = {
  'premier-pas': {
    title: 'First Step',
    description: 'Your marketing adventure has officially begun.',
    criteriaText: 'Complete your first lesson',
  },
  'roi-fondamentaux': {
    title: 'King of Fundamentals',
    description: 'Market basics, customer needs, and the 4Ps hold no secrets for you.',
    criteriaText: 'Pass the Foundational Marketing final exam',
  },
  'expert-digital': {
    title: 'Digital Expert',
    description: 'You navigate online acquisition ecosystems with confidence.',
    criteriaText: 'Finish 5 Digital Marketing lessons or pass its exam',
  },
  'maitre-seo': {
    title: 'SEO Master',
    description: 'Keywords, search intent, and organic visibility mastered.',
    criteriaText: 'Finish 5 SEO & SEA lessons or pass its exam',
  },
  'stratege-marque': {
    title: 'Brand Strategist',
    description: 'You know how to craft a memorable, differentiated brand.',
    criteriaText: 'Finish 5 Branding lessons or complete the Brand Simulator',
  },
  'expert-reseaux': {
    title: 'Social Media Pro',
    description: 'Your editorial calendar and engagement tactics hit the mark.',
    criteriaText: 'Finish 5 Social Media lessons or the Social Calendar Simulator',
  },
  'analyste-marketing': {
    title: 'Marketing Analyst',
    description: 'KPIs, ROI, and conversion rates guide every decision.',
    criteriaText: 'Complete the KPI Simulator or 5 Analytics lessons',
  },
  'champion-marketing': {
    title: 'Marketing Champion',
    description: 'Remarkable progress across disciplines, exams, and challenges.',
    criteriaText: 'Reach 1,000 XP and pass at least 3 domain exams',
  },
};

export const GLOSSARY_EN_MAP: Record<
  string,
  { category: string; definition: string; simplified: string; example: string }
> = {
  seo: {
    category: 'Acquisition & Search',
    definition: 'Techniques used to improve a website’s organic ranking in search engine results.',
    simplified: 'The art of showing up at the top of Google for free thanks to helpful, well-structured pages.',
    example: 'A local bakery optimizes its pages for “sourdough bread Lyon” to attract nearby buyers without paying per click.',
  },
  sea: {
    category: 'Acquisition & Search',
    definition: 'Paid search advertising using keyword auctions on search engines.',
    simplified: 'Paying to place your ad at the very top of search results starting today.',
    example: 'An emergency locksmith bids on “24/7 lock repair Paris” to get immediate phone calls.',
  },
  roi: {
    category: 'Analytics & Finance',
    definition: 'Metric measuring profitability of a marketing investment: (Revenue generated - Cost) / Cost.',
    simplified: 'How many dollars or euros come back for every euro invested in marketing.',
    example: 'A €500 campaign generates €2,000 in net margin: the ROI is 300%.',
  },
  kpi: {
    category: 'Analytics & Finance',
    definition: 'Key Performance Indicator selected to track progress toward a specific goal.',
    simplified: 'The key number on your dashboard telling you whether your strategy is working.',
    example: 'For an online store, checkout conversion rate is a critical KPI.',
  },
  swot: {
    category: 'Strategy',
    definition: 'Strategic matrix mapping internal Strengths/Weaknesses against external Opportunities/Threats.',
    simplified: 'A clear snapshot of your internal edge and external market tailwinds or headwinds.',
    example: 'A local coffee shop pairs its barista craft (Strength) with a new nearby campus (Opportunity).',
  },
  pestel: {
    category: 'Strategy',
    definition: 'Macro-environmental scan covering Political, Economic, Sociocultural, Technological, Ecological, and Legal factors.',
    simplified: 'Checking big outside-world trends before launching a product or entering a market.',
    example: 'An e-scooter brand checks new city laws (Legal) and green mobility demand (Ecological).',
  },
  crm: {
    category: 'Retention',
    definition: 'Strategy and software centralizing prospect and customer interactions to personalize follow-up and retention.',
    simplified: 'Your company’s organized memory to send the right message at the right moment.',
    example: 'A repair shop sends a tailored maintenance reminder 11 months after a car purchase.',
  },
  ctr: {
    category: 'Analytics & Finance',
    definition: 'Click-Through Rate: percentage of viewers who click a link or ad out of total impressions.',
    simplified: 'Out of 100 people who see your ad, how many were interested enough to click?',
    example: 'A banner shown 1,000 times getting 25 clicks has a 2.5% CTR.',
  },
  cpc: {
    category: 'Advertising',
    definition: 'Cost Per Click: ad pricing model where the advertiser pays only when someone clicks.',
    simplified: 'The exact price you pay for each visitor brought in by an ad.',
    example: 'Spending €100 for 200 clicks equals an average CPC of €0.50.',
  },
  cpm: {
    category: 'Advertising',
    definition: 'Cost Per Mille: price paid per 1,000 ad impressions regardless of clicks.',
    simplified: 'The cost to be seen 1,000 times — ideal for brand awareness.',
    example: 'A brand-launch video campaign billed at an €8 CPM.',
  },
  conversion: {
    category: 'E-commerce & Funnel',
    definition: 'Target action completed by a user: purchase, newsletter signup, download, or quote request.',
    simplified: 'The moment a casual visitor takes the exact action you wanted.',
    example: 'If 3 out of 100 product-page visitors buy, your conversion rate is 3%.',
  },
  segmentation: {
    category: 'Strategy',
    definition: 'Dividing a broad market into distinct customer groups sharing similar needs or behaviors.',
    simplified: 'Grouping customers by clear profiles instead of talking to everyone the same way.',
    example: 'A gym separates budget-conscious students from executives seeking 7 a.m. coaching.',
  },
  positionnement: {
    category: 'Strategy',
    definition: 'Distinctive, valuable place a brand aims to occupy in customers’ minds compared to competitors.',
    simplified: 'The clear promise explaining why buyers pick you over any alternative.',
    example: 'A bottle brand positions itself as “the minimalist insulated flask guaranteed for life.”',
  },
  branding: {
    category: 'Brand & Content',
    definition: 'Long-term management of a brand’s image, visual identity, voice, and values.',
    simplified: 'What people feel and say about your brand even when you are not in the room.',
    example: 'Signature packaging, friendly tone, and consistent ethics build strong branding.',
  },
  lead: {
    category: 'B2B & Acquisition',
    definition: 'Prospective buyer who showed interest and shared contact details (email, phone, form).',
    simplified: 'An interested person who gave you permission to follow up.',
    example: 'An operations director downloads a cybersecurity guide using their work email.',
  },
  funnel: {
    category: 'E-commerce & Funnel',
    definition: 'Step-by-step path turning strangers into customers and loyal advocates.',
    simplified: 'The guided journey from first discovery to purchase and repeat loyalty.',
    example: 'Blog discovery → Newsletter signup → Free trial → Paid subscription.',
  },
  engagement: {
    category: 'Social Media',
    definition: 'Ratio measuring likes, comments, shares, and saves relative to reach or followers.',
    simplified: 'Does your audience actively react to your posts or scroll right past?',
    example: 'An educational carousel saved by readers earns high-quality engagement.',
  },
  retargeting: {
    category: 'Advertising',
    definition: 'Showing tailored follow-up ads to users who previously visited your site or abandoned a cart.',
    simplified: 'Gently reminding someone who already showed interest without finishing checkout.',
    example: 'A shopper browses sneakers and later sees an ad for that pair with free shipping.',
  },
  inbound: {
    category: 'Brand & Content',
    definition: 'Attracting customers organically through helpful content matched to every buying stage.',
    simplified: 'Pulling buyers in like a magnet with useful advice instead of interrupting them.',
    example: 'A nutrition brand publishes balanced recipes and guides to attract future buyers.',
  },
  outbound: {
    category: 'Acquisition & Search',
    definition: 'Proactive outreach where the brand initiates contact via ads, cold calls, or direct mail.',
    simplified: 'Knocking directly on your prospect’s door to build visibility fast.',
    example: 'A B2B sales team reaches out to 50 targeted logistics directors with tailored notes.',
  },
  persona: {
    category: 'Strategy',
    definition: 'Research-backed semi-fictional profile of your ideal customer’s goals, blockers, and media habits.',
    simplified: 'A human portrait of your ideal buyer so you never write generic copy.',
    example: '“Claire, 34, freelance architect, short on time for invoicing.”',
  },
  cac: {
    category: 'Analytics & Finance',
    definition: 'Customer Acquisition Cost: total marketing and sales spend divided by new customers acquired.',
    simplified: 'How much it costs on average to win one new paying customer.',
    example: 'Spending €1,500 on ads to win 30 new customers yields a €50 CAC.',
  },
  ltv: {
    category: 'Analytics & Finance',
    definition: 'Customer Lifetime Value: total revenue or margin generated across a customer’s relationship.',
    simplified: 'Everything a loyal customer brings in over months or years.',
    example: 'A €20/month subscriber staying 18 months represents €360 gross LTV.',
  },
  'ab-testing': {
    category: 'Growth & Optimization',
    definition: 'Controlled experiment comparing variant A vs variant B across similar audience splits.',
    simplified: 'Testing two real-world versions to keep whichever converts better.',
    example: 'Testing two email subject lines on 20% of your list before sending the winner to 80%.',
  },
  usp: {
    category: 'Strategy',
    definition: 'Unique Selling Proposition: the single clear differentiator separating you from rivals.',
    simplified: 'The #1 memorable reason why your offer stands apart.',
    example: '“2-hour cargo-bike delivery, or your order is free.”',
  },
  cta: {
    category: 'E-commerce & Funnel',
    definition: 'Call To Action: button or prompt urging the user to take a clear immediate step.',
    simplified: 'The clear button telling readers what to do next.',
    example: '“Start my free trial” beats a vague “Submit” button.',
  },
  churn: {
    category: 'Retention',
    definition: 'Percentage of customers or subscribers lost during a given period.',
    simplified: 'How fast water leaks out of the bucket while you try to fill it.',
    example: 'Losing 5 out of 100 subscribers per month equals a 5% monthly churn rate.',
  },
  storytelling: {
    category: 'Brand & Content',
    definition: 'Structuring brand communication around an authentic story that sparks emotion and recall.',
    simplified: 'Telling a real human story instead of listing cold specs.',
    example: 'Sharing how a family workshop revived local textile craftsmanship.',
  },
  nps: {
    category: 'Retention',
    definition: 'Net Promoter Score based on likelihood (0–10) to recommend the brand to others.',
    simplified: 'Measuring whether customers love you enough to refer friends.',
    example: '9–10 are Promoters, 0–6 Detractors: NPS = % Promoters − % Detractors.',
  },
  omnichannel: {
    category: 'E-commerce & Funnel',
    definition: 'Seamless orchestration of web, mobile, social, and retail touchpoints around one customer.',
    simplified: 'Moving from phone to store without ever repeating yourself.',
    example: 'Reserving an item on mobile and picking it up in-store 1 hour later with loyalty perks.',
  },
};

export const DAILY_CHALLENGE_EN_MAP: Record<
  string,
  {
    kind: string;
    prompt: string;
    scenario: string;
    options: { label: string; pros: string; cons: string }[];
    takeaway: string;
  }
> = {
  'dc-1': {
    kind: 'Strategy Challenge',
    prompt: 'Tight budget & young audience: which channel comes first?',
    scenario:
      'You lead marketing for a new eco-friendly apparel brand (“Atelier Brume”) with a strict €600 launch budget. Which channel should you prioritize to reach 18–25 year olds?',
    options: [
      {
        label: 'Organic short-form videos + local micro-creators (TikTok / Reels)',
        pros: 'Very low entry cost, strong organic discovery potential, and fast social proof through relatable creators.',
        cons: 'Requires creative consistency and fluency in short-video storytelling.',
      },
      {
        label: 'Metro billboard campaign in a major city',
        pros: 'High physical visibility and prestige for established brands.',
        cons: 'Way over budget (thousands of euros) with poor targeting and no direct click tracking.',
      },
      {
        label: 'Google Search ads on the broad keyword “clothing”',
        pros: 'Captures active buying intent when keywords are specific.',
        cons: 'Generic keywords are ultra-expensive against retail giants and would burn €600 in hours.',
      },
      {
        label: 'Printed paper catalogs via postal mail',
        pros: 'Tangible keepsake for certain local or senior audiences.',
        cons: 'High printing/postage cost, low fit for Gen Z, and clashes with an eco-friendly positioning.',
      },
    ],
    takeaway:
      'On a lean budget, lean into creative, community-driven channels before paying for broad mass media.',
  },
  'dc-2': {
    kind: 'Mini Case',
    prompt: 'High traffic but almost zero sales: what do you fix first?',
    scenario:
      'Fictional online store “Nordic Roast” attracts 4,000 monthly visitors via coffee blog posts, yet conversion sits at 0.2%. What is the most urgent move?',
    options: [
      {
        label: 'Double Meta Ads spend immediately',
        pros: 'Increases short-term traffic volume.',
        cons: 'Pouring more water into a leaky bucket magnifies losses until the page converts.',
      },
      {
        label: 'Audit the product page (offer clarity, social proof, shipping fees, checkout friction)',
        pros: 'Fixes the actual bottleneck directly by building buyer trust and simplifying checkout.',
        cons: 'Requires analyzing user behavior and running focused page improvements.',
      },
      {
        label: 'Redesign the logo and color palette',
        pros: 'Can refresh an outdated visual look.',
        cons: 'Cosmetic tweaks rarely solve trust, pricing, or usability friction.',
      },
    ],
    takeaway:
      'Always optimize landing-page conversion and checkout flow before buying additional traffic.',
  },
  'dc-3': {
    kind: 'Marketing Culture',
    prompt: 'Why does segmentation always come before positioning?',
    scenario:
      'A founder launching an all-in-one fitness app wants to write ad slogans before defining who the primary user actually is.',
    options: [
      {
        label: 'Because you cannot craft a resonant promise without knowing a specific group’s real needs',
        pros: 'Follows the STP sequence (Segmentation → Targeting → Positioning) so messaging truly lands.',
        cons: 'Requires customer research upfront before jumping into creative slogans.',
      },
      {
        label: 'Because social platforms force you to pick an age bracket to open an ad account',
        pros: 'Ad platforms do offer demographic filters.',
        cons: 'Confuses a technical ad setting with real strategic marketing thinking.',
      },
      {
        label: 'It is optional: a catchy slogan convinces everyone equally',
        pros: 'Speeds up launching generic messaging.',
        cons: 'Trying to speak to everyone resonates with no one and drives acquisition costs up.',
      },
    ],
    takeaway:
      'The STP framework (Segmentation, Targeting, Positioning) is your compass before writing any campaign.',
  },
  'dc-4': {
    kind: 'Ad Analysis',
    prompt: 'Diagnosing an ignored promotional email',
    scenario:
      'A B2B newsletter sent Tuesday morning earns a strong 34% open rate, yet only a 0.4% click rate. What is most likely broken?',
    options: [
      {
        label: 'The email subject line was weak',
        pros: 'Subject lines drive open rates.',
        cons: 'At 34% opens, the subject line worked! The drop-off happens inside the email.',
      },
      {
        label: 'The email body is too dense, the promise unclear, or the CTA button hard to spot',
        pros: 'Pinpoints the exact break between initial curiosity (open) and action (click).',
        cons: 'Requires tightening copy, aligning body with the subject promise, and featuring one clear CTA.',
      },
      {
        label: 'The subscriber list is technically invalid',
        pros: 'List hygiene affects deliverability.',
        cons: 'A 34% open rate proves emails are reaching inboxes.',
      },
    ],
    takeaway:
      'Open rate = subject line & sender trust. Click rate = message relevance & CTA clarity.',
  },
  'dc-5': {
    kind: 'Strategy Reflection',
    prompt: 'Retention vs Acquisition: what balance wins?',
    scenario:
      'Your fictional SaaS “Kinetik” acquires 100 new customers/month at €80 each, but loses 95 customers/month within 60 days.',
    options: [
      {
        label: 'Prioritize onboarding and churn interviews to retain users before scaling ads',
        pros: 'Protects LTV, turns happy users into advocates, and makes future acquisition profitable.',
        cons: 'Takes a few weeks of product & CRM improvement rather than an instant vanity spike.',
      },
      {
        label: 'Scale ad bids to buy 200 new customers/month right away',
        pros: 'Creates a temporary illusion of top-line growth.',
        cons: 'With 95% churn, net user count stalls while ad spend drains cash.',
      },
    ],
    takeaway:
      'Retention is the foundation of durable growth: keeping customers beats endlessly replacing them.',
  },
};

export const PLACEMENT_EN_MAP = [
  {
    question: 'What does “STP” stand for in strategic marketing?',
    options: [
      'Segmentation, Targeting, Positioning',
      'Strategy, Tariff, Publicity',
      'Service, Traffic, Partnership',
    ],
  },
  {
    question: 'A site receives 2,000 visitors and makes 60 sales. What is its conversion rate?',
    options: ['0.3%', '3%', '30%'],
  },
  {
    question: 'What is the key difference between SEO and SEA?',
    options: [
      'SEO is organic search ranking; SEA is paid search advertising',
      'SEO is social media only; SEA is email marketing',
      'There is no difference; they are synonyms',
    ],
  },
  {
    question: 'If Customer Acquisition Cost (CAC) is €90 and LTV is €65, the business is:',
    options: [
      'Highly profitable long-term',
      'Losing money: each acquired customer costs more than they bring in',
      'Financially neutral',
    ],
  },
];
