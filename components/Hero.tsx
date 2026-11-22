"use client";

import { motion } from "framer-motion";
import PixelIcon from "./PixelIcon";
import { Campfire, Tree } from "./Scenery";

export default function Hero() {
  return (
    <section id="home" className="relative flex h-svh min-h-[620px] w-full flex-col items-center justify-center overflow-hidden">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,#0f2e1a_0%,#071810_45%,#030805_100%)]" />
      <div className="stripe-overlay absolute inset-0" />

      {/* voxel landscape */}
      <Tree side="left" variant="a" className="-top-[6vh] w-[78vw] max-w-[760px] opacity-80 md:w-[40vw]" />
      <Tree side="right" variant="b" className="-top-[10vh] w-[78vw] max-w-[760px] opacity-80 md:w-[38vw]" />
      <Campfire className="-bottom-[9vh] -right-[30vw] w-[82vw] max-w-[820px] opacity-95 md:-bottom-[12vh] md:-right-[5vw] md:w-[40vw]" />

      {/* vignette + bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-void to-transparent" />

      {/* name */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 -mt-[10vh] px-4 text-center md:-mt-[14vh]"
      >
        <p className="neon-glow mb-3 font-tech text-xs font-semibold tracking-[0.5em] text-neon/80 sm:text-sm">STUDENT DEVELOPER</p>
        <h1 className="stripe-text font-pixel text-[clamp(3.6rem,23vw,7.5rem)] font-bold leading-[0.95] tracking-[0.04em] md:text-[clamp(5rem,12.5vw,12.5rem)] md:leading-none">
          <span className="block md:inline">MOHIT</span>
          <span className="block md:ml-[0.3em] md:inline">BOORA</span>
        </h1>
      </motion.div>

      {/* bottom UI */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-6 px-6 pb-8 md:flex-row md:items-end md:justify-between md:px-14 md:pb-10"
      >
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <PixelIcon name="user" size={30} className="text-neon" />
            <span className="neon-glow font-tech text-xl font-bold tracking-[0.18em] sm:text-2xl">PLAYER PROFILE</span>
          </div>
          <p className="mt-2 font-tech text-sm tracking-wide text-neon/80 sm:text-base">Developer | Student | Tech Enthusiast</p>
        </div>

        <a href="#profile" aria-label="Scroll to explore" className="group flex w-full flex-col items-center gap-1 md:absolute md:inset-x-0 md:bottom-10 md:w-auto md:pointer-events-none">
          <span className="pointer-events-auto flex flex-col items-center gap-1">
            <span className="font-tech text-[11px] font-semibold tracking-[0.45em] text-neon/80 transition group-hover:text-neon">SCROLL TO EXPLORE</span>
            <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <PixelIcon name="chevron" size={26} className="text-neon" />
            </motion.span>
          </span>
        </a>
      </motion.div>
    </section>
  );
}
