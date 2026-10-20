"use strict";
// Trilha do semestre: cada capítulo numa faixa de assunto e as dependências entre fases.
// As faixas seguem as competências das questões; os capítulos 1 de cada fase formam o contexto do projeto.
globalThis.FIAPRoadmap = {
  lanes: [
    { id: "projeto", title: "Contexto do projeto" },
    { id: "logic", title: "Fundamentos e lógica" },
    { id: "code", title: "Programação e algoritmos" },
    { id: "system", title: "Estruturas e sistemas" },
    { id: "math", title: "Matemática, dados e IA" },
    { id: "energy", title: "Energia, sustentabilidade e sociedade" }
  ],
  chapterLane: {
    "1-1": "projeto", "1-2": "logic", "1-3": "logic", "1-4": "code", "1-5": "code", "1-6": "math", "1-7": "energy", "1-8": "energy",
    "2-1": "projeto", "2-2": "logic", "2-3": "code", "2-4": "system", "2-5": "code", "2-6": "math", "2-7": "system", "2-8": "energy",
    "3-1": "projeto", "3-2": "logic", "3-3": "code", "3-4": "system", "3-5": "math", "3-6": "system", "3-7": "math", "3-8": "energy",
    "4-1": "projeto", "4-2": "code", "4-3": "system", "4-4": "math", "4-5": "math", "4-6": "math", "4-7": "energy", "4-8": "energy"
  },
  edges: [
    ["1-1", "2-1", "A missão Aurora segue para a aproximação"],
    ["2-1", "3-1", "Da descida aos sistemas da colônia"],
    ["3-1", "4-1", "A colônia integra energia e decisões"],
    ["1-3", "2-2", "Bits e bases viram sinais lógicos"],
    ["2-2", "3-2", "Tabelas-verdade viram expressões simplificáveis"],
    ["1-4", "2-3", "Operadores e teste de mesa dentro dos laços"],
    ["1-5", "2-3", "Condições controlam a repetição"],
    ["2-3", "3-3", "Laços organizados em funções"],
    ["3-3", "4-2", "Funções e escopo ao manipular coleções"],
    ["2-4", "3-4", "Estruturas lineares antes das árvores"],
    ["3-4", "4-2", "Chaves e hash nos dicionários"],
    ["3-4", "4-3", "Árvores são grafos sem ciclos"],
    ["2-5", "4-3", "Busca e custo levam aos percursos"],
    ["1-2", "2-7", "Gerações de computadores e arquitetura"],
    ["2-7", "3-6", "Hardware que o sistema operacional gerencia"],
    ["2-6", "3-7", "Função afim vira modelo de regressão"],
    ["2-6", "4-4", "Funções antes de limites e derivadas"],
    ["1-6", "3-7", "Aprendizado supervisionado: regressão"],
    ["1-6", "4-6", "Classificação e métricas de erro"],
    ["3-5", "4-5", "Matrizes: o modelo Xβ"],
    ["3-7", "4-5", "Da regressão simples à múltipla"],
    ["3-7", "4-6", "Da regressão linear à logística"],
    ["1-7", "3-8", "Potência e energia nas renováveis"],
    ["1-7", "4-7", "kWh, rendimento e autonomia"],
    ["3-8", "4-7", "Geração variável pede armazenamento"],
    ["1-8", "2-8", "Responsabilidade social chega ao ESG"],
    ["2-8", "4-8", "Gestão ambiental e ciclo de vida"]
  ]
};
