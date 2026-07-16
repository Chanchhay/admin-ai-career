import { Lightbulb } from "lucide-react";

export function SmartTipCard() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-white/20">
            <Lightbulb aria-hidden="true" className="size-3.5 text-amber-300" />
          </span>
          <h2 className="text-sm font-semibold text-white">Smart Tip</h2>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-green-50/90">
          Including a <span className="font-semibold text-white">Salary Range</span>{" "}
          and <span className="font-semibold text-white">Remote</span> options can
          increase candidate application rates by up to{" "}
          <span className="font-bold text-lime-300">34%</span> in your current
          industry sector.
        </p>
      </div>
    </section>
  );
}