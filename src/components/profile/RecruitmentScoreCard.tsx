import type { RecruitmentScore } from "@/types/profile";

export function RecruitmentScoreCard({ score }: { score: RecruitmentScore }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-linear-to-br from-green-500 to-green-700 p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          Recruitment Score
        </p>

        <p className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{score.score}</span>
          <span className="text-base text-white/70">/{score.outOf}</span>
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-white/80">Monthly Target</span>
          <span className="text-xs font-bold text-white">
            {score.monthlyTargetPct}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Monthly target progress"
          aria-valuenow={score.monthlyTargetPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25"
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${score.monthlyTargetPct}%` }}
          />
        </div>
      </div>
    </section>
  );
}