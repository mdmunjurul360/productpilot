import React from 'react';
import { Award, ShieldCheck, Flame, Info } from 'lucide-react';

export interface ScoreItem {
  category: 'Design' | 'Performance' | 'Features' | 'Ease of Use' | 'Build Quality' | 'Value For Money' | string;
  score: number;
  description: string;
}

interface EditorialRatingSystemProps {
  overallScore: number;
  award?: string;
  testedHours?: string;
  breakdown: ScoreItem[];
}

export const EditorialRatingSystem: React.FC<EditorialRatingSystemProps> = ({
  overallScore,
  award = "Editor's Choice",
  testedHours = '48+ Hours',
  breakdown,
}) => {
  // Score label badge generator
  const getScoreVerdict = (score: number) => {
    if (score >= 9.5) return { label: 'Exceptional (Lab Reference)', color: 'text-emerald-500 bg-emerald-500/10' };
    if (score >= 9.0) return { label: 'Outstanding Class Leader', color: 'text-emerald-500 bg-emerald-500/10' };
    if (score >= 8.0) return { label: 'Great Recommended Buy', color: 'text-blue-500 bg-blue-500/10' };
    return { label: 'Good Value Option', color: 'text-amber-500 bg-amber-500/10' };
  };

  const verdict = getScoreVerdict(overallScore);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
      {/* Header with Lab Score Ring */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
              ProductPilot Editorial Scorecard
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Independent benchmark results based on {testedHours} of objective laboratory testing.
          </p>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl bg-slate-900 text-white dark:bg-slate-800 px-4 py-2.5 shadow-lg border border-slate-800">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Overall Score
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${verdict.color}`}>
              {award}
            </span>
          </div>
          <div className="flex items-baseline gap-0.5 border-l border-slate-700 pl-3">
            <span className="text-3xl font-black tracking-tight text-white">
              {overallScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-bold">/10</span>
          </div>
        </div>
      </div>

      {/* Breakdown Grid with Progress Bars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Standardized Evaluation Metrics</span>
          <span>Score (0–10)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdown.map((item, idx) => {
            const percentage = (item.score / 10) * 100;
            const isTopScore = item.score >= 9.5;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isTopScore && (
                      <span className="rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.2">
                        Class Best
                      </span>
                    )}
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {item.score.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ 10</span>
                  </div>
                </div>

                {/* Animated Progress Track */}
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      item.score >= 9.0
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : item.score >= 8.0
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lab Verification Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="h-4 w-4" /> Lab Measurement Standard ISO/IEC 17025 Compliant
        </span>
        <span className="hidden sm:inline">Calibrated Instruments Only</span>
      </div>
    </section>
  );
};
