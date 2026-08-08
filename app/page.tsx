"use client";
import { motion } from "framer-motion";
import { Aboutsection } from "@/components/about-section";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Particles } from "@/components/ui/particles";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/useLenis";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [quantity, setQuantity] = useState(70);
  useLenis();

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setQuantity(window.innerWidth < 768 ? 24 : 70);
  }, []);

  const particleColor = isDark ? "#ffffff" : "#1a1a1a";

  return (
    <div className="relative w-full">
      <Particles key={`${particleColor}-${quantity}`} className="fixed inset-0 -z-10 h-full w-full" quantity={quantity} color={particleColor} size={0.6} />
      <Nav current="/" />
      <ScrollProgress />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-24 sm:pt-28 pb-8">
        <motion.div id="hero" custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <Header />
        </motion.div>

        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div id="about" custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="md:col-span-2">
            <Aboutsection />
          </motion.div>

          <motion.div id="experience" custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="md:col-span-2">
            <Experience />
          </motion.div>

          <motion.div id="education" custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="md:col-span-2">
            <Education />
          </motion.div>

          <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="md:col-span-2" id="skills">
            <Skills />
          </motion.div>
        </div>

        <motion.div id="work" custom={5} variants={sectionVariants} initial="hidden" animate="visible" className="mt-16 sm:mt-24">
          <Projects />
        </motion.div>

        <div className="mt-16 sm:mt-24">
          <Contact />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Footer />
      </div>
    </div>
  );
}
