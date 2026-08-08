// Generates public/robots.txt and public/llms.txt from data/profile.json
// so both stay in sync with the real project/contact info instead of
// drifting out of date. Run via `npm run generate:meta` or automatically
// before `dev`/`build` (see package.json).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const profile = JSON.parse(
  readFileSync(path.join(root, "data", "profile.json"), "utf-8")
);

const { siteUrl, name, role, location, bio, currently, skills, projects, pages, contact } = profile;

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function buildLlmsTxt() {
  const allSkills = [
    ...skills.web,
    ...skills.languages,
    ...skills.cms,
    ...skills.tools,
  ].join(", ");

  const pagesList = pages
    .map((p) => `- [${p.title}](${siteUrl}${p.path}) — ${p.description}`)
    .join("\n");

  const projectsList = projects
    .map(
      (p) =>
        `- ${p.title} — ${p.description} (${p.technologies.join(", ")})${p.href ? ` — ${p.href}` : ""}`
    )
    .join("\n");

  const currentlyList = currently.map((c) => `- ${c}`).join("\n");

  return `# ${name} — Portfolio

> ${role} based in ${location}. ${bio}

## Currently

${currentlyList}

## Pages

${pagesList}

## Skills

${allSkills}

## Projects

${projectsList}

## Contact

- Email: ${contact.email}
- LinkedIn: ${contact.linkedin}
- GitHub: ${contact.github}
- Twitter/X: ${contact.twitter}
- WhatsApp: ${contact.whatsapp}

## API

- Machine-readable profile (for agents/LLMs): ${siteUrl}/api/me
`;
}

writeFileSync(path.join(root, "public", "robots.txt"), buildRobotsTxt());
writeFileSync(path.join(root, "public", "llms.txt"), buildLlmsTxt());

console.log("Generated public/robots.txt and public/llms.txt from data/profile.json");
