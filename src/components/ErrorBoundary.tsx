import React from 'react';
import { RotateCcw } from 'lucide-react';
import { MarketupLogo } from './MarketupLogo';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unknown rendering error',
    };
  }

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('marketup_progress_v1');
    } catch {
      // ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-slate-50 to-sky-50 p-6 text-slate-900">
          <div className="w-full max-w-md rounded-3xl border-2 border-violet-200 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex justify-center">
              <MarketupLogo size="lg" className="shadow-sm" />
            </div>
            <h1 className="font-display mt-4 text-xl font-extrabold text-slate-950">
              MARKETUP · Récupération d&apos;affichage
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Une erreur locale temporaire a bloqué l&apos;affichage. Cliquez
              ci-dessous pour réinitialiser la session locale et relancer
              l&apos;application.
            </p>
            <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-mono text-slate-600 break-words">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border-b-4 border-violet-950 bg-violet-700 px-5 py-3 text-sm font-extrabold text-white transition-all hover:bg-violet-600 active:translate-y-0.5 active:border-b-0"
            >
              <RotateCcw className="h-4 w-4" />
              Relancer MARKETUP
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
