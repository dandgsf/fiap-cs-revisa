"use strict";
(function () {
  const definitions = {
    1: [["fundamentos", "Fundamentos", [2, 3]], ["programacao", "Programação e lógica", [4, 5]], ["ia", "Inteligência artificial", [6]], ["energia", "Energia e sociedade", [7, 8]], ["projeto", "Contexto do projeto", [1]]],
    2: [["logica", "Lógica digital", [2]], ["programacao", "Programação e estruturas", [3, 4, 5]], ["matematica", "Matemática", [6]], ["sistemas", "Arquitetura", [7]], ["sociedade", "Sustentabilidade e sociedade", [8]], ["projeto", "Contexto do projeto", [1]]],
    3: [["logica", "Lógica digital", [2]], ["programacao", "Programação e estruturas", [3, 4]], ["matematica", "Matemática e dados", [5, 7]], ["sistemas", "Sistemas computacionais", [6]], ["energia", "Energia", [8]], ["projeto", "Contexto do projeto", [1]]],
    4: [["programacao", "Dados e estruturas", [2, 3]], ["matematica", "Cálculo e modelos", [4, 5, 6]], ["energia", "Energia e sustentabilidade", [7, 8]], ["projeto", "Contexto do projeto", [1]]]
  };
  const labels = ["Fundamentos da computação", "Lógica e estruturas", "Dados e sistemas", "Modelos e energia"];
  for (const phase of globalThis.FIAPCourse.phases) {
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
