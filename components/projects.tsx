"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DATA } from "@/data/data";
import { ProjectCard } from "./project-card";
import { ClientProjectsSection } from "./client-projects";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

type ProjectTab = "personal" | "freelance";

export const Projects = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectTab>("freelance");

  const featuredPersonal = DATA.Projects.filter(
    (p) => !p.archived && p.category === "personal"
  );
  const archivedPersonal = DATA.Projects.filter(
    (p) => p.archived && p.category === "personal"
  );
  const freelanceProjects = DATA.Projects.filter(
    (p) => p.category === "freelance"
  );

  const visibleProjects = activeTab === "personal" ? featuredPersonal : freelanceProjects;
  const visibleArchived = activeTab === "personal" ? archivedPersonal : [];

  return (
    <div className="w-full space-y-10">
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        className="font-mono text-[11px] tracking-widest text-brand"
      >
        work
      </motion.h2>

      {/* Professional */}
      <div className="space-y-4">
        <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest">professional</p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={staggerContainer(0.1)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {DATA.ProfessionalProjects.map((project) => (
            <motion.div key={project.title} variants={fadeUp} className="h-full">
              <ProjectCard
                href={project.href}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ClientProjectsSection />

      {/* Projects tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest">projects</p>
          <div className="liquid-glass flex rounded-full p-1">
            {(["freelance", "personal"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setShowArchived(false);
                }}
                className="relative rounded-full px-3 py-1 font-mono text-[11px] transition-colors"
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-brand -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={activeTab === tab ? "text-brand-foreground" : "text-muted-foreground/70"}>
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.06)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {visibleProjects.map((project) => {
            const linksToShow =
              activeTab === "personal"
                ? project.links
                : project.links?.filter((link) => link.type !== "Source");

            return (
              <motion.div key={project.title} variants={fadeUp} className="h-full">
                <ProjectCard
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={linksToShow}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {activeTab === "personal" && visibleArchived.length > 0 && (
          <div className="space-y-4 pt-1">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="font-mono text-xs text-muted-foreground/40 hover:text-brand transition-colors"
            >
              {showArchived ? "↑ hide older work" : `↓ show older work (${visibleArchived.length})`}
            </button>
            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={staggerContainer(0.06)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                  {visibleArchived.map((project) => (
                    <motion.div key={project.title} variants={fadeUp} className="h-full">
                      <ProjectCard
                        href={project.href}
                        title={project.title}
                        description={project.description}
                        dates={project.dates}
                        tags={project.technologies}
                        image={project.image}
                        video={project.video}
                        links={project.links}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
