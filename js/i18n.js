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
    "Tekerlek,": "Wheels,",
    "acı tako aromalı.": "hot taco flavoured.",
    "Kabuk,": "Shells,",
    "peynir aromalı.": "cheese flavoured.",
    "Rulo,": "Spirals,",
    "süt mısırı aromalı.": "sweet corn flavoured.",
    "Burgu,": "Twists,",
    "ketçap aromalı.": "ketchup flavoured.",
    "Kıtlax ailesi": "The Kıtlax family",
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
    "İhracat ve distribütörlük": "Export and distribution",
    "Kıtlax'ı": "Bring Kıtlax",
    "ülkenize getirin.": "to your country.",
    "Bölgenizde Kıtlax satmak için bize yazın. Aroma karışımına ve koli adedine göre teklif hazırlayalım.": "Write to us to sell Kıtlax in your region. We will prepare an offer for your mix of flavours and number of cases.",
    "Koli: 40 g × 48 paket.": "Case: 40 g × 48 bags.",
    "Ad soyad": "Full name",
    "Firma": "Company",
    "Ülke / şehir": "Country / city",
    "E-posta veya telefon": "E-mail or phone",
    "Mesajınız": "Your message",
    "Tahmini adet, teslim yeri, sorularınız": "Estimated quantity, delivery place, your questions",
    "Teklif isteyin": "Request an offer",
    "Adres": "Address",
    "© 2026 Kıtlax Makarna Cipsi": "© 2026 Kıtlax Macaroni Crispy",
    "Tüm hakları saklıdır.": "All rights reserved.",
    "Lütfen adınızı, ülkenizi ve size ulaşabileceğimiz bir yolu yazın.": "Please write your name, your country and a way to reach you.",
    "Mesajınız e-posta olarak hazırlandı; e-posta uygulamanızdan gönderin.": "Your message is ready as an e-mail; send it from your mail app.",
    "Yeni distribütörlük talebi": "New distribution request",
    "Ses": "Sound",
    "01 — Buğday": "01 — Wheat",
    "Her şey": "It all starts",
    "durum buğdayıyla başlar.": "with durum wheat.",
    "Sert, kehribar renkli durum buğdayı: iyi makarnanın hammaddesi.": "Hard, amber-coloured durum wheat: the raw material of good pasta.",
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
    "Dört şekil,": "Four shapes,",
    "02 — Öğütme": "02 — Milling",
    "Filmin bölümleri": "The film's chapters",
    "Buğday": "Wheat",
    "Öğütme": "Milling",
    "Kalıp": "Die",
    "Çıtırlık": "Crunch",
    "Aroma": "Flavour",
    "Paket": "Bag",
    "Toplam paket": "Total bags",
    "Aile": "Family",
    "Makarna cipsi, bu tecrübenin atıştırmalığa dönüşmüş hali: aynı irmik, aynı kalıplar, aynı titizlik — sadece çıtır.": "Macaroni crisps are that experience made into a snack: the same semolina, the same dies, the same care — only crunchy.",
    "Tesis": "The plant",
    "alanın": "site,",
    "Kalite": "Quality",
    "FDA kaydı": "FDA registration",
    "ABD Gıda ve İlaç Dairesi kaydıyla ihracat": "Exported under US Food and Drug Administration registration",
    "Koşer (OU-D)": "Kosher (OU-D)",
    "Her poşette koşer sertifika işareti": "A kosher certification mark on every bag",
    "Durum buğdayı irmiği": "Durum wheat semolina",
    "Hammaddesi un değil, irmik": "Made from semolina, not flour",
    "Aroma başına koli adedini seçin.": "Choose the number of cases per flavour.",
    "Bilgilerinizi yazın.": "Write your details.",
    "Talebiniz e-posta olarak hazırlanır; tek tuşla gönderin.": "Your request is written out as an e-mail; send it with one tap.",
    "Aroma başına koli": "Cases per flavour",
    "Ketçap: bir koli azalt": "Ketchup: one case less",
    "Ketçap koli": "Ketchup cases",
    "Ketçap: bir koli artır": "Ketchup: one case more",
    "Peynir: bir koli azalt": "Cheese: one case less",
    "Peynir koli": "Cheese cases",
    "Peynir: bir koli artır": "Cheese: one case more",
    "Süt Mısırı: bir koli azalt": "Sweet Corn: one case less",
    "Süt Mısırı koli": "Sweet Corn cases",
    "Süt Mısırı: bir koli artır": "Sweet Corn: one case more",
    "Acı Tako: bir koli azalt": "Hot Taco: one case less",
    "Acı Tako koli": "Hot Taco cases",
    "Acı Tako: bir koli artır": "Hot Taco: one case more",
    "Toplam koli": "Total cases",
    "Net ağırlık": "Net weight",
    "koli": "cases",
    "1 koli = 48 paket × 40 g = 1,92 kg net.": "1 case = 48 bags × 40 g = 1.92 kg net.",
    "Talebi kopyala": "Copy the request",
    "Talebiniz kopyalandı; dilediğiniz yere yapıştırın.": "Your request is copied; paste it wherever you like.",
    "Hızlı erişim": "Quick access",
    "Teklif iste": "Request an offer",
    "Beşsan Makarna Gıda San. ve Tic. A.Ş.": "Beşsan Makarna Gıda San. ve Tic. A.Ş.",
    "1. Organize Sanayi Bölgesi": "1st Organised Industrial Zone",
    "83101 Cad. No: 37": "83101 Street No: 37",
    "Şehitkamil / Gaziantep": "Şehitkamil / Gaziantep, Türkiye",
    "Tüm aromalar": "All flavours",
    "Kıtlax · Makarna Cipsi · 40 g": "Kıtlax · Macaroni Crispy · 40 g",
    "Bu aroma için teklif isteyin": "Request an offer for this flavour",
    "Paylaş": "Share",
    "Bağlantı kopyalandı.": "Link copied.",
    "Şekil": "Shape",
    "Net": "Net",
    "40 g": "40 g",
    "Koli": "Case",
    "48 paket": "48 bags",
    "Burgu": "Twist",
    "Kabuk": "Shell",
    "Rulo": "Spiral",
    "Tekerlek": "Wheel",
    "Ürün bilgileri": "Product facts",
    "Hammadde": "Raw material",
    "Sertifika işareti": "Certification mark",
    "bize yazın": "write to us",
    "Diğer aromalar": "Other flavours",
    "Ailenin": "The rest of",
    "diğerleri.": "the family.",
    "Ketçap aromalı, burgu şeklinde makarna cipsi. Kırmızı poşette, 40 gram.": "Ketchup-flavoured macaroni crisps in the shape of twists. In the red bag, 40 grams.",
    "Peynir aromalı, oluklu kabuk şeklinde makarna cipsi. Yeşil poşette, 40 gram.": "Cheese-flavoured macaroni crisps in the shape of ridged shells. In the green bag, 40 grams.",
    "Süt mısırı aromalı, rulo şeklinde makarna cipsi. Turkuaz poşette, 40 gram.": "Sweet-corn-flavoured macaroni crisps in the shape of spirals. In the turquoise bag, 40 grams.",
    "Acı tako aromalı, tekerlek şeklinde makarna cipsi. Mavi poşette, 40 gram.": "Hot-taco-flavoured macaroni crisps in the shape of wheels. In the blue bag, 40 grams.",
    "Hamur bronz kalıptan geçer; iki iplik birbirine sarılır, bıçak her turda bir burgu keser.": "The dough goes through a bronze die; two strands wind round each other and on every turn the knife cuts a twist.",
    "Burgular ketçap çeşnisiyle kaplanır.": "The twists are coated in ketchup seasoning.",
    "Hamur bronz kalıptan oluklu bir şerit olarak çıkar; bıçak her turda bir kabuk keser.": "The dough leaves the bronze die as a ridged ribbon; on every turn the knife cuts a shell.",
    "Kabuklar peynir çeşnisiyle kaplanır; oluklar çeşniyi tutar.": "The shells are coated in cheese seasoning; the ridges hold it.",
    "Hamur bronz kalıptan ince bir şerit olarak çıkar ve kendi üstüne sarılarak rulo olur.": "The dough leaves the bronze die as a thin ribbon and rolls up on itself into a spiral.",
    "Rulolar süt mısırı çeşnisiyle kaplanır.": "The spirals are coated in sweet corn seasoning.",
    "Hamur bronz kalıbın tekerlek deliklerinden çıkar; bıçak her turda bir tekerlek keser.": "The dough comes out of the bronze die's wheel-shaped openings; on every turn the knife cuts a wheel.",
    "Tekerlekler acı tako çeşnisiyle kaplanır.": "The wheels are coated in hot taco seasoning.",
    "Kıtlax Ketçap — Makarna Cipsi": "Kıtlax Ketchup — Macaroni Crispy",
    "Kıtlax Peynir — Makarna Cipsi": "Kıtlax Cheese — Macaroni Crispy",
    "Kıtlax Süt Mısırı — Makarna Cipsi": "Kıtlax Sweet Corn — Macaroni Crispy",
    "Kıtlax Acı Tako — Makarna Cipsi": "Kıtlax Hot Taco — Macaroni Crispy",
    "Bir aromaya dokunun: tüm detaylarını görün.": "Pick a flavour to see all its details.",
    "Son baktığınız": "Last viewed",
    "Detayları incele": "View details",
    "Kıtlax, Beşler Makarna'nın markasıdır. Makarnamızı Gaziantep 1. Organize Sanayi Bölgesi'ndeki tesisimizde durum buğdayı irmiğinden üretiyor, 30 ülkeye gönderiyoruz.": "Kıtlax is a Beşler Makarna brand. We make our pasta from durum wheat semolina in our plant in Gaziantep's 1st Organised Industrial Zone and ship it to 30 countries.",
    "Beşler — Yıllardır değişmeyen kalite": "Beşler — quality unchanged for years",
    "Bir Beşler markası": "A Beşler brand",
    "Adını beş kardeşten alan": "A family named",
    "bir aile.": "after five brothers.",
    "Beşler'in Gaziantep'teki yolu bir un fabrikasıyla başladı; adı, onu kuran beş kardeşten gelir. Grup bugün undan irmiğe, irmikten makarnaya uzanan bir zincirde üretiyor.": "Beşler's road in Gaziantep began with a flour mill; its name comes from the five brothers who founded it. Today the group works along one chain, from flour to semolina and from semolina to pasta.",
    "Beşler Makarna 2004'ten beri bu çatının altında. Kıtlax onun makarna cipsi: Beşler'in irmiği ve titizliği, çıtır bir atıştırmalıkta.": "Beşler Makarna has been part of it since 2004. Kıtlax is its macaroni crisp: Beşler's semolina and care, in a crunchy snack.",
    "Üç dilli ambalaj": "Trilingual packaging",
    "Türkçe, İngilizce ve Arapça: ihracata hazır": "Turkish, English and Arabic: ready for export",
    "Kıtlax'ın koalası, bileğine bağlı iple seçtiğiniz aromanın paketini taşıyor": "The Kıtlax koala carrying the bag of the flavour you pick, on a cord tied round its wrist",
    "Her aromanın paketinde, o aromanın renginde tulumuyla. Bir aroma seçin: koala onun paketini tutsun.": "On each flavour's bag, in dungarees of that flavour's colour. Pick a flavour and the koala holds up its bag.",
    "Koalanın aroması": "The koala's flavour",
    "Beşler": "Beşler",
    "Kıtlax, Beşler Makarna'nın markasıdır.": "Kıtlax is a Beşler Makarna brand.",
    "Teknik föy isteyin": "Request the technical sheet",
    "İçindekiler, besin değerleri ve ihracat belgeleri teknik föyde.": "Ingredients, nutrition facts and export documents are in the technical sheet.",
    "Marka": "Brand",
    "Ambalaj": "Packaging",
    "Isıyla mühürlü poşet": "Heat-sealed bag",
    "48 poşet · 1,92 kg net": "48 bags · 1.92 kg net",
    "Ambalaj dili": "Languages on the bag",
    "Türkçe · İngilizce · Arapça": "Turkish · English · Arabic",
    "Menşe": "Origin",
    "Türkiye": "Türkiye",
    "Üretici": "Producer",
    "Beşsan Makarna · Beşler, Gaziantep": "Beşsan Makarna · Beşler, Gaziantep",
    "Kıtlax Ketçap: burgu şekli, çeşnisiyle": "Kıtlax Ketchup: the twist, seasoned",
    "Kıtlax Peynir: kabuk şekli, çeşnisiyle": "Kıtlax Cheese: the shell, seasoned",
    "Kıtlax Süt Mısırı: rulo şekli, çeşnisiyle": "Kıtlax Sweet Corn: the spiral, seasoned",
    "Kıtlax Acı Tako: tekerlek şekli, çeşnisiyle": "Kıtlax Hot Taco: the wheel, seasoned",
    "Şekil ve aroma": "Shape and flavour"
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
