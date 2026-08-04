import React from "react";
import AboutHeroSection from "./AboutHero";
import WhoWeAreSection from "./WhoWeAreSection";
import MissionSection from "./Mission";
import TeamSection from "./TeamSection";

export default function AboutUsPage() {
    return (
        <>
            <div className="w-full bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="mx-auto max-w-7xl space-y-20">
                    {/* SECTION 1: Hero Header with Globe + Stats */}
                    <AboutHeroSection />

                    {/* SECTION 2: Who Are We? */}
                    <WhoWeAreSection />

                    {/* SECTION 3: Our Mission */}
                    <MissionSection />

                    {/* SECTION 4: Meet Our Mentors + Our Members */}
                    <TeamSection />
                </div>
            </div>
        </>
    );
}
