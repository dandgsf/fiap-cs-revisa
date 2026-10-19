import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { runtime as runtimeFiles, files as projectFiles } from "../scripts/project-files.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(join(root, file), "utf8");
const { vendor } = existsSync(join(root, "scripts/vendor-manifest.mjs")) ? await import("../scripts/vendor-manifest.mjs") : { vendor: [] };
const hashed = new Set(vendor.map(item => item.path));
const require = createRequire(import.meta.url);
const E = require(join(root, "assets/engine.js"));
const R = require(join(root, "assets/render.js"));
const katex = require(join(root, "assets/vendor/katex/katex.min.js"));
const sandbox = vm.createContext({});
const dataFiles = [...read("index.html").matchAll(/<script defer src="([^"]+)"/g)].map(m => m[1]).filter(file => file.startsWith("content/"));
for (const file of dataFiles) vm.runInContext(read(file), sandbox, { filename: file });
// Normalize cross-context objects before structural comparisons.
const clone = value => JSON.parse(JSON.stringify(value));
const bank = clone(sandbox.FIAPBank);
const course = clone(sandbox.FIAPCourse);
const sources = clone(sandbox.FIAPSources);
const original = [...Object.values(bank.minis).flat(), ...bank.finals.flatMap(set => set.questions)];
const all = [...original, ...bank.extra];
const curriculum = clone(sandbox.FIAPCurriculum);
const competencies = ["Fundamentos e lógica", "Programação e algoritmos", "Estruturas e sistemas",
  "Matemática, dados e IA", "Energia, sustentabilidade e sociedade"].sort();
const groups = [];
function check(name, test) {
  try { test(); groups.push(name); console.log("OK: " + name); }
  catch (error) { error.message = name + ": " + error.message; throw error; }
}
const rng = seed => () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
function ready() { const state = E.freshState(); state.studyMs = [600000, 600000, 0, 0]; return state; }
function finish(quiz, questions, wrong = 0) {
  quiz.items.forEach((item, index) => {
    const q = questions.find(q => q.id === item.id);
    assert.equal(E.answer(quiz, q.id, (q.correctIndex + (index < wrong ? 1 : 0)) % 5), true);
  });
  E.submit(quiz);
}
function reference(source, label) {
  const pdf = sources.find(item => item.phase === source.phase && item.chapter === source.chapter);
  assert.ok(pdf, label + ": fonte não encontrada");
  assert.match(source.pages, /^\d+(?:[–-]\d+)?(?:[,;]\s*\d+(?:[–-]\d+)?)*$/, label);
  for (const part of source.pages.split(/[,;]/)) {
    const bounds = part.trim().split(/[–-]/).map(Number);
    assert.ok(bounds[0] >= 1 && bounds.at(-1) <= pdf.pages && bounds[0] <= bounds.at(-1),
      label + ": páginas fora do PDF individual");
  }
}

check("32 capítulos, objetivos, recuperação ativa e referências individuais", () => {
  assert.equal(sources.length, 32);
  assert.equal(new Set(sources.map(s => s.phase + "-" + s.chapter)).size, 32);
  assert.equal(sources.reduce((sum, s) => sum + s.pages, 0), 1259);
  assert.deepEqual(course.phases.map(p => p.id), [1, 2, 3, 4]);
  for (const phase of course.phases) {
    assert.ok(phase.summary.length > 200);
    assert.ok(phase.outcomes.length >= 4);
    assert.equal(phase.chapters.length, 8);
    assert.deepEqual(phase.chapters.map(c => c.number), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(phase.memory.length, 8);
    assert.equal(phase.checklist.length, 8);
    for (const chapter of phase.chapters) {
      assert.ok(chapter.body.length > 350 && (chapter.body + (chapter.extension || '')).length > 800, chapter.title + ": revisão ou aprofundamento ausente");
      assert.ok(chapter.worked.length > 150);
      assert.ok(chapter.pitfall.length > 30);
      assert.ok(chapter.recall.length >= 2);
      assert.ok(chapter.recall.every(item => item.question.length > 10 && item.answer.length > 15));
      reference({ phase: phase.id, chapter: chapter.number, pages: chapter.pages }, chapter.title);
    }
    for (const [term, meaning, chapter] of phase.memory) {
      assert.ok(term && meaning.length > 15 && phase.chapters.some(c => c.number === chapter));
    }
  }
});

check("129 questões únicas, incluindo as 50 originais e três conjuntos finais de 10", () => {
  assert.deepEqual(Object.keys(bank.minis), ["1", "2", "3", "4"]);
  assert.equal(bank.finals.length, 3);
  assert.equal(new Set(bank.finals.map(s => s.id)).size, 3);
  assert.equal(original.length, 50);
  assert.equal(bank.extra.length, 79);
  assert.equal(all.length, 129);
  assert.equal(new Set(all.map(q => q.id)).size, 129);
  assert.equal(new Set(all.map(q => q.prompt)).size, 129);
  for (const [phase, questions] of Object.entries(bank.minis)) {
    assert.equal(questions.length, 5);
    assert.ok(questions.every(q => q.phase === Number(phase)));
  }
  for (const set of bank.finals) {
    assert.equal(set.questions.length, 10);
    assert.deepEqual([...new Set(set.questions.map(q => q.phase))].sort(), [1, 2, 3, 4]);
    assert.deepEqual([...new Set(set.questions.map(q => q.competency))].sort(), competencies);
  }
  for (const q of all) {
    assert.ok(q.id && q.prompt.length > 25 && competencies.includes(q.competency), q.id);
    assert.equal(q.options.length, 5, q.id);
    assert.equal(new Set(q.options).size, 5, q.id);
    assert.equal(q.rationales.length, 5, q.id);
    assert.ok(q.rationales.every(text => text.length >= 20), q.id);
    assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 5, q.id);
    assert.ok(q.explanation.length > 50 && q.level, q.id);
    assert.equal(q.source.phase, q.phase, q.id);
    reference(q.source, q.id);
  }
});

