import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Compass,
  Info,
  Megaphone,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
import { UI_TEXT } from '../i18n/translations';
import { UserProgress } from '../types/marketup';
import { MarkyCoach } from './MarkyCoach';

interface SimulatorsViewProps {
  progress: UserProgress;
  onCompleteSimulator: (simId: string, label: string) => void;
}

type SimulatorId =
  | 'sim-strategie'
  | 'sim-campagne'
  | 'sim-etude'
  | 'sim-social'
  | 'sim-kpis'
  | 'sim-marque';

const SIM_ICONS: Record<SimulatorId, React.ComponentType<{ className?: string }>> = {
  'sim-strategie': Compass,
  'sim-campagne': Megaphone,
  'sim-etude': Search,
  'sim-social': Calendar,
  'sim-kpis': BarChart3,
  'sim-marque': Tag,
};

const SIM_COLORS: Record<SimulatorId, string> = {
  'sim-strategie': 'from-violet-700 to-indigo-700 border-violet-800',
  'sim-campagne': 'from-blue-600 to-cyan-600 border-blue-700',
  'sim-etude': 'from-emerald-600 to-teal-600 border-emerald-700',
  'sim-social': 'from-rose-600 to-pink-600 border-rose-700',
  'sim-kpis': 'from-amber-500 to-orange-500 border-amber-600',
  'sim-marque': 'from-fuchsia-600 to-violet-700 border-fuchsia-700',
};

const KPI_SCENARIOS = {
  fr: [
    {
      id: 'ecom-coffee',
      title: 'Nordic Roast · E-commerce café de spécialité',
      visitors: 12500,
      conversionRate: 0.7,
      cpc: 0.65,
      roiPct: -15,
      engagementPct: 4.8,
      reach: 42000,
      salesEur: 3150,
      bestDiagnosisIndex: 1,
      options: [
        'Le trafic et la portée sont insuffisants : il faut doubler le budget publicitaire dès demain.',
        'Le trafic et l’engagement sont bons (CPC 0,65 €, 12 500 visites), mais le taux de conversion de 0,7 % freine la rentabilité : priorité à l’optimisation de la fiche produit et du panier.',
        'Le taux d’engagement de 4,8 % est catastrophique : il faut supprimer tous les réseaux sociaux.',
      ],
      explanation:
        'Avec 12 500 visiteurs et un CPC maîtrisé à 0,65 €, l’acquisition fonctionne. Le vrai levier de ROI est la conversion sur le site (passer de 0,7 % à 2 % triple le chiffre d’affaires sans payer plus de trafic).',
    },
    {
      id: 'b2b-saas',
      title: 'Kinetik SaaS · Logiciel RH B2B',
      visitors: 3400,
      conversionRate: 3.8,
      cpc: 3.9,
      roiPct: 190,
      engagementPct: 1.9,
      reach: 11200,
      salesEur: 24800,
      bestDiagnosisIndex: 0,
      options: [
        'La conversion (3,8 %) et le ROI (190 %) sont très sains, mais le CPC est élevé (3,90 €) et la portée modeste : développer du SEO/contenu B2B baissera le coût d’acquisition moyen.',
        'Le taux de conversion de 3,8 % en B2B est trop faible : il faut baisser le prix de 50 %.',
        'Il faut arrêter toutes les actions qui génèrent 190 % de ROI pour tester des affiches papier.',
      ],
      explanation:
        'En B2B, 3,8 % de conversion et 190 % de ROI prouvent une forte adéquation offre-marché. Réduire la dépendance aux enchères coûteuses (CPC 3,90 €) grâce à l’Inbound/SEO consolidera les marges.',
    },
  ],
  en: [
    {
      id: 'ecom-coffee',
      title: 'Nordic Roast · Specialty Coffee E-Commerce',
      visitors: 12500,
      conversionRate: 0.7,
      cpc: 0.65,
      roiPct: -15,
      engagementPct: 4.8,
      reach: 42000,
      salesEur: 3150,
      bestDiagnosisIndex: 1,
      options: [
        'Traffic and reach are too low: double the ad budget immediately.',
        'Traffic and engagement are healthy (€0.65 CPC, 12,500 visits), but the 0.7% conversion rate hurts profitability: prioritize product-page and checkout optimization.',
        'A 4.8% engagement rate is terrible: shut down all social media accounts.',
      ],
      explanation:
        'With 12,500 visitors and a low €0.65 CPC, acquisition is working well. The true ROI lever is on-site conversion: lifting it from 0.7% to 2% nearly triples revenue with zero extra ad spend.',
    },
    {
      id: 'b2b-saas',
      title: 'Kinetik SaaS · B2B HR Software',
      visitors: 3400,
      conversionRate: 3.8,
      cpc: 3.9,
      roiPct: 190,
      engagementPct: 1.9,
      reach: 11200,
      salesEur: 24800,
      bestDiagnosisIndex: 0,
      options: [
        'Conversion (3.8%) and ROI (190%) are strong, while CPC is pricey (€3.90) and reach modest: investing in B2B SEO & content will lower average acquisition costs.',
        'A 3.8% B2B conversion rate is weak: slash pricing by 50%.',
        'Stop every campaign delivering 190% ROI and switch to street flyers.',
      ],
      explanation:
        'In B2B, 3.8% conversion and 190% ROI prove strong product-market fit. Lowering reliance on costly paid bids (€3.90 CPC) via Inbound & SEO will strengthen margins.',
    },
  ],
};

