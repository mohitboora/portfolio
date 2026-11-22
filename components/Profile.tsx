"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { profile } from "@/lib/data";
import PixelIcon, { type IconName } from "./PixelIcon";
import { Tree } from "./Scenery";

function Panel({ icon, title, children, className = "", delay = 0 }: { icon: IconName; title: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={`panel p-5 sm:p-6 ${className}`}
    >
      <header className="mb-4 flex items-center gap-3 border-b-2 border-neon/15 pb-3">
        <PixelIcon name={icon} size={26} className="text-neon" />
        <h2 className="neon-glow font-tech text-lg font-bold tracking-[0.2em] text-neon">{title}</h2>
      </header>
      {children}
    </motion.section>
  );
}

export default function Profile() {
  return (
    <section id="profile" className="relative w-full overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030805_0%,#0b2415_22%,#071a0f_60%,#030805_100%)]" />
      <div className="stripe-overlay absolute inset-0 opacity-70" />
      <Tree side="left" variant="b" className="-top-[2vh] w-[70vw] max-w-[640px] opacity-35 md:opacity-70 md:w-[34vw]" />
      <Tree side="right" variant="a" className="-top-[6vh] w-[70vw] max-w-[640px] opacity-35 md:opacity-70 md:w-[32vw]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 md:pt-28">
        {/* title block, as in the reference ACCOUNT screen */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="stripe-text text-center font-pixel text-[clamp(3.2rem,17.5vw,6.5rem)] font-bold leading-none tracking-[0.06em] md:text-[clamp(5rem,12vw,10rem)]"
        >
          PROFILE
        </motion.h2>

        <div className="mt-10 flex items-start gap-3 md:mt-14">
          <PixelIcon name="user" size={30} className="mt-0.5 shrink-0 text-neon" />
          <div>
            <h3 className="neon-glow font-tech text-xl font-bold tracking-[0.18em] sm:text-2xl">ACCOUNT</h3>
            <p className="mt-1 max-w-xl font-tech text-sm text-neon/70">Player: Mohit Boora &nbsp;·&nbsp; Class: Student Developer &nbsp;·&nbsp; Level: 2nd Year</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {/* column 1 */}
          <div className="flex flex-col gap-5">
            <Panel icon="user" title="ABOUT ME">
              <p className="font-tech text-[15px] leading-relaxed text-neon/85">{profile.about}</p>
            </Panel>
            <Panel icon="book" title="EDUCATION" delay={0.08}>
              <ul className="space-y-2 font-tech text-[15px]">
                {profile.education.map((e, i) => (
                  <li key={e} className="flex items-center gap-3">
                    <span className="inline-block h-2.5 w-2.5 shrink-0 bg-neon shadow-[0_0_8px_#7af59a]" />
                    <span className={i === 0 ? "font-bold text-neon" : "text-neon/80"}>{e}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* column 2 */}
          <div className="flex flex-col gap-5">
            <Panel icon="case" title="EXPERIENCE" delay={0.05}>
              <ul className="space-y-3">
                {profile.experience.map((x) => (
                  <li key={x.org} className="slot px-4 py-3">
                    <p className="font-pixel text-xl font-bold tracking-wide text-neon">{x.org}</p>
                    <p className="font-tech text-sm text-neon/75">{x.role}</p>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel icon="sword" title="SKILLS" delay={0.12}>
              <ul className="grid grid-cols-2 gap-2.5">
                {profile.skills.map((s) => (
                  <li key={s} className="slot flex items-center gap-2 px-3 py-2 font-tech text-sm font-semibold text-neon">
                    <span className="h-2 w-2 shrink-0 bg-neon" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* column 3 */}
          <Panel icon="globe" title="SOCIALS" delay={0.1} className="h-fit">
            <ul className="space-y-2.5">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="slot flex items-center gap-3 px-3 py-2.5">
                    <PixelIcon name={s.icon as IconName} size={24} className="shrink-0 text-neon" />
                    <span className="min-w-0">
                      <span className="block font-tech text-[11px] font-semibold tracking-[0.25em] text-neon/55">{s.label.toUpperCase()}</span>
                      <span className="block break-all font-tech text-sm font-semibold text-neon">{s.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <p className="mt-14 text-center font-tech text-xs tracking-[0.4em] text-neon/40">© {new Date().getFullYear()} MOHIT BOORA</p>
      </div>
    </section>
  );
}
