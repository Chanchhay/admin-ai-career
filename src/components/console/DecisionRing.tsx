/**
 * A ring chart for exactly one shape of data: two outcomes out of a decided
 * total. No charting library for one shape — plain SVG, themed off the same
 * tokens as the chips (`--primary` for approved, `--error` for rejected), so
 * it reads as part of the console rather than a bolted-on widget.
 */
export function DecisionRing({
  approved,
  rejected,
  size = 132,
  strokeWidth = 14,
}: {
  approved: number;
  rejected: number;
  size?: number;
  strokeWidth?: number;
}) {
  const decided = approved + rejected;
  const rate = decided === 0 ? null : Math.round((approved / decided) * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const approvedLength = decided === 0 ? 0 : (approved / decided) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={
          rate === null
            ? "No decisions recorded yet"
            : `${rate}% approved, ${100 - rate}% rejected`
        }
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ws-line)"
          strokeWidth={strokeWidth}
        />
        {decided > 0 ? (
          <>
            {/* Full ring in the "rejected" colour; the approved arc drawn on
                top leaves exactly the rejected share showing underneath. */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--error)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={strokeWidth}
              strokeLinecap={approved > 0 && rejected > 0 ? "butt" : "round"}
              strokeDasharray={`${approvedLength} ${circumference - approvedLength}`}
            />
          </>
        ) : null}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-ws-fg">
          {rate === null ? "—" : `${rate}%`}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ws-faint">
          approved
        </span>
      </div>
    </div>
  );
}
