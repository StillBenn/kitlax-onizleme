/* ==========================================================================
   The papers: a wall of certificates, and a viewer for one of them
   --------------------------------------------------------------------------
   The wall. The chips sort it; the cards that stay slide from where they were
   to where they go, the ones that come back rise in (a FLIP: measure, change,
   play the difference back).

   The viewer (a <dialog>: Escape, the focus kept inside, the page inert).
   Opening, the sheet LIFTS OFF ITS CARD: the viewer's sheet is laid out where
   it will rest, then drawn back to the card's sheet — its place, its size, its
   tilt — and let go, so it flies in and straightens while the page dims and
   the facts slide in beside it. Closing plays it home to the card it now
   belongs to (the wall may have moved on under it), or simply fades if that
   card is out of sight. The card's own sheet hides while it is away, so there
   is only ever one. The card's small picture stands in until the whole sheet
   has arrived (same proportions: nothing jumps).
   In the viewer: ← → (mirrored in Arabic), the arrows and a swipe go on through
   the papers on the wall; a click on the sheet shows it at its own size (the
   clicked point brought to the middle), another click fits it again; a paper
   of several pages shows its pages beside the facts.
   Under prefers-reduced-motion nothing flies: the viewer fades in and out.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var wall = document.querySelector(".docs__grid");
  var dlg = document.getElementById("belge");
  if (!wall || !dlg || typeof dlg.showModal !== "function") return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(0.22, 1, 0.36, 1)", INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";
  var t = function (s) { return window.KX ? window.KX.t(s) : s; };
  var rtl = function () { return root.getAttribute("dir") === "rtl"; };
  var cards = [].slice.call(wall.querySelectorAll(".dcard"));
  var V = "?v=1";
  /* when an animation is over — or would have been: a cancelled or never-settling animation
     must not leave the wall or the viewer waiting for it */
  function after(a, ms, fn) {
    var done = false, f = function () { if (!done) { done = true; fn(); } };
    a.finished.then(f, f);
    setTimeout(f, ms + 120);
  }
  var srcOf = function (card, page) { return "./img/belgeler/" + card.dataset.id + "-" + page + ".webp" + V; };

  /* ---- the wall: sorting ---------------------------------------------------------------- */
  var chips = [].slice.call(document.querySelectorAll(".docs__chip"));
  var shown = function () { return cards.filter(function (c) { return !c.hidden; }); };
  function sortTo(group) {
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.filter === group)); });
    var keep = function (c) { return group === "all" || c.dataset.group === group; };
    var first = new Map();
    cards.forEach(function (c) { first.set(c, c.hidden ? null : c.getBoundingClientRect()); });
    var leaving = cards.filter(function (c) { return !c.hidden && !keep(c); });
    var go = function () {
      cards.forEach(function (c) { c.hidden = !keep(c); });
      if (reduced) return;
      var n = 0;
      cards.forEach(function (c) {
        if (c.hidden) return;
        var f = first.get(c), l = c.getBoundingClientRect();
        if (!f) {                                                   /* comes back: rises in */
          c.animate([{ opacity: 0, transform: "translateY(18px) scale(0.94)" }, { opacity: 1, transform: "none" }],
            { duration: 620, delay: 60 + n++ * 45, easing: EASE, fill: "backwards" });
        } else if (Math.abs(f.left - l.left) > 0.5 || Math.abs(f.top - l.top) > 0.5) {
          c.animate([{ transform: "translate(" + (f.left - l.left) + "px," + (f.top - l.top) + "px)" }, { transform: "none" }],
            { duration: 700, easing: EASE });
        }
      });
    };
    if (reduced || !leaving.length) { go(); return; }
    var outs = leaving.map(function (c) {
      return c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.94)" }], { duration: 200, easing: "ease-in", fill: "forwards" });
    });
    after(outs[outs.length - 1], 200, function () {
      outs.forEach(function (a) { a.cancel(); });
      go();
    });
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { if (c.getAttribute("aria-pressed") !== "true") sortTo(c.dataset.filter); }); });

  /* ---- the viewer ----------------------------------------------------------------------- */
  var stage = dlg.querySelector(".dv__stage"), sheet = dlg.querySelector(".dv__sheet");
  var body = dlg.querySelector(".dv__body"), facts = dlg.querySelector(".dv__facts");
  var pagesBox = dlg.querySelector(".dv__pages"), pageBtns = dlg.querySelector(".dv__pagebtns");
  var countB = dlg.querySelector(".dv__count b"), countN = dlg.querySelector(".dv__count span");
  var openLink = dlg.querySelector(".dv__open"), live = dlg.querySelector(".dv__live");
  var list = [], at = 0, page = 1, W = 0, H = 0, zoomed = false, busy = false, opener = null, outCard = null;

  /* the sheet's size: the whole paper inside the stage (never past its own pixels), or its own size zoomed */
  function fit() {
    var cs = getComputedStyle(stage);
    var aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ah = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var k = Math.min(1, aw / W, ah / H);
    var big = zoomed ? 1 : k;
    sheet.style.width = Math.round(W * big) + "px";
    sheet.style.height = Math.round(H * big) + "px";
    stage.classList.toggle("no-zoom", k > 0.92);                   /* already at (nearly) its own size: nothing to zoom */
  }
  /* the card's picture now, the whole sheet when it has come (cached ones at once) */
  var want = "";
  function show(card, p) {
    var full = srcOf(card, p);
    want = full;
    var img = new Image();
    img.decoding = "async";
    img.src = full;
    if (img.complete && img.naturalWidth) { sheet.src = full; return Promise.resolve(); }
    if (p === 1) sheet.src = card.querySelector(".dcard__sheet").currentSrc || card.querySelector(".dcard__sheet").src;
    var ready = (img.decode ? img.decode() : Promise.resolve()).catch(function () {});
    ready.then(function () { if (want === full) sheet.src = full; });
    return p === 1 ? Promise.resolve() : ready;               /* a page has no stand-in: wait for it */
  }
  function preload(card, p) { var i = new Image(); i.decoding = "async"; i.src = srcOf(card, p); }

  /* the facts, from the card (already in the page's language) */
  function fill(card, rise) {
    var b = card.querySelector(".dcard__btn");
    W = +b.dataset.w; H = +b.dataset.h;
    dlg.classList.toggle("dv--wide", W > H);
    dlg.querySelector(".dv__code").textContent = card.querySelector(".dcard__code").textContent;
    dlg.querySelector(".dv__title").textContent = card.querySelector(".dcard__name").textContent;
    dlg.querySelector(".dv__by").textContent = card.querySelector(".dcard__by").textContent;
    var badge = card.querySelector(".dcard__badge"), bd = dlg.querySelector(".dv__badge");
    bd.hidden = !badge; bd.textContent = badge ? badge.textContent : "";
    facts.innerHTML = card.querySelector(".dcard__facts").innerHTML;
    var n = +b.dataset.pages;
    pagesBox.hidden = n < 2;
    pageBtns.innerHTML = "";
    for (var p = 1; p <= n && n > 1; p++) {
      var pb = document.createElement("button");
      pb.type = "button"; pb.className = "dv__page"; pb.dataset.page = p;
      pb.setAttribute("aria-label", t("Sayfa") + " " + p);
      pb.innerHTML = '<img alt="" decoding="async" src="' + srcOf(card, p) + '"><b>' + p + "</b>";
      pageBtns.appendChild(pb);
    }
    countB.textContent = list.indexOf(card) + 1; countN.textContent = list.length;
    if (rise && !reduced) {
      var i = 0;
      [].forEach.call(body.children, function (el) {
        if (el.hidden) return;
        el.classList.remove("is-rising"); void el.offsetWidth;
        el.style.setProperty("--i", i++); el.style.setProperty("--d", rise + "ms");
        el.classList.add("is-rising");
      });
    }
  }
  function markPage() {
    [].forEach.call(pageBtns.children, function (b) { b.setAttribute("aria-current", String(+b.dataset.page === page)); });
    openLink.href = srcOf(list[at], page);
  }
  function announce() {
    var c = list[at];
    live.textContent = (at + 1) + " / " + list.length + " · " + c.querySelector(".dcard__code").textContent + " · " + c.querySelector(".dcard__name").textContent;
  }

  /* the card's sheet as the viewer's sheet would have to be drawn to sit exactly on it */
  function fromCard(card) {
    var cs = card.querySelector(".dcard__sheet"), r = cs.getBoundingClientRect(), s = sheet.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null;
    /* the card's sheet as it is drawn this instant (at rest: tilted; pointed at: straight and larger) */
    var m = getComputedStyle(cs).transform, a = 1, b = 0;
    if (m && m !== "none") { var v = m.match(/-?[\d.e]+/g).map(Number); a = v[0]; b = v[1]; }
    var k = cs.offsetWidth * Math.sqrt(a * a + b * b) / sheet.offsetWidth;     /* offset sizes: no transform in them */
    var tilt = Math.atan2(b, a) * 180 / Math.PI;
    return "translate(" + ((r.left + r.width / 2) - (s.left + s.width / 2)) + "px," + ((r.top + r.height / 2) - (s.top + s.height / 2)) + "px) "
      + "scale(" + k + ") rotate(" + tilt + "deg)";
  }
  var LIFT = "0 60px 110px -40px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.35)";
  var REST = "0 16px 26px -14px rgba(29,20,14,0.5), 0 1px 2px rgba(29,20,14,0.22)";

  function open(card) {
    if (busy || dlg.open) return;
    list = shown(); at = list.indexOf(card); page = 1; zoomed = false; opener = card.querySelector(".dcard__btn");
    stage.classList.remove("is-zoomed");
    fill(card, 260);
    show(card, 1); markPage(); announce();
    dlg.classList.toggle("is-single", list.length < 2);
    root.classList.add("has-modal");
    dlg.classList.remove("is-leaving");
    dlg.classList.add("is-entering");
    dlg.showModal();
    stage.scrollTop = 0; stage.scrollLeft = 0;
    fit();
    var from = !reduced && fromCard(card);
    outCard = card; card.classList.add("is-out");
    if (from) {
      busy = true;
      var a = sheet.animate([
        { transform: from, boxShadow: REST },
        { transform: "translateY(-2%) scale(1.012) rotate(" + (-0.3 * (rtl() ? -1 : 1)) + "deg)", boxShadow: LIFT, offset: 0.72 },
        { transform: "none", boxShadow: LIFT }
      ], { duration: 820, easing: EASE });
      after(a, 820, function () { busy = false; });
    } else if (!reduced) {
      sheet.animate([{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE });
    }
    setTimeout(function () { dlg.classList.remove("is-entering"); }, 1400);
    list.forEach(function (c, i) { if (Math.abs(i - at) === 1 || (i === 0 && at === list.length - 1) || (at === 0 && i === list.length - 1)) preload(c, 1); });
    for (var p = 2; p <= +card.querySelector(".dcard__btn").dataset.pages; p++) preload(card, p);
  }

  function close() {
    if (!dlg.open || dlg.classList.contains("is-leaving")) return;
    var card = list[at], to = null;
    if (zoomed) { zoomed = false; stage.classList.remove("is-zoomed"); fit(); }
    dlg.classList.remove("is-entering");
    dlg.classList.add("is-leaving");
    if (outCard && outCard !== card) outCard.classList.remove("is-out");
    card.classList.add("is-out"); outCard = card;
    var done = function () {
      dlg.close();
      dlg.classList.remove("is-leaving");
      card.classList.remove("is-out"); outCard = null;
      root.classList.remove("has-modal");
      busy = false;
      var back = card.hidden ? opener : card.querySelector(".dcard__btn");
      if (back) back.focus({ preventScroll: true });
    };
    if (reduced) { done(); return; }
    busy = true;
    if (page !== 1) { page = 1; sheet.src = srcOf(card, 1); }
    to = fromCard(card);
    var a = to
      ? sheet.animate([{ transform: "none", boxShadow: LIFT }, { transform: to, boxShadow: REST }], { duration: 640, easing: INOUT, fill: "forwards" })
      : sheet.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.94)" }], { duration: 320, easing: "ease-in", fill: "forwards" });
    after(a, to ? 640 : 320, function () { done(); a.cancel(); });
  }

  /* on through the wall: the sheet leaves one way, the next comes in from the other */
  function go(step) {
    if (busy || list.length < 2) return;
    busy = true;
    var from = list[at];
    at = (at + step + list.length) % list.length; page = 1;
    var card = list[at];
    if (zoomed) { zoomed = false; stage.classList.remove("is-zoomed"); }
    var dir = step * (rtl() ? -1 : 1);
    var swap = function () {
      from.classList.remove("is-out"); card.classList.add("is-out"); outCard = card;
      fill(card, 0); show(card, 1); markPage(); announce();
      fit();
      var neighbour = list[(at + step + list.length) % list.length];
      preload(neighbour, 1);
      for (var p = 2; p <= +card.querySelector(".dcard__btn").dataset.pages; p++) preload(card, p);
    };
    if (reduced) { swap(); busy = false; return; }
    var out = sheet.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (-7 * dir) + "%) rotate(" + (-2.4 * dir) + "deg) scale(0.97)" }],
      { duration: 230, easing: "cubic-bezier(0.55, 0, 1, 0.45)", fill: "forwards" });
    after(out, 230, function () {
      swap();
      out.cancel();
      after(sheet.animate([{ opacity: 0, transform: "translateX(" + (8 * dir) + "%) rotate(" + (2.6 * dir) + "deg) scale(0.97)" }, { opacity: 1, transform: "none" }],
        { duration: 560, easing: EASE }), 560, function () { busy = false; });
    });
  }
  function turnTo(p) {
    if (busy || p === page) return;
    var dir = p > page ? 1 : -1;
    page = p; markPage();
    if (zoomed) { zoomed = false; stage.classList.remove("is-zoomed"); fit(); }
    if (reduced) { show(list[at], p); return; }
    busy = true;
    var ready = show(list[at], p), mine = p;
    var out = sheet.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(" + (-3 * dir) + "%)" }], { duration: 180, easing: "ease-in", fill: "forwards" });
    after(out, 180, function () {
      var back = function () {
        if (mine !== page) return;
        out.cancel();
        after(sheet.animate([{ opacity: 0, transform: "translateY(" + (4 * dir) + "%)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE }), 420, function () { busy = false; });
      };
      var waited = false, once = function () { if (!waited) { waited = true; back(); } };
      ready.then(once, once);
      setTimeout(once, 2500);                                    /* a page slow to come shows its stand-in rather than nothing */
    });
  }

  /* its own size, the clicked point to the middle; and back */
  var swiped = false;
  sheet.addEventListener("click", function (e) {
    if (swiped || busy || stage.classList.contains("no-zoom")) return;
    var r = sheet.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    zoomed = !zoomed;
    stage.classList.toggle("is-zoomed", zoomed);
    fit();
    if (zoomed) {
      var n = sheet.getBoundingClientRect(), s = stage.getBoundingClientRect();
      stage.scrollLeft += (n.left + fx * n.width) - (s.left + s.width / 2);
      stage.scrollTop += (n.top + fy * n.height) - (s.top + s.height / 2);
    }
    if (!reduced) sheet.animate([{ opacity: 0.6, transform: "scale(" + (zoomed ? 0.94 : 1.04) + ")" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE });
  });

  /* a swipe across the sheet goes on (touch only; not while zoomed, where the finger pans) */
  var sx = 0, sy = 0, st = 0, touching = false;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || zoomed) return;
    touching = true; sx = e.clientX; sy = e.clientY; st = performance.now(); swiped = false;
  });
  stage.addEventListener("pointerup", function (e) {
    if (!touching) return;
    touching = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && performance.now() - st < 700) {
      swiped = true;
      go((dx < 0 ? 1 : -1) * (rtl() ? -1 : 1));
      setTimeout(function () { swiped = false; }, 350);
    }
  });
  stage.addEventListener("pointercancel", function () { touching = false; });

  dlg.querySelector(".dv__nav--prev").addEventListener("click", function () { go(-1); });
  dlg.querySelector(".dv__nav--next").addEventListener("click", function () { go(1); });
  dlg.querySelector(".dv__close").addEventListener("click", close);
  pageBtns.addEventListener("click", function (e) { var b = e.target.closest(".dv__page"); if (b) turnTo(+b.dataset.page); });
  dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target === stage) close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if (e.target.closest && e.target.closest(".dv__body") && body.scrollWidth > body.clientWidth) return;
    e.preventDefault();
    go((e.key === "ArrowRight" ? 1 : -1) * (rtl() ? -1 : 1));
  });
  addEventListener("resize", function () { if (dlg.open) fit(); });

  cards.forEach(function (c) { c.querySelector(".dcard__btn").addEventListener("click", function () { open(c); }); });
})();
