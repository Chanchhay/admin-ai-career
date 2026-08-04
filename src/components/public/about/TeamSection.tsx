import { bottomMembers, mentors, topMembers } from "./data";
import { SocialButtons } from "./icons";

export default function TeamSection() {
    return (
        <>
            <section className="space-y-12">
                <h2 className="text-center text-3xl font-extrabold text-[#F3BE00] sm:text-4xl">
                    Meet Our Mentors
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                    {mentors.map((mentor, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center space-y-3"
                        >
                            {/* Avatar with floating stars */}
                            <div className="relative">
                                <div className="h-36 w-36 overflow-hidden rounded-full">
                                    <img
                                        src={mentor.avatar}
                                        alt={mentor.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                                {/* Yellow Decorative Stars */}
                                <span className="absolute -top-1 -right-1 text-xl text-[#F3BE00]">
                                    &#9733;
                                </span>
                                <span className="absolute top-3 -right-3 text-xs text-[#F3BE00]">
                                    &#9733;
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                {mentor.name}
                            </h3>

                            <span className="rounded-full bg-[#FFFBEA] px-4 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-amber-300">
                                {mentor.role}
                            </span>

                            <SocialButtons />
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 2: OUR MEMBERS                                    */}
            {/* ========================================================= */}
            <section className="space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black sm:text-4xl">
                        <span className="text-[#008A1E]">Our</span>{" "}
                        <span className="text-[#F3BE00]">Members</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        The passionate people driving{" "}
                        <span className="font-bold text-[#F3BE00]">ការងារ</span>{" "}
                        forward.
                    </p>
                </div>

                {/* Members Grid Container */}
                <div className="space-y-12">
                    {/* Top Row: 3 Members (Leaders) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center max-w-4xl mx-auto">
                        {topMembers.map((member, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-3"
                            >
                                <div className="relative">
                                    <div className="h-36 w-36 overflow-hidden rounded-full">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    {/* Yellow Stars */}
                                    <span className="absolute -top-1 -right-1 text-xl text-[#F3BE00]">
                                        &#9733;
                                    </span>
                                    <span className="absolute top-3 -right-3 text-xs text-[#F3BE00]">
                                        &#9733;
                                    </span>
                                </div>

                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {member.name}
                                </h3>

                                <span className="rounded-full bg-[#FFFBEA] px-4 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-amber-300">
                                    {member.role}
                                </span>

                                <SocialButtons />
                            </div>
                        ))}
                    </div>

                    {/* Bottom Row: 4 Members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {bottomMembers.map((member, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-3"
                            >
                                <div className="relative">
                                    <div className="h-36 w-36 overflow-hidden rounded-full">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    {/* Yellow Stars */}
                                    <span className="absolute -top-1 -right-1 text-xl text-[#F3BE00]">
                                        &#9733;
                                    </span>
                                    <span className="absolute top-3 -right-3 text-xs text-[#F3BE00]">
                                        &#9733;
                                    </span>
                                </div>

                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {member.name}
                                </h3>

                                <span className="rounded-full bg-[#FFFBEA] px-4 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-amber-300">
                                    {member.role}
                                </span>

                                <SocialButtons />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
