import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Watchlist — TalentPulse",
};

export default function WatchlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Watchlist"
        subtitle="Keep an eye on the companies and candidates that matter most."
      />
      <ComingSoon
        icon={Star}
        title="Nothing on your watchlist yet"
        description="Star companies and candidates as you work and they'll gather here for quick access and monitoring."
        actionLabel="Browse companies"
        actionHref="/discovery/new"
      />
    </>
  );
}