const WEEK_DAYS = {
  fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const SimulatorsView: React.FC<SimulatorsViewProps> = ({
  progress,
  onCompleteSimulator,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].simulators;

  const [activeSim, setActiveSim] = useState<SimulatorId>('sim-strategie');

  // 1. Stratégie
  const [stratCompany, setStratCompany] = useState('Veloce Terra');
  const [stratTarget, setStratTarget] = useState(
    lang === 'fr'
      ? 'Jeunes actifs urbains soucieux d’écologie'
      : 'Eco-conscious urban commuters (25–38)'
  );
  const [stratObjective, setStratObjective] = useState<
    'notoriete' | 'acquisition' | 'fidelisation'
  >('acquisition');
  const [stratPositioning, setStratPositioning] = useState(
    lang === 'fr'
      ? 'Le vélo électrique urbain réparable en 24h et garanti 5 ans'
      : 'The urban e-bike serviced in 24h with a 5-year warranty'
  );
  const [stratChannels, setStratChannels] = useState<string[]>([
    'SEO & Content',
    'Social Media',
  ]);
  const [stratDigitalShare, setStratDigitalShare] = useState(70);
  const [stratEvaluated, setStratEvaluated] = useState(false);

  // 2. Campagne
  const [campProduct, setCampProduct] = useState('Nordic Roast Coffee Box');
  const [campTarget, setCampTarget] = useState('Coffee lovers 25-45');
  const [campChannel, setCampChannel] = useState<
    'search' | 'social' | 'display' | 'email'
  >('social');
  const [campObjective, setCampObjective] = useState<
    'notoriete' | 'trafic' | 'ventes'
  >('ventes');
  const [campBudget, setCampBudget] = useState(1200);
  const [campMessage, setCampMessage] = useState(
    lang === 'fr'
      ? 'Savourez un café d’exception livré sous 48h — -15 % sur votre 1er coffret'
      : 'Freshly roasted specialty coffee in 48h — 15% off your first box'
  );
  const [campEvaluated, setCampEvaluated] = useState(false);

  // 3. Étude de marché
  const [swotStrength, setSwotStrength] = useState('Artisanal recipes & agile team');
  const [swotWeakness, setSwotWeakness] = useState('Low awareness outside city center');
  const [swotOpp, setSwotOpp] = useState('Rising demand for click & collect');
  const [swotThreat, setSwotThreat] = useState('Low-cost national chain opening nearby');
  const [pestelTech, setPestelTech] = useState('Widespread mobile payment & QR ordering');
  const [pestelEco, setPestelEco] = useState('Strong preference for compostable packs');
  const [marketSegment, setMarketSegment] = useState('Office professionals 25-45 ordering 3x/week');
  const [competitorGap, setCompetitorGap] = useState('Competitors lack sourcing transparency');
  const [studyEvaluated, setStudyEvaluated] = useState(false);

  // 4. Réseaux sociaux
  const [socialCalendar, setSocialCalendar] = useState<
    Record<number, { channel: string; format: string; goal: string }>
  >({
    0: { channel: 'LinkedIn', format: 'Educational Carousel', goal: 'Authority' },
    1: { channel: 'Instagram', format: 'Behind-the-scenes Reel', goal: 'Awareness' },
    2: { channel: 'TikTok', format: '30s Quick Tip Video', goal: 'Reach' },
    3: { channel: 'Instagram', format: 'Customer Testimonial', goal: 'Social Proof' },
    4: { channel: 'LinkedIn', format: 'Mini Case Study', goal: 'Conversion' },
    5: { channel: 'Instagram', format: 'Interactive Story Poll', goal: 'Engagement' },
    6: { channel: 'Community / Rest', format: 'Comment Replies', goal: 'Retention' },
  });
  const [socialEvaluated, setSocialEvaluated] = useState(false);

  // 5. KPI
  const [kpiScenarioIdx, setKpiScenarioIdx] = useState(0);
  const [kpiSelectedOption, setKpiSelectedOption] = useState<number | null>(null);
  const [kpiEvaluated, setKpiEvaluated] = useState(false);

  // 6. Marque
  const [brandName, setBrandName] = useState('Atelier Brume');
  const [brandTarget, setBrandTarget] = useState('Creative urbanites 22-38');
  const [brandPositioning, setBrandPositioning] = useState('Minimalist durable apparel in numbered batches');
  const [brandTone, setBrandTone] = useState('Warm, transparent, and expert');
  const [brandVisual, setBrandVisual] = useState('Deep violet, natural linen, crisp geometric typography');
  const [brandPromise, setBrandPromise] = useState('Timeless pieces built to last 10 years without compromise');
  const [brandEvaluated, setBrandEvaluated] = useState(false);

  const campaignMetrics = useMemo(() => {
    const channelStats = {
      search: { cpm: 14, ctr: 0.042, cvr: 0.038, avgBasket: 48 },
      social: { cpm: 7.5, ctr: 0.019, cvr: 0.024, avgBasket: 42 },
      display: { cpm: 4.5, ctr: 0.007, cvr: 0.011, avgBasket: 40 },
      email: { cpm: 3.0, ctr: 0.055, cvr: 0.045, avgBasket: 45 },
    }[campChannel];

    const msgBonus = campMessage.trim().length > 25 ? 1.15 : 0.85;
    const impressions = Math.round((campBudget / channelStats.cpm) * 1000);
    const ctr = +(channelStats.ctr * 100 * msgBonus).toFixed(2);
    const clicks = Math.round(impressions * (ctr / 100));
    const cpc = clicks > 0 ? +(campBudget / clicks).toFixed(2) : 0;
    const conversions = Math.max(1, Math.round(clicks * channelStats.cvr));
    const revenue = Math.round(conversions * channelStats.avgBasket);
    const roas = +(revenue / Math.max(1, campBudget)).toFixed(2);

    return { impressions, ctr, clicks, cpc, conversions, revenue, roas };
  }, [campChannel, campBudget, campMessage]);

  const toggleStrategyChannel = (ch: string) => {
    setStratChannels((prev) =>
      prev.includes(ch) ? prev.filter((item) => item !== ch) : [...prev, ch]
    );
  };

  const strategyScore = useMemo(() => {
    let score = 40;
    if (stratCompany.trim().length >= 2) score += 10;
    if (stratTarget.trim().length >= 8) score += 15;
    if (stratPositioning.trim().length >= 12) score += 15;
    if (stratChannels.length >= 2 && stratChannels.length <= 4) score += 15;
    else if (stratChannels.length > 0) score += 5;
    if (stratDigitalShare >= 40 && stratDigitalShare <= 85) score += 5;
    return Math.min(100, score);
  }, [stratCompany, stratTarget, stratPositioning, stratChannels, stratDigitalShare]);

  const studyScore = useMemo(() => {
    const fields = [
      swotStrength,
      swotWeakness,
      swotOpp,
      swotThreat,
      pestelTech,
      pestelEco,
      marketSegment,
      competitorGap,
    ];
    const filled = fields.filter((f) => f.trim().length >= 8).length;
    return Math.round((filled / fields.length) * 100);
  }, [
    swotStrength,
    swotWeakness,
    swotOpp,
    swotThreat,
    pestelTech,
    pestelEco,
    marketSegment,
    competitorGap,
  ]);

  const socialMixReport = useMemo(() => {
    const entries = Object.values(socialCalendar);
    const uniqueGoals = new Set(entries.map((e) => e.goal)).size;
    const uniqueFormats = new Set(entries.map((e) => e.format)).size;
    const activeDays = entries.filter((e) => e.channel !== 'Community / Rest').length;
    const score = Math.min(
      100,
      Math.round((uniqueGoals / 5) * 40 + (uniqueFormats / 5) * 40 + (activeDays >= 4 ? 20 : 10))
    );
    return { uniqueGoals, uniqueFormats, activeDays, score };
  }, [socialCalendar]);

  const brandScore = useMemo(() => {
    const fields = [
      brandName,
      brandTarget,
      brandPositioning,
      brandTone,
      brandVisual,
      brandPromise,
    ];
    const solid = fields.filter((f) => f.trim().length >= 8).length;
    return Math.round((solid / fields.length) * 100);
  }, [brandName, brandTarget, brandPositioning, brandTone, brandVisual, brandPromise]);

  const activeKpiScenario = KPI_SCENARIOS[lang][kpiScenarioIdx];
  const localeStr = lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-amber-50/40 p-6 shadow-xs sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
          {t.tag}
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{t.subtitle}</p>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border-2 border-sky-200 bg-sky-50/80 px-4 py-3 text-xs text-sky-950">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p>
            <strong>{t.disclaimerTitle}</strong> {t.disclaimerBody}
          </p>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {t.tabs.map((sim) => {
            const simId = sim.id as SimulatorId;
            const Icon = SIM_ICONS[simId];
            const isActive = activeSim === simId;
            const isDone = progress.completedSimulatorIds.includes(simId);

            return (
              <button
                key={simId}
                type="button"
                onClick={() => setActiveSim(simId)}
                className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${SIM_COLORS[simId]} text-white shadow-sm`
                    : 'border-slate-200 bg-white text-slate-800 hover:border-violet-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive
                      ? 'bg-white/20 text-amber-300'
                      : 'border border-slate-200 bg-violet-50 text-violet-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold">{sim.label}</span>
                    {isDone && (
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-amber-300' : 'text-emerald-600'
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`mt-0.5 text-xs ${
                      isActive ? 'text-white/90' : 'text-slate-500'
                    }`}
                  >
                    {sim.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* 1. STRATEGY */}
      {activeSim === 'sim-strategie' && (
        <section className="rounded-3xl border-2 border-violet-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            {t.s1Title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.s1Desc}</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s1Company}
              </label>
              <input
                type="text"
                value={stratCompany}
                onChange={(e) => setStratCompany(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s1Obj}
              </label>
              <select
                value={stratObjective}
                onChange={(e) =>
                  setStratObjective(
                    e.target.value as 'notoriete' | 'acquisition' | 'fidelisation'
                  )
                }
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-violet-600 focus:outline-none"
              >
                <option value="notoriete">
                  {lang === 'fr' ? 'Développer la notoriété' : 'Build brand awareness'}
                </option>
                <option value="acquisition">
                  {lang === 'fr' ? 'Acquérir de nouveaux clients' : 'Acquire new customers'}
                </option>
                <option value="fidelisation">
                  {lang === 'fr'
                    ? 'Fidéliser et augmenter le réachat'
                    : 'Retain & boost repeat orders'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s1Target}
              </label>
              <input
                type="text"
                value={stratTarget}
                onChange={(e) => setStratTarget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s1Pos}
              </label>
              <input
                type="text"
                value={stratPositioning}
                onChange={(e) => setStratPositioning(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold text-slate-700">{t.s1Channels}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                'SEO & Content',
                'Social Media',
                'Search / Meta Ads',
                'Emailing & CRM',
                'Local Partnerships',
                'Field Events',
              ].map((ch) => {
                const active = stratChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleStrategyChannel(ch)}
                    className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border-violet-700 bg-violet-700 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border-2 border-violet-100 bg-violet-50/40 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t.s1BudgetMix}</span>
              <span className="font-mono-num text-violet-800">
                {stratDigitalShare}% Digital · {100 - stratDigitalShare}%{' '}
                {lang === 'fr' ? 'Terrain' : 'Field'}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              step={5}
              value={stratDigitalShare}
              onChange={(e) => setStratDigitalShare(Number(e.target.value))}
              className="mt-3 w-full accent-violet-700"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setStratEvaluated(true);
                onCompleteSimulator(
                  'sim-strategie',
                  lang === 'fr'
                    ? 'Simulateur : Stratégie marketing'
                    : 'Simulator: Marketing Strategy'
                );
              }}
              className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-violet-600"
            >
              <Sparkles className="h-4 w-4" />
              {t.s1Evaluate}
            </button>

            {stratEvaluated && (
              <div className="text-right">
                <p className="text-xs text-slate-500">{t.s1ScoreLabel}</p>
                <p className="font-mono-num text-2xl font-extrabold text-blue-700">
                  {strategyScore}/100
                </p>
              </div>
            )}
          </div>

          {stratEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood="celebrate"
                title={stratCompany || 'Strategy'}
                message={
                  stratChannels.length > 4
                    ? lang === 'fr'
                      ? 'Attention à la dispersion : concentrez vos efforts sur 2 ou 3 canaux alignés avec votre cible.'
                      : 'Watch out for spreading too thin: focus on 2–3 high-impact channels aligned with your target.'
                    : lang === 'fr'
                    ? `Stratégie équilibrée (${strategyScore}/100) ! Votre positionnement « ${stratPositioning} » parle directement à « ${stratTarget} » via ${stratChannels.join(', ')}.`
                    : `Well-balanced strategy (${strategyScore}/100)! Your positioning “${stratPositioning}” speaks directly to “${stratTarget}” via ${stratChannels.join(', ')}.`
                }
              />
            </div>
          )}
        </section>
      )}

      {/* 2. AD CAMPAIGN */}
      {activeSim === 'sim-campagne' && (
        <section className="rounded-3xl border-2 border-sky-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            {t.s2Title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.s2Desc}</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s2Product}
              </label>
              <input
                type="text"
                value={campProduct}
                onChange={(e) => setCampProduct(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s2Audience}
              </label>
              <input
                type="text"
                value={campTarget}
                onChange={(e) => setCampTarget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s2Channel}
              </label>
              <select
                value={campChannel}
                onChange={(e) =>
                  setCampChannel(
                    e.target.value as 'search' | 'social' | 'display' | 'email'
                  )
                }
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="search">Google Search (SEA)</option>
                <option value="social">Social Ads (Instagram / TikTok / Meta)</option>
                <option value="display">Display Banners</option>
                <option value="email">Newsletter / Sponsored Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {t.s2Obj}
              </label>
              <select
                value={campObjective}
                onChange={(e) =>
                  setCampObjective(
                    e.target.value as 'notoriete' | 'trafic' | 'ventes'
                  )
                }
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="notoriete">
                  {lang === 'fr' ? 'Notoriété (Portée / CPM)' : 'Awareness (Reach / CPM)'}
                </option>
                <option value="trafic">
                  {lang === 'fr' ? 'Trafic qualifié (Clics / CPC)' : 'Qualified Traffic (CPC)'}
                </option>
                <option value="ventes">
                  {lang === 'fr' ? 'Conversions & Ventes (ROAS)' : 'Conversions & Sales (ROAS)'}
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-700">
              {t.s2Message}
            </label>
            <input
              type="text"
              value={campMessage}
              onChange={(e) => setCampMessage(e.target.value)}
              className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="mt-5 rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t.s2Budget}</span>
              <span className="font-mono-num text-base text-blue-700">
                {campBudget.toLocaleString(localeStr)} €
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={campBudget}
              onChange={(e) => setCampBudget(Number(e.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] font-semibold text-slate-500">
                {t.s2Impressions}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {campaignMetrics.impressions.toLocaleString(localeStr)}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-3.5">
              <p className="text-[11px] font-semibold text-blue-800">{t.s2Ctr}</p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-blue-700">
                {campaignMetrics.ctr}%
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] font-semibold text-slate-500">
                {t.s2Clicks}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {campaignMetrics.clicks.toLocaleString(localeStr)}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] font-semibold text-slate-500">{t.s2Cpc}</p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {campaignMetrics.cpc} €
              </p>
            </div>
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3.5">
              <p className="text-[11px] font-semibold text-emerald-800">
                {t.s2Conv}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-emerald-700">
                {campaignMetrics.conversions}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-3.5">
              <p className="text-[11px] font-semibold text-violet-800">
                {t.s2Roas}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-violet-900">
                {campaignMetrics.roas}x
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setCampEvaluated(true);
                onCompleteSimulator(
                  'sim-campagne',
                  lang === 'fr'
                    ? 'Simulateur : Campagne publicitaire'
                    : 'Simulator: Ad Campaign'
                );
              }}
              className="rounded-2xl border-b-4 border-blue-900 bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-500"
            >
              {t.s2Validate}
            </button>
          </div>

          {campEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood="tip"
                message={
                  campObjective === 'ventes' && campChannel === 'display'
                    ? lang === 'fr'
                      ? 'Remarque pédagogique : le Display génère beaucoup d’impressions à faible CPM, mais convertit moins directement que le Search ou l’Emailing.'
                      : 'Learning note: Display drives lots of low-CPM impressions, but converts lower than Search or Email for direct sales.'
                    : lang === 'fr'
                    ? `Campagne cohérente pour « ${campProduct} » ! Votre accroche porte le CTR simulé à ${campaignMetrics.ctr}%.`
                    : `Coherent campaign for “${campProduct}”! Your benefit-led headline pushes simulated CTR to ${campaignMetrics.ctr}%.`
                }
              />
            </div>
          )}
        </section>
      )}

      {/* 3. MARKET RESEARCH */}
      {activeSim === 'sim-etude' && (
        <section className="rounded-3xl border-2 border-emerald-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            {t.s3Title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.s3Desc}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
              <label className="block text-xs font-extrabold text-emerald-900">
                SWOT · {lang === 'fr' ? 'Force interne' : 'Strength'}
              </label>
              <input
                type="text"
                value={swotStrength}
                onChange={(e) => setSwotStrength(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-4">
              <label className="block text-xs font-extrabold text-rose-900">
                SWOT · {lang === 'fr' ? 'Faiblesse interne' : 'Weakness'}
              </label>
              <input
                type="text"
                value={swotWeakness}
                onChange={(e) => setSwotWeakness(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4">
              <label className="block text-xs font-extrabold text-blue-900">
                SWOT · {lang === 'fr' ? 'Opportunité externe' : 'Opportunity'}
              </label>
              <input
                type="text"
                value={swotOpp}
                onChange={(e) => setSwotOpp(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4">
              <label className="block text-xs font-extrabold text-amber-900">
                SWOT · {lang === 'fr' ? 'Menace externe' : 'Threat'}
              </label>
              <input
                type="text"
                value={swotThreat}
                onChange={(e) => setSwotThreat(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                PESTEL · {lang === 'fr' ? 'Tendance Technologique' : 'Technological Trend'}
              </label>
              <input
                type="text"
                value={pestelTech}
                onChange={(e) => setPestelTech(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                PESTEL · {lang === 'fr' ? 'Exigence Écologique' : 'Ecological Factor'}
              </label>
              <input
                type="text"
                value={pestelEco}
                onChange={(e) => setPestelEco(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Segment cible prioritaire' : 'Primary Target Segment'}
              </label>
              <input
                type="text"
                value={marketSegment}
                onChange={(e) => setMarketSegment(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr'
                  ? 'Analyse concurrence (faille identifiée)'
                  : 'Competitor Gap Identified'}
              </label>
              <input
                type="text"
                value={competitorGap}
                onChange={(e) => setCompetitorGap(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setStudyEvaluated(true);
                onCompleteSimulator(
                  'sim-etude',
                  lang === 'fr'
                    ? 'Simulateur : Étude de marché'
                    : 'Simulator: Market Research'
                );
              }}
              className="rounded-2xl border-b-4 border-emerald-800 bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-500"
            >
              {t.s3Evaluate}
            </button>
            {studyEvaluated && (
              <p className="font-mono-num text-xl font-extrabold text-emerald-700">
                {t.s3Score(studyScore)}
              </p>
            )}
          </div>

          {studyEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood="celebrate"
                message={
                  lang === 'fr'
                    ? `Votre étude croise diagnostic interne (« ${swotStrength} »), tendances externes et faille concurrentielle (« ${competitorGap} »).`
                    : `Your research connects internal strengths (“${swotStrength}”), macro trends, and competitor gaps (“${competitorGap}”).`
                }
              />
            </div>
          )}
        </section>
      )}

      {/* 4. SOCIAL MEDIA */}
      {activeSim === 'sim-social' && (
        <section className="rounded-3xl border-2 border-rose-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            {t.s4Title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.s4Desc}</p>

          <div className="mt-6 space-y-2.5">
            {WEEK_DAYS[lang].map((day, idx) => {
              const row = socialCalendar[idx];
              return (
                <div
                  key={day}
                  className="grid items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/30 p-3.5 sm:grid-cols-12"
                >
                  <span className="font-display text-sm font-extrabold text-slate-900 sm:col-span-2">
                    {day}
                  </span>

                  <select
                    value={row.channel}
                    onChange={(e) =>
                      setSocialCalendar((prev) => ({
                        ...prev,
                        [idx]: { ...prev[idx], channel: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold sm:col-span-3"
                  >
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>TikTok</option>
                    <option>YouTube Shorts</option>
                    <option>Community / Rest</option>
                  </select>

                  <select
                    value={row.format}
                    onChange={(e) =>
                      setSocialCalendar((prev) => ({
                        ...prev,
                        [idx]: { ...prev[idx], format: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold sm:col-span-4"
                  >
                    <option>Educational Carousel</option>
                    <option>Behind-the-scenes Reel</option>
                    <option>30s Quick Tip Video</option>
                    <option>Customer Testimonial</option>
                    <option>Mini Case Study</option>
                    <option>Interactive Story Poll</option>
                    <option>Comment Replies</option>
                  </select>

                  <select
                    value={row.goal}
                    onChange={(e) =>
                      setSocialCalendar((prev) => ({
                        ...prev,
                        [idx]: { ...prev[idx], goal: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold sm:col-span-3"
                  >
                    <option>Awareness</option>
                    <option>Authority</option>
                    <option>Reach</option>
                    <option>Engagement</option>
                    <option>Social Proof</option>
                    <option>Conversion</option>
                    <option>Retention</option>
                  </select>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setSocialEvaluated(true);
                onCompleteSimulator(
                  'sim-social',
                  lang === 'fr'
                    ? 'Simulateur : Calendrier Social Media'
                    : 'Simulator: Social Calendar'
                );
              }}
              className="rounded-2xl border-b-4 border-rose-800 bg-rose-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-rose-500"
            >
              {t.s4Evaluate}
            </button>

            {socialEvaluated && (
              <div className="text-right">
                <p className="text-xs text-slate-500">{t.s4ScoreLabel}</p>
                <p className="font-mono-num text-2xl font-extrabold text-rose-600">
                  {socialMixReport.score}/100
                </p>
              </div>
            )}
          </div>

          {socialEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood="celebrate"
                message={
                  lang === 'fr'
                    ? `Calendrier planifié sur ${socialMixReport.activeDays} jours actifs avec ${socialMixReport.uniqueFormats} formats variés et ${socialMixReport.uniqueGoals} objectifs distincts !`
                    : `Planned ${socialMixReport.activeDays} active days with ${socialMixReport.uniqueFormats} distinct formats and ${socialMixReport.uniqueGoals} goals!`
                }
              />
            </div>
          )}
        </section>
      )}

      {/* 5. KPI ANALYTICS */}
      {activeSim === 'sim-kpis' && (
        <section className="rounded-3xl border-2 border-amber-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-950">
                {t.s5Title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{t.s5Desc}</p>
            </div>
            <div className="flex gap-2">
              {KPI_SCENARIOS[lang].map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setKpiScenarioIdx(idx);
                    setKpiSelectedOption(null);
                    setKpiEvaluated(false);
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-extrabold ${
                    kpiScenarioIdx === idx
                      ? 'bg-amber-500 text-slate-950'
                      : 'border-2 border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {t.s5Scenario(idx + 1)}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm font-extrabold text-blue-700">
            {activeKpiScenario.title}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] text-slate-500">
                {lang === 'fr' ? 'Visiteurs' : 'Visitors'}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {activeKpiScenario.visitors.toLocaleString(localeStr)}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-3.5">
              <p className="text-[11px] text-blue-800">Conversion</p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-blue-700">
                {activeKpiScenario.conversionRate}%
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] text-slate-500">CPC</p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {activeKpiScenario.cpc} €
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] text-slate-500">ROI</p>
              <p
                className={`font-mono-num mt-1 text-lg font-extrabold ${
                  activeKpiScenario.roiPct >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-600'
                }`}
              >
                {activeKpiScenario.roiPct}%
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] text-slate-500">Engagement</p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {activeKpiScenario.engagementPct}%
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] text-slate-500">
                {lang === 'fr' ? 'Portée' : 'Reach'}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-slate-900">
                {activeKpiScenario.reach.toLocaleString(localeStr)}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-3.5">
              <p className="text-[11px] text-violet-800">
                {lang === 'fr' ? 'Ventes' : 'Sales'}
              </p>
              <p className="font-mono-num mt-1 text-lg font-extrabold text-violet-900">
                {activeKpiScenario.salesEur.toLocaleString(localeStr)} €
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <p className="text-sm font-bold text-slate-900">{t.s5Prompt}</p>
            {activeKpiScenario.options.map((opt, idx) => {
              const selected = kpiSelectedOption === idx;
              const isBest = idx === activeKpiScenario.bestDiagnosisIndex;
              let cls =
                'border-2 border-slate-200 bg-white hover:border-blue-400';
              if (kpiEvaluated) {
                if (isBest)
                  cls = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950';
                else if (selected)
                  cls = 'border-2 border-rose-400 bg-rose-50 text-rose-950';
              } else if (selected) {
                cls = 'border-2 border-violet-700 bg-violet-50 text-violet-950';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={kpiEvaluated}
                  onClick={() => setKpiSelectedOption(idx)}
                  className={`block w-full rounded-2xl p-4 text-left text-sm font-semibold transition-colors ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={kpiSelectedOption === null || kpiEvaluated}
              onClick={() => {
                setKpiEvaluated(true);
                onCompleteSimulator(
                  'sim-kpis',
                  lang === 'fr'
                    ? 'Simulateur : Analyse des KPI'
                    : 'Simulator: KPI Analytics'
                );
              }}
              className="rounded-2xl border-b-4 border-amber-700 bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300 disabled:border-slate-400 disabled:bg-slate-300"
            >
              {t.s5Validate}
            </button>
          </div>

          {kpiEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood={
                  kpiSelectedOption === activeKpiScenario.bestDiagnosisIndex
                    ? 'celebrate'
                    : 'encourage'
                }
                title={t.s5FeedbackTitle}
                message={activeKpiScenario.explanation}
              />
            </div>
          )}
        </section>
      )}

      {/* 6. BRAND MANAGEMENT */}
      {activeSim === 'sim-marque' && (
        <section className="rounded-3xl border-2 border-fuchsia-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            {t.s6Title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.s6Desc}</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Nom de marque' : 'Brand Name'}
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Cible principale' : 'Target Audience'}
              </label>
              <input
                type="text"
                value={brandTarget}
                onChange={(e) => setBrandTarget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Positionnement stratégique' : 'Strategic Positioning'}
              </label>
              <input
                type="text"
                value={brandPositioning}
                onChange={(e) => setBrandPositioning(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Ton & personnalité verbale' : 'Tone & Voice'}
              </label>
              <input
                type="text"
                value={brandTone}
                onChange={(e) => setBrandTone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr'
                  ? 'Identité visuelle (couleurs, codes)'
                  : 'Visual Identity (colors, codes)'}
              </label>
              <input
                type="text"
                value={brandVisual}
                onChange={(e) => setBrandVisual(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Proposition de valeur' : 'Value Proposition'}
              </label>
              <input
                type="text"
                value={brandPromise}
                onChange={(e) => setBrandPromise(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-fuchsia-300 bg-gradient-to-br from-fuchsia-700 via-violet-800 to-blue-800 p-6 text-white shadow-sm">
            <p className="text-xs font-bold text-amber-300">{t.s6PreviewTitle}</p>
            <h3 className="font-display mt-1 text-2xl font-extrabold">
              {brandName || 'Brand'}
            </h3>
            <p className="mt-2 text-sm text-violet-100">{brandPromise}</p>
            <div className="mt-4 grid gap-3 border-t border-white/15 pt-4 text-xs sm:grid-cols-3">
              <div>
                <p className="text-violet-200">
                  {lang === 'fr' ? 'Cible' : 'Target'}
                </p>
                <p className="mt-0.5 font-bold">{brandTarget}</p>
              </div>
              <div>
                <p className="text-violet-200">
                  {lang === 'fr' ? 'Ton' : 'Tone'}
                </p>
                <p className="mt-0.5 font-bold">{brandTone}</p>
              </div>
              <div>
                <p className="text-violet-200">
                  {lang === 'fr' ? 'Codes visuels' : 'Visuals'}
                </p>
                <p className="mt-0.5 font-bold">{brandVisual}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setBrandEvaluated(true);
                onCompleteSimulator(
                  'sim-marque',
                  lang === 'fr'
                    ? 'Simulateur : Gestion de marque'
                    : 'Simulator: Brand Studio'
                );
              }}
              className="rounded-2xl border-b-4 border-fuchsia-950 bg-fuchsia-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-fuchsia-600"
            >
              {t.s6Validate}
            </button>
            {brandEvaluated && (
              <p className="font-mono-num text-xl font-extrabold text-fuchsia-700">
                {t.s6Score(brandScore)}
              </p>
            )}
          </div>

          {brandEvaluated && (
            <div className="mt-5">
              <MarkyCoach
                lang={lang}
                mood="celebrate"
                message={
                  lang === 'fr'
                    ? `Plateforme solide pour ${brandName} ! En alignant promesse (« ${brandPromise} »), ton (« ${brandTone} ») et codes visuels, chaque prise de parole renforce la mémorisation.`
                    : `Strong brand platform for ${brandName}! Aligning promise (“${brandPromise}”), tone (“${brandTone}”), and visuals boosts recall.`
                }
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
};
