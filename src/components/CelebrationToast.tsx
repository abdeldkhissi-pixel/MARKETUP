import React from 'react';
import { Award, CheckCircle2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CelebrationPayload {
  title: string;
  subtitle: string;
  xp?: number;
  kind: 'level' | 'chapter' | 'badge' | 'info';
}

interface CelebrationToastProps {
  payload: CelebrationPayload | null;
  onClose: () => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({
  payload,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {payload && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 left-3 right-3 z-50 rounded-2xl border border-violet-200 bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:w-full sm:max-w-sm md:bottom-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-900 text-amber-300">
              {payload.kind === 'level' ? (
                <Sparkles className="h-5 w-5" />
              ) : payload.kind === 'badge' ? (
                <Award className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-slate-900">
                {payload.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                {payload.subtitle}
              </p>
              {typeof payload.xp === 'number' && payload.xp > 0 && (
                <p className="font-mono-num mt-1.5 text-xs font-semibold text-blue-700">
                  +{payload.xp} XP ajoutés
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la notification"
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
