/**
 * A minimal vertical bar chart for one series of labelled points (signups per
 * day, revenue per period, and so on). One shape, plain SVG/CSS, themed off
 * `--primary` like everything else — a charting library would be overkill
 * for a console with exactly this one kind of series to plot.
 */
export function TrendBars({
  points,
  height = 120,
  formatValue,
}: {
  points: { label: string; value: number }[];
  height?: number;
  formatValue?: (value: number) => string;
}) {
  if (points.length === 0) {
    return (
      <p className="rounded-[18px] bg-ws-card-hover px-4 py-8 text-center text-xs text-ws-faint">
        No data yet.
      </p>
    );
  }

  const max = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {points.map((point, index) => {
        const pct = Math.max((point.value / max) * 100, point.value > 0 ? 4 : 0);
        return (
          <div
            key={`${point.label}-${index}`}
            className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded-md bg-ws-fg px-2 py-1 text-[10px] font-semibold text-ws-panel group-hover:block">
              {formatValue ? formatValue(point.value) : point.value.toLocaleString()}
            </span>
            <div
              className="w-full rounded-t-md bg-primary/80 transition-colors group-hover:bg-primary"
              style={{ height: `${pct}%` }}
            />
            <span className="w-full truncate text-center text-[10px] text-ws-faint">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** A horizontal breakdown bar for a small set of categories (roles, etc). */
export function BreakdownBars({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ws-fg">{item.label}</span>
              <span className="text-ws-faint">
                {item.value.toLocaleString()} · {pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ws-line">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
