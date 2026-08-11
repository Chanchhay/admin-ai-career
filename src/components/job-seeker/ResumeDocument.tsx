import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type ResumeDocumentProps = {
  title: string;
  data: Record<string, unknown> | null;
  compact?: boolean;
};

export function ResumeDocument({ title, data, compact = false }: ResumeDocumentProps) {
  const safeData = data ?? {};
  const value = (key: string) => typeof safeData[key] === "string" ? safeData[key] as string : "";
  const name = value("fullName") || title;
  const photo = value("profilePhotoUrl");

  return (
    <article className={`mx-auto aspect-[0.707] w-full overflow-hidden bg-white text-slate-800 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ${compact ? "max-w-82 p-6 text-[8px]" : "max-w-210 p-10 sm:p-14"}`}>
      <header className={`flex items-center border-b border-emerald-500 ${compact ? "gap-4 pb-4" : "gap-7 pb-8"}`}>
        {photo ? <Image src={photo} alt={`${name} profile`} width={112} height={112} unoptimized className={`shrink-0 rounded-full object-cover ring-4 ring-emerald-50 ${compact ? "size-15" : "size-28"}`} /> : <span className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700 ${compact ? "size-15 text-xl" : "size-28 text-4xl"}`}>{name.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0"><h1 className={`font-bold tracking-tight text-slate-950 ${compact ? "text-lg" : "text-4xl"}`}>{name}</h1>{value("professionalTitle") ? <p className={`font-medium text-emerald-700 ${compact ? "mt-1 text-[9px]" : "mt-2 text-lg"}`}>{value("professionalTitle")}</p> : null}</div>
      </header>

      <div className={`grid grid-cols-[0.72fr_1.28fr] ${compact ? "gap-5 pt-4" : "gap-10 pt-8"}`}>
        <aside className={`border-r border-slate-200 ${compact ? "pr-4" : "pr-8"}`}>
          <Section title="Contact" compact={compact}>
            <Contact icon={Mail} text={value("email")} compact={compact} />
            <Contact icon={Phone} text={value("phone")} compact={compact} />
            <Contact icon={MapPin} text={value("location")} compact={compact} />
          </Section>
          {value("skills") ? <Section title="Skills" compact={compact}><p className="whitespace-pre-line leading-relaxed text-slate-600">{value("skills")}</p></Section> : null}
          {value("education") ? <Section title="Education" compact={compact}><p className="whitespace-pre-line leading-relaxed text-slate-600">{value("education")}</p></Section> : null}
        </aside>
        <main>
          {value("summary") ? <Section title="Profile" compact={compact}><p className="whitespace-pre-line leading-relaxed text-slate-600">{value("summary")}</p></Section> : null}
          {value("experience") ? <Section title="Experience" compact={compact}><p className="whitespace-pre-line leading-relaxed text-slate-600">{value("experience")}</p></Section> : null}
        </main>
      </div>
    </article>
  );
}

function Section({ title, compact, children }: { title: string; compact: boolean; children: ReactNode }) {
  return <section className={compact ? "mb-4" : "mb-8"}><h2 className={`font-bold uppercase tracking-widest text-slate-950 ${compact ? "mb-2 text-[8px]" : "mb-4 text-sm"}`}>{title}</h2>{children}</section>;
}

function Contact({ icon: Icon, text, compact }: { icon: typeof Mail; text: string; compact: boolean }) {
  if (!text) return null;
  return <p className={`flex items-start text-slate-600 ${compact ? "mb-1.5 gap-1.5" : "mb-3 gap-2.5 text-sm"}`}><Icon className={compact ? "mt-0.5 size-2.5 shrink-0 text-emerald-600" : "mt-0.5 size-4 shrink-0 text-emerald-600"} /> <span className="break-all">{text}</span></p>;
}
