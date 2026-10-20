(function (root, factory) {
  const bases = factory();
  if (typeof module === "object" && module.exports) module.exports = bases;
  else root.FIAPBases = bases;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const DIGITS = "0123456789ABCDEF";
  const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sub = n => String(n).split("").map(d => SUB[d]).join("");
  const sup = n => String(n).split("").map(d => SUP[d]).join("");
  const BITS = { 2: 1, 8: 3, 16: 4 };
  const NAMES = { 2: "binária", 8: "octal", 10: "decimal", 16: "hexa" };

  // ---------- Núcleo: aritmética exata com BigInt (inteiros e frações racionais) ----------

  function parse(text, base, { limit = true } = {}) {
    const raw = String(text ?? "").trim().replace(/[\s_]/g, "").toUpperCase();
    if (!raw) return { error: "Digite um número." };
    if (raw.startsWith("-")) return { error: "Use números sem sinal: o laboratório trata da representação do valor." };
    const parts = raw.split(/[,.]/);
    if (parts.length > 2) return { error: "Use uma única vírgula para separar a parte fracionária." };
    const [int, frac = ""] = parts;
    if (!int && !frac) return { error: "Digite um número." };
    for (const char of int + frac) {
      const value = DIGITS.indexOf(char);
      if (value < 0) return { error: `O símbolo "${char}" não é um algarismo válido nas bases de 2 a 16.` };
      if (value >= base) return { error: `O algarismo ${char} não existe na base ${base}: ela usa ${base <= 10 ? `de 0 a ${base - 1}` : `de 0 a 9 e de A a ${DIGITS[base - 1]}`}.` };
    }
    if (limit && int.length + frac.length > 24) return { error: "Use até 24 algarismos." };
    return { int: int.replace(/^0+(?=.)/, "") || "0", frac: frac.replace(/0+$/, "") };
  }

  function decimalString(num, den, limit = 10) {
    const integer = num / den;
    let rest = num % den, digits = "";
    if (rest === 0n) return integer.toString();
    while (rest !== 0n && digits.length < limit) { rest *= 10n; digits += (rest / den).toString(); rest %= den; }
    return `${integer},${digits}${rest !== 0n ? "…" : ""}`;
  }

  // Base b → valor: soma de algarismo × peso da posição.
  function expand(parsed, base) {
    const b = BigInt(base), steps = [];
    let integer = 0n;
    [...parsed.int].forEach((digit, index, all) => {
      const position = all.length - 1 - index, value = DIGITS.indexOf(digit), weight = b ** BigInt(position);
      integer = integer * b + BigInt(value);
      steps.push({ digit, value, position, weight: weight.toString(), product: (BigInt(value) * weight).toString() });
    });
    const den = b ** BigInt(parsed.frac.length);
    let num = 0n;
    [...parsed.frac].forEach((digit, index) => {
      const value = DIGITS.indexOf(digit), power = b ** BigInt(index + 1);
      num = num * b + BigInt(value);
      steps.push({ digit, value, position: -(index + 1), weight: decimalString(1n, power), product: decimalString(BigInt(value), power) });
    });
    return { integer, num, den, steps };
  }

  // Valor → base b: divisões sucessivas na parte inteira, multiplicações sucessivas na fracionária.
  function divide(integer, base) {
    const b = BigInt(base), steps = [];
    let n = integer;
    while (n > 0n) {
      const quotient = n / b, remainder = Number(n % b);
      steps.push({ dividend: n.toString(), quotient: quotient.toString(), remainder, digit: DIGITS[remainder] });
      n = quotient;
    }
    return { digits: steps.map(step => step.digit).reverse().join("") || "0", steps };
  }

  function multiply(num, den, base, limit) {
    const b = BigInt(base), steps = [], seen = new Map();
    let state = num, repeated = false;
    while (state !== 0n && steps.length < limit) {
      const earlier = seen.get(state);
      if (earlier !== undefined) repeated = true;
      else seen.set(state, steps.length);
      const product = state * b, digit = Number(product / den);
      steps.push({ value: decimalString(state, den), product: decimalString(product, den), digit: DIGITS[digit], repeats: earlier === undefined ? null : earlier + 1 });
      state = product % den;
    }
    if (state !== 0n && seen.has(state)) repeated = true;
    return { digits: steps.map(step => step.digit).join(""), steps, periodic: state !== 0n && repeated, truncated: state !== 0n && !repeated };
  }

  // Atalho entre 2, 8 e 16: cada algarismo vale um grupo fixo de bits.
  function toBits(parsed, base) {
    const size = BITS[base];
    const map = digits => [...digits].map(d => DIGITS.indexOf(d).toString(2).padStart(size, "0"));
    return { size, digits: [...parsed.int], bits: map(parsed.int), fractionDigits: [...parsed.frac], fractionBits: map(parsed.frac) };
  }
  function regroup(intBits, fracBits, base) {
    const size = BITS[base];
    const trimmed = intBits.replace(/^0+(?=.)/, "") || "0", fraction = fracBits.replace(/0+$/, "");
    const intPadded = trimmed.padStart(Math.ceil(trimmed.length / size) * size, "0");
    const fracPadded = fraction.padEnd(Math.ceil(fraction.length / size) * size, "0");
    const chunk = text => text.match(new RegExp(`.{${size}}`, "g")) || [];
    const bits = chunk(intPadded), fractionBits = chunk(fracPadded);
    const digit = group => DIGITS[parseInt(group, 2)];
    return { size, bits, digits: bits.map(digit), fractionBits, fractionDigits: fractionBits.map(digit) };
  }
  const join = (int, frac) => (int.replace(/^0+(?=.)/, "") || "0") + (frac ? "," + frac : "");

  function convert(text, from, to, { maxFraction = 12 } = {}) {
    from = Number(from); to = Number(to);
    if (![from, to].every(base => Number.isInteger(base) && base >= 2 && base <= 16)) return { ok: false, error: "Escolha bases entre 2 e 16." };
    const parsed = parse(text, from);
    if (parsed.error) return { ok: false, error: parsed.error };
    const input = join(parsed.int, parsed.frac);
    const value = expand(parsed, from);
    const decimal = decimalString(value.integer * value.den + value.num, value.den, 12);
    const answer = { ok: true, input, from, to, decimal, steps: {}, periodic: false, truncated: false };
    if (from === to) return { ...answer, result: input, method: "same", check: `${input}${sub(from)} já está na base pedida.` };
    if (BITS[from] && BITS[to]) {
      answer.method = "grouping";
      const bits = from === 2 ? { bits: [parsed.int], fractionBits: [parsed.frac] } : toBits(parsed, from);
      if (to === 2) {
        answer.steps.groups = bits;
        answer.result = join(bits.bits.join(""), bits.fractionBits.join("").replace(/0+$/, ""));
      } else {
        if (from !== 2) answer.steps.expand = bits;
        answer.steps.groups = regroup(bits.bits.join(""), bits.fractionBits.join(""), to);
        answer.result = join(answer.steps.groups.digits.join(""), answer.steps.groups.fractionDigits.join("").replace(/0+$/, ""));
      }
    } else if (to === 10) {
      answer.method = "positional";
      answer.steps.expansion = value.steps;
      const fraction = decimalString(value.num, value.den, maxFraction);
      answer.result = value.integer.toString() + (value.num ? fraction.slice(fraction.indexOf(",")) : "");
      answer.truncated = fraction.endsWith("…");
      if (answer.truncated) answer.result = answer.result.replace("…", "");
    } else {
      answer.method = from === 10 ? "divisions" : "positional+divisions";
      if (from !== 10) answer.steps.expansion = value.steps;
      const integer = divide(value.integer, to);
      answer.steps.divisions = integer.steps;
      let frac = "";
      if (value.num) {
        const fraction = multiply(value.num, value.den, to, maxFraction);
        answer.steps.multiplications = fraction.steps;
        answer.periodic = fraction.periodic;
        answer.truncated = fraction.truncated;
        frac = fraction.digits;
      }
      answer.result = join(integer.digits, frac);
    }
    answer.check = check(answer);
    return answer;
  }

  // Conferência: o resultado, expandido na base de destino, precisa voltar ao mesmo valor.
  function check(answer) {
    const parsed = parse(answer.result, answer.to, { limit: false });
    if (parsed.error) return "";
    const terms = expand(parsed, answer.to).steps.filter(step => step.value).map(step => `${step.digit === String(step.value) ? step.value : `${step.digit}(${step.value})`}·${answer.to}${sup(step.position)}`);
    const back = expand(parsed, answer.to), value = decimalString(back.integer * back.den + back.num, back.den, 12);
    const approx = answer.periodic || answer.truncated;
    return `${answer.result}${sub(answer.to)} = ${terms.join(" + ") || "0"} ${approx ? "≈" : "="} ${value} em base 10${approx ? ", aproximação de" : ", o mesmo valor de"} ${answer.input}${sub(answer.from)}.`;
  }

  // ---------- Interface ----------

  const EXAMPLES = [
    ["45", 10, 2], ["1985", 10, 6], ["2D", 16, 10], ["101101", 2, 16], ["0,625", 10, 2], ["0,101", 2, 10], ["255", 10, 16],
    ["3A", 16, 2], ["777", 8, 10], ["13105", 6, 10], ["12,5", 10, 2], ["FF", 16, 8], ["0,1", 10, 2], ["100", 10, 8], ["11011", 2, 10]
  ];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const baseName = base => NAMES[base] ? `${base} (${NAMES[base]})` : String(base);
  const options = selected => Array.from({ length: 15 }, (_, i) => i + 2).map(base => `<option value="${base}"${base === selected ? " selected" : ""}>${baseName(base)}</option>`).join("");
  const motion = () => globalThis.FIAPMotion || { reduced: () => true };
  let serial = 0;

  function methodText(answer) {
    const { from, to } = answer;
    return {
      grouping: to === 2 ? `Atalho: cada algarismo da base ${from} vale exatamente ${BITS[from]} bits, porque ${from} = 2${sup(BITS[from])}. Troque cada algarismo pelo seu grupo de bits.`
        : from === 2 ? `Atalho: agrupe os bits de ${BITS[to]} em ${BITS[to]}, a partir da vírgula (completando com zeros nas pontas), e troque cada grupo pelo algarismo da base ${to}.`
        : `Atalho em duas etapas: passe cada algarismo da base ${from} para ${BITS[from]} bits e reagrupe os bits de ${BITS[to]} em ${BITS[to]} para formar a base ${to}.`,
      positional: `Expansão posicional: multiplique cada algarismo pelo peso da sua posição (${from} elevado à posição) e some tudo.`,
      divisions: answer.steps.divisions && answer.steps.divisions.length ? `Divisões sucessivas por ${to} na parte inteira: anote o resto e continue com o quociente até ele zerar.${answer.steps.multiplications ? ` Na parte fracionária, multiplique por ${to} e recolha as partes inteiras.` : ""}` : `A parte inteira é 0. Na parte fracionária, multiplique por ${to}, recolha a parte inteira de cada produto e continue com o que sobra.`,
      "positional+divisions": `Duas etapas: primeiro a expansão posicional leva o número para a base 10; depois as divisões sucessivas por ${to} levam à base ${to}.`
    }[answer.method] || "";
  }

  function stepsMarkup(answer) {
    const blocks = [];
    const { steps, from, to } = answer;
    if (steps.expand) blocks.push(groupTable(steps.expand, `Cada algarismo da base ${from} em ${steps.expand.size} bits`, "digits-first"));
    if (steps.groups) blocks.push(groupTable(steps.groups, to === 2 ? `Cada algarismo da base ${from} em ${steps.groups.size || BITS[from]} bits` : `Bits agrupados de ${steps.groups.size} em ${steps.groups.size}`, to === 2 ? "digits-first" : "bits-first"));
    if (steps.expansion) {
      blocks.push(`<div class="table-scroll"><table class="steps lab-table"><caption>${escapeHtml(answer.input)}${sub(from)}: algarismo × peso da posição</caption><thead><tr><th>Algarismo</th><th>Posição</th><th>Peso ${from}<sup>posição</sup></th><th>Produto</th></tr></thead><tbody>${steps.expansion.map(step => `<tr data-step><td>${step.digit}${step.digit !== String(step.value) ? ` <span class="step-muted">(${step.value})</span>` : ""}</td><td class="step-muted">${step.position}</td><td>${step.weight}</td><td class="step-key">${step.product}</td></tr>`).join("")}</tbody></table></div><p class="lab-sum" data-step>Soma dos produtos: <strong>${answer.decimal}</strong> em base 10</p>`);
    }
    if (steps.divisions && steps.divisions.length) {
      blocks.push(`<div class="table-scroll"><table class="steps lab-table" data-read-order="up"><caption>Parte inteira dividida sucessivamente por ${to}</caption><thead><tr><th>Dividendo</th><th>÷ ${to} = quociente</th><th>Resto</th></tr></thead><tbody>${steps.divisions.map((step, index, all) => `<tr data-step${index === all.length - 1 ? ' class="step-final"' : ""}><td>${step.dividend}</td><td>${step.quotient}</td><td class="step-key">${step.remainder}${step.digit !== String(step.remainder) ? ` <span class="step-muted">= ${step.digit}</span>` : ""}</td></tr>`).join("")}</tbody></table></div><p class="read-order" data-step>Leia os restos de baixo para cima.</p>`);
    }
    if (steps.multiplications) {
      blocks.push(`<div class="table-scroll"><table class="steps lab-table" data-read-order="down"><caption>Parte fracionária multiplicada sucessivamente por ${to}</caption><thead><tr><th>Fração</th><th>× ${to}</th><th>Parte inteira</th></tr></thead><tbody>${steps.multiplications.map(step => `<tr data-step${step.repeats ? ' class="step-repeat"' : ""}><td>${step.value}${step.repeats ? ` <span class="step-muted">(igual à linha ${step.repeats})</span>` : ""}</td><td>${step.product}</td><td class="step-key">${step.digit}</td></tr>`).join("")}</tbody></table></div><p class="read-order" data-step>Leia as partes inteiras de cima para baixo${answer.periodic ? ". A fração se repete: a representação é periódica e foi cortada." : answer.truncated ? ". O cálculo parou no limite de algarismos." : "."}</p>`);
    }
    return blocks.join("");
  }

  function groupTable(groups, caption, order) {
    const cells = (bits, digits) => bits.map((group, i) => {
      const bitsSpan = `<span class="bits">${group}</span>`, digitSpan = `<span class="bit-digit">${digits[i] ?? ""}</span>`;
      return `<td class="bit-group">${order === "digits-first" ? digitSpan + bitsSpan : bitsSpan + digitSpan}</td>`;
    }).join("");
    const fraction = groups.fractionBits && groups.fractionBits.length && groups.fractionBits[0] ? `<td class="bit-comma">,</td>${cells(groups.fractionBits, groups.fractionDigits || [])}` : "";
    return `<p class="lab-caption">${caption}</p><div class="table-scroll"><table class="steps lab-groups ${order}" aria-label="${caption}"><tbody><tr data-step>${cells(groups.bits, groups.digits || [])}${fraction}</tr></tbody></table></div>`;
  }

  function render(lab, answer, { stepwise = true } = {}) {
    const output = lab.querySelector(".lab-output");
    if (!answer.ok) { output.innerHTML = `<p class="lab-error" role="alert">${escapeHtml(answer.error)}</p>`; return; }
    const digits = [...answer.result].map(char => `<span class="lab-digit">${char}</span>`).join("");
    output.innerHTML = `<p class="lab-method">${escapeHtml(methodText(answer))}</p>${stepsMarkup(answer)}
      <p class="lab-answer" data-step><span class="lab-answer-label">Resultado</span><span class="lab-answer-value">${escapeHtml(answer.input)}<sub>${answer.from}</sub> ${answer.periodic || answer.truncated ? "≈" : "="} <strong>${digits}</strong><sub>${answer.to}</sub></span></p>
      ${answer.check ? `<p class="lab-check" data-step><span>Conferência</span> ${escapeHtml(answer.check)}</p>` : ""}
      <div class="lab-controls"><button type="button" class="button button-secondary" data-lab-next>Próximo passo</button><button type="button" class="text-button" data-lab-all>Mostrar tudo</button><span class="lab-progress" aria-live="polite"></span></div>`;
    const steps = [...output.querySelectorAll("[data-step]")];
    let shown = 0;
    const progress = output.querySelector(".lab-progress"), next = output.querySelector("[data-lab-next]"), all = output.querySelector("[data-lab-all]");
    const update = () => {
      const done = shown >= steps.length;
      progress.textContent = done ? "Conta completa." : `Passo ${shown} de ${steps.length}`;
      next.textContent = done ? "Recomeçar o passo a passo" : "Próximo passo";
      all.disabled = done;
    };
    const reveal = (step, animate) => {
      step.classList.remove("is-pending");
      if (animate && !motion().reduced()) globalThis.gsap.fromTo(step, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out", clearProps: "opacity,visibility,transform" });
      if (step.classList.contains("lab-answer")) readOut(output, animate);
    };
    steps.forEach(step => step.classList.add("is-pending"));
    next.addEventListener("click", () => {
      if (shown >= steps.length) {
        steps.forEach(step => step.classList.add("is-pending"));
        output.querySelectorAll(".is-read").forEach(cell => cell.classList.remove("is-read"));
        shown = 0;
      }
      reveal(steps[shown++], true); update();
    });
    all.addEventListener("click", () => { while (shown < steps.length) reveal(steps[shown++], false); update(); });
    if (!stepwise || motion().reduced()) { while (shown < steps.length) reveal(steps[shown++], false); }
    else reveal(steps[shown++], true);
    update();
  }

  // Momento principal: os restos são lidos na ordem certa enquanto o resultado se forma, algarismo por algarismo.
  function readOut(output, animate) {
    const integer = [...output.querySelectorAll("table[data-read-order='up'] .step-key")].reverse();
    const fraction = [...output.querySelectorAll("table[data-read-order='down'] .step-key")];
    const cells = [...integer, ...fraction];
    const digits = [...output.querySelectorAll(".lab-digit")];
    if (!animate || motion().reduced() || !globalThis.gsap) { cells.forEach(cell => cell.classList.add("is-read")); return; }
    const pace = cells.length ? 0.16 : 0.05;
    const timeline = globalThis.gsap.timeline();
    timeline.fromTo(digits, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out", stagger: pace, clearProps: "opacity,visibility,transform" }, 0);
    cells.forEach((cell, index) => timeline.call(() => cell.classList.add("is-read"), null, index * pace));
  }

  function mount(element) {
    const id = `lab-bases-${++serial}`;
    const value = element.dataset.value || "45", from = Number(element.dataset.from) || 10, to = Number(element.dataset.to) || 2;
    element.classList.add("lab-bases");
    element.innerHTML = `<div class="lab-head"><p class="lab-title">Laboratório de bases</p><p class="lab-intro">Digite um número, escolha as bases e acompanhe a conta passo a passo. Use vírgula para a parte fracionária.</p></div>
      <form class="lab-form" novalidate><label for="${id}-value">Número<input id="${id}-value" name="value" value="${escapeHtml(value)}" autocomplete="off" spellcheck="false" maxlength="30" inputmode="text"></label>
      <label for="${id}-from">Da base<select id="${id}-from" name="from">${options(from)}</select></label>
      <button type="button" class="icon-button lab-swap" aria-label="Inverter as bases" title="Inverter as bases"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h14m-4-4 4 4-4 4M20 16H6m4 4-4-4 4-4"/></svg></button>
      <label for="${id}-to">Para a base<select id="${id}-to" name="to">${options(to)}</select></label>
      <div class="lab-actions"><button type="submit" class="button button-primary">Converter</button><button type="button" class="text-button" data-lab-example>Novo exemplo</button></div></form>
      <div class="lab-output" aria-live="polite"></div>`;
    const form = element.querySelector("form");
    const run = (options = {}) => render(element, convert(form.elements.value.value, form.elements.from.value, form.elements.to.value), options);
    form.addEventListener("submit", event => { event.preventDefault(); run(); });
    element.querySelector(".lab-swap").addEventListener("click", () => {
      const fromValue = form.elements.from.value;
      form.elements.from.value = form.elements.to.value; form.elements.to.value = fromValue; run();
    });
    element.querySelector("[data-lab-example]").addEventListener("click", () => {
      const pool = EXAMPLES.filter(([v, f, t]) => !(v === form.elements.value.value && String(f) === form.elements.from.value && String(t) === form.elements.to.value));
      const [v, f, t] = pool[Math.floor(Math.random() * pool.length)];
      form.elements.value.value = v; form.elements.from.value = f; form.elements.to.value = t; run();
    });
    run({ stepwise: false });
  }

  return Object.freeze({ convert, parse, mount });
});
