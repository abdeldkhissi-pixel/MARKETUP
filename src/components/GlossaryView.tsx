import React, { useMemo, useState } from 'react';
import { BookMarked, Search, Star } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryAndGamification';
import { GLOSSARY_EN_MAP, UI_TEXT } from '../i18n/translations';
import { UserProgress } from '../types/marketup';

interface GlossaryViewProps {
  progress: UserProgress;
  onToggleFavorite: (termId: string) => void;
}

const CARD_COLORS = [
  'border-violet-200 bg-violet-50/30',
  'border-sky-200 bg-sky-50/30',
  'border-emerald-200 bg-emerald-50/30',
  'border-amber-200 bg-amber-50/30',
];

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  progress,
  onToggleFavorite,
}) => {
  const lang = progress.language;
  const t = UI_TEXT[lang].glossary;

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t.allCat);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const localizedTerms = useMemo(() => {
    return GLOSSARY_TERMS.map((item) => {
      if (lang === 'fr') return item;
      const en = GLOSSARY_EN_MAP[item.id];
      return en ? { ...item, ...en } : item;
    });
  }, [lang]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(localizedTerms.map((term) => term.category)));
    return [t.allCat, ...cats];
  }, [localizedTerms, t.allCat]);

  const favSet = useMemo(
    () => new Set(progress.favoriteGlossaryIds),
    [progress.favoriteGlossaryIds]
  );

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localizedTerms.filter((term) => {
      if (onlyFavorites && !favSet.has(term.id)) return false;
      if (
        selectedCategory !== t.allCat &&
        selectedCategory !== 'Tous' &&
        selectedCategory !== 'All' &&
        term.category !== selectedCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        term.term.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q) ||
        term.simplified.toLowerCase().includes(q) ||
        term.example.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory, onlyFavorites, favSet, localizedTerms, t.allCat]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-white via-sky-50/40 to-violet-50/40 p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              {t.tag(GLOSSARY_TERMS.length)}
            </p>
            <h1 className="font-display mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              onlyFavorites
                ? 'border-amber-400 bg-amber-100 text-amber-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                onlyFavorites ? 'fill-amber-500 text-amber-500' : ''
              }`}
            />
            {t.favoritesBtn(progress.favoriteGlossaryIds.length)}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border-2 border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-violet-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-violet-700 text-white'
                    : 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredTerms.length === 0 ? (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-10 text-center">
          <BookMarked className="mx-auto h-8 w-8 text-slate-400" />
          <p className="font-display mt-3 text-lg font-bold text-slate-900">
            {t.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500">{t.emptyHint}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTerms.map((item, idx) => {
            const isFav = favSet.has(item.id);
            const cardTint = CARD_COLORS[idx % CARD_COLORS.length];
            return (
              <article
                key={item.id}
                className={`flex flex-col justify-between rounded-3xl border-2 p-6 ${cardTint} bg-white shadow-xs`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold text-blue-700">
                        {item.category}
                      </p>
                      <h2 className="font-display mt-1 text-lg font-extrabold text-slate-950">
                        {item.term}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      aria-label="Toggle favorite"
                      className={`rounded-xl border-2 p-2 transition-colors ${
                        isFav
                          ? 'border-amber-300 bg-amber-100 text-amber-600'
                          : 'border-slate-200 bg-white text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {item.definition}
                  </p>

                  <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-white p-4 text-xs leading-relaxed">
                    <p className="text-slate-800">
                      <span className="font-extrabold text-violet-800">
                        {t.simpleLabel}
                      </span>
                      {item.simplified}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-extrabold text-blue-700">
                        {t.exampleLabel}
                      </span>
                      {item.example}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
