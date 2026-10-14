/* ==========================================================================
   The distributor form
   --------------------------------------------------------------------------
   A static site has nowhere to post a form to: the request is written out as
   an e-mail to the company's own address, ready to send from the visitor's
   mail app, with every field in it. Required: a name, a place and a way to
   reach them — the three things a sales team needs to answer.
   ========================================================================== */
(function () {
  "use strict";
  var form = document.querySelector("[data-trade]");
  if (!form) return;
  var t = function (s) { return window.KX ? window.KX.t(s) : s; };
  var TO = "besler@beslermakarna.com";
  var hint = form.querySelector(".form__hint");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var get = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ""; };
    var need = ["name", "place", "reach"];
    var missing = need.filter(function (n) { return !get(n); });
    need.forEach(function (n) { form.elements[n].setAttribute("aria-invalid", String(missing.indexOf(n) >= 0)); });
    if (missing.length) {
      hint.textContent = t("Lütfen adınızı, ülkenizi ve size ulaşabileceğimiz bir yolu yazın.");
      form.elements[missing[0]].focus();
      return;
    }
    var flv = [].slice.call(form.querySelectorAll('input[name="flv"]:checked')).map(function (c) { return t(c.value); });
    var lines = [
      t("Ad soyad") + ": " + get("name"),
      t("Firma") + ": " + (get("company") || "—"),
      t("Ülke / şehir") + ": " + get("place"),
      t("E-posta veya telefon") + ": " + get("reach"),
      t("İlgilendiğiniz aromalar") + ": " + (flv.join(", ") || "—"),
      "",
      get("msg")
    ];
    var href = "mailto:" + TO + "?subject=" + encodeURIComponent(t("Yeni distribütörlük talebi") + " — " + get("place")) +
               "&body=" + encodeURIComponent(lines.join("\n"));
    hint.textContent = t("Mesajınız e-posta olarak hazırlandı; e-posta uygulamanızdan gönderin.");
    location.href = href;
  });
})();
