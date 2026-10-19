(function (root, factory) {
  const motion = factory();
  if (typeof module === "object" && module.exports) module.exports = motion;
  else root.FIAPMotion = motion;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  // Movimento explica estado e relação. Com movimento reduzido (ou sem GSAP), o estado final aparece direto.
  const query = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  const reduced = () => !globalThis.gsap || Boolean(query && query.matches);

  function reveal(targets, vars = {}) {
    if (reduced()) return null;
    return globalThis.gsap.from(targets, { autoAlpha: 0, x: -10, duration: 0.42, ease: "power3.out",
      stagger: { each: 0.022, from: "start" }, clearProps: "transform,opacity,visibility", ...vars });
  }

  // Destaca o trecho de destino ao voltar da correção; só cor, então vale também com movimento reduzido.
  function flash(element) {
    if (!element) return null;
    if (!globalThis.gsap) { element.style.setProperty("--flash", "0"); return null; }
    return globalThis.gsap.fromTo(element, { "--flash": 1 }, { "--flash": 0, duration: reduced() ? 0.9 : 1.8, ease: "power2.out", delay: 0.15 });
  }

  return Object.freeze({ reduced, reveal, flash });
});
