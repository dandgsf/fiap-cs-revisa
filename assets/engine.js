(function (root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  else root.FIAPEngine = engine;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const STORAGE_KEY = "fiap.csRevisa.semestre-1.v1";
  const LEGACY_STORAGE_KEY = "fiap.firstSemesterExam.v2";
  const storageKey = semester => `fiap.csRevisa.${semester}.v1`;
  const REQUIRED_MS = 10 * 60 * 1000;
  const IDLE_MS = 90 * 1000;
  const MAX_ATTEMPTS = 3;
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const permutation = (items, count) => Array.isArray(items) && items.length === count &&
    new Set(items).size === count && items.every(i => Number.isInteger(i) && i >= 0 && i < count);

  function freshState(bank) {
    const phaseIds = bank ? Object.keys(bank.minis).map(Number) : [1, 2, 3, 4];
    const size = Math.max(0, ...phaseIds);
    return { version: 2, theme: "dark", sidebar: "expanded", activeTab: `phase-${phaseIds[0] || 1}`, studyMs: Array(size).fill(0),
      attempts: [], minis: {}, practices: {}, readChapters: {}, checks: {}, updatedAt: 0 };
  }

  function shuffle(items, random = Math.random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }

  function makeQuiz(questions, setId, random) {
    return { setId, items: shuffle(questions, random).map(q => ({ id: q.id,
      optionOrder: shuffle([0, 1, 2, 3, 4], random) })), answers: {}, submitted: false };
  }

  function complete(quiz) {
    return quiz.items.every(item => own(quiz.answers, item.id) &&
      Number.isInteger(quiz.answers[item.id]) && quiz.answers[item.id] >= 0 && quiz.answers[item.id] < 5);
  }

  function unlocked(state, bank) {
    return (bank?.reviewPhases || [1, 2]).every(id => state.studyMs[id - 1] >= REQUIRED_MS);
  }

  function creditStudy(state, phase, delta, { visible, focused, idleFor, reviewing = true }) {
    if (!Number.isInteger(phase) || phase < 1 || phase > state.studyMs.length || !visible || !focused || !reviewing ||
        !Number.isFinite(delta) || delta <= 0 || delta > 5000 ||
        !Number.isFinite(idleFor) || idleFor < 0 || idleFor >= IDLE_MS) return 0;
    const credit = Math.min(delta, IDLE_MS - idleFor);
    state.studyMs[phase - 1] = Math.min(24 * 60 * 60 * 1000, state.studyMs[phase - 1] + credit);
    return credit;
  }

  function startFinal(state, bank, random = Math.random) {
    if (!unlocked(state, bank)) throw new Error("REVIEW_REQUIRED");
    if (state.attempts.length >= MAX_ATTEMPTS) throw new Error("ATTEMPT_LIMIT");
    if (state.attempts.length && !state.attempts.at(-1).submitted) throw new Error("ATTEMPT_IN_PROGRESS");
    const unused = bank.finals.filter(set => !state.attempts.some(quiz => quiz.setId === set.id));
    const set = shuffle(unused, random)[0];
    if (!set) throw new Error("NO_QUESTIONS");
    const quiz = makeQuiz(set.questions, set.id, random);
    state.attempts.push(quiz);
    return quiz;
  }

  function startMini(state, phase, bank, random = Math.random) {
    const questions = bank.minis[phase];
    if (!questions) throw new Error("INVALID_PHASE");
    const quiz = makeQuiz(questions, `mini-${phase}`, random);
    state.minis[phase] = quiz;
    return quiz;
  }

  function startPractice(state, chapter, bank, random = Math.random) {
    const questions = bank.chapters?.[chapter];
    if (!questions?.length) throw new Error("INVALID_CHAPTER");
    const quiz = makeQuiz(questions, `chapter-${chapter}`, random);
    state.practices[chapter] = quiz;
    return quiz;
  }

  function answer(quiz, id, originalIndex) {
    if (quiz.submitted || !quiz.items.some(item => item.id === id) ||
        !Number.isInteger(originalIndex) || originalIndex < 0 || originalIndex > 4) return false;
    quiz.answers[id] = originalIndex;
    return true;
  }

  function submit(quiz) {
    if (!complete(quiz)) throw new Error("INCOMPLETE");
    quiz.submitted = true;
  }

  function grade(quiz, questions) {
    if (!quiz.submitted || !complete(quiz)) throw new Error("NOT_SUBMITTED");
    const byId = new Map(questions.map(question => [question.id, question]));
    const competencies = {};
    const details = quiz.items.map(item => {
      const question = byId.get(item.id);
      if (!question) throw new Error("UNKNOWN_QUESTION");
      const selected = quiz.answers[item.id];
      const correct = selected === question.correctIndex;
      const group = competencies[question.competency] ||= { correct: 0, total: 0 };
      group.total++;
      if (correct) group.correct++;
      return { question, selected, correct, optionOrder: item.optionOrder };
    });
    const correct = details.filter(item => item.correct).length;
    return { correct, total: details.length, score: correct * 10 / details.length, competencies, details };
  }

  function cleanQuiz(value, questions, setId) {
    if (!value || value.setId !== setId || !Array.isArray(value.items) || value.items.length !== questions.length) return null;
    const expected = new Set(questions.map(q => q.id));
    if (new Set(value.items.map(item => item?.id)).size !== questions.length ||
        value.items.some(item => !item || !expected.has(item.id) || !permutation(item.optionOrder, 5))) return null;
    const quiz = { setId, items: value.items.map(item => ({ id: item.id, optionOrder: [...item.optionOrder] })), answers: {}, submitted: false };
    for (const item of quiz.items) {
      const selected = value.answers?.[item.id];
      if (Number.isInteger(selected) && selected >= 0 && selected < 5) quiz.answers[item.id] = selected;
    }
    quiz.submitted = value.submitted === true && complete(quiz);
    return quiz;
  }

  function restore(raw, bank) {
    const result = freshState(bank);
    let value;
    try { value = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return result; }
    if (!value || value.version !== 2) return result;
    if (value.theme === "light") result.theme = "light";
    if (value.sidebar === "collapsed") result.sidebar = "collapsed";
    if ([...Object.keys(bank.minis).map(id => `phase-${id}`), "final"].includes(value.activeTab)) result.activeTab = value.activeTab;
    result.studyMs = result.studyMs.map((_, index) => {
      const time = value.studyMs?.[index];
      return Number.isFinite(time) && time >= 0 ? Math.min(time, 86400000) : 0;
    });
    if (Array.isArray(value.attempts)) {
      for (const candidate of value.attempts.slice(0, MAX_ATTEMPTS)) {
        const set = bank.finals.find(item => item.id === candidate?.setId);
        if (!set || result.attempts.some(item => item.setId === set.id)) break;
        const quiz = cleanQuiz(candidate, set.questions, set.id);
        if (!quiz) break;
        result.attempts.push(quiz);
        if (!quiz.submitted) break;
      }
    }
    for (const phase of Object.keys(bank.minis)) {
      const quiz = cleanQuiz(value.minis?.[phase], bank.minis[phase], `mini-${phase}`);
      if (quiz) result.minis[phase] = quiz;
    }
    for (const [key, questions] of Object.entries(bank.chapters || {})) {
      const quiz = cleanQuiz(value.practices?.[key], questions, `chapter-${key}`);
      if (quiz) result.practices[key] = quiz;
    }
    for (const key of bank.chapterIds || Object.keys(bank.chapters || {})) {
      if (value.readChapters?.[key] === true) result.readChapters[key] = true;
    }
    if (value.checks && typeof value.checks === "object") {
      for (const [key, checked] of Object.entries(value.checks)) {
        if (/^p\d+-[0-7]$/.test(key) && own(bank.minis, Number(key.split('-')[0].slice(1)))) result.checks[key] = checked === true;
      }
    }
    if (Number.isFinite(value.updatedAt)) result.updatedAt = value.updatedAt;
    return result;
  }

  return Object.freeze({ STORAGE_KEY, LEGACY_STORAGE_KEY, storageKey, REQUIRED_MS, IDLE_MS, MAX_ATTEMPTS, freshState, shuffle,
    makeQuiz, complete, unlocked, creditStudy, startFinal, startMini, startPractice, answer, submit, grade, restore });
});
