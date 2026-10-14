/* ==========================================================================
   The flavours: cards and bags that answer the pointer
   --------------------------------------------------------------------------
   · A flavour card tilts toward the pointer (a few degrees, eased) and a soft
     light follows it across the card; leaving lets it settle back.
   · On a flavour's page the big bag does the same, a little more.
   · Opening a flavour: the browser's own cross-document view transition flies
     the bag from the card to its page (view-transition-name bag-<slug>, CSS).
   · Share: the system share sheet where there is one, the link copied where not.
   Fine pointers only for the tilt; never under reduced motion.
   ========================================================================== */
(function () {
  "use strict";
  var fine = matchMedia("(pointer: fine)").matches;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t = function (s) { return window.KX ? window.KX.t(s) : s; };

  function tilt(el, target, max) {
    var raf = 0, px = 0.5, py = 0.5;
    function paint() {
      raf = 0;
      target.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
      target.style.setProperty("--rx", (-(py - 0.5) * 2 * max).toFixed(2) + "deg");
      target.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      target.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    }
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      target.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(paint);
    });
    el.addEventListener("pointerleave", function () {
      target.classList.remove("is-tilting");
      px = 0.5; py = 0.5;
      if (!raf) raf = requestAnimationFrame(paint);
    });
  }

  if (fine && !reduced) {
    document.querySelectorAll(".flv").forEach(function (card) { tilt(card, card, 6); });
    var stage = document.querySelector("[data-tilt]");
    if (stage) tilt(document.querySelector(".ahero") || stage, stage, 9);
  }
  /* a soft sound when the pointer meets a card (js/sound.js plays it only when sound is on) */
  document.querySelectorAll(".flv__link").forEach(function (a) {
    a.addEventListener("pointerenter", function () { document.dispatchEvent(new CustomEvent("kx:sfx", { detail: "hover" })); });
  });

  /* share this flavour */
  var share = document.querySelector("[data-share]");
  var said = document.querySelector(".ahero__copied");
  if (share) share.addEventListener("click", function () {
    var data = { title: document.title, url: location.href.split("#")[0] };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () {
      if (!said) return;
      var put = function () { said.textContent = said.dataset.key ? t(said.dataset.key) : ""; };
      said.dataset.key = "Bağlantı kopyalandı."; put();
      if (window.KX && !said.__kx) { said.__kx = 1; window.KX.on(put); }
      setTimeout(function () { said.dataset.key = ""; put(); }, 2600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done, function () {});
  });
})();
