"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, Bot, Users, CheckCircle2 } from "lucide-react";

export default function AboutHeroSection() {
  // Stagger variants for content reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Background Soft Glow Accents */}
      <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#F3BE00]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-80 w-80 rounded-full bg-[#008A1E]/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-12"
        >
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#008A1E]/20 bg-[#008A1E]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#008A1E] backdrop-blur-sm dark:bg-[#008A1E]/20">
                <Sparkles className="h-3.5 w-3.5 text-[#F3BE00]" />
                Get Best Employee
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-black leading-[1.15] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              We find the{" "}
              <span className="relative inline-block text-[#008A1E]">
                best
                {/* Yellow Highlight Bar behind "best" */}
                <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-[#F3BE00] opacity-80 sm:h-4" />
              </span>{" "}
              asset for your team
            </motion.h1>

            {/* Subheading / Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-relaxed"
            >
              <span className="font-bold text-[#008A1E]">ការងារ</span> is an
              innovative recruitment platform that connects technology
              enthusiasts with quality opportunities using AI-driven mock interviews
              and real-time skill matching.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm"
            >
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <CheckCircle2 className="h-4 w-4 text-[#008A1E]" />
                Top Tech Talent
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <Bot className="h-4 w-4 text-[#F3BE00]" />
                AI Mock Interviewer
              </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button className="group flex items-center gap-2 rounded-xl bg-[#008A1E] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#008A1E]/25 transition-all hover:bg-[#007018] hover:shadow-xl hover:shadow-[#008A1E]/30 active:scale-[0.98]">
                Explore Talent
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Right Visual Graphic Container */}
          <div className="relative flex justify-center lg:col-span-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative h-72 w-72 sm:h-96 sm:w-96"
            >
              {/* Outer Pulsing Ring */}
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#F3BE00]/30 duration-3000" />
              <div className="absolute -inset-4 rounded-full border border-[#008A1E]/20" />

              {/* Main Globe Image with Floating Effect */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative h-full w-full"
              >
                <img
                  src="/images/avatar/globe.png"
                  alt="Global Connection Network"
                  className="h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(0,138,30,0.2)]"
                />
              </motion.div>

              {/* Floating Stat Card 1: Matches */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -left-6 top-1/4 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:-left-10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008A1E]/10 text-[#008A1E]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active Seekers
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    10,000+
                  </p>
                </div>
              </motion.div>

              {/* Floating Stat Card 2: AI Tech */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-6 bottom-10 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:-right-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3BE00]/20 text-[#008A1E]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI Interview Practice
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Instant Feedback
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}