/* ==========================================================================
   The page around the film: the loader, the header, words that arrive
   --------------------------------------------------------------------------
   The loader is a curtain the film lifts (js/film.js calls FilmIntro): its bar
   is the opening's frames actually arriving, not a timer. The header gets a
   ground of its own only over the page, never over the film. Each block of
   the page rises into place once as it comes on screen (off under reduced
   motion; without JS nothing is hidden: html.rv is set here).
   ========================================================================== */
(function () {
  "use strict";
  var html = document.documentElement;
  var bar = document.querySelector(".loader__bar");
  var shown = 0, lifted = false, t0 = performance.now();
  var MIN_MS = 700;                  /* a cached visit still sees the curtain, not a flash of it */

  function paint(p) {
    shown = Math.max(shown, Math.min(1, p));
    if (bar) bar.style.setProperty("--p", shown.toFixed(3));
  }
  function lift() {
    if (lifted) return;
    lifted = true;
    paint(1);
    setTimeout(function () {
      html.classList.remove("is-loading");
      dispatchEvent(new Event("intro:done"));
      setTimeout(function () { html.classList.add("is-written"); }, 1800);
    }, Math.max(0, MIN_MS - (performance.now() - t0)));
  }
  window.FilmIntro = { progress: paint, done: lift };
  setTimeout(lift, 12000);           /* never trapped behind the curtain */

  /* arriving at index.html#part: the browser scrolls to the part before the film has grown to its real
     length (that needs its manifest), and the part is pushed far down — follow it until the reader moves */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var hashEl = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (hashEl) {
    var moved = false;
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (t) { addEventListener(t, function () { moved = true; }, { once: true, passive: true }); });
    var settle = function () { if (!moved) window.scrollTo(0, hashEl.getBoundingClientRect().top + scrollY); };
    addEventListener("film:layout", function (e) { if (e.detail && e.detail.id === "main") settle(); });
    addEventListener("load", settle);
    setTimeout(function () { moved = true; }, 6000);
  }

  /* the reader has taken over */
  addEventListener("scroll", function once() {
    if (scrollY > 12) { html.classList.add("has-scrolled"); removeEventListener("scroll", once); }
  }, { passive: true });

  /* the header: its own ground over the page, transparent over the film */
  var hdr = document.querySelector(".hdr");
  function stuck() {
    if (!hdr) return;
    var onFilm = html.dataset.film === "dark" || html.dataset.film === "light";
    hdr.classList.toggle("is-stuck", !onFilm && scrollY > 10);
  }
  addEventListener("scroll", stuck, { passive: true });
  new MutationObserver(stuck).observe(html, { attributes: true, attributeFilter: ["data-film"] });
  stuck();

  /* words arrive, part after part */
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var groups = [].slice.call(document.querySelectorAll(".sec-head, .flv-list, .maker__text, .figures, .maker__grid, .koala__text, .koala__stage, .trade__text, .form, .pinfo__side, .pinfo__list, .pshape__img, .pshape__text"));
  if (!reduced && "IntersectionObserver" in window && groups.length) {
    html.classList.add("rv");
    groups.forEach(function (g) {
      /* an image, a picture's stage or one step rises as one; a block rises child after child */
      var parts = g.matches("img, .koala__stage, .pshape__img") ? [g] : [].slice.call(g.children);
      parts.forEach(function (el, i) { el.classList.add("rv__p"); el.style.setProperty("--i", Math.min(i, 8)); });
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 });
    groups.forEach(function (g) { io.observe(g); });
  }

  /* the documents: a card opens its sheet whole, fitted to the screen. A click on the sheet
     shows it at its own size (scrolling round it, the clicked point brought to the middle);
     Escape, the cross or the dimmed page around it closes. The card's small picture stands
     in until the full one has arrived, at the same size, so nothing jumps. */
  var dlg = document.getElementById("belge");
  if (dlg && typeof dlg.showModal === "function") {
    var card = dlg.querySelector(".doc__card"), head = dlg.querySelector(".doc__head");
    var big = dlg.querySelector(".doc__img"), opener = null, W = 0, H = 0, zoomed = false;
    var fit = function () {
      var cs = getComputedStyle(dlg);
      var aw = dlg.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var ah = dlg.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - head.offsetHeight - 15;
      var k = zoomed ? 1 : Math.min(1, aw / W, ah / H);
      var w = Math.round(W * k), h = Math.round(H * k);
      big.style.width = w + "px"; big.style.height = h + "px";
      card.style.width = Math.max(w, Math.min(aw, 320)) + "px";
    };
    var shut = function () {
      if (!dlg.open || dlg.classList.contains("is-closing")) return;
      dlg.classList.add("is-closing");
      setTimeout(function () {
        dlg.classList.remove("is-closing", "is-zoomed");
        dlg.close();
      }, reduced ? 0 : 190);
    };
    dlg.addEventListener("close", function () {
      html.classList.remove("has-modal");
      big.removeAttribute("src");
      if (opener) opener.focus({ preventScroll: true });
    });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); shut(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) shut(); });
    dlg.querySelector(".doc__close").addEventListener("click", shut);
    big.addEventListener("click", function (e) {
      var r = big.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      zoomed = !zoomed;
      dlg.classList.toggle("is-zoomed", zoomed);
      fit();
      var n = big.getBoundingClientRect();
      dlg.scrollLeft += n.left + fx * n.width - dlg.clientWidth / 2;
      dlg.scrollTop += n.top + fy * n.height - dlg.clientHeight / 2;
    });
    addEventListener("resize", function () { if (dlg.open) fit(); });
    [].forEach.call(document.querySelectorAll(".cert__doc"), function (b) {
      b.addEventListener("click", function () {
        var c = b.closest(".cert"), thumb = b.querySelector("img");
        opener = b; zoomed = false;
        W = +b.dataset.w; H = +b.dataset.h;
        dlg.querySelector(".doc__title").textContent = c.querySelector(".cert__title").textContent;
        dlg.querySelector(".doc__by").textContent = c.querySelector(".cert__by").textContent;
        big.alt = c.querySelector(".cert__title").textContent;
        big.src = thumb.currentSrc || thumb.src;
        var full = new Image();
        full.onload = function () { if (dlg.open && opener === b) big.src = full.src; };
        full.src = b.dataset.doc;
        html.classList.add("has-modal");
        dlg.showModal();
        dlg.scrollTop = 0; dlg.scrollLeft = 0;
        fit();
      });
    });
  }
})();