check("cálculos independentes das questões quantitativas", () => {
  const correct = id => { const q = all.find(q => q.id === id); assert.ok(q, id); return q.options[q.correctIndex]; };
  assert.match(correct("a1"), new RegExp(String(parseInt("10110110", 2))));
  assert.match(correct("a4"), /\b9\b/);
  assert.equal([1, 2, 3, 4, 5, 6].filter(n => n % 2).reduce((a, b) => a + b, 0), 9);
  assert.match(correct("a7"), /10.*6/);
  assert.match(correct("a8"), /24.*3/);
  assert.match(correct("b2"), /1,5/);
  assert.equal(150 / 100, 1.5);
  assert.match(correct("b5"), /15/);
  assert.equal(-(2 ** 2) + 8 * 2 + 3, 15);
  assert.match(correct("b9"), /5/);
  assert.equal(5 ** 2 - 10 * 5 + 29, 4);
  assert.match(correct("b10"), /0,33|1\/3|33,3/);
  assert.ok(Math.abs((2 * (0.2 / 0.8)) / (1 + 2 * (0.2 / 0.8)) - 1 / 3) < 1e-10);
  assert.match(correct("c2"), /\b8\b/);
  assert.match(correct("c5"), /\b10\b/);
  assert.match(correct("c6"), /Oito vezes/);
  assert.equal(2 ** 3, 8);
  assert.match(correct("c8"), /\b6\b/);
  assert.match(correct("c10"), /75.*80/);
  assert.equal(12 / (12 + 4), 0.75);
  assert.equal(12 / (12 + 3), 0.8);
});

check("bloqueio: 10 minutos em cada fase e somente tempo ativo", () => {
  const state = E.freshState();
  assert.throws(() => E.startFinal(state, bank), /REVIEW_REQUIRED/);
  state.studyMs = [1200000, 599999, 0, 0];
  assert.equal(E.unlocked(state), false);
  const active = { visible: true, focused: true, idleFor: 0 };
  for (const context of [{ ...active, visible: false }, { ...active, focused: false },
    { ...active, reviewing: false }, { ...active, idleFor: 90000 }]) {
    assert.equal(E.creditStudy(state, 2, 1000, context), 0);
  }
  for (const delta of [-1, 0, 5001, NaN, Infinity]) assert.equal(E.creditStudy(state, 2, delta, active), 0);
  assert.equal(E.creditStudy(state, 0, 1000, active), 0);
  assert.equal(E.creditStudy(state, 2, 1000, { ...active, idleFor: 89999 }), 1);
  assert.equal(E.unlocked(state), true);
  const before = [...state.studyMs];
  E.creditStudy(state, 3, 1000, active);
  assert.deepEqual(state.studyMs, [before[0], before[1], 1000, 0]);
  assert.equal(E.restore(JSON.stringify(state), bank).studyMs[1], 600000);
});

check("envio completo, nota, erros, revisão e alternativas embaralhadas", () => {
  const state = ready();
  const quiz = E.startFinal(state, bank, rng(17));
  const questions = bank.finals.find(s => s.id === quiz.setId).questions;
  assert.throws(() => E.grade(quiz, questions), /NOT_SUBMITTED/);
  assert.throws(() => E.submit(quiz), /INCOMPLETE/);
  assert.equal(E.answer(quiz, "missing", 0), false);
  assert.equal(E.answer(quiz, quiz.items[0].id, 5), false);
  assert.equal(E.answer(quiz, quiz.items[0].id, -1), false);
  assert.throws(() => E.startFinal(state, bank), /ATTEMPT_IN_PROGRESS/);
  const initial = R.form(quiz, questions, "test", "final", 0);
  assert.equal((initial.match(/<fieldset/g) || []).length, 10);
  assert.equal((initial.match(/type="radio"/g) || []).length, 50);
  assert.doesNotMatch(initial, /correct-option|chosen-wrong|Alternativa correta|review-verdict/);
  assert.doesNotMatch(initial, /page-ref|source-reference|PDF/, "páginas e fonte só aparecem depois da correção");
  assert.equal(R.feedback(quiz, questions, E, "test"), "");
  for (const item of quiz.items) assert.deepEqual([...item.optionOrder].sort(), [0, 1, 2, 3, 4]);
  assert.ok(quiz.items.some(item => item.optionOrder.join() !== "0,1,2,3,4"));
  finish(quiz, questions, 3);
  const result = E.grade(quiz, questions);
  assert.equal(result.correct, 7);
  assert.equal(result.score, 7);
  assert.equal(Object.values(result.competencies).reduce((n, c) => n + c.total, 0), 10);
  assert.equal(E.answer(quiz, quiz.items[0].id, 0), false);
  assert.equal(R.form(quiz, questions, "test", "final", 0), "");
  const feedback = R.feedback(quiz, questions, E, "test");
  assert.equal((feedback.match(/Sua resposta · incorreta/g) || []).length, 3);
  assert.equal((feedback.match(/class="correct-option"/g) || []).length, 10);
  assert.equal((feedback.match(/class="source-reference"/g) || []).length, 10);
  assert.match(feedback, /Seu caderno de erros/);
  assert.match(feedback, /tabindex="-1"/);
  for (const item of result.details) {
    const q = item.question;
    const visibleLetter = String.fromCharCode(65 + item.optionOrder.indexOf(q.correctIndex));
    const segment = feedback.split('id="review-test-' + q.id + '"')[1].split('</article>')[0];
    assert.ok(segment.includes('Alternativa correta: ' + visibleLetter + '.'));
    assert.ok(segment.includes(R.escape(q.rationales[item.selected])));
  }
});

