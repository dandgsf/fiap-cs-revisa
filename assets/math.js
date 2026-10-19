(function (root, factory) {
  const math = factory();
  if (typeof module === "object" && module.exports) module.exports = math;
  else root.FIAPMath = math;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  // Fórmulas são escritas em TeX dentro de .tex (no texto) e .tex-block (destacadas).
  // Sem KaTeX disponível, o TeX continua visível como texto.
  function renderIn(root) {
    const katex = globalThis.katex;
    if (!katex || !root) return 0;
    let count = 0;
    for (const element of root.querySelectorAll(".tex:not([data-rendered]), .tex-block:not([data-rendered])")) {
      const tex = element.textContent;
      try {
        katex.render(tex, element, { displayMode: element.classList.contains("tex-block"), throwOnError: false, output: "htmlAndMathml", strict: "ignore" });
        element.dataset.rendered = "true";
        element.dataset.tex = tex;
        count++;
      } catch {
        element.dataset.rendered = "error";
      }
    }
    return count;
  }
  return Object.freeze({ renderIn });
});
