(function (root, factory) {
  const render = factory();
  if (typeof module === "object" && module.exports) module.exports = render;
  else root.FIAPRender = render;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const clock = ms => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };
  const source = value => `Fase ${value.phase} · Capítulo ${value.chapter} · p. ${value.pages}`;
  const chapterId = (phase, chapter) => `phase-${phase}-chapter-${chapter}`;
  const arrow = '<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

  const priorityLabels = { core: "Essencial", support: "Complementar", context: "Contexto do projeto" };
  function phase(phase) {
    const chapters = phase.subjects.flatMap(subject => subject.chapters);
    return `<section id="panel-phase-${phase.id}" class="tabpanel phase-panel" role="tabpanel" aria-labelledby="tab-phase-${phase.id}" tabindex="0" hidden>
      <header class="phase-heading"><h2>${escape(phase.shortTitle)}</h2><p>${escape(phase.summary)}</p></header>
      <div class="chapter-filters"><label>Assunto<select data-subject-filter="${phase.id}"><option value="all">Todos os assuntos</option>${phase.subjects.map(s => `<option value="${s.id}">${escape(s.title)}</option>`).join("")}</select></label><label>Capítulo<select data-chapter-filter="${phase.id}"><option value="overview">Visão geral da fase</option>${chapters.map(ch => `<option value="${ch.number}">${ch.number}. ${escape(ch.title)}</option>`).join("")}</select></label></div>
      <div class="phase-overview" data-overview="${phase.id}">
        <div class="phase-orientation"><div><h3>O que você vai praticar</h3><ul>${phase.outcomes.map(item => `<li>${escape(item)}</li>`).join("")}</ul></div></div>
        <div class="chapter-list">${chapters.map(ch => `<a href="#phase-${phase.id}-chapter-${ch.number}" data-open-phase="${phase.id}" data-open-chapter="${ch.number}" class="chapter-row" data-subject="${ch.subjectId}"><span class="chapter-order">${String(ch.number).padStart(2,"0")}</span><div><strong>${escape(ch.title)}</strong><span>${escape(ch.focus)}</span></div><span class="chapter-row-meta">${priorityLabels[ch.priority]}<span class="reading-duration">${ch.minutes} min</span></span><span class="row-arrow">${arrow}</span></a>`).join("")}</div>
        <details class="phase-extras"><summary>Relembrar termos e conferir o que aprendeu</summary><div class="memory-grid">${phase.memory.map(([term, meaning, ch]) => `<details><summary>${escape(term)}</summary><p>${escape(meaning)}</p><a href="#phase-${phase.id}-chapter-${ch}" data-open-phase="${phase.id}" data-open-chapter="${ch}">Rever capítulo ${ch}</a></details>`).join("")}</div><h3>Consigo explicar sem consultar?</h3><div class="check-grid">${phase.checklist.map((item,i) => `<label><input type="checkbox" data-check="p${phase.id}-${i}"><span>${escape(item)}</span></label>`).join("")}</div></details>
        <div class="phase-practice-link"><h3>Conecte os assuntos desta fase.</h3><p>O mini simulado mistura cinco decisões. A correção aparece depois de todas as respostas.</p><button class="button button-secondary" data-open-mini="${phase.id}" type="button">Praticar a fase</button></div>
      </div>
      <div class="chapter-body">${chapters.map((ch, index) => {
        const key = `p${phase.id}-c${ch.number}`;
        const next = chapters[index+1];
        return `<article class="lesson" id="${chapterId(phase.id,ch.number)}" aria-labelledby="heading-${phase.id}-${ch.number}" data-chapter="${ch.number}" hidden>
          <div class="lesson-meta"><span class="priority-label">${priorityLabels[ch.priority]}</span><span>${ch.minutes} min de leitura estimada</span><span data-read-status="${key}">Não marcado como lido</span></div>
          <h3 id="heading-${phase.id}-${ch.number}" tabindex="-1">${escape(ch.title)}</h3>
          <p class="lesson-source">Fase ${phase.id} · Capítulo ${ch.number} · PDF, p. ${escape(ch.pages)}</p>
          <div class="learning-focus"><strong>Ao revisar, concentre-se em:</strong><p>${escape(ch.focus)}</p></div>
          ${ch.priority === 'context' ? `<p>${escape(ch.priorityReason)}</p><details class="extension"><summary>Ler o contexto completo do projeto</summary>${ch.body}</details>` : ch.body}
          <section class="worked-example"><h4>Reconstrua o raciocínio</h4>${ch.worked}</section>
          <p class="pitfall"><strong>Cuidado com esta confusão.</strong> ${escape(ch.pitfall)}</p>
          ${ch.extension ? `<details class="extension"><summary>${escape(ch.extensionTitle || 'Aprofundar e consultar ferramentas')}</summary>${ch.extension}</details>` : ""}
          <div class="retrieval"><h4>Explique antes de abrir</h4>${ch.recall.map(item=>`<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join("")}</div>
          <div class="lesson-completion"><label><input type="checkbox" data-read="${key}"><span>Revisei e consigo explicar o raciocínio</span></label><p>Uma marcação de leitura, não uma comprovação de domínio.</p></div>
          <section class="chapter-practice" aria-labelledby="practice-title-${key}"><h4 id="practice-title-${key}">Agora, teste sua compreensão.</h4><p data-practice-description="${key}"></p><button type="button" class="button button-primary" data-practice="${key}">Praticar este capítulo</button><div id="practice-${key}"></div></section>
          <nav class="lesson-navigation" aria-label="Continuar a revisão"><button class="text-button" data-overview-link="${phase.id}" type="button">Voltar aos assuntos</button>${next ? `<a class="text-button" href="#phase-${phase.id}-chapter-${next.number}" data-open-phase="${phase.id}" data-open-chapter="${next.number}">Próximo: ${escape(next.title)} ${arrow}</a>` : `<button class="text-button" data-open-mini="${phase.id}" type="button">Praticar a fase ${arrow}</button>`}</nav>
        </article>`;
      }).join("")}</div>
      <section class="phase-mini" id="mini-${phase.id}" hidden><h3 id="mini-title-${phase.id}" tabindex="-1">Mini simulado da fase ${phase.id}</h3><p>Cinco questões. Responda todas antes de ver as justificativas. Você pode refazer sem consumir tentativas finais.</p><div id="mini-quiz-${phase.id}"></div><button class="button button-secondary mini-reset" type="button" data-mini-reset="${phase.id}" hidden>Refazer mini simulado</button></section>
      <div class="study-clock"><span>Revisão ativa nesta fase <strong data-time="${phase.id}">00:00</strong></span><span data-time-status="${phase.id}"></span></div>
    </section>`;
  }

  function form(quiz, questions, key, kind, reference) {
    if (quiz.submitted) return "";
    const byId = new Map(questions.map(question => [question.id, question]));
    const answered = Object.keys(quiz.answers).length;
    return `<form id="form-${key}" data-quiz="${kind}" data-reference="${reference}" novalidate>
      <p class="answer-count" id="count-${key}" aria-live="polite">${answered} de ${quiz.items.length} respondidas</p>
      <div class="question-list">${quiz.items.map((item, index) => {
        const question = byId.get(item.id);
        return `<fieldset class="question" id="${key}-${item.id}"><legend><span class="question-number">${index + 1} / ${quiz.items.length}</span><span class="question-meta">Fase ${question.phase} · ${escape(question.competency)} · ${escape(question.level)}</span><strong>${escape(question.prompt)}</strong></legend>
          <div class="options">${item.optionOrder.map((originalIndex, visibleIndex) => `<label class="option"><input type="radio" name="${key}-${item.id}" data-question="${item.id}" value="${originalIndex}" ${quiz.answers[item.id] === originalIndex ? "checked" : ""}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + visibleIndex)}</span><span>${escape(question.options[originalIndex])}</span></label>`).join("")}</div></fieldset>`;
      }).join("")}</div>
      <p class="quiz-status" id="status-${key}" role="alert" hidden></p>
      <div class="exam-actions"><button class="button button-primary" type="submit">Enviar ${quiz.items.length} respostas</button><span>A correção aparece somente após responder todas.</span></div>
    </form>`;
  }

  function feedback(quiz, questions, engine, key) {
    if (!quiz.submitted) return "";
    const result = engine.grade(quiz, questions);
    const missed = result.details.filter(item => !item.correct);
    return `<section class="quiz-result" aria-labelledby="result-${key}"><div class="result-summary"><div class="score-number"><strong>${Number(result.score.toFixed(1)).toLocaleString("pt-BR")}</strong><span>/ 10</span></div><div><h3 id="result-${key}" tabindex="-1">${result.correct} de ${result.total} respostas corretas</h3><p>${missed.length ? "Use os erros como roteiro: releia a explicação, refaça o raciocínio e volte ao capítulo indicado." : "Agora explique por que as outras alternativas estão incorretas. Isso ajuda a consolidar o raciocínio."}</p></div></div>
      <div class="competency-breakdown"><h4>Acertos por competência nesta tentativa</h4><ul>${Object.entries(result.competencies).map(([name, group]) => `<li><span>${escape(name)}</span><strong>${group.correct} / ${group.total}</strong></li>`).join("")}</ul></div>
      ${missed.length ? `<nav class="error-notebook" aria-label="Questões para revisar"><h4>Seu caderno de erros</h4><ul>${missed.map(item => `<li><a href="#review-${key}-${item.question.id}">${escape(item.question.competency)} · questão ${quiz.items.findIndex(q => q.id === item.question.id) + 1}</a></li>`).join("")}</ul></nav>` : ""}
      <div class="answer-review">${result.details.map((item, index) => {
        const { question, selected, correct, optionOrder } = item;
        const letter = String.fromCharCode(65 + optionOrder.indexOf(question.correctIndex));
        return `<article class="review-item ${correct ? "is-correct" : "is-wrong"}" id="review-${key}-${question.id}"><p class="review-verdict">Questão ${index + 1} · ${correct ? "Acerto" : "Revisar: resposta incorreta"}</p><h4>${escape(question.prompt)}</h4><p><strong>Alternativa correta: ${letter}.</strong> ${escape(question.explanation)}</p><ul class="review-options">${optionOrder.map((originalIndex, visibleIndex) => {
          const isCorrect = originalIndex === question.correctIndex;
          const chosen = originalIndex === selected;
          return `<li class="${isCorrect ? "correct-option" : chosen ? "chosen-wrong" : "other-option"}"><strong>${String.fromCharCode(65 + visibleIndex)}. ${escape(question.options[originalIndex])}</strong><span class="option-verdict">${isCorrect ? chosen ? "Sua resposta · correta" : "Alternativa correta" : chosen ? "Sua resposta · incorreta" : "Alternativa incorreta"}</span><p>${escape(question.rationales[originalIndex])}</p></li>`;
        }).join("")}</ul><p class="source-reference">Fonte: ${escape(source(question.source))}. <a href="#${chapterId(question.phase, question.source.chapter)}" data-review-phase="${question.phase}" data-review-chapter="${question.source.chapter}">Rever o capítulo</a></p></article>`;
      }).join("")}</div></section>`;
  }

  return Object.freeze({ escape, clock, source, chapterId, phase, form, feedback });
});