check("três tentativas distintas; recarga preserva ordem, respostas e limite", () => {
  let state = ready();
  const seen = new Set();
  for (let attempt = 0; attempt < 3; attempt++) {
    const quiz = E.startFinal(state, bank, rng(71 + attempt));
    assert.ok(!seen.has(quiz.setId));
    seen.add(quiz.setId);
    const questions = bank.finals.find(s => s.id === quiz.setId).questions;
    E.answer(quiz, quiz.items[0].id, 4);
    const restored = E.restore(JSON.stringify(state), bank);
    assert.deepEqual(restored.attempts.at(-1), quiz);
    finish(quiz, questions, attempt);
    state = E.restore(JSON.stringify(state), bank);
  }
  assert.equal(seen.size, 3);
  assert.throws(() => E.startFinal(state, bank), /ATTEMPT_LIMIT/);
  const before = clone(state);
  const mini = E.startMini(state, 1, bank, rng(5));
  finish(mini, bank.minis[1], 2);
  assert.equal(E.grade(mini, bank.minis[1]).score, 6);
  E.startMini(state, 1, bank, rng(6));
  assert.deepEqual(state.attempts, before.attempts);
  assert.deepEqual(state.studyMs, before.studyMs);
  assert.equal(Object.keys(state.minis[1].answers).length, 0);
  for (const wrong of [0, 10]) {
    const quiz = E.makeQuiz(bank.finals[0].questions, "A", rng(3));
    finish(quiz, bank.finals[0].questions, wrong);
    assert.equal(E.grade(quiz, bank.finals[0].questions).score, 10 - wrong);
  }
});

check("restauração defensiva de dados ausentes, antigos e corrompidos", () => {
  for (const raw of [null, "", "{broken", JSON.stringify({ version: 1, submitted: true })]) {
    assert.deepEqual(E.restore(raw, bank), E.freshState());
  }
  const state = ready();
  const quiz = E.startFinal(state, bank, rng(10));
  quiz.submitted = true;
  state.studyMs = [-1, 1e30, null, "600000"];
  state.checks = { "p1-0": true, "p3-8": true, unrelated: true };
  let restored = E.restore(JSON.stringify(state), bank);
  assert.equal(restored.attempts[0].submitted, false);
  assert.deepEqual(restored.studyMs, [0, 86400000, 0, 0]);
  assert.deepEqual(restored.checks, { "p1-0": true });
  quiz.items[0].optionOrder = [0, 0, 1, 2, 3];
  restored = E.restore(JSON.stringify(state), bank);
  assert.equal(restored.attempts.length, 0);
  assert.equal(E.STORAGE_KEY, "fiap.csRevisa.semestre-1.v1");
  assert.equal(E.LEGACY_STORAGE_KEY, "fiap.firstSemesterExam.v2");
});

