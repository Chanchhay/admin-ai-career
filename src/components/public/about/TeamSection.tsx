"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { bottomMembers, mentors, topMembers } from "./data";

interface Member {
  name: string;
  role: string;
  avatar: string;
  badge?: string;
}

// Custom GitHub Icon Component
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Custom LinkedIn Icon Component
function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" />
    </svg>
  );
}

// Animation Variants with Explicit Type Annotations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function TeamSection() {
  const mentorsRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  const isMentorsInView = useInView(mentorsRef, { once: true, margin: "-60px" });
  const isMembersInView = useInView(membersRef, { once: true, margin: "-60px" });

  return (
    <div className="space-y-20 py-12">
      {/* SECTION 1: MENTORS */}
      <section ref={mentorsRef} className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={isMentorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F3BE00]/40 bg-[#F3BE00]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D9A700] dark:text-[#F3BE00]">
            <Sparkles className="h-3.5 w-3.5" />
            Leadership & Expertise
          </div>
          <h2 className="text-3xl font-black text-[#F3BE00] sm:text-4xl lg:text-5xl">
            Meet Our Mentors
          </h2>
          <p className="max-w-md mx-auto text-sm font-medium text-slate-500 dark:text-slate-400">
            Guiding and shaping the future of next-generation tech talent.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isMentorsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
        >
          {mentors.map((mentor, index) => (
            <MemberCard
              key={mentor.name}
              member={mentor}
              index={index + 1}
              badge="MENTOR"
              accentColor="gold"
            />
          ))}
        </motion.div>
      </section>

      {/* SECTION 2: MEMBERS */}
      <section ref={membersRef} className="space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={isMembersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1fa628]/40 bg-[#1fa628]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1fa628]">
            <Sparkles className="h-3.5 w-3.5" />
            Development Team
          </div>
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
            <span className="text-[#1fa628]">Our</span>{" "}
            <span className="text-[#F3BE00]">Members</span>
          </h2>
          <p className="max-w-md mx-auto text-sm font-medium text-slate-500 dark:text-slate-400">
            The passionate engineers and designers driving{" "}
            <span className="font-bold text-[#1fa628]">Find Job </span> forward.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Top Members Row (3 Leaders) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isMembersInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto items-start"
          >
            {topMembers.map((member, index) => (
              <MemberCard
                key={member.name}
                member={member}
                index={index + 1}
                badge="LEAD"
                accentColor="green"
              />
            ))}
          </motion.div>

          {/* Bottom Members Row (4 Developers) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isMembersInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
          >
            {bottomMembers.map((member, index) => (
              <MemberCard
                key={member.name}
                member={member}
                index={topMembers.length + index + 1}
                badge="MEMBER"
                accentColor="green"
              />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

{/* Member Card Component */}
function MemberCard({
  member,
  index,
  badge = "MEMBER",
  accentColor = "green",
}: {
  member: Member;
  index: number;
  badge?: string;
  accentColor?: "green" | "gold";
}) {
  const formattedIndex = index < 10 ? `0${index}` : `${index}`;
  const isGold = accentColor === "gold";

  const pillBg = isGold
    ? "bg-[#FFFBEA] text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300"
    : "bg-[#1fa628]/10 text-[#1fa628] border border-[#1fa628]/20 dark:bg-[#1fa628]/20 dark:text-[#1fa628]";

  const roleColor = isGold
    ? "text-amber-600 dark:text-amber-400"
    : "text-[#1fa628]";

  const hoverIconColor = isGold
    ? "hover:text-[#1fa628]"
    : "hover:text-[#F3BE00]";

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-[350px] w-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Top Index Badge */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 3 }}
        className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-[11px] font-bold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
      >
        {formattedIndex}
      </motion.div>

      {/* Orbit Avatar Container */}
      <div className="relative mx-auto mt-2 flex h-32 w-32 items-center justify-center">
        {/* Animated Dashed Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-slate-300/80 dark:border-slate-700/80"
        />

        {/* Avatar Frame */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:bg-slate-800">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Middle Text Info */}
      <div className="flex flex-col items-center">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
          {member.name}
        </h3>

        <p className={`mt-1 text-[11px] font-extrabold uppercase tracking-wider ${roleColor}`}>
          {member.role}
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`mt-3 inline-block rounded-full px-4 py-1 text-[11px] font-bold ${pillBg}`}
        >
          {badge}
        </motion.div>
      </div>

      {/* Bottom Separator Line & Social Links */}
      <div className="w-full border-t border-slate-200/70 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-center gap-5 text-slate-400 dark:text-slate-500">
          <motion.a
            whileHover={{ scale: 1.25, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className={`transition-colors ${hoverIconColor}`}
            aria-label="GitHub"
          >
            <GithubIcon className="h-4 w-4" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.25, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className={`transition-colors ${hoverIconColor}`}
            aria-label="Telegram"
          >
            <Send className="h-4 w-4" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.25, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className={`transition-colors ${hoverIconColor}`}
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}