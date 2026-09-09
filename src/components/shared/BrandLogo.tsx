import Image from "next/image";
import { asset } from "@/lib/base-path";
import { cn } from "@/lib/utils";

/**
 * The Kagea brand assets, shared with the seeker/recruiter app.
 *
 * They ship as a light/dark pair rather than one recolourable mark: the
 * wordmark is green on light backgrounds and white on dark ones, while the
 * icon keeps its green/amber palette in both. The swap is CSS
 * (`dark:hidden` / `hidden dark:block`) rather than `useTheme()`, so the logo
 * is correct in the server-rendered HTML and never flashes the wrong variant
 * while hydrating.
 *
 * The paths are run through `asset()` because this console is served under a
 * base path and an `unoptimized` `next/image` does not add one: it emits the
 * `src` verbatim, the gateway hands `/images/**` to the seeker app, and the
 * mark renders as an empty box. Only the router and `next/link` prefix it for
 * you.
 */

const WORDMARK = {
  light: asset("/images/brand/logo-light.png"),
  dark: asset("/images/brand/logo-dark.png"),
  ratio: 1345 / 424,
} as const;

const MARK = {
  light: asset("/images/brand/icon-light.png"),
  dark: asset("/images/brand/icon-dark.png"),
  ratio: 612 / 657,
} as const;

type BrandImageProps = {
  /** Rendered height in pixels; width follows the asset's aspect ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
  /** Empty string marks the image decorative — a nearby label names it. */
  alt?: string;
};

function ThemedImage({
  asset,
  height,
  className,
  priority,
  alt = "Kagea",
}: Omit<BrandImageProps, "height"> & {
  asset: typeof WORDMARK | typeof MARK;
  height: number;
}) {
  const width = Math.round(height * asset.ratio);

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width, height }}
    >
      <Image
        src={asset.light}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="absolute inset-0 size-full object-contain object-left dark:hidden"
      />
      <Image
        src={asset.dark}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="absolute inset-0 hidden size-full object-contain object-left dark:block"
      />
    </span>
  );
}

/** Icon + wordmark lock-up. Use wherever there is horizontal room. */
export function BrandLogo({ height = 32, ...props }: BrandImageProps) {
  return <ThemedImage asset={WORDMARK} height={height} {...props} />;
}

/** Icon only. Use in rails, avatars, and other square slots. */
export function BrandMark({ height = 30, ...props }: BrandImageProps) {
  return <ThemedImage asset={MARK} height={height} {...props} />;
}
