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

  // Trilha: curvas entre capítulos medidas no layout real; foco ou hover destaca pré-requisitos e dependentes.
  function drawRoadmap(root) {
    const map = root && root.querySelector("[data-roadmap]");
    if (!map || map.dataset.wired) return;
    map.dataset.wired = "true";
    const grid = map.querySelector(".rm-grid"), svg = map.querySelector(".rm-edges");
    const nodes = new Map([...map.querySelectorAll("[data-node]")].map(node => [node.dataset.node, node]));
    const edges = [...nodes.values()].flatMap(node => (node.dataset.to || "").split(" ").filter(Boolean).map(to => [node.dataset.node, to]));
    const ns = "http://www.w3.org/2000/svg";
    let animated = false;
    const draw = () => {
      if (!grid.offsetWidth || getComputedStyle(svg).display === "none") { svg.replaceChildren(); return; }
      const box = grid.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const shapes = edges.flatMap(([from, to]) => {
        const a = nodes.get(from).getBoundingClientRect(), b = nodes.get(to).getBoundingClientRect();
        const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top, x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
        const dx = Math.max(28, (x2 - x1) / 2), lane = nodes.get(from).style.getPropertyValue("--lane");
        const path = document.createElementNS(ns, "path"), dot = document.createElementNS(ns, "circle");
        path.setAttribute("d", `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`);
        dot.setAttribute("cx", x2); dot.setAttribute("cy", y2); dot.setAttribute("r", "2.5");
        for (const shape of [path, dot]) { shape.dataset.from = from; shape.dataset.to = to; shape.style.setProperty("--lane", lane); }
        return [path, dot];
      });
      svg.replaceChildren(...shapes);
      if (!animated && !motion().reduced()) {
        animated = true;
        const paths = shapes.filter(shape => shape.tagName === "path");
        for (const path of paths) { const length = path.getTotalLength(); path.style.strokeDasharray = length; path.style.strokeDashoffset = length; }
        globalThis.gsap.to(paths, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: { amount: 0.5 },
          onComplete: () => paths.forEach(path => { path.style.strokeDasharray = ""; path.style.strokeDashoffset = ""; }) });
      }
    };
    const focus = key => {
      if (!key) {
        delete map.dataset.focus;
        nodes.forEach(node => node.classList.remove("is-linked"));
        svg.querySelectorAll(".is-on").forEach(shape => shape.classList.remove("is-on"));
        return;
      }
      map.dataset.focus = key;
      const linked = new Set([key]);
      for (const shape of svg.children) {
        const on = shape.dataset.from === key || shape.dataset.to === key;
        shape.classList.toggle("is-on", on);
        if (on) { linked.add(shape.dataset.from); linked.add(shape.dataset.to); }
      }
      nodes.forEach((node, id) => node.classList.toggle("is-linked", linked.has(id)));
    };
    map.addEventListener("pointerover", event => { const node = event.target.closest("[data-node]"); if (node) focus(node.dataset.node); });
    map.addEventListener("pointerleave", () => focus(null));
    map.addEventListener("focusin", event => { const node = event.target.closest("[data-node]"); focus(node ? node.dataset.node : null); });
    map.addEventListener("focusout", event => { if (!map.contains(event.relatedTarget)) focus(null); });
    new ResizeObserver(draw).observe(grid);
    map.closest("details")?.addEventListener("toggle", event => { if (event.target.open) draw(); });
    draw();
  }

  return Object.freeze({ enhance, drawRoadmap });
});
