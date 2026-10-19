(function (root, factory) {
  const surface = factory();
  if (typeof module === "object" && module.exports) module.exports = surface;
  else root.FIAPSurface = surface;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  // ---------- Núcleo numérico (testado em Node) ----------

  const functions = {
    himmelblau: {
      label: "Himmelblau (exemplo do PDF)", formula: "f(x, y) = (x² + y − 11)² + (x + y² − 7)²",
      f: (x, y) => (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2,
      grad: (x, y) => [4 * x * (x * x + y - 11) + 2 * (x + y * y - 7), 2 * (x * x + y - 11) + 4 * y * (x + y * y - 7)],
      domain: [-10, 10], start: [-10, 10], eta: 0.002, etaRange: [0.0005, 0.02], steps: 150, log: true,
      minima: [[3, 2], [-2.805118, 3.131312], [-3.77931, -3.283186], [3.584428, -1.848126]]
    },
    bowl: {
      label: "Tigela x² + y²", formula: "f(x, y) = x² + y²",
      f: (x, y) => x * x + y * y,
      grad: (x, y) => [2 * x, 2 * y],
      domain: [-5, 5], start: [4, 3], eta: 0.1, etaRange: [0.01, 1.2], steps: 40, log: false,
      minima: [[0, 0]]
    }
  };

  function descent(name, x0, y0, eta, steps) {
    const fn = functions[name];
    const path = [[x0, y0, fn.f(x0, y0)]];
    let x = x0, y = y0, diverged = false;
    for (let i = 0; i < steps; i++) {
      const [gx, gy] = fn.grad(x, y);
      if (Math.hypot(gx, gy) < 1e-6) break;
      x -= eta * gx; y -= eta * gy;
      const value = fn.f(x, y);
      if (!Number.isFinite(value) || Math.abs(x) > 1e4 || Math.abs(y) > 1e4) { diverged = true; break; }
      path.push([x, y, value]);
    }
    return { path, diverged };
  }

  function tangentPlane(name, x0, y0) {
    const fn = functions[name], [gx, gy] = fn.grad(x0, y0);
    return { f0: fn.f(x0, y0), gx, gy };
  }

  // ---------- Carregamento sob demanda do three.js ----------

  let loading = null;
  function loadThree() {
    if (globalThis.THREE) return Promise.resolve(globalThis.THREE);
    loading ||= new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "assets/vendor/three/three.min.js";
      script.onload = () => globalThis.THREE ? resolve(globalThis.THREE) : reject(new Error("three.js indisponível"));
      script.onerror = () => { loading = null; reject(new Error("three.js não carregou")); };
      document.head.appendChild(script);
    });
    return loading;
  }

  // ---------- Leitura numérica (sempre visível, sem depender de WebGL) ----------

  const fmt = (value, digits = 3) => { const number = Number(value); return (Math.abs(number) < 0.5 * 10 ** -digits ? 0 : number).toLocaleString("pt-BR", { maximumFractionDigits: digits }).replace("-", "−"); };
  const signed = value => (value < 0 ? "− " : "+ ") + fmt(Math.abs(value));
  const pair = (a, b, digits = 3) => `(${fmt(a, digits)}; ${fmt(b, digits)})`;
  // η com até 2 algarismos significativos: o valor exibido é exatamente o usado na conta.
  function etaAt(name, position) { const [a, b] = functions[name].etaRange; return Number((a * (b / a) ** (position / 1000)).toPrecision(2)); }
  const formatEta = eta => Number(eta).toLocaleString("pt-BR", { maximumSignificantDigits: 2 });

  function readout(state) {
    const fn = functions[state.fn], [x0, y0] = [state.x0, state.y0];
    const plane = tangentPlane(state.fn, x0, y0), norm = Math.hypot(plane.gx, plane.gy);
    const run = state.run, end = run.path.at(-1);
    const x1 = x0 - state.eta * plane.gx, y1 = y0 - state.eta * plane.gy;
    const near = fn.minima.find(([mx, my]) => Math.hypot(end[0] - mx, end[1] - my) < 0.05);
    const summary = run.diverged ? `A descida <strong>divergiu</strong> em ${run.path.length - 1} passos: com η = ${formatEta(state.eta)}, cada passo salta para longe e f cresce. Diminua η.`
      : near ? `Depois de ${run.path.length - 1} passos, o ponto chegou a ${pair(end[0], end[1])}, com f = ${fmt(end[2], 6)}: o mínimo ${pair(near[0], near[1])}.`
      : `Depois de ${run.path.length - 1} passos, o ponto está em ${pair(end[0], end[1])}, com f = ${fmt(end[2], 4)}. Aumente os passos ou ajuste η.`;
    const last = run.path.slice(-6).map((point, i, list) => {
      const t = run.path.length - list.length + i, [gx, gy] = fn.grad(point[0], point[1]);
      return `<tr><td class="step-muted">${t}</td><td>${fmt(point[0])}</td><td>${fmt(point[1])}</td><td class="step-key">${fmt(point[2], 4)}</td><td>${fmt(Math.hypot(gx, gy), 3)}</td></tr>`;
    }).join("");
    return `<p class="surface-formula">${fn.formula}</p>
      <dl class="surface-facts">
        <div><dt>Ponto inicial</dt><dd>(x₀, y₀) = ${pair(x0, y0)}</dd></div>
        <div><dt>Valor</dt><dd>f(x₀, y₀) = ${fmt(plane.f0)}</dd></div>
        <div><dt>Gradiente</dt><dd>∇f(x₀, y₀) = ${pair(plane.gx, plane.gy)}; |∇f| = ${fmt(norm, 2)}</dd></div>
        <div><dt>Plano tangente</dt><dd>z ≈ ${fmt(plane.f0)} ${signed(plane.gx)}·(x ${signed(-x0)}) ${signed(plane.gy)}·(y ${signed(-y0)})</dd></div>
        <div><dt>1º passo</dt><dd>(x₁, y₁) = (x₀, y₀) − ${formatEta(state.eta)}·∇f = ${pair(x1, y1)}</dd></div>
      </dl>
      <p class="surface-summary">${summary}</p>
      <div class="table-scroll"><table class="steps"><caption>Últimos passos da descida</caption><thead><tr><th>t</th><th>x</th><th>y</th><th>f(x, y)</th><th>|∇f|</th></tr></thead><tbody>${last}</tbody></table></div>`;
  }

  // ---------- Cena 3D ----------

  const reduced = () => !globalThis.FIAPMotion || globalThis.FIAPMotion.reduced();
  const WORLD = 5, HEIGHT = 4.2;

  function createScene(lab, THREE) {
    const stage = lab.querySelector(".surface-stage");
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { stage.insertAdjacentHTML("beforeend", '<p class="lab-error">O navegador não ofereceu WebGL. A tabela ao lado continua mostrando os cálculos.</p>'); return null; }
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.className = "surface-canvas";
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    stage.prepend(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(6, 12, 8);
    scene.add(sun);
    const view = { theta: -0.85, phi: 1.02, radius: 17.5 };
    const groups = { surface: new THREE.Group(), path: new THREE.Group(), helpers: new THREE.Group() };
    Object.values(groups).forEach(group => scene.add(group));
    let mapping = null, surfaceMesh = null, tween = null;

    const place = () => {
      const target = new THREE.Vector3(0, HEIGHT * 0.35, 0);
      camera.position.set(target.x + view.radius * Math.sin(view.phi) * Math.cos(view.theta), target.y + view.radius * Math.cos(view.phi), target.z + view.radius * Math.sin(view.phi) * Math.sin(view.theta));
      camera.lookAt(target);
    };
    const render = () => { place(); renderer.render(scene, camera); };
    const clear = group => {
      for (const child of [...group.children]) {
        group.remove(child);
        child.traverse?.(node => { node.geometry?.dispose(); [].concat(node.material || []).forEach(material => material.dispose()); });
      }
    };

    function buildSurface(name) {
      clear(groups.surface);
      const fn = functions[name], [lo, hi] = fn.domain, n = 110;
      const raw = (x, y) => (fn.log ? Math.log1p(fn.f(x, y)) : fn.f(x, y));
      let min = Infinity, max = -Infinity;
      const samples = [];
      for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
        const x = lo + (hi - lo) * i / n, y = lo + (hi - lo) * j / n, v = raw(x, y);
        samples.push(v); min = Math.min(min, v); max = Math.max(max, v);
      }
      const scale = WORLD * 2 / (hi - lo);
      mapping = { fn, scale, raw, min, max, lo, hi,
        world: (x, y, v = raw(x, y)) => new THREE.Vector3(x * scale, HEIGHT * (v - min) / (max - min), -y * scale) };
      const geometry = new THREE.PlaneGeometry(WORLD * 2, WORLD * 2, n, n);
      geometry.rotateX(-Math.PI / 2);
      const position = geometry.attributes.position, colors = new Float32Array(position.count * 3);
      const low = new THREE.Color("#25dbef"), mid = new THREE.Color("#4eec85"), high = new THREE.Color("#ed145b"), color = new THREE.Color();
      for (let k = 0; k < position.count; k++) {
        const x = position.getX(k) / scale, y = -position.getZ(k) / scale, t = (raw(x, y) - min) / (max - min);
        position.setY(k, HEIGHT * t);
        color.copy(t < 0.5 ? low : mid).lerp(t < 0.5 ? mid : high, t < 0.5 ? t * 2 : (t - 0.5) * 2);
        colors.set([color.r, color.g, color.b], k * 3);
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      surfaceMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      groups.surface.add(surfaceMesh);
      // Curvas de nível no plano da base (marching squares sobre a grade).
      const levels = 14, segments = [];
      const at = (i, j) => samples[j * (n + 1) + i];
      for (let l = 1; l < levels; l++) {
        const level = min + (max - min) * (l / levels) ** 1.6;
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
          const crossings = [];
          for (let e = 0; e < 4; e++) {
            const [a, b] = [corners[e], corners[(e + 1) % 4]], va = at(...a), vb = at(...b);
            if ((va < level) !== (vb < level)) {
              const t = (level - va) / (vb - va);
              crossings.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
            }
          }
          if (crossings.length >= 2) for (const [ci, cj] of crossings.slice(0, 2)) segments.push(lo + (hi - lo) * ci / n, lo + (hi - lo) * cj / n);
        }
      }
      const contour = new Float32Array(segments.length / 2 * 3);
      for (let k = 0; k < segments.length / 2; k++) contour.set([segments[2 * k] * scale, -0.02, -segments[2 * k + 1] * scale], k * 3);
      const contourGeometry = new THREE.BufferGeometry();
      contourGeometry.setAttribute("position", new THREE.BufferAttribute(contour, 3));
      groups.surface.add(new THREE.LineSegments(contourGeometry, new THREE.LineBasicMaterial({ color: 0x75838b, transparent: true, opacity: 0.65 })));
      const base = new THREE.Mesh(new THREE.PlaneGeometry(WORLD * 2, WORLD * 2), new THREE.MeshBasicMaterial({ color: 0x75838b, transparent: true, opacity: 0.06, side: THREE.DoubleSide }));
      base.rotateX(-Math.PI / 2); base.position.y = -0.03;
      groups.surface.add(base);
      canvas.setAttribute("aria-label", `Superfície 3D de ${fn.formula}, com curvas de nível na base. Arraste ou use as setas para girar.`);
    }

    function showRun(state) {
      clear(groups.path); clear(groups.helpers);
      if (tween) { tween.kill(); tween = null; }
      const fn = functions[state.fn], inside = state.run.path.filter(([x, y]) => x >= mapping.lo && x <= mapping.hi && y >= mapping.lo && y <= mapping.hi);
      const points = inside.map(([x, y, v]) => mapping.world(x, y).add(new THREE.Vector3(0, 0.06, 0)));
      const radius = 0.09;
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xfcea10 }));
      groups.path.add(line);
      const dotGeometry = new THREE.SphereGeometry(radius, 12, 10), dotMaterial = new THREE.MeshBasicMaterial({ color: 0xfcea10 });
      const dots = points.map(point => { const dot = new THREE.Mesh(dotGeometry, dotMaterial); dot.position.copy(point); groups.path.add(dot); return dot; });
      const head = new THREE.Mesh(new THREE.SphereGeometry(radius * 2.2, 20, 16), new THREE.MeshBasicMaterial({ color: 0xed145b }));
      groups.path.add(head);
      // Vetor −∇f no ponto inicial e plano tangente da superfície desenhada.
      const [x0, y0] = [state.x0, state.y0];
      if (x0 >= mapping.lo && x0 <= mapping.hi && y0 >= mapping.lo && y0 <= mapping.hi) {
        const start = mapping.world(x0, y0), [gx, gy] = fn.grad(x0, y0);
        const direction = new THREE.Vector3(-gx, 0, gy).normalize();
        groups.helpers.add(new THREE.ArrowHelper(direction, start.clone().add(new THREE.Vector3(0, 0.08, 0)), 1.9, 0x25dbef, 0.38, 0.22));
        if (state.plane) {
          const h = 0.02, s = mapping.scale, a = 1.4;
          const slopeX = (mapping.world(x0 + h, y0).y - mapping.world(x0 - h, y0).y) / (2 * h * s);
          const slopeZ = -(mapping.world(x0, y0 + h).y - mapping.world(x0, y0 - h).y) / (2 * h * s);
          const corners = [[-a, -a], [a, -a], [a, a], [-a, a]].map(([dx, dz]) => new THREE.Vector3(start.x + dx, start.y + slopeX * dx + slopeZ * dz, start.z + dz));
          const planeGeometry = new THREE.BufferGeometry().setFromPoints([corners[0], corners[1], corners[2], corners[0], corners[2], corners[3]]);
          groups.helpers.add(new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ color: 0xed145b, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false })));
        }
      }
      if (!points.length) { head.visible = false; render(); return; }
      if (reduced() || !globalThis.gsap) { head.position.copy(points.at(-1)); render(); return; }
      dots.forEach(dot => { dot.visible = false; });
      line.geometry.setDrawRange(0, 1);
      const progress = { t: 0 };
      tween = globalThis.gsap.to(progress, { t: points.length - 1, duration: Math.min(2.4, 0.25 + points.length * 0.04), ease: "power1.inOut",
        onUpdate: () => {
          const k = Math.floor(progress.t), frac = progress.t - k;
          dots.forEach((dot, i) => { dot.visible = i <= k; });
          line.geometry.setDrawRange(0, k + 1);
          head.position.copy(points[k]).lerp(points[Math.min(k + 1, points.length - 1)], frac);
          render();
        } });
    }

    // Arrastar gira a câmera; clicar sem arrastar escolhe o ponto inicial na superfície.
    let drag = null;
    canvas.addEventListener("pointerdown", event => { drag = { x: event.clientX, y: event.clientY, moved: 0 }; canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener("pointermove", event => {
      if (!drag) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = event.clientX; drag.y = event.clientY;
      view.theta += dx * 0.008; view.phi = Math.min(1.45, Math.max(0.25, view.phi - dy * 0.008)); render();
    });
    canvas.addEventListener("pointerup", event => {
      const click = drag && drag.moved < 5;
      drag = null;
      if (!click || !surfaceMesh) return;
      const rect = canvas.getBoundingClientRect(), pointer = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      const caster = new THREE.Raycaster();
      caster.setFromCamera(pointer, camera);
      const hit = caster.intersectObject(surfaceMesh)[0];
      if (hit) lab.dispatchEvent(new CustomEvent("surface:pick", { detail: { x: hit.point.x / mapping.scale, y: -hit.point.z / mapping.scale } }));
    });
    canvas.addEventListener("keydown", event => {
      const moves = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[event.key];
      if (!moves) return;
      event.preventDefault();
      view.theta += moves[0]; view.phi = Math.min(1.45, Math.max(0.25, view.phi + moves[1])); render();
    });
    const zoom = factor => { view.radius = Math.min(30, Math.max(9, view.radius * factor)); render(); };
    const resize = () => {
      const width = stage.clientWidth, height = Math.round(Math.min(480, Math.max(280, width * 0.62)));
      renderer.setSize(width, height, false);
      canvas.style.width = "100%"; canvas.style.height = height + "px";
      camera.aspect = width / height; camera.updateProjectionMatrix(); render();
    };
    new ResizeObserver(resize).observe(stage);
    return { buildSurface, showRun, zoom, resize, render };
  }

  // ---------- Montagem ----------

  let serial = 0;
  function mount(element) {
    const id = `lab-surface-${++serial}`;
    element.classList.add("lab-surface");
    element.innerHTML = `<div class="lab-head"><p class="lab-title">Laboratório 3D: gradiente descendente</p><p class="lab-intro">Escolha o ponto inicial e a taxa de aprendizagem η e veja o ponto descer a superfície contra o gradiente, como no exemplo da função de Himmelblau do PDF.</p></div>
      <div class="surface-layout">
        <div class="surface-stage"><div class="surface-poster"><p>A visualização 3D usa a biblioteca three.js, que acompanha o guia e é carregada só agora.</p><button type="button" class="button button-primary" data-surface-open>Abrir a visualização 3D</button></div>
          <div class="surface-tools" hidden><button type="button" class="icon-button" data-zoom="0.85" aria-label="Aproximar"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 6v12M6 12h12"/></svg></button><button type="button" class="icon-button" data-zoom="1.18" aria-label="Afastar"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 12h12"/></svg></button><span>Arraste ou use as setas para girar. Clique na superfície para escolher o ponto inicial.</span></div></div>
        <form class="surface-controls" novalidate>
          <label for="${id}-fn">Função<select id="${id}-fn" name="fn"><option value="himmelblau">${functions.himmelblau.label}</option><option value="bowl">${functions.bowl.label}</option></select></label>
          <label for="${id}-x0">x₀<input id="${id}-x0" name="x0" type="number" step="0.5"></label>
          <label for="${id}-y0">y₀<input id="${id}-y0" name="y0" type="number" step="0.5"></label>
          <label for="${id}-eta" class="surface-eta">Taxa η <output for="${id}-eta" name="etaOut"></output><input id="${id}-eta" name="eta" type="range" min="0" max="1000" step="1"></label>
          <label for="${id}-steps">Passos<input id="${id}-steps" name="steps" type="number" min="1" max="400" step="1"></label>
          <label class="surface-check"><input name="plane" type="checkbox" checked> Plano tangente no ponto inicial</label>
          <div class="lab-actions"><button type="submit" class="button button-secondary">Descer</button><button type="button" class="text-button" data-surface-reset>Valores do PDF</button></div>
        </form>
      </div>
      <div class="surface-readout" aria-live="polite"></div>`;
    const form = element.querySelector("form"), readoutBox = element.querySelector(".surface-readout");
    const state = { fn: "himmelblau", x0: -10, y0: 10, eta: 0.002, steps: 150, plane: true, run: null };
    let scene = null;
    const sliderFromEta = eta => { const [a, b] = functions[state.fn].etaRange; return Math.round(1000 * Math.log(eta / a) / Math.log(b / a)); };
    const sync = () => {
      form.elements.fn.value = state.fn; form.elements.x0.value = state.x0; form.elements.y0.value = state.y0;
      form.elements.eta.value = sliderFromEta(state.eta); form.elements.etaOut.value = formatEta(state.eta);
      form.elements.steps.value = state.steps; form.elements.plane.checked = state.plane;
    };
    const run = () => {
      const fn = functions[state.fn], [lo, hi] = fn.domain;
      state.x0 = Math.min(hi, Math.max(lo, Number(form.elements.x0.value) || 0));
      state.y0 = Math.min(hi, Math.max(lo, Number(form.elements.y0.value) || 0));
      state.steps = Math.min(400, Math.max(1, Math.round(Number(form.elements.steps.value) || fn.steps)));
      state.plane = form.elements.plane.checked;
      state.run = descent(state.fn, state.x0, state.y0, state.eta, state.steps);
      sync();
      readoutBox.innerHTML = readout(state);
      if (scene) scene.showRun(state);
    };
    const reset = name => {
      const fn = functions[name];
      Object.assign(state, { fn: name, x0: fn.start[0], y0: fn.start[1], eta: fn.eta, steps: fn.steps });
      sync();
      if (scene) scene.buildSurface(name);
      run();
    };
    form.addEventListener("submit", event => { event.preventDefault(); run(); });
    form.elements.eta.addEventListener("input", () => { state.eta = etaAt(state.fn, Number(form.elements.eta.value)); form.elements.etaOut.value = formatEta(state.eta); });
    form.elements.fn.addEventListener("change", () => reset(form.elements.fn.value));
    element.querySelector("[data-surface-reset]").addEventListener("click", () => reset(state.fn));
    element.addEventListener("surface:pick", event => { form.elements.x0.value = Number(event.detail.x.toFixed(2)); form.elements.y0.value = Number(event.detail.y.toFixed(2)); run(); });
    element.querySelectorAll("[data-zoom]").forEach(button => button.addEventListener("click", () => scene?.zoom(Number(button.dataset.zoom))));
    element.querySelector("[data-surface-open]").addEventListener("click", async event => {
      const button = event.currentTarget;
      button.disabled = true; button.textContent = "Carregando a visualização…";
      try {
        const THREE = await loadThree();
        scene = createScene(element, THREE);
        element.querySelector(".surface-poster").remove();
        if (!scene) return;
        element.querySelector(".surface-tools").hidden = false;
        scene.buildSurface(state.fn); scene.resize(); scene.showRun(state);
      } catch {
        button.disabled = false; button.textContent = "Tentar de novo";
        element.querySelector(".surface-poster p").textContent = "Não foi possível carregar a visualização 3D. A tabela abaixo continua com todos os cálculos.";
      }
    });
    reset("himmelblau");
  }

  return Object.freeze({ functions, descent, tangentPlane, etaAt, formatEta, loadThree, mount });
});
