(function (root, factory) {
  const maps = factory();
  if (typeof module === "object" && module.exports) module.exports = maps;
  else root.FIAPMaps = maps;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const motion = () => globalThis.FIAPMotion || { reduced: () => true, reveal: () => null };

  function setOpen(button, open, animate = true) {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(open));
    if (!target) return;
    const gsap = globalThis.gsap;
    if (!animate || motion().reduced()) { target.hidden = !open; return; }
    gsap.killTweensOf(target);
    if (open) {
      target.hidden = false;
      gsap.fromTo(target, { height: 0, autoAlpha: 0, overflow: "hidden" },
        { height: "auto", autoAlpha: 1, duration: 0.28, ease: "power3.out", clearProps: "height,opacity,visibility,overflow" });
    } else {
      gsap.to(target, { height: 0, autoAlpha: 0, overflow: "hidden", duration: 0.18, ease: "power2.in",
        onComplete: () => { target.hidden = true; gsap.set(target, { clearProps: "height,opacity,visibility,overflow" }); } });
    }
  }

  function toggleDetails(figure, button) {
    const open = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(open));
    button.textContent = open ? "Ocultar os detalhes" : "Mostrar os detalhes";
    for (const leaf of figure.querySelectorAll(".mm-node.has-note")) setOpen(leaf, open, false);
  }

  function enhance(root) {
    if (!root) return;
    for (const figure of root.querySelectorAll("[data-mindmap]:not([data-enhanced])")) {
      figure.dataset.enhanced = "true";
      figure.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button || !figure.contains(button)) return;
        if (button.hasAttribute("data-mm-all")) toggleDetails(figure, button);
        else if (button.classList.contains("mm-node")) setOpen(button, button.getAttribute("aria-expanded") !== "true");
      });
      if (motion().reduced() || typeof IntersectionObserver !== "function") continue;
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        motion().reveal(figure.querySelectorAll(".mm-root, .mm-node"));
      }, { threshold: 0.15 });
      observer.observe(figure);
    }
  }

  return Object.freeze({ enhance });
});
