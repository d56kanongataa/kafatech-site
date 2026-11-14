(() => {
  const projects = window.KAFA_PROJECTS || [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const HOLD_MS = 450;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  const initials = name => name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const buzz = () => navigator.vibrate && navigator.vibrate(12);

  // Swap a broken logo for an initials badge.
  function logoFallback(img, label) {
    const swap = () => img.replaceWith(el("span", img.className + " badge", label));
    if (img.complete && img.naturalWidth === 0) return swap(); // already failed before this script ran
    img.addEventListener("error", swap, { once: true });
  }
  document.querySelectorAll("img[data-fallback]").forEach(i => logoFallback(i, i.dataset.fallback));

  // Press-and-hold helper: calls onHold after HOLD_MS; returns a check so the following click can be ignored.
  function onPressHold(node, onHold, onRelease) {
    let timer, held = false, sx = 0, sy = 0;
    const cancel = () => { clearTimeout(timer); if (held && onRelease) onRelease(); };
    node.addEventListener("pointerdown", e => {
      held = false; sx = e.clientX; sy = e.clientY;
      timer = setTimeout(() => { held = true; buzz(); onHold(e); }, HOLD_MS);
    });
    node.addEventListener("pointermove", e => { if (Math.hypot(e.clientX - sx, e.clientY - sy) > 10) clearTimeout(timer); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(t => node.addEventListener(t, cancel));
    node.addEventListener("contextmenu", e => { if (held) e.preventDefault(); });
    return () => held;
  }

  // ---------- Project details dialog ("Read more") ----------
  const dlg = document.getElementById("details");
  // Extra project links (e.g. social page, early-access email). mailto opens in place; web links in a new tab.
  function linkBtn(l, cls) {
    const a = el("a", cls, l.label); a.href = l.href;
    if (!l.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  function openDetails(p, statusText, statusCls, live) {
    const body = dlg.querySelector(".details-body");
    body.textContent = "";
    if (p.media && p.media.logo) { const i = el("img", "details-logo"); i.alt = `${p.name} logo`; i.addEventListener("error", () => i.remove(), { once: true }); i.src = p.media.logo; body.append(i); }
    body.append(el("span", `status ${statusCls}`, statusText), el("h3", "", p.headline || p.name));
    p.about.forEach(t => body.append(el("p", "", t)));
    const row = el("div", "details-links");
    if (live) { const a = el("a", "btn primary", "Visit site"); a.href = p.url; a.target = "_blank"; a.rel = "noopener"; row.append(a); }
    (p.links || []).forEach((l, n) => row.append(linkBtn(l, n || live ? "btn ghost" : "btn primary")));
    if (row.children.length) body.append(row);
    dlg.showModal();
  }
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest(".details-close")) dlg.close(); });

  // ---------- Project cards ----------
  const grid = document.getElementById("project-grid");
  const dots = document.getElementById("dots");
  projects.forEach((p, i) => {
    const live = p.status === "live" && p.url && p.url !== "#";
    const card = el("article", "card reveal");
    card.tabIndex = 0;
    card.dataset.status = p.status;
    card.style.setProperty("--d", `${(i % 3) * 0.08}s`);
    card.setAttribute("aria-label", `${p.name}. ${live ? "Opens site" : "Press Enter for details"}`);

    const inner = el("div", "card-inner");
    const front = el("div", "face front");
    const back = el("div", "face back");

    const media = el("div", "media");
    if (p.media && p.media.image) {
      media.classList.add("photo");
      media.style.backgroundImage = `url("${p.media.image}")`;
    } else if (p.media && p.media.logo) {
      media.classList.add("light");
      const big = el("img", "media-logo");
      big.src = p.media.logo; big.alt = ""; big.loading = "lazy";
      media.append(big);
    } else {
      media.classList.add("empty");
      media.append(el("span", "media-initials", initials(p.name)));
    }

    const statusText = { live: "Live", soon: "Coming soon" }[p.status] || "In development";
    const statusCls = { live: "live", soon: "soon" }[p.status] || "dev";
    const head = el("div", "card-head");
    const logo = el("img", "logo");
    logo.src = `assets/logos/${p.logo}`; logo.alt = ""; logo.loading = "lazy";
    logoFallback(logo, initials(p.name));
    const titles = el("div");
    titles.append(el("h3", "", p.name), el("p", "tag", p.tagline));
    head.append(logo, titles);
    front.append(el("span", `status ${statusCls}`, statusText), media, head, el("span", "go", live ? "Visit site →" : "Tap for details"));

    back.append(el("span", `status ${statusCls}`, statusText), el("h3", "", p.name), el("p", "desc", p.desc));
    const actions = el("div", "actions");
    if (live) {
      const cta = el("a", "btn small primary", "Visit site");
      cta.href = p.url; cta.target = "_blank"; cta.rel = "noopener";
      actions.append(cta);
    }
    (p.links || []).slice(0, 1).forEach(l => actions.append(linkBtn(l, `btn small ${live ? "ghost" : "primary"}`)));
    if (p.about) {
      const more = el("button", "btn small ghost", "Read more");
      more.type = "button";
      more.addEventListener("click", () => openDetails(p, statusText, statusCls, live));
      actions.append(more);
    }
    if (!actions.children.length) actions.append(el("span", "btn small ghost", p.status === "soon" ? "Launching soon" : (p.status === "live" ? "Link coming soon" : "In development")));
    back.append(actions, el("span", "go", "Tap to flip back"));

    inner.append(front, back);
    card.append(inner);
    grid.append(card);

    const flip = () => card.classList.toggle("flipped");
    const open = () => window.open(p.url, "_blank", "noopener");
    const wasHeld = onPressHold(card, flip);
    card.addEventListener("click", e => {
      if (wasHeld()) return;                 // hold already flipped it
      if (e.target.closest("a, button")) return;     // CTA link / Read more handle themselves
      live && !card.classList.contains("flipped") ? open() : flip();
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); live ? open() : flip(); }
      if (e.key === "f") flip();
    });

    const dot = el("button");
    dot.setAttribute("aria-label", `Go to ${p.name}`);
    dot.addEventListener("click", () => card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" }));
    dots.append(dot);
  });

  // Mobile carousel dots follow the swipe position.
  const cards = [...grid.querySelectorAll(".card")];
  const dotBtns = [...dots.children];
  const setDot = () => {
    const mid = grid.scrollLeft + grid.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => { if (c.classList.contains("hidden")) return; const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
    dotBtns.forEach((b, i) => b.classList.toggle("on", i === best));
  };
  grid.addEventListener("scroll", () => requestAnimationFrame(setDot), { passive: true });
  setDot();

  // Card tilt + spotlight (mouse only)
  if (!reduceMotion && finePointer) {
    grid.addEventListener("pointermove", e => {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", `${x * 100}%`);
      c.style.setProperty("--my", `${y * 100}%`);
      c.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      c.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    });
    grid.addEventListener("pointerout", e => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    });
  }

  // Filters (animated)
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach(b => b.setAttribute("aria-selected", b === btn));
      const f = btn.dataset.filter;
      cards.forEach((c, i) => {
        const show = f === "all" || c.dataset.status === f;
        dotBtns[i].hidden = !show;
        if (show) { c.classList.remove("hidden"); requestAnimationFrame(() => c.classList.remove("leaving")); }
        else { c.classList.add("leaving"); setTimeout(() => c.classList.contains("leaving") && c.classList.add("hidden"), reduceMotion ? 0 : 250); }
      });
      setTimeout(setDot, 300);
    });
  });

  // ---------- Hero starfield: gold stars linked like wayfinding charts; drawn toward the cursor/finger ----------
  (() => {
    const cv = document.getElementById("stars");
    if (!cv) return;
    const ctx = cv.getContext("2d"), hero = cv.parentElement;
    let w, h, dpr, stars = [], pointer = null, raf;
    const LINK = 150;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, w * h / 16000));
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.8 + .7, tw: Math.random() * Math.PI * 2 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduceMotion) {
          s.x += s.vx; s.y += s.vy; s.tw += .03;
          if (pointer) { const dx = pointer.x - s.x, dy = pointer.y - s.y, d = Math.hypot(dx, dy); if (d < 180) { s.x += dx * .006; s.y += dy * .006; } }
          if (s.x < 0 || s.x > w) s.vx *= -1;
          if (s.y < 0 || s.y > h) s.vy *= -1;
        }
      }
      for (let i = 0; i < stars.length; i++) for (let k = i + 1; k < stars.length; k++) {
        const a = stars[i], b = stars[k], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) { ctx.strokeStyle = `rgba(212,166,64,${(1 - d / LINK) * .38})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      if (pointer) for (const s of stars) {
        const d = Math.hypot(pointer.x - s.x, pointer.y - s.y);
        if (d < 180) { ctx.strokeStyle = `rgba(243,211,130,${(1 - d / 180) * .45})`; ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(s.x, s.y); ctx.stroke(); }
      }
      for (const s of stars) {
        ctx.fillStyle = `rgba(243,211,130,${.6 + Math.sin(s.tw) * .3})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    const setPointer = e => { const r = hero.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    hero.addEventListener("pointermove", setPointer, { passive: true });
    hero.addEventListener("pointerdown", setPointer, { passive: true });
    hero.addEventListener("pointerleave", () => { pointer = null; });
    hero.addEventListener("pointerup", e => { if (e.pointerType !== "mouse") pointer = null; });
    // Pause when the hero is off screen to save battery.
    new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) draw(); }).observe(hero);
    addEventListener("resize", () => { size(); if (reduceMotion) draw(); });
    size(); // first draw comes from the IntersectionObserver callback
  })();

  // Hide filter tabs with no matching projects (and the whole bar if only "All" is left).
  const fbtns = [...document.querySelectorAll(".filters button")];
  fbtns.forEach(b => { if (b.dataset.filter !== "all" && !cards.some(c => c.dataset.status === b.dataset.filter)) b.hidden = true; });
  if (fbtns.every(b => b.hidden || b.dataset.filter === "all")) document.querySelector(".filters").hidden = true;

  // ---------- Animation layer ----------
  // Intro screen: hide once the page has loaded (or after 1.6s at most).
  const endIntro = () => document.body.classList.remove("loading");
  if (reduceMotion) endIntro();
  else { addEventListener("load", () => setTimeout(endIntro, 700)); setTimeout(endIntro, 1600); }

  // Split hero headline into letters for the staggered rise.
  let ci = 0;
  document.querySelectorAll(".split-text .line").forEach(line => {
    const text = line.textContent; line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    [...text].forEach(ch => {
      const s = el("span", "char", ch === " " ? "\u00a0" : ch);
      s.style.setProperty("--i", ci++);
      line.append(s);
    });
  });

  // Gentle parallax on the hero as you scroll.
  const heroLogo = document.querySelector(".hero-logo"), heroLead = document.querySelector(".hero .lead");
  if (!reduceMotion) addEventListener("scroll", () => {
    const y = Math.min(scrollY, innerHeight);
    if (heroLogo) heroLogo.style.transform = `translateY(${y * .25}px) rotate(${y * .05}deg)`;
    if (heroLead) heroLead.style.transform = `translateY(${y * .12}px)`;
  }, { passive: true });

  // Cursor glow.
  const glow = document.querySelector(".cursor-glow");
  if (finePointer && !reduceMotion && glow) {
    let gx = 0, gy = 0, tx = 0, ty = 0, running = false;
    const loop = () => { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px, ${gy}px)`; running = Math.abs(tx - gx) + Math.abs(ty - gy) > .5; if (running) requestAnimationFrame(loop); };
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); if (!running) { running = true; requestAnimationFrame(loop); } }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("on"));
  }

  // ---------- Buttons: magnetic hover + tap ripple ----------
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn, .filters button");
    if (!b || reduceMotion) return;
    const r = b.getBoundingClientRect();
    const s = el("span", "ripple");
    s.style.left = `${e.clientX - r.left}px`; s.style.top = `${e.clientY - r.top}px`;
    b.append(s);
    setTimeout(() => s.remove(), 600);
  });
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  // ---------- Marquee (drag to scrub) + footer ----------
  const track = document.getElementById("marquee");
  const names = projects.map(p => p.name);
  [...names, ...names, ...names, ...names].forEach(n => track.append(el("span", "", n)));
  const foot = document.getElementById("footer-projects");
  projects.forEach(p => {
    const li = el("li"), a = el("a", "", p.name);
    a.href = p.url && p.url !== "#" ? p.url : "#projects";
    li.append(a); foot.append(li);
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("stat-projects").dataset.count = projects.length;

  // ---------- Scroll reveal, counters, progress ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(n => reduceMotion ? n.classList.add("in") : io.observe(n));

  const counter = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const n = e.target, end = +n.dataset.count, suf = n.dataset.suffix || "";
      counter.unobserve(n);
      if (reduceMotion) { n.textContent = end + suf; return; }
      const t0 = performance.now(), dur = 1200;
      const step = t => {
        const k = Math.min(1, (t - t0) / dur);
        n.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(n => counter.observe(n));

  const nav = document.querySelector(".nav");
  const bar = document.querySelector(".progress");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !open);
    menu.classList.toggle("open", !open);
  });
  menu.addEventListener("click", e => {
    if (e.target.tagName === "A") { btn.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); }
  });
})();
