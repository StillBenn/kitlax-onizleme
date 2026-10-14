/* ==========================================================================
   The home page below the film
   --------------------------------------------------------------------------
   · Figures count up once as they come on screen.
   · The koala changes into each flavour's colour and holds that flavour's bag
     up by its top seal: its overalls are found once by their hue (the red of
     the artwork) and recoloured on a canvas laid over the picture; the bags
     (tools/koala_hold.py) hang under its own fist, laid back over the grip, and
     the new one swings in on the grip as it is chosen. It leans a little
     toward the pointer.
   · A phone's bar shows once the film is behind the reader.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(pointer: fine)").matches;

  /* ---- figures, counted in ---- */
  /* thousands grouped the reader's way: 37.960 in Turkish, 37,960 in English and Arabic */
  function fmtOf(el) {
    var group = el.hasAttribute("data-sep");
    return function (v) {
      var s = String(Math.round(v)), sep = window.KX && window.KX.lang() !== "tr" ? "," : ".";
      return group ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
    };
  }
  function count(el) {
    var to = +el.getAttribute("data-to"), fmt = fmtOf(el);
    if (reduced) { el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 1600;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(to * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var once = function (el, fn) {
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.35 });
    io.observe(el);
  };
  var figs = document.querySelector("[data-count]");
  if (figs) {
    var bs = [].slice.call(figs.querySelectorAll("[data-to]"));
    if (!reduced) bs.forEach(function (b) { b.textContent = "0"; });
    var counted = false;
    once(figs, function () { counted = true; bs.forEach(count); });
    if (window.KX) window.KX.on(function () { if (counted) bs.forEach(function (b) { b.textContent = fmtOf(b)(+b.getAttribute("data-to")); }); });
  }

  /* ---- the koala, dressed ---- */
  var img = document.querySelector(".koala__img"), cv = document.querySelector(".koala__paint");
  var stage = document.querySelector(".koala__stage");
  var dress = [].slice.call(document.querySelectorAll("[data-dress]"));
  /* the artwork wears ketçap red; each other flavour's colour as hue and saturation (the bags' own,
     a little livelier: dyed cloth, not ink) */
  var DYE = { ketcap: null, peynir: [112, 0.42], sut: [182, 0.58], tako: [214, 0.62] };
  var mask = null, base = null;
  function prepare() {
    if (mask || !img.naturalWidth) return !!mask;
    var w = img.naturalWidth, h = img.naturalHeight;
    cv.width = w; cv.height = h;
    var cx = cv.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    try { base = cx.getImageData(0, 0, w, h); } catch (e) { return false; }
    var d = base.data; mask = new Float32Array(w * h);
    var top = Math.round(h * 0.37) * w;                /* the overalls are below the face: the ears' pink and the mouth stay */
    for (var i = top * 4, p = top; i < d.length; i += 4, p++) {
      var r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (d[i + 3] < 8 || mx - mn < 0.18) continue;
      var hue = mx === r ? ((g - b) / (mx - mn) + 6) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
      hue *= 60;
      /* the overalls' red: hue near 0/360, well saturated — not the koala's orange fur (hue ~25-40) */
      var dist = Math.min(Math.abs(hue - 358), Math.abs(hue + 2));
      if (dist < 14 && (mx - mn) / mx > 0.45) mask[p] = Math.min(1, (14 - dist) / 6);
    }
    return true;
  }
  function paint(slug) {
    var target = DYE[slug];
    if (!target) { cv.classList.remove("is-on"); return; }
    if (!prepare()) return;
    var cx = cv.getContext("2d"), out = cx.createImageData(base.width, base.height), s = base.data, o = out.data;
    for (var i = 0, p = 0; i < s.length; i += 4, p++) {
      var m = mask[p];
      if (!m) { o[i + 3] = 0; continue; }
      var r = s[i] / 255, g = s[i + 1] / 255, b = s[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
      var sat = mx === mn ? 0 : (l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn));
      var rgb = hsl(target[0] / 360, Math.min(sat, target[1]), l);
      o[i] = rgb[0]; o[i + 1] = rgb[1]; o[i + 2] = rgb[2]; o[i + 3] = Math.round(s[i + 3] * m);
    }
    cx.putImageData(out, 0, 0);
    cv.classList.add("is-on");
  }
  function hsl(h, s, l) {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var f = function (t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
  }
  var hold = document.querySelector(".koala__hold");
  var bags = hold ? [].slice.call(hold.querySelectorAll("[data-bag]")) : [];
  function holdBag(slug) {
    if (!hold) return;
    bags.forEach(function (im) { im.classList.toggle("is-on", im.getAttribute("data-bag") === slug); });
    if (reduced) return;
    hold.classList.remove("is-swinging");
    void hold.offsetWidth;                             /* restart the swing when chosen again mid-swing */
    hold.classList.add("is-swinging");
  }
  if (hold) hold.addEventListener("animationend", function () { hold.classList.remove("is-swinging"); });
  dress.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("aria-pressed") === "true") return;
      dress.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var slug = b.getAttribute("data-dress");
      holdBag(slug);
      var go = function () { paint(slug); };
      if (img.complete) go(); else img.addEventListener("load", go, { once: true });
    });
  });
  if (stage && fine && !reduced) {
    var sec = stage.closest("section");
    sec.addEventListener("pointermove", function (e) {
      var r = sec.getBoundingClientRect();
      stage.style.setProperty("--kx", (((e.clientX - r.left) / r.width - 0.5) * 18).toFixed(1) + "px");
      stage.style.setProperty("--ky", (((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1) + "px");
    });
    sec.addEventListener("pointerleave", function () { stage.style.setProperty("--kx", "0px"); stage.style.setProperty("--ky", "0px"); });
  }

  /* ---- a phone's bar, once the film (or a flavour page's own buttons) is behind ---- */
  var bar = document.querySelector(".mbar");
  if (bar) {
    var film = document.querySelector('[data-film="main"]');
    var cta = document.querySelector(".ahero__cta");
    var tick = function () {
      var past = film ? film.getBoundingClientRect().bottom < innerHeight * 0.6
        : cta ? cta.getBoundingClientRect().bottom < 0 : scrollY > innerHeight;
      var foot = document.querySelector(".trade");
      var atForm = foot && foot.getBoundingClientRect().top < innerHeight * 0.7;
      bar.classList.toggle("is-on", past && !atForm);
    };
    addEventListener("scroll", tick, { passive: true }); tick();
  }
})();
