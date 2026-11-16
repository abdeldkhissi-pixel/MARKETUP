import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { getDomainLocalized } from '../i18n/domainTranslations';
import { UI_TEXT } from '../i18n/translations';
import { Domain, ExamResult, Language } from '../types/marketup';
import { MarketupLogo } from './MarketupLogo';

interface CertificateModalProps {
  domain: Domain;
  examResult: ExamResult;
  learnerName: string;
  lang: Language;
  onChangeLearnerName: (name: string) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  domain,
  examResult,
  learnerName,
  lang,
  onChangeLearnerName,
  onClose,
}) => {
  const t = UI_TEXT[lang].certificate;
  const loc = getDomainLocalized(domain, lang);

  const formattedDate = new Date(examResult.dateIso).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const handleDownloadSvg = () => {
    const safeName = (learnerName.trim() || 'MARKETUP Learner').replace(
      /[<>&"']/g,
      ''
    );
    const safeDomain = loc.title.replace(/[<>&"']/g, '');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840">
      <rect width="1200" height="840" fill="#f8fafc"/>
  <rect x="36" y="36" width="1128" height="768" rx="28" fill="#ffffff" stroke="#6d28d9" stroke-width="6"/>
  <rect x="56" y="56" width="1088" height="728" rx="20" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <g transform="translate(568, 74) scale(1)">
    <rect x="2" y="2" width="60" height="60" rx="16" fill="#5b21b6"/>
    <rect x="13" y="37" width="8" height="14" rx="3" fill="#38bdf8"/>
    <rect x="26" y="30" width="8" height="21" rx="3" fill="#34d399"/>
    <rect x="39" y="22" width="8" height="29" rx="3" fill="#fbbf24"/>
    <path d="M12 31L22 21L30 28L47 13" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M38.5 12.5H48.5V22.5" stroke="#fde047" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="600" y="166" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#2563eb" letter-spacing="4">${t.brandLine}</text>
  <text x="600" y="232" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#0f172a">${t.heading.toUpperCase()}</text>
  <text x="600" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#475569">${t.certifiesThat}</text>
  <text x="600" y="378" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#5b21b6">${safeName}</text>
  <line x1="300" y1="402" x2="900" y2="402" stroke="#cbd5e1" stroke-width="2"/>
  <text x="600" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#475569">${t.completedLine}</text>
  <text x="600" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#0f172a">${safeDomain}</text>
  <text x="600" y="605" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#2563eb">${t.finalScore(examResult.score)}</text>
  <text x="600" y="698" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#64748b">${t.issuedOn(formattedDate)}</text>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-marketup-${domain.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 sm:p-4 backdrop-blur-xs">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-violet-200 bg-white shadow-xl">
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-950">
            {t.modalTitle(loc.shortTitle)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <label
                htmlFor="certificate-learner-name"
                className="block text-xs font-bold text-slate-600"
              >
                {t.nameInputLabel}
              </label>
              <input
                id="certificate-learner-name"
                type="text"
                value={learnerName}
                onChange={(e) => onChangeLearnerName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-1.5 rounded-xl border-b-4 border-violet-950 bg-violet-700 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-violet-600 whitespace-nowrap shrink-0"
              >
                <Download className="h-4 w-4" />
                {t.downloadSvg}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <Printer className="h-4 w-4" />
                {t.printPdf}
              </button>
            </div>
          </div>

          <div className="print-only-certificate rounded-3xl border-4 border-violet-700 bg-white p-8 text-center">
            <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-violet-50/40 to-white p-6 sm:p-10">
              <div className="mx-auto flex justify-center">
                <MarketupLogo size="lg" className="shadow-sm" />
              </div>

              <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                {t.brandLine}
              </p>

              <h3 className="font-display mt-3 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {t.heading}
              </h3>

              <p className="mt-4 text-sm text-slate-600">{t.certifiesThat}</p>

              <p className="font-display mt-2 border-b border-slate-200 pb-3 text-2xl font-extrabold text-violet-800 sm:text-3xl">
                {learnerName.trim() || 'MARKETUP Learner'}
              </p>

              <p className="mt-4 text-sm text-slate-600">{t.completedLine}</p>

              <p className="font-display mt-2 text-xl font-bold text-slate-950">
                {loc.title}
              </p>

              <p className="font-mono-num mt-4 text-lg font-extrabold text-blue-700">
                {t.finalScore(examResult.score)}
              </p>

              <p className="mt-6 text-xs text-slate-500">
                {t.issuedOn(formattedDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
