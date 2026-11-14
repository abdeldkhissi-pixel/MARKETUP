import { Language } from '../types/marketup';

export const DOMAIN_EN_MAP: Record<
  string,
  {
    title: string;
    shortTitle: string;
    description: string;
    objectives: [string, string, string, string];
  }
> = {
  'marketing-fondamental': {
    title: 'Foundational Marketing',
    shortTitle: 'Fundamentals',
    description:
      'Understand customer needs, perceived value, market mechanics, and the 4Ps marketing mix from scratch.',
    objectives: [
      'Identify the true needs and motivations of a target customer',
      'Formulate a clear, differentiated value proposition',
      'Master the 4Ps (Product, Price, Place, Promotion)',
      'Build a coherent customer journey from discovery to purchase',
    ],
  },
  'marketing-strategique': {
    title: 'Strategic Marketing',
    shortTitle: 'Strategy',
    description:
      'Analyze your environment, segment markets, choose winning targets, and build a durable competitive advantage.',
    objectives: [
      'Run a complete SWOT and PESTEL strategic diagnosis',
      'Apply the STP methodology (Segmentation, Targeting, Positioning)',
      'Define sustainable competitive advantages',
      'Plan strategic resource allocation over time',
    ],
  },
  'marketing-operationnel': {
    title: 'Operational Marketing',
    shortTitle: 'Operational',
    description:
      'Turn strategic plans into concrete campaigns, pricing actions, distribution choices, and commercial execution.',
    objectives: [
      'Design an actionable annual marketing calendar',
      'Align pricing, promotions, and product launches',
      'Coordinate distribution channels seamlessly',
      'Measure short-term campaign impact and adjust execution',
    ],
  },
  'marketing-digital': {
    title: 'Digital Marketing',
    shortTitle: 'Digital',
    description:
      'Master online acquisition ecosystems, websites, landing pages, paid media, and omnichannel digital journeys.',
    objectives: [
      'Structure a high-converting digital acquisition funnel',
      'Optimize landing pages for clarity and user trust',
      'Combine owned, earned, and paid media effectively',
      'Track digital user behavior responsibly and accurately',
    ],
  },
  'social-media-marketing': {
    title: 'Social Media Marketing',
    shortTitle: 'Social Media',
    description:
      'Build engaged communities, craft platform-native formats, plan editorial calendars, and grow organic reach.',
    objectives: [
      'Adapt content formats to Instagram, LinkedIn, TikTok, and YouTube',
      'Design balanced weekly editorial calendars',
      'Foster authentic community interaction and loyalty',
      'Measure meaningful engagement beyond vanity likes',
    ],
  },
  'content-marketing': {
    title: 'Content Marketing',
    shortTitle: 'Content',
    description:
      'Attract and educate prospects through storytelling, editorial pillars, lead magnets, and value-driven media.',
    objectives: [
      'Define editorial pillars aligned with buyer questions',
      'Write compelling stories and educational formats',
      'Map content to awareness, consideration, and decision stages',
      'Repurpose cornerstone content across multiple channels',
    ],
  },
  'seo-et-sea': {
    title: 'SEO & Search Advertising (SEA)',
    shortTitle: 'SEO & SEA',
    description:
      'Capture active search intent organically with SEO and accelerate qualified traffic through paid search campaigns.',
    objectives: [
      'Conduct keyword research focused on search intent',
      'Optimize page structure, metadata, and internal linking',
      'Structure profitable Google Ads / SEA campaigns and ad groups',
      'Combine SEO durability with SEA speed',
    ],
  },
  'branding-et-identite': {
    title: 'Branding & Brand Identity',
    shortTitle: 'Branding',
    description:
      'Shape memorable visual and verbal brand platforms that inspire trust, preference, and emotional connection.',
    objectives: [
      'Craft a coherent brand platform (mission, vision, values)',
      'Establish a recognizable visual identity and tone of voice',
      'Differentiate your brand in crowded markets',
      'Maintain brand consistency across every customer touchpoint',
    ],
  },
  'publicite-et-communication': {
    title: 'Advertising & Communication',
    shortTitle: 'Advertising',
    description:
      'Design persuasive ad creatives, media plans, clear calls to action, and memorable multi-channel campaigns.',
    objectives: [
      'Structure a persuasive creative brief and key message',
      'Apply copywriting frameworks like AIDA and PAS',
      'Select advertising channels matching budget and audience',
      'Diagnose ad fatigue and creative performance',
    ],
  },
  'email-marketing': {
    title: 'Email Marketing',
    shortTitle: 'Emailing',
    description:
      'Grow permission-based subscriber lists, craft high-open-rate newsletters, and automate lifecycle email sequences.',
    objectives: [
      'Build a healthy, compliant email subscriber base',
      'Write irresistible subject lines and clear email copy',
      'Set up automated welcome, nurture, and cart-recovery flows',
      'Improve deliverability, open rates, and click-through rates',
    ],
  },
  'crm-et-fidelisation': {
    title: 'CRM & Customer Retention',
    shortTitle: 'CRM & Loyalty',
    description:
      'Maximize customer lifetime value through segmentation, onboarding, loyalty programs, and churn prevention.',
    objectives: [
      'Organize customer data cleanly inside a CRM',
      'Segment customers by behavior and lifecycle stage (RFM)',
      'Design rewarding loyalty and referral programs',
      'Reduce churn through proactive onboarding and support',
    ],
  },
  'marketing-analytique-kpi': {
    title: 'Marketing Analytics & KPIs',
    shortTitle: 'Analytics & KPI',
    description:
      'Turn numbers into smart decisions using CAC, LTV, ROI, ROAS, conversion rates, and A/B testing.',
    objectives: [
      'Select actionable KPIs aligned with business objectives',
      'Calculate and balance CAC, LTV, ROI, and ROAS',
      'Identify funnel bottlenecks from conversion data',
      'Run reliable A/B tests to improve performance continuously',
    ],
  },
  'e-commerce': {
    title: 'E-Commerce Marketing',
    shortTitle: 'E-Commerce',
    description:
      'Optimize online store merchandising, product pages, checkout flows, average order value, and repeat purchases.',
    objectives: [
      'Design high-converting product pages with strong social proof',
      'Reduce cart abandonment and checkout friction',
      'Increase average order value via bundles and upsells',
      'Coordinate acquisition and retention for online retail',
    ],
  },
  'marketing-influence': {
    title: 'Influencer Marketing',
    shortTitle: 'Influencer',
    description:
      'Partner authentically with creators, structure transparent briefs, evaluate audience quality, and measure ROI.',
    objectives: [
      'Select creators based on engagement quality and brand fit',
      'Distinguish nano, micro, and macro influencer strategies',
      'Write clear creative briefs while preserving creator authenticity',
      'Track campaign impact with promo codes and UTM links',
    ],
  },
  'etudes-de-marche': {
    title: 'Market Research',
    shortTitle: 'Market Research',
    description:
      'Collect qualitative and quantitative insights, interview customers, benchmark competitors, and validate demand.',
    objectives: [
      'Design unbiased customer surveys and interview guides',
      'Combine qualitative insights with quantitative market sizing',
      'Map competitors objectively to spot market gaps',
      'Validate product-market fit before scaling spend',
    ],
  },
  'marketing-b2b-b2c': {
    title: 'B2B & B2C Marketing',
    shortTitle: 'B2B & B2C',
    description:
      'Adapt messaging, buying cycles, lead generation, and sales alignment between consumer and business markets.',
    objectives: [
      'Contrast emotional B2C impulses with multi-stakeholder B2B cycles',
      'Build B2B lead generation and lead scoring systems',
      'Align marketing and sales teams around qualified pipeline',
      'Craft B2B account-based and B2C mass-personalization plays',
    ],
  },
  'marketing-traditionnel': {
    title: 'Traditional & Field Marketing',
    shortTitle: 'Traditional',
    description:
      'Leverage outdoor billboards, print, events, point-of-sale activation, and local PR alongside digital channels.',
    objectives: [
      'Understand when offline media outperforms digital ads',
      'Design impactful out-of-home, print, and retail displays',
      'Activate trade shows, pop-up shops, and local sponsorships',
      'Connect offline touchpoints to digital tracking (QR, promo codes)',
    ],
  },
  'growth-marketing': {
    title: 'Growth Marketing',
    shortTitle: 'Growth',
    description:
      'Apply rapid experimentation across the AARRR pirate funnel to unlock scalable, sustainable growth loops.',
    objectives: [
      'Master the AARRR framework (Acquisition, Activation, Retention, Referral, Revenue)',
      'Prioritize growth experiments using ICE scoring',
      'Build viral and product-led growth loops',
      'Focus on activation speed and retention before scaling acquisition',
    ],
  },
};

export function getDomainLocalized(
  domain: {
    id: string;
    title: string;
    shortTitle: string;
    description: string;
    objectives: string[];
  },
  lang: Language
) {
  if (lang === 'fr') return domain;
  const en = DOMAIN_EN_MAP[domain.id];
  if (!en) return domain;
  return {
    ...domain,
    title: en.title,
    shortTitle: en.shortTitle,
    description: en.description,
    objectives: en.objectives,
  };
}
