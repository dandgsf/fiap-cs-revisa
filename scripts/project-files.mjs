import { vendor } from "./vendor-manifest.mjs";

export const runtime = [
  "index.html", "assets/app.js", "assets/engine.js", "assets/render.js", "assets/math.js", "assets/motion.js", "assets/maps.js", "assets/styles.css", "assets/fiap.svg",
  "content/catalog.js", "content/semesters/01/practice.js",
  "content/semesters/01/sources.js", "content/semesters/01/roadmap.js", "content/semesters/01/questions.js", "content/semesters/01/final-exams.js",
  "content/semesters/01/phases/01.js", "content/semesters/01/phases/02.js",
  "content/semesters/01/phases/03.js", "content/semesters/01/phases/04.js",
  ...vendor.map(item => item.path)
];
export const files = [...runtime, ".gitignore", ".gitattributes", "package.json", "README.md", "CONTRIBUTING.md", "CHANGELOG.md", ".github/workflows/validate.yml",
  "docs/content-policy.md", "docs/design.md", "docs/fiap-design-system.md", "docs/security.md", "assets/vendor/LICENSES.md",
  "scripts/project-files.mjs", "scripts/vendor-manifest.mjs", "scripts/serve.mjs", "scripts/export-guide.mjs", "tests/verify-guide.mjs"];
