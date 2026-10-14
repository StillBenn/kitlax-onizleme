/* ==========================================================================
   The distributor form, with a case calculator
   --------------------------------------------------------------------------
   Per flavour, how many cases (− / + or typed); the totals follow live: cases,
   bags (48 a case) and net weight (1.92 kg a case). A static site has nowhere
   to post a form to: the request — the cases per flavour, the totals, every
   field — is written out as an e-mail to the company's own address, ready to
   send from the visitor's mail app; or copied, to paste anywhere.
   Required: a name, a place and a way to reach them.
   A flavour page's "request an offer" arrives as ?aroma=<slug>: that flavour
   starts at one case.
   ========================================================================== */
(function () {
  "use strict";
  var form = document.querySelector("[data-trade]");
  if (!form) return;
  var t = function (s) { return window.KX ? window.KX.t(s) : s; };
  var TO = "besler@beslermakarna.com";
  var hint = form.querySelector(".form__hint");
  /* a message is kept by its Turkish text and written again in the reader's language when it changes */
  var said = "";
  var say = function (s) { said = s; hint.textContent = s ? t(s) : ""; };
  if (window.KX) window.KX.on(function () { say(said); });
  var PER_CASE = 48, KG_CASE = 1.92;
  var inputs = [].slice.call(form.querySelectorAll("[data-calc] input[data-flavour]"));
  var sums = {};
  form.querySelectorAll("[data-sum]").forEach(function (el) { sums[el.getAttribute("data-sum")] = el; });

  var n = function (el) { var v = parseInt(el.value, 10); return isFinite(v) && v > 0 ? Math.min(v, 9999) : 0; };
  var num = function (v, dec) {
    var lang = window.KX ? window.KX.lang() : "tr";
    return v.toLocaleString(lang === "en" ? "en-GB" : "tr-TR", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  };
  function total() {
    var koli = inputs.reduce(function (s, el) { return s + n(el); }, 0);
    sums.koli.textContent = num(koli);
    sums.paket.textContent = num(koli * PER_CASE);
    sums.kg.textContent = num(koli * KG_CASE, koli ? 2 : 0) + " kg";
    return koli;
  }
  form.querySelectorAll("[data-step]").forEach(function (b) {
    b.addEventListener("click", function () {
      var el = form.querySelector('input[data-flavour="' + b.getAttribute("data-for") + '"]');
      el.value = Math.max(0, Math.min(9999, n(el) + +b.getAttribute("data-step")));
      total();
      document.dispatchEvent(new CustomEvent("kx:sfx", { detail: "tick" }));
    });
  });
  inputs.forEach(function (el) {
    el.addEventListener("input", total);
    el.addEventListener("blur", function () { el.value = n(el); total(); });
  });
  if (window.KX) window.KX.on(total);
  var pre = new URLSearchParams(location.search).get("aroma");
  var preEl = pre && form.querySelector('input[data-flavour="' + pre.replace(/[^a-z]/g, "") + '"]');
  if (preEl) preEl.value = 1;
  total();

  function letter() {
    var get = function (k) { var el = form.elements[k]; return el ? el.value.trim() : ""; };
    var koli = total();
    var lines = [
      t("Ad soyad") + ": " + get("name"),
      t("Firma") + ": " + (get("company") || "—"),
      t("Ülke / şehir") + ": " + get("place"),
      t("E-posta veya telefon") + ": " + get("reach"),
      ""
    ];
    lines.push(t("Aroma başına koli") + ":");
    inputs.forEach(function (el) { if (n(el)) lines.push("  · " + t(el.getAttribute("data-name")) + ": " + num(n(el)) + " " + t("koli")); });
    if (!koli) lines.push("  —");
    lines.push(t("Toplam koli") + ": " + num(koli) + " · " + t("Toplam paket") + ": " + num(koli * PER_CASE) + " · " + t("Net ağırlık") + ": " + num(koli * KG_CASE, koli ? 2 : 0) + " kg");
    if (get("msg")) { lines.push(""); lines.push(get("msg")); }
    return lines.join("\n");
  }
  function valid() {
    var need = ["name", "place", "reach"];
    var missing = need.filter(function (k) { return !form.elements[k].value.trim(); });
    need.forEach(function (k) { form.elements[k].setAttribute("aria-invalid", String(missing.indexOf(k) >= 0)); });
    if (missing.length) {
      say("Lütfen adınızı, ülkenizi ve size ulaşabileceğimiz bir yolu yazın.");
      form.elements[missing[0]].focus();
      return false;
    }
    return true;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!valid()) return;
    var place = form.elements.place.value.trim();
    var href = "mailto:" + TO + "?subject=" + encodeURIComponent(t("Yeni distribütörlük talebi") + " — " + place) + "&body=" + encodeURIComponent(letter());
    say("Mesajınız e-posta olarak hazırlandı; e-posta uygulamanızdan gönderin.");
    document.dispatchEvent(new CustomEvent("kx:sfx", { detail: "send" }));
    location.href = href;
  });
  var copy = form.querySelector("[data-copy]");
  if (copy) copy.addEventListener("click", function () {
    if (!valid()) return;
    var done = function () { say("Talebiniz kopyalandı; dilediğiniz yere yapıştırın."); };
    if (navigator.clipboard) navigator.clipboard.writeText(letter()).then(done, function () {});
  });
})();