check("HTML gerado, acessibilidade estrutural e impressão", () => {
  const markup = course.phases.map(R.phase).join("");
  assert.equal((markup.match(/role="tabpanel"/g) || []).length, 4);
  assert.equal((markup.match(/class="lesson"/g) || []).length, 32);
  assert.equal((markup.match(/data-check=/g) || []).length, 32);
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  const index = read("index.html"), styles = read("assets/styles.css"), app = read("assets/app.js");
  assert.match(app, /role="tab"/);
  assert.match(index, /id="semester-select"/);
  assert.match(index, /id="study-search"/);
  assert.match(index, /<html lang="pt-BR"/);
  assert.match(index, /class="skip-link"/);
  assert.match(app, /ArrowRight/);
  assert.match(app, /ArrowLeft/);
  assert.match(app, /unanswered\[0\]\.id.*querySelector\('input'\).*focus/);
  assert.match(app, /document\.hasFocus/);
  assert.match(app, /visibilitychange/);
  assert.match(app, /beforeprint/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /@media print/);
  assert.match(styles, /\.phase-panel\[hidden\]/);
  assert.match(styles.slice(styles.lastIndexOf("@media print")), /\.lesson pre code\s*\{[^}]*white-space:\s*pre-wrap/);
  assert.match(styles, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.equal(R.escape('<img onerror="x">'), "&lt;img onerror=&quot;x&quot;&gt;");
});

check("pacote autocontido, privacidade e identificação autorizada do autor", () => {
  for (const file of ["README.md", "scripts/export-guide.mjs", ...runtimeFiles]) assert.ok(existsSync(join(root, file)), file);
  const index = read("index.html");
  const assets = [...index.matchAll(/<(?:script|link|img)\b[^>]*?(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  for (const asset of assets) {
    assert.match(asset, /^(?:assets|content)\/[\w.\/-]+$/, asset);
    assert.ok(!asset.includes(".."), asset);
    assert.ok(existsSync(join(root, asset)), asset);
  }
  for (const file of dataFiles) assert.ok(assets.includes(file), file);
  // Arquivos de terceiros ficam cobertos pelo hash do manifesto; a varredura vale para o código próprio.
  const runtime = runtimeFiles.filter(file => !hashed.has(file)).map(read).join("\n");
  const footer = index.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)[0];
  assert.doesNotMatch(runtime, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/);
  assert.doesNotMatch(runtime, /@import\b|url\(\s*["']?(?:https?:|\/\/)/i);
  assert.doesNotMatch(runtime, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.doesNotMatch(runtime.replace(footer, ""), /\bRM\s*[:#-]?\s*\d{5,}/i);
  assert.deepEqual([...footer.matchAll(/\bRM\s*[:#-]?\s*\d{5,}/gi)].map(match => match[0]), ["RM570057"]);
  assert.doesNotMatch(runtime, /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/);
  assert.doesNotMatch(read("assets/app.js"), /localStorage\.(?:clear|removeItem)\s*\(/);
  assert.doesNotMatch(runtime, /\.\.\/|fase-\d\d\/materials\//);
  const remoteLinks = [...index.matchAll(/<a\b[^>]*href="(https?:[^"]+)"/g)];
  assert.equal(remoteLinks.length, 5, "Quatro consultas opcionais de conferência e o perfil do autor");
  assert.ok(footer.includes("© 2026 Danilo Fernandes · RM570057 · "));
  assert.ok(footer.includes('<a href="https://github.com/dandgsf" target="_blank" rel="noopener noreferrer">@dandgsf</a>'));
});

check("hierarquia sem duplicação e cobertura mínima por capítulo", () => {
  assert.deepEqual(curriculum.semesters.map(s => s.id), ["semestre-1", "semestre-2"]);
  assert.equal(curriculum.semesters[1].status, "planned");
  assert.equal(curriculum.semesters[1].phases.length, 0);
  for (const phase of curriculum.semesters[0].phases) {
    const nested = phase.subjects.flatMap(subject => subject.chapters);
    assert.deepEqual(nested.map(ch => ch.number).sort(), phase.chapters.map(ch => ch.number).sort());
    for (const subject of phase.subjects) for (const ch of subject.chapters) {
      assert.equal(ch.subjectId, subject.id);
      assert.ok(ch.focus && ch.priorityReason && ch.minutes >= 4);
      if (ch.number > 1) assert.ok(bank.chapters[`p${phase.id}-c${ch.number}`].length >= 4);
      else assert.equal(ch.priority, "context");
    }
  }
  for (const key of ["p1-c6", "p2-c4", "p4-c4", "p4-c5"]) assert.equal(bank.chapters[key].length, 8);
  assert.equal(new Set(Object.values(bank.chapters).flat().map(q => q.id)).size, 129);
  assert.match(course.phases[0].chapters[5].body, /perceptron|Perceptron/);
  assert.match(course.phases[1].chapters[3].body, /lista simplesmente encadeada/);
});

check("treino por capítulo, recarga, resultado e preservação dos finais", () => {
  const state = ready();
  const final = E.startFinal(state, bank, rng(91));
  const beforeFinal = clone(final);
  let quiz = E.startPractice(state, "p2-c4", bank, rng(7));
  assert.equal(quiz.items.length, 8);
  assert.throws(() => E.submit(quiz), /INCOMPLETE/);
  E.answer(quiz, quiz.items[0].id, 2);
  state.readChapters = { "p2-c4": true, "p8-c99": true, "p1-c1": true };
  let restored = E.restore(JSON.stringify(state), bank);
  assert.deepEqual(restored.practices["p2-c4"], quiz);
  assert.deepEqual(restored.readChapters, { "p1-c1": true, "p2-c4": true });
  finish(quiz, bank.chapters["p2-c4"], 2);
  assert.equal(E.grade(quiz, bank.chapters["p2-c4"]).score, 7.5);
  restored = E.restore(JSON.stringify(state), bank);
  assert.equal(restored.practices["p2-c4"].submitted, true);
  E.startPractice(state, "p2-c4", bank, rng(8));
  assert.deepEqual(state.attempts[0], beforeFinal);
  assert.deepEqual(state.practices["p2-c4"].answers, {});
  assert.throws(() => E.startPractice(state, "p99-c99", bank), /INVALID_CHAPTER/);
  assert.throws(() => E.startPractice(state, "p2-c1", bank), /INVALID_CHAPTER/);
  state.practices["p2-c4"].items[0].id = "unrecognized";
  assert.equal(E.restore(JSON.stringify(state), bank).practices["p2-c4"], undefined);
});

check("chaves por semestre e fases futuras sem herdar respostas", () => {
  assert.notEqual(E.storageKey("semestre-1"), E.storageKey("semestre-2"));
  const futureBank = { minis: { 5: bank.minis[1] }, finals: [], chapters: {}, chapterIds: [], reviewPhases: [5] };
  const future = E.freshState(futureBank);
  assert.equal(future.activeTab, "phase-5");
  assert.equal(future.studyMs.length, 5);
  assert.equal(E.unlocked(future, futureBank), false);
  assert.equal(E.creditStudy(future, 5, 1000, { visible: true, focused: true, idleFor: 0 }), 1000);
  future.studyMs[4] = 600000;
  assert.equal(E.unlocked(future, futureBank), true);
  assert.deepEqual(E.restore(JSON.stringify(ready()), futureBank).attempts, []);
});

check("novos cálculos independentes e distinção entre aproximação e igualdade", () => {
  const correct = id => { const q = all.find(q => q.id === id); assert.ok(q, id); return q.options[q.correctIndex]; };
  assert.match(correct("treino-1-3-1"), new RegExp(parseInt("3A", 16).toString(2).padStart(8, "0")));
  assert.equal(2 ** 6, 64);
  assert.ok(Math.abs(2 * 0.5 - 1 + 0.2 - 0.2) < 1e-12);
  assert.match(correct("treino-1-6-4"), /0,77/);
  assert.ok(Math.abs(0.8 - 0.1 * 0.3 - 0.77) < 1e-12);
  assert.match(correct("treino-4-4-3"), /2,01/);
  assert.ok(Math.abs((2 + 0.04 / 4) - Math.sqrt(4.04)) < 0.0001);
  assert.match(correct("treino-4-4-4"), /1,105/);
  assert.ok(Math.abs((1 + 0.1 + 0.1 ** 2 / 2) - Math.exp(0.1)) < 0.0002);
  assert.match(correct("treino-4-5-3"), /20/);
  assert.equal((120 / 2) / (60 / (23 - 2 - 1)), 20);
  assert.match(correct("treino-4-5-5"), /^5/);
  assert.ok(Math.abs(1 / (1 - 0.8) - 5) < 1e-12);
  assert.equal(Math.sqrt(9), 3);
  assert.match(correct("treino-4-7-1"), /7,2/);
  assert.ok(Math.abs(30 * 0.8 * 0.9 / 3 - 7.2) < 1e-12);
  assert.equal(3 ** 3, 27);
});

check("exportação explícita e ausência de formatos comuns de segredos", () => {
  assert.equal(new Set(projectFiles).size, projectFiles.length);
  const detectors = [
    ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ["public-key", /(?:ssh-rsa|ssh-ed25519)\s+[A-Za-z0-9+/]{40,}/],
    ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
    ["cloud-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    ["api-key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
    ["jwt", /\beyJ[A-Za-z0-9_-]{12,}\.eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\b/],
    ["personal-email", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
    ["local-user-path", /[A-Z]:\\(?:Users|Development)\\/i]
  ];
  for (const file of projectFiles) {
    assert.ok(existsSync(join(root, file)), file);
    assert.ok(!file.split("/").includes(".git"));
    assert.doesNotMatch(file, /\.(?:pdf|pem|pub|key|pfx|p12)$/i);
    if (hashed.has(file)) continue;
    const text = read(file);
    for (const [category, pattern] of detectors) assert.ok(!pattern.test(text), `${file}: detector ${category}`);
  }
  assert.match(read("scripts/serve.mjs"), /server\.listen\(port, "127\.0\.0\.1"/);
  assert.match(read("scripts/serve.mjs"), /runtime\.includes\(file\)/);
  assert.match(read("index.html"), /connect-src 'none'/);
});

const htmlFields = chapter => ["body", "worked", "extension"].map(field => chapter[field] || "").join("\n");
const decode = text => text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const texSources = html => [...html.matchAll(/<(span|div) class="(tex|tex-block)">([\s\S]*?)<\/\1>/g)].map(match => decode(match[3]));
// Em template literal, "\t", "\f", "\n", "\r", "\v" e "\b" viram caracteres de controle e "\c", "\s", "\a"… perdem a barra.
const bareCommand = /(?<![\\A-Za-z])(frac|dfrac|tfrac|sqrt|cdot|cdots|ldots|times|div|pm|sum|prod|int|lim|log|ln|exp|sin|cos|tan|in|le|leq|ge|geq|neq|approx|equiv|alpha|beta|gamma|delta|Delta|epsilon|varepsilon|eta|theta|lambda|mu|sigma|Sigma|pi|omega|phi|varphi|partial|nabla|infty|quad|qquad|left|right|text|mathrm|mathbf|mathbb|operatorname|hat|bar|overline|underbrace|overbrace|binom|begin|end|land|lor|lnot|oplus|implies|iff|forall|exists|subset|cup|cap|Rightarrow|Leftrightarrow)\b/;
function texProblems(tex) {
  const problems = [];
  if (/[\u0000-\u001F]/.test(tex)) problems.push("caractere de controle (barra invertida perdida ou quebra de linha no TeX)");
  if (bareCommand.test(tex)) problems.push("comando sem barra: " + tex.match(bareCommand)[0]);
  try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); } catch (error) { problems.push("KaTeX: " + error.message); }
  return problems;
}

check("trechos citados por página", () => {
  const sample = R.excerpts('<section class="excerpt" data-pages="33–36"><h4>Divisões</h4><p>x</p></section><section class="excerpt" data-pages="39"><p>y</p></section>', "ex-1-3", "Cap. 3 — Exemplo");
  assert.match(sample, /<section class="excerpt" id="ex-1-3-1" data-pages="33–36"><p class="page-ref"[^>]*><span>PDF<\/span> p\. 33–36<\/p><h4>/);
  assert.match(sample, /id="ex-1-3-2" data-pages="39"><p class="page-ref"[^>]*><span>PDF<\/span> p\. 39<\/p>/);
  assert.equal(R.pdfTitle(sources, 1, 3), "A Lógica que Define Cada Decisão no Cérebro Digital da Nave");
  assert.equal(R.pdfTitle(sources, 4, 4), "O Cálculo Diferencial que Modela as Variações do Sistema Energético");
  for (const phase of course.phases) {
    const markup = R.phase(phase, { sources });
    let excerpts = 0;
    for (const chapter of phase.chapters) {
      const html = htmlFields(chapter);
      assert.doesNotMatch(html, /<section class="excerpt"(?! data-pages="[^"]+">)/, chapter.title + ": trecho sem data-pages");
      for (const [, pages] of html.matchAll(/<section class="excerpt" data-pages="([^"]+)">/g)) {
        reference({ phase: phase.id, chapter: chapter.number, pages }, chapter.title + " (trecho)");
        excerpts++;
      }
      assert.ok(markup.includes(`Cap. ${chapter.number} — ${R.pdfTitle(sources, phase.id, chapter.number)} · PDF p. ${chapter.pages}`), chapter.title + ": fonte do capítulo");
    }
    assert.equal((markup.match(/class="page-ref"/g) || []).length, excerpts, `fase ${phase.id}: um marcador de página por trecho`);
  }
  assert.equal(course.phases.map(R.phase).join("").includes("undefined"), false, "map(R.phase) passa índice como contexto");
});

check("fórmulas renderizáveis e sem barra perdida", () => {
  assert.ok(texProblems("\f" + "rac{1}{2}").length > 0, "detecta \\f perdido");
  assert.ok(texProblems("a " + "\t" + "imes b").length > 0, "detecta \\t perdido");
  assert.ok(texProblems("cdot x").length > 0, "detecta comando sem barra");
  assert.deepEqual(texProblems("\\dfrac{1}{1-R_j^{2}}"), []);
  let total = 0;
  for (const phase of course.phases) for (const chapter of phase.chapters) {
    for (const tex of texSources(htmlFields(chapter))) {
      assert.deepEqual(texProblems(tex), [], `${phase.id}-${chapter.number}: ${tex}`);
      total++;
    }
    assert.doesNotMatch(htmlFields(chapter), /<p class="formula">/, `${phase.id}-${chapter.number}: fórmula antiga sem KaTeX`);
  }
  assert.ok(total >= 6, "fórmulas convertidas para KaTeX");
  const index = read("index.html");
  assert.ok(index.indexOf("assets/math.js") > index.indexOf("assets/vendor/katex/katex.min.js"));
  assert.match(read("assets/app.js"), /FIAPMath\?\.renderIn\(/, "sem KaTeX o guia continua funcionando");
});

function mapProblems(map, phaseId, chapterNumber) {
  const problems = [];
  let nodes = 0;
  const walk = (node, depth, path) => {
    nodes++;
    if (typeof node.label !== "string" || !node.label.trim() || node.label.length > 60) problems.push(`${path}: rótulo vazio ou com mais de 60 caracteres`);
    if (node.note !== undefined && (typeof node.note !== "string" || node.note.length > 160 || node.note.length < 10)) problems.push(`${path}: nota fora de 10–160 caracteres`);
    if (node.pages !== undefined) {
      try { reference({ phase: phaseId, chapter: chapterNumber, pages: node.pages }, path); } catch (error) { problems.push(error.message); }
    }
    if (node.children !== undefined) {
      if (!Array.isArray(node.children) || !node.children.length) problems.push(`${path}: children vazio`);
      else if (depth >= 3) problems.push(`${path}: mais de 3 níveis abaixo da raiz`);
      else node.children.forEach((child, i) => walk(child, depth + 1, `${path}/${i + 1}`));
    }
  };
  if (!map || !Array.isArray(map.children) || map.children.length < 3 || map.children.length > 6) problems.push("raiz precisa de 3 a 6 ramos");
  else walk(map, 0, `mapa ${phaseId}-${chapterNumber}`);
  if (nodes > 33) problems.push(`${nodes - 1} nós além da raiz (máximo 32)`);
  return problems;
}

check("mapas mentais válidos e acessíveis", () => {
  const sample = { label: "Sistemas <numéricos>", children: [
    { label: "Notação posicional", pages: "12–21", children: [{ label: "Peso bⁱ", note: "Cada posição vale a base elevada à posição." }, { label: "Zero mantém posições" }] },
    { label: "Conversões", children: [{ label: "Divisões sucessivas", pages: "33–40" }] },
    { label: "Bits e bytes", note: "n bits representam 2ⁿ combinações." }
  ] };
  assert.deepEqual(mapProblems(sample, 1, 3), []);
  assert.ok(mapProblems({ label: "x", children: [{ label: "a" }, { label: "b" }] }, 1, 3).length, "menos de 3 ramos");
  assert.ok(mapProblems({ label: "x", children: [{ label: "a", pages: "99" }, { label: "b" }, { label: "c" }] }, 1, 3).length, "página fora do PDF");
  const markup = R.mindmap(sample, "map-1-3");
  assert.equal((markup.match(/<figure class="mindmap wide" id="map-1-3"/g) || []).length, 1);
  assert.equal((markup.match(/aria-expanded="true"/g) || []).length, 2, "ramos com filhos começam abertos");
  assert.equal((markup.match(/aria-expanded="false"/g) || []).length, 2, "detalhes das folhas começam fechados");
  assert.equal((markup.match(/style="--branch:var\(--map-\d\)"/g) || []).length, 3);
  assert.match(markup, /<span class="mm-pages">p\. 12–21<\/span>/);
  assert.match(markup, /Sistemas &lt;numéricos&gt;/);
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, target] of markup.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(target), target);
  for (const phase of course.phases) for (const chapter of phase.chapters) {
    if (chapter.map) assert.deepEqual(mapProblems(chapter.map, phase.id, chapter.number), [], `${phase.id}-${chapter.number}`);
  }
  const styles = read("assets/styles.css"), index = read("index.html");
  assert.match(styles, /@container mindmap \(max-width:\s*40rem\)/);
  assert.match(styles.slice(styles.lastIndexOf("@media print")), /\.mindmap \[hidden\]/);
  assert.ok(index.indexOf("assets/maps.js") > index.indexOf("assets/vendor/gsap/gsap.min.js"));
  assert.ok(index.indexOf("assets/motion.js") > index.indexOf("assets/vendor/gsap/gsap.min.js"));
  assert.match(read("assets/motion.js"), /prefers-reduced-motion: reduce/);
});

check("enunciados ricos e fonte detalhada só no resultado", () => {
  const rich = R.rich("Veja <b>x</b> e `a<b`.\n\n```\nfor i in range(3):\n    print(i)\n```\nDepois responda.");
  assert.doesNotMatch(rich, /<b>/);
  assert.match(rich, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.match(rich, /<code>a&lt;b<\/code>/);
  assert.match(rich, /<pre><code>for i in range\(3\):\n    print\(i\)<\/code><\/pre>/);
  assert.match(rich, /<p>Depois responda\.<\/p>/);
  assert.equal(R.rich("Só `x` aqui", { inline: true }), "Só <code>x</code> aqui");
  const fixture = [{ id: 1, chapters: [{ number: 3, body: '<section class="excerpt" data-pages="12–19"><p>a</p></section><section class="excerpt" data-pages="33–40"><p>b</p></section>', worked: '<section class="excerpt" data-pages="26"><p>c</p></section>', extension: "" }] }];
  assert.equal(R.excerptFor(fixture, { phase: 1, chapter: 3, pages: "36" }), "ex-1-3-2");
  assert.equal(R.excerptFor(fixture, { phase: 1, chapter: 3, pages: "26" }), "wk-1-3-1");
  assert.equal(R.excerptFor(fixture, { phase: 1, chapter: 3, pages: "50–51" }), null);
  const state = ready();
  const quiz = E.startFinal(state, bank, rng(23));
  const questions = bank.finals.find(set => set.id === quiz.setId).questions;
  const form = R.form(quiz, questions, "rich", "final", 0);
  assert.equal((form.match(/class="question-prompt"/g) || []).length, 10);
  for (const item of quiz.items) assert.match(form, new RegExp(`aria-labelledby="rich-${item.id}-legend rich-${item.id}-prompt"`));
  assert.doesNotMatch(form, /page-ref|source-reference|PDF|Rever o trecho/);
  finish(quiz, questions);
  const phases = course.phases.map(phase => ({ ...phase, chapters: phase.chapters.map(ch => ({ ...ch, body: `<section class="excerpt" data-pages="${ch.pages}"><p>x</p></section>` })) }));
  const feedback = R.feedback(quiz, questions, E, "rich", { sources, phases });
  assert.equal((feedback.match(/class="source-reference"/g) || []).length, 10);
  for (const q of questions) {
    const segment = feedback.split(`id="review-rich-${q.id}"`)[1].split("</article>")[0];
    assert.ok(segment.includes(`Cap. ${q.source.chapter} — ${R.escape(R.pdfTitle(sources, q.phase, q.source.chapter))} · p. ${q.source.pages}`), q.id);
    assert.match(segment, new RegExp(`data-review-excerpt="ex-${q.phase}-${q.source.chapter}-1"[^>]*>Rever o trecho`));
  }
  assert.match(feedback, /Seu caderno de erros|Agora explique/);
  const plain = R.feedback(quiz, questions, E, "rich");
  assert.equal((plain.match(/class="source-reference"/g) || []).length, 10, "sem contexto continua mostrando a fonte");
});

check("conteúdo completo: trechos, mapas, passo a passo, laboratórios e enunciados", () => {
  const calculation = { 1: [3, 4, 6, 7], 2: [2, 5, 6, 7], 3: [2, 5, 7, 8], 4: [3, 4, 5, 6, 7] };
  for (const phase of course.phases) for (const chapter of phase.chapters) {
    const label = `${phase.id}-${chapter.number}`;
    const excerpts = [...chapter.body.matchAll(/<section class="excerpt" data-pages="/g)].length;
    assert.ok(excerpts >= (chapter.number === 1 ? 2 : 3), `${label}: ${excerpts} trechos citados`);
    const loose = chapter.body.replace(/<section class="excerpt" data-pages="[^"]+">[\s\S]*?<\/section>/g, "").replace(/<div class="lab"[^>]*><\/div>/g, "").trim();
    assert.equal(loose, "", `${label}: conteúdo fora de trecho citado`);
    if (chapter.number >= 2) assert.ok(chapter.map, `${label}: mapa mental`);
    if (calculation[phase.id].includes(chapter.number)) {
      assert.match(htmlFields(chapter), /class="formula"/, `${label}: fórmula destacada`);
      assert.match(htmlFields(chapter), /class="(steps|calc)"/, `${label}: passo a passo`);
    }
  }
  assert.match(course.phases[0].chapters[2].body, /data-lab="bases"/);
  assert.match(course.phases[3].chapters[3].body, /data-lab="surface"/);
  for (const q of all) {
    assert.ok(q.prompt.length >= 120 && q.prompt.length <= 650, `${q.id}: enunciado com ${q.prompt.length} caracteres`);
    assert.ok(R.excerptFor(course.phases, q.source), `${q.id}: páginas ${q.source.pages} fora dos trechos citados`);
  }
});

check("alternativas e gabaritos estáveis para o progresso salvo", () => {
  // Respostas salvas guardam o índice original da alternativa: IDs, alternativas e gabarito não podem mudar sem migração.
  const stable = all.map(q => [q.id, q.options, q.correctIndex]).sort((a, b) => a[0] < b[0] ? -1 : 1);
  assert.equal(createHash("sha256").update(JSON.stringify(stable)).digest("hex"), "41e9c21c4cbb48c158ae48b13b1c52cd919334f364224862306340732553e0b5");
});

check("conversor de bases: passos e resultados", () => {
  const B = require(join(root, "assets/labs/bases.js"));
  const binary = B.convert("45", 10, 2);
  assert.equal(binary.ok, true);
  assert.equal(binary.result, "101101");
  assert.equal(binary.method, "divisions");
  assert.deepEqual(binary.steps.divisions.map(step => [step.dividend, step.quotient, step.remainder]),
    [["45", "22", 1], ["22", "11", 0], ["11", "5", 1], ["5", "2", 1], ["2", "1", 0], ["1", "0", 1]]);
  const grouped = B.convert("101101", 2, 16);
  assert.equal(grouped.result, "2D");
  assert.equal(grouped.method, "grouping");
  assert.deepEqual(grouped.steps.groups.bits, ["0010", "1101"]);
  assert.deepEqual(grouped.steps.groups.digits, ["2", "D"]);
  const expanded = B.convert("2D", 16, 10);
  assert.equal(expanded.result, "45");
  assert.equal(expanded.method, "positional");
  assert.deepEqual(expanded.steps.expansion.map(step => [step.digit, step.position, step.weight, step.product]), [["2", 1, "16", "32"], ["D", 0, "1", "13"]]);
  assert.equal(B.convert("1985", 10, 6).result, "13105");
  assert.equal(B.convert("13105", 6, 10).result, "1985");
  const fraction = B.convert("0,101", 2, 10);
  assert.equal(fraction.result, "0,625");
  assert.deepEqual(fraction.steps.expansion.map(step => step.product), ["0", "0,5", "0", "0,125"]);
  const periodic = B.convert("0,1", 10, 2);
  assert.ok(periodic.result.startsWith("0,0001100110"), periodic.result);
  assert.equal(periodic.periodic, true);
  assert.deepEqual(periodic.steps.multiplications.slice(0, 4).map(step => step.digit), ["0", "0", "0", "1"]);
  assert.equal(periodic.steps.multiplications[5].repeats, 2, "0,2 volta na linha 6: a fração da linha 2 se repete");
  assert.equal(periodic.steps.multiplications[1].repeats, null);
  assert.equal(B.convert("0,625", 10, 2).result, "0,101");
  assert.equal(B.convert("0,625", 10, 2).periodic, false);
  assert.equal(B.convert("3A", 16, 2).result, "111010");
  assert.equal(B.convert("3a", 16, 2).result, "111010");
  assert.equal(B.convert("FF", 16, 8).result, "377");
  assert.equal(B.convert("12,5", 10, 2).result, "1100,1");
  assert.equal(B.convert("1985", 10, 6).check.includes("1985"), true);
  const invalid = B.convert("128", 8, 10);
  assert.equal(invalid.ok, false);
  assert.match(invalid.error, /\b8\b/);
  assert.equal(B.convert("12", 17, 10).ok, false);
  assert.equal(B.convert("", 10, 2).ok, false);
  assert.equal(B.convert("1G", 16, 10).ok, false);
  assert.match(read("index.html"), /assets\/labs\/bases\.js/);
});

check("gradiente: núcleo numérico do laboratório 3D", () => {
  const S = require(join(root, "assets/labs/surface.js"));
  assert.deepEqual(S.functions.himmelblau.grad(-10, 10), [-3794, 3518]);
  assert.equal(S.functions.himmelblau.f(-10, 10), 16690);
  assert.deepEqual(S.functions.bowl.grad(1, 2), [2, 4]);
  assert.deepEqual(S.tangentPlane("bowl", 1, 2), { f0: 5, gx: 2, gy: 4 });
  const run = S.descent("himmelblau", -10, 10, S.functions.himmelblau.eta, 400);
  assert.equal(run.diverged, false);
  const [x, y, value] = run.path.at(-1);
  assert.ok(value < 1e-3, "termina perto de um mínimo");
  assert.ok(S.functions.himmelblau.minima.some(([mx, my]) => Math.hypot(x - mx, y - my) < 0.05), `${x}, ${y}`);
  assert.ok(run.path.length <= 401);
  assert.deepEqual(run.path[0], [-10, 10, 16690]);
  const other = S.descent("himmelblau", -10, 10, 0.003, 400).path.at(-1);
  assert.ok(Math.hypot(other[0] - 3.5844, other[1] + 1.8481) < 0.05, "η maior leva a outro mínimo");
  assert.equal(S.descent("himmelblau", -10, 10, 0.05, 400).diverged, true);
  assert.equal(S.descent("bowl", 3, -2, 0.1, 200).diverged, false);
  assert.match(read("assets/labs/surface.js"), /assets\/vendor\/three\/three\.min\.js/);
  assert.doesNotMatch(read("index.html"), /three\.min\.js/, "three.js carrega só ao abrir o laboratório");
  assert.match(read("index.html"), /assets\/labs\/surface\.js/);
});

check("trilha do semestre consistente", () => {
  const semester = curriculum.semesters[0];
  const roadmap = semester.roadmap;
  assert.ok(roadmap, "semestre sem trilha");
  const lanes = roadmap.lanes.map(lane => lane.id);
  assert.deepEqual(lanes, ["projeto", "logic", "code", "system", "math", "energy"]);
  const keys = course.phases.flatMap(phase => phase.chapters.map(ch => `${phase.id}-${ch.number}`));
  assert.deepEqual(Object.keys(roadmap.chapterLane).sort(), [...keys].sort());
  for (const [key, lane] of Object.entries(roadmap.chapterLane)) {
    assert.ok(lanes.includes(lane), key);
    if (key.endsWith("-1")) assert.equal(lane, "projeto", key);
  }
  assert.ok(roadmap.edges.length >= 18);
  const seen = new Set(), linked = new Set();
  for (const [from, to, label] of roadmap.edges) {
    assert.ok(keys.includes(from) && keys.includes(to), `${from} → ${to}`);
    assert.ok(Number(from.split("-")[0]) < Number(to.split("-")[0]), `${from} → ${to}: a trilha avança de fase`);
    assert.ok(label && label.length <= 60, `${from} → ${to}: rótulo`);
    assert.ok(!seen.has(from + ">" + to), "aresta repetida");
    seen.add(from + ">" + to); linked.add(from); linked.add(to);
  }
  assert.deepEqual(keys.filter(key => !linked.has(key)), [], "capítulos fora da trilha");
  const markup = R.roadmap(semester, { "p1-c3": { read: true, score: 7.5 }, "p2-c2": { read: false, score: null } });
  assert.equal((markup.match(/class="rm-node[^"]*"[^>]*data-open-chapter=/g) || []).length, 32);
  assert.match(markup, /data-node="1-3"[\s\S]*?Lido · prática 7,5/);
  assert.match(markup, /data-node="2-2"[\s\S]*?Não lido/);
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, target] of markup.matchAll(/aria-describedby="([^"]+)"/g)) assert.ok(ids.includes(target), target);
  assert.match(read("index.html"), /<details id="semester-map" class="semester-map">/);
  assert.match(read("assets/styles.css"), /@container roadmap \(max-width:\s*56rem\)/);
  assert.match(read("assets/maps.js"), /drawRoadmap/);
});

check("menu lateral retrátil, persistente e acessível", () => {
  assert.equal(E.freshState().sidebar, "expanded");
  const collapsed = { ...ready(), sidebar: "collapsed" };
  assert.equal(E.restore(JSON.stringify(collapsed), bank).sidebar, "collapsed");
  assert.equal(E.restore(JSON.stringify({ ...ready(), sidebar: "x" }), bank).sidebar, "expanded");
  const legacy = ready();
  delete legacy.sidebar;
  const quiz = E.startMini(legacy, 1, bank, rng(4));
  E.answer(quiz, quiz.items[0].id, 2);
  const restored = E.restore(JSON.stringify(legacy), bank);
  assert.equal(restored.sidebar, "expanded");
  assert.equal(restored.minis[1].answers[quiz.items[0].id], 2);
  const index = read("index.html"), app = read("assets/app.js"), styles = read("assets/styles.css");
  assert.match(index, /id="library-sidebar"/);
  assert.match(index, /id="sidebar-toggle"[^>]*aria-controls="library-sidebar"/);
  assert.match(index, /id="sidebar-toggle"[^>]*aria-expanded="true"/);
  assert.match(index, /id="sidebar-toggle"[^>]*aria-keyshortcuts="Control\+B Meta\+B"/);
  assert.match(index, /id="sidebar-close"[^>]*aria-controls="library-sidebar"/);
  assert.match(index, /id="sidebar-backdrop"/);
  assert.doesNotMatch(index, /id="library-menu"/);
  assert.match(app, /event\.ctrlKey\s*\|\|\s*event\.metaKey/);
  assert.match(app, /toLowerCase\(\)\s*===\s*'b'/);
  assert.match(app, /closest\('input, select, textarea/);
  assert.match(app, /\.inert\s*=/);
  assert.match(app, /'Escape'/);
  assert.match(styles, /transition:[^;}]*grid-template-columns/);
  assert.match(styles, /\.library-layout\[data-sidebar="collapsed"\]/);
  assert.match(styles, /\.drawer-open\s+\.library-sidebar/);
  assert.match(styles, /container-type:\s*inline-size/);
});

check("bibliotecas de terceiros fixadas por hash", () => {
  assert.equal(vendor.length, 24, "GSAP, KaTeX (js, css e 20 fontes) e three.js");
  assert.deepEqual([...new Set(vendor.map(item => item.library))].sort(), ["GSAP", "KaTeX", "three.js"]);
  const licenses = existsSync(join(root, "assets/vendor/LICENSES.md")) ? read("assets/vendor/LICENSES.md") : "";
  for (const item of vendor) {
    assert.match(item.path, /^assets\/vendor\/[\w.\/-]+$/, item.path);
    assert.ok(runtimeFiles.includes(item.path), item.path + ": fora da lista de runtime");
    assert.ok(existsSync(join(root, item.path)), item.path);
    const hash = createHash("sha256").update(readFileSync(join(root, item.path))).digest("hex");
    assert.equal(hash, item.sha256, item.path + ": hash divergente do manifesto");
    assert.ok(licenses.includes(item.library) && licenses.includes(item.version), item.library + " sem licença registrada");
  }
  for (const file of runtimeFiles.filter(file => file.startsWith("assets/vendor/"))) {
    assert.ok(vendor.some(item => item.path === file), file + ": arquivo de terceiros sem hash");
  }
  assert.ok(projectFiles.includes("assets/vendor/LICENSES.md"));
});

console.log("\n" + groups.length + " grupos aprovados. Validação lógica/estrutural; não substitui inspeção visual e interação em navegador.");
