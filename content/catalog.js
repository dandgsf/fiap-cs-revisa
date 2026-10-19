"use strict";
(function () {
  const definitions = {
    1: [["fundamentos", "Fundamentos", [2, 3]], ["programacao", "Programação e lógica", [4, 5]], ["ia", "Inteligência artificial", [6]], ["energia", "Energia e sociedade", [7, 8]], ["projeto", "Contexto do projeto", [1]]],
    2: [["logica", "Lógica digital", [2]], ["programacao", "Programação e estruturas", [3, 4, 5]], ["matematica", "Matemática", [6]], ["sistemas", "Arquitetura", [7]], ["sociedade", "Sustentabilidade e sociedade", [8]], ["projeto", "Contexto do projeto", [1]]],
    3: [["logica", "Lógica digital", [2]], ["programacao", "Programação e estruturas", [3, 4]], ["matematica", "Matemática e dados", [5, 7]], ["sistemas", "Sistemas computacionais", [6]], ["energia", "Energia", [8]], ["projeto", "Contexto do projeto", [1]]],
    4: [["programacao", "Dados e estruturas", [2, 3]], ["matematica", "Cálculo e modelos", [4, 5, 6]], ["energia", "Energia e sustentabilidade", [7, 8]], ["projeto", "Contexto do projeto", [1]]]
  };
  const labels = ["Fundamentos da computação", "Lógica e estruturas", "Dados e sistemas", "Modelos e energia"];
  const supporting = ["1-2", "2-8"];
  const reasons = {
    context: "Enunciado integrador: entenda o cenário e volte a ele quando precisar aplicar os conceitos.",
    support: "Consolide conceitos e relações. Nomes, datas e detalhes ficam disponíveis para consulta.",
    core: "Conceitos transferíveis e operações que permitem resolver situações novas. Prioridade pedagógica, sem estimativa de incidência na prova."
  };
  for (const phase of globalThis.FIAPCourse.phases) {
    for (const ch of phase.chapters) {
      ch.priority = ch.number === 1 ? "context" : supporting.includes(`${phase.id}-${ch.number}`) ? "support" : "core";
      ch.priorityReason = reasons[ch.priority];
      ch.minutes = Math.max(4, Math.ceil((ch.body + ch.worked).replace(/<[^>]+>/g, " ").split(/\s+/).length / 170));
    }
    phase.shortTitle = labels[phase.id - 1];
    phase.subjects = definitions[phase.id].map(([id, title, numbers]) => ({ id, title,
      chapters: numbers.map(number => phase.chapters.find(ch => ch.number === number)) }));
    for (const subject of phase.subjects) for (const ch of subject.chapters) ch.subjectId = subject.id;
  }
  globalThis.FIAPCurriculum = {
    name: "FIAP CS Revisa", slug: "fiap-cs-revisa", version: "1.0.0",
    semesters: [{ id: "semestre-1", number: 1, title: "1º semestre", status: "available",
      phases: globalThis.FIAPCourse.phases, bank: globalThis.FIAPBank, sources: globalThis.FIAPSources,
      reviewPhases: [1, 2] },
    { id: "semestre-2", number: 2, title: "2º semestre", status: "planned", phases: [], sources: [],
      bank: { minis: {}, finals: [], chapters: {} }, reviewPhases: [] }]
  };
})();
