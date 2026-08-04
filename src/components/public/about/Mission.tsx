import Image from "next/image";

const missionFeatures = [
    {
        title: "Flexible job search",
        description: "Learn anytime, anywhere\nAt your own pace.",
        icon: "🌍",
        background: "bg-[#FFB800]",
        position: "lg:self-start",
    },
    {
        title: "24/7 Support",
        description: "AI tutors and mentors,\nalways available.",
        icon: "🤖",
        background: "bg-[#A3470D]",
        position: "lg:self-center",
    },
    {
        title: "Progress Guarantee",
        description: "Analytics and structured\npaths for real results.",
        icon: "🎯",
        background: "bg-[#18AD28]",
        position: "lg:self-end",
    },
];

export default function MissionSection() {
    return (
        <section className="w-full bg-white py-12 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Left side */}
                    <div className="w-full">
                        <h2 className="mb-8 text-3xl font-black sm:text-4xl lg:text-5xl">
                            <span className="text-[#E33434]">Our</span>{" "}
                            <span className="text-black dark:text-white">
                                Mission
                            </span>
                        </h2>

                        {/* Mission image */}
                        <div className="relative mx-auto aspect-[1.15/1] w-full max-w-[520px] lg:mx-0">
                            <div
                                className="relative h-full w-full overflow-hidden bg-[#171E40]"
                                style={{
                                    borderRadius:
                                        "42% 58% 55% 45% / 46% 39% 61% 54%",
                                }}
                            >
                                <Image
                                    src="/images/about-us/mission.png"
                                    alt="Online internship mission"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 520px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right cards */}
                    <div className="flex w-full flex-col gap-6">
                        {missionFeatures.map((feature) => (
                            <article
                                key={feature.title}
                                className={[
                                    "flex min-h-[110px] w-full max-w-[380px] items-start gap-4",
                                    "rounded-2xl px-6 py-4 text-white",
                                    "shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                                    "transition-transform duration-300 hover:-translate-y-1",
                                    feature.background,
                                    feature.position,
                                ].join(" ")}
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-1 shrink-0 text-2xl leading-none"
                                >
                                    {feature.icon}
                                </span>

                                <div>
                                    <h3 className="mb-1 text-base font-medium">
                                        {feature.title}
                                    </h3>

                                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/95">
                                        {feature.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
