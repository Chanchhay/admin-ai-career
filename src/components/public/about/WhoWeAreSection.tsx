export default function WhoWeAreSection() {
    return (
        <section className="space-y-12 pt-6">
            {/* Header Row: Cloud Badge + Stats */}
            <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between px-4 sm:px-8">
                {/* Cloud Badge Title */}
                <div className="inline-flex items-center shrink-0 mt-4 xl:mt-0 relative h-32 w-80">
                    {/* Left Circle */}
                    <div className="absolute left-0 top-6 h-20 w-20 rounded-full bg-[#E8C222]" />

                    {/* Middle Large Circle */}
                    <div className="absolute left-10 top-0 h-32 w-56 rounded-full bg-[#E8C222]" />

                    {/* Right Circle */}
                    <div className="absolute right-0 top-8 h-16 w-20 rounded-full bg-[#E8C222]" />

                    {/* Text over the cloud */}
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white tracking-wide z-10 pl-2">
                        Who are we ?
                    </span>
                </div>

                {/* Stats Counter Bar */}
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 xl:justify-end">
                    <div className="text-center">
                        <p className="text-3xl font-black text-[#008A1E] sm:text-4xl">
                            120K+
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            Live Job
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-[#008A1E] sm:text-4xl">
                            850K+
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            Company+
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-[#008A1E] sm:text-4xl">
                            900k+
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            Candidates
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-[#008A1E] sm:text-4xl">
                            100%
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            Satisfaction
                        </p>
                    </div>
                </div>

                {/* Giant Gold Star below stats */}
                <div className="absolute right-12 top-40 hidden xl:block">
                    <span className="text-7xl text-[#F3BE00] drop-shadow-md">
                        &#9733;
                    </span>
                </div>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-2 mt-8">
                {/* Team Photo */}
                <div className="overflow-hidden rounded-[35px] border-4 border-slate-100 dark:border-slate-800 shadow-md">
                    <img
                        src="/images/avatar/team.jpg"
                        alt="ISTAD Students Team"
                        className="h-80 w-full object-cover sm:h-96"
                    />
                </div>

                {/* Description Text with Floating Gold Stars */}
                <div className="relative space-y-4 px-2">
                    {/* Scattered Decorative Stars */}
                    <span className="absolute -top-10 right-12 text-3xl text-[#F3BE00]">
                        &#9733;
                    </span>
                    <span className="absolute top-1/4 right-4 text-sm text-[#F3BE00]">
                        &#9733;
                    </span>
                    <span className="absolute top-8 left-2/3 text-xs text-[#F3BE00]">
                        &#9733;
                    </span>
                    <span className="absolute bottom-12 left-10 text-2xl text-[#F3BE00]">
                        &#9733;
                    </span>
                    <span className="absolute -bottom-6 right-20 text-lg text-[#F3BE00]">
                        &#9733;
                    </span>
                    <span className="absolute -bottom-10 right-40 text-sm text-[#F3BE00]">
                        &#9733;
                    </span>

                    <p className="text-lg font-extrabold leading-snug text-[#008A1E] sm:text-2xl">
                        We are Bachelor&apos;s degree, 2nd year students at
                        ISTAD, building
                    </p>
                    <p className="text-lg font-extrabold leading-snug text-[#008A1E] sm:text-2xl">
                        responsive and user-friendly web applications
                    </p>
                    <p className="text-lg font-extrabold leading-snug text-[#008A1E] sm:text-2xl">
                        using frontend and backend technologies.
                    </p>
                </div>
            </div>
        </section>
    );
}
