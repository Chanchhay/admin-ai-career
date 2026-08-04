import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { HeroSection } from "@/components/public/HeroSection";
import { LandingSections } from "@/components/public/LandingSections";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <HeroSection />
        <LandingSections />
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
