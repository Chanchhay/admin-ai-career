export default function AboutHeroSection() {
    return (
        <>
            <section className="grid items-center gap-8 lg:grid-cols-2">
                {/* Left Hero Text Container */}
                <div className="relative pt-6">
                    {/* Yellow Accent Circle behind top subtext */}
                    <div className="absolute -left-4 -top-2 h-24 w-24 rounded-full bg-[#F3BE00] opacity-90 -z-0" />

                    <div className="relative z-10 space-y-4">
                        <span className="text-xs font-bold text-[#008A1E] tracking-wider">
                            ____Get Best Employee
                        </span>

                        <h1 className="text-4xl font-black leading-tight text-[#008A1E] sm:text-5xl lg:text-6xl">
                            We find the{" "}
                            <span className="text-[#F3BE00]">best</span>
                            <br />
                            asset for you
                        </h1>

                        <p className="max-w-md text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed sm:text-sm">
                            <span className="font-bold text-[#008A1E]">
                                ការងារ
                            </span>{" "}
                            is an innovative online job search platform that
                            connects technology enthusiasts through quality job
                            searches and has AI for Interviewing skills.
                        </p>
                    </div>
                </div>

                {/* Right Hero Graphic: Globe */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative h-64 w-64 sm:h-80 sm:w-80">
                        <img
                            src="/images/avatar/globe.png"
                            alt="Global Connection Globe"
                            className="h-full w-full object-contain drop-shadow-2xl rounded-full"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
