/* ==========================================================================
   Turkish and English
   --------------------------------------------------------------------------
   The page is written in Turkish; English is a dictionary keyed by the
   Turkish text itself (whitespace-normalised), applied to text nodes and to
   alt / aria-label / placeholder / title. The original text of every node is
   kept, so switching back and forth always translates from the source.
   A first visit follows the browser's language; a choice is remembered.
   ========================================================================== */
(function () {
  "use strict";
  var EN = {
    "Kıtlax — Makarna Cipsi": "Kıtlax — Macaroni Crispy",
    "İçeriğe geç": "Skip to content",
    "Kıtlax — ana sayfa": "Kıtlax — home",
    "Ana menü": "Main menu",
    "Aromalar": "Flavours",
    "Hakkımızda": "About us",
    "İletişim": "Contact",
    "Dil": "Language",
    "Distribütör olun": "Become a distributor",
    "Kıtlax — film": "Kıtlax — film",
    "Kıtlax makarna cipsleri": "Kıtlax macaroni crisps",
    "Kıtlax · Makarna Cipsi": "Kıtlax · Macaroni Crispy",
    "Makarnanın": "Pasta at its",
    "en çıtır hali.": "crispiest.",
    "Durum buğdayı irmiğinden, günde 300 ton makarna üreten tesisimizde.": "From durum wheat semolina, in our plant that makes 300 tonnes of pasta a day.",
    "Dört şekil, dört aroma": "Four shapes, four flavours",
    "Tekerlek. Kabuk.": "Wheel. Shell.",
    "Rulo. Burgu.": "Spiral. Twist.",
    "Her şekil kendi aromasıyla: Acı Tako, Peynir, Süt Mısırı ve Ketçap.": "Each shape with its own flavour: Hot Taco, Cheese, Sweet Corn and Ketchup.",
    "01 — Acı Tako": "01 — Hot Taco",
    "Tekerlek,": "Wheels,",
    "acı tako aromalı.": "hot taco flavoured.",
    "Mavi paketin tekerlekleri.": "The wheels of the blue bag.",
    "02 — Peynir": "02 — Cheese",
    "Kabuk,": "Shells,",
    "peynir aromalı.": "cheese flavoured.",
    "Yeşil paketin oluklu kabukları.": "The ridged shells of the green bag.",
    "03 — Süt Mısırı": "03 — Sweet Corn",
    "Rulo,": "Spirals,",
    "süt mısırı aromalı.": "sweet corn flavoured.",
    "Turkuaz paketin sarmal ruloları.": "The rolled spirals of the turquoise bag.",
    "04 — Ketçap": "04 — Ketchup",
    "Burgu,": "Twists,",
    "ketçap aromalı.": "ketchup flavoured.",
    "Kırmızı paketin burguları.": "The twists of the red bag.",
    "Kıtlax ailesi": "The Kıtlax family",
    "40 gram,": "40 grams,",
    "dört aroma.": "four flavours.",
    "Filmi geç": "Skip the film",
    "Kaydırın": "Scroll",
    "Her şekil": "Each shape",
    "Kıtlax ailesi.": "The Kıtlax family.",
    "Ketçap": "Ketchup",
    "Peynir": "Cheese",
    "Süt Mısırı": "Sweet Corn",
    "Acı Tako": "Hot Taco",
    "Burgu · 40 g": "Twist · 40 g",
    "Kabuk · 40 g": "Shell · 40 g",
    "Rulo · 40 g": "Spiral · 40 g",
    "Tekerlek · 40 g": "Wheel · 40 g",
    "Kıtlax Ketçap aromalı paket": "Kıtlax Ketchup flavoured bag",
    "Kıtlax Peynir aromalı paket": "Kıtlax Cheese flavoured bag",
    "Kıtlax Süt Mısırı aromalı paket": "Kıtlax Sweet Corn flavoured bag",
    "Kıtlax Acı Tako aromalı paket": "Kıtlax Hot Taco flavoured bag",
    "Makarnayı bilen": "From a maker",
    "bir üreticiden.": "who knows pasta.",
    "Kıtlax, Beşler Grup'un makarna yatırımı Beşsan Makarna'nın ürünüdür. Gaziantep 1. Organize Sanayi Bölgesi'ndeki tesisimizde durum buğdayı irmiğinden makarna üretiyor, dünyanın dört bir yanına gönderiyoruz.":
      "Kıtlax is made by Beşsan Makarna, the pasta company of Beşler Group. In our plant in Gaziantep's 1st Organised Industrial Zone we make pasta from durum wheat semolina and ship it around the world.",
    "Günlük üretim": "Daily output",
    "ton": "tonnes",
    "İhracat": "Export",
    "ülke": "countries",
    "Tecrübe": "Experience",
    "yıl": "years",
    "Tesis alanı": "Plant area",
    "Maskotumuz": "Our mascot",
    "Her pakette": "A koala",
    "bir koala.": "on every bag.",
    "Her aromanın paketinde, o aromanın renginde tulumuyla.": "On each flavour's bag, in dungarees of that flavour's colour.",
    "Kıtlax'ın koalası, sepetinde Kıtlax paketleriyle": "The Kıtlax koala with Kıtlax bags in its basket",
    "İhracat ve distribütörlük": "Export and distribution",
    "Kıtlax'ı": "Bring Kıtlax",
    "ülkenize getirin.": "to your country.",
    "Bölgenizde Kıtlax satmak için bize yazın. Aroma karışımına ve koli adedine göre teklif hazırlayalım.": "Write to us to sell Kıtlax in your region. We will prepare an offer for your mix of flavours and number of cases.",
    "Koli: 40 g × 48 paket.": "Case: 40 g × 48 bags.",
    "Ad soyad": "Full name",
    "Firma": "Company",
    "Ülke / şehir": "Country / city",
    "E-posta veya telefon": "E-mail or phone",
    "İlgilendiğiniz aromalar": "Flavours you are interested in",
    "Mesajınız": "Your message",
    "Tahmini adet, teslim yeri, sorularınız": "Estimated quantity, delivery place, your questions",
    "Teklif isteyin": "Request an offer",
    "Adres": "Address",
    "© 2026 Kıtlax Makarna Cipsi": "© 2026 Kıtlax Macaroni Crispy",
    "Tüm hakları saklıdır.": "All rights reserved.",
    "Lütfen adınızı, ülkenizi ve size ulaşabileceğimiz bir yolu yazın.": "Please write your name, your country and a way to reach you.",
    "Mesajınız e-posta olarak hazırlandı; e-posta uygulamanızdan gönderin.": "Your message is ready as an e-mail; send it from your mail app.",
    "Yeni distribütörlük talebi": "New distribution request",
    "Kıtlax — Makarna Cipsi | Beşsan Makarna": "Kıtlax — Macaroni Crispy | Beşsan Makarna",
    "Ses": "Sound",
    "01 — Buğday": "01 — Wheat",
    "Her şey": "It all starts",
    "durum buğdayıyla başlar.": "with durum wheat.",
    "Sert, kehribar renkli durum buğdayı: iyi makarnanın hammaddesi.": "Hard, amber-coloured durum wheat: the raw material of good pasta.",
    "02 — İrmik": "02 — Semolina",
    "Buğday öğütülür,": "The wheat is milled",
    "irmik olur.": "into semolina.",
    "Makarnamızı un değil, iri taneli durum irmiği ile yaparız.": "We make our pasta with coarse durum semolina, not flour.",
    "03 — Şekil": "03 — Shape",
    "Hamur kalıptan geçer,": "The dough goes through the die",
    "şeklini alır.": "and takes its shape.",
    "Bıçak her turda kalıbın yüzünü süpürür: tekerlek, kabuk, rulo, burgu.": "On every turn a knife sweeps the face of the die: wheels, shells, spirals, twists.",
    "04 — Çıtırlık": "04 — Crunch",
    "Isıyla kabarır,": "Heat puffs it up",
    "altın rengini alır.": "and turns it golden.",
    "Hamur hafifler, kabarır ve çıtırlaşır.": "The dough lightens, puffs up and turns crisp.",
    "05 — Aroma": "05 — Flavour",
    "kendi aromasıyla.": "with its own flavour.",
    "Acı Tako, Peynir, Süt Mısırı, Ketçap: her şeklin kendi çeşnisi var.": "Hot Taco, Cheese, Sweet Corn, Ketchup: every shape has its own seasoning.",
    "06 — Paket": "06 — The bag",
    "40 gramlık poşette,": "In a 40 g bag,",
    "taze ve çıtır.": "fresh and crisp.",
    "Poşet doldurulur ve ısıyla mühürlenir; çıtırlık açılana kadar içinde kalır.": "The bag is filled and heat-sealed; the crunch stays inside until it is opened.",
    "Dört şekil,": "Four shapes,"
  };
  var norm = function (s) { return s.replace(/\s+/g, " ").trim(); };
  var ATTRS = ["alt", "aria-label", "placeholder", "title"];
  var listeners = [];
  var lang = "tr";

  function walk(root, fn) {
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    for (var n = tw.nextNode(); n; n = tw.nextNode()) fn(n);
  }
  function apply(to) {
    lang = to;
    walk(document.body, function (n) {
      if (n.__src === undefined) {
        if (!norm(n.nodeValue)) return;
        n.__src = n.nodeValue;
      }
      var t = to === "en" && EN[norm(n.__src)];
      if (!t) { n.nodeValue = n.__src; return; }
      var edge = n.__src.match(/^(\s*)[\s\S]*?(\s*)$/);         /* the spacing around the words stays */
      n.nodeValue = edge[1] + t + edge[2];
    });
    document.querySelectorAll("*").forEach(function (el) {
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var k = "__src_" + a;
        if (el[k] === undefined) el[k] = el.getAttribute(a);
        var t = to === "en" && EN[norm(el[k])];
        el.setAttribute(a, t || el[k]);
      });
    });
    if (document.__title === undefined) document.__title = document.title;
    document.title = (to === "en" && EN[norm(document.__title)]) || document.__title;
    document.documentElement.setAttribute("lang", to);
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === to)); });
    for (var i = 0; i < listeners.length; i++) listeners[i](to);
  }
  window.KX = {
    t: function (s) { return (lang === "en" && EN[norm(s)]) || s; },
    lang: function () { return lang; },
    on: function (fn) { listeners.push(fn); }
  };
  function stored() { try { return localStorage.getItem("kx-lang"); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem("kx-lang", v); } catch (e) { /* the choice holds for this visit */ } }
  function start() {
    var first = stored() || (/^tr\b/i.test(navigator.language || "") ? "tr" : "en");
    if (first !== "tr") apply(first);
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { var to = b.getAttribute("data-lang"); store(to); apply(to); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
