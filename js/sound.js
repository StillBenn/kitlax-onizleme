/* ==========================================================================
   Sound — on from the start
   --------------------------------------------------------------------------
   The page opens sounding and the button in the header turns it off.
   Browsers let a page make sound only after the visitor's first gesture, so
   it starts on the first click, tap or key anywhere (at once where the
   browser already allows it). Everything is made here with the Web Audio
   API — no files to download:

     music  : a slow, warm bed — a felt-damped electric piano (FM) rolling
              through an eight-chord phrase in D, a soft pad that opens under
              each chord, a round bass, now and then a melody note with its
              echo. Clean tones only: no noise bed, nothing that pulses.
     room   : one shared reverb that every sound sends into
     scenes : what the film shows, quietly, mostly as single events — the
              scroll is the film's clock, so an event fires when the reader
              scrolls past its moment (forward only, never on a jump):
       wheat  : the air moving round the ear; a soft tick as the grain falls
       mill   : the rollers' low hum; a crack as the grain goes in; semolina
                running out — sparse, fine, never a hiss
       die    : the press's low hum; the knife's ring as it cuts; the wheel's
                rush past the lens
       fryer  : bubbles rising in the oil
       season : the powder's fine shimmer; a soft puff as it lands
       pack   : wheels landing in the bag; the jaws closing: a thump, a breath
                of steam
       family : the music opens up
   Low on purpose: atmosphere, never a soundtrack.
   ========================================================================== */
(function () {
  "use strict";
  var btn = document.querySelector("[data-sound]");
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!btn || !AC) { if (btn) btn.hidden = true; return; }

  var ctx = null, master = null, verb = null, on = false, raf = 0, clock = 0;
  var layers = {};
  var noiseBuf = null, brownBuf = null;

  function makeNoise(brown) {
    var len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return b;
  }
  /* a soft room: 3 s of decaying stereo noise, darker as it fades */
  function makeImpulse() {
    var sr = ctx.sampleRate, len = Math.floor(sr * 3.2), b = ctx.createBuffer(2, len, sr);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c), lp = 0;
      for (var i = 0; i < len; i++) {
        var t = i / sr, k = 0.16 + 0.8 * Math.exp(-t / 0.5);
        lp += (Math.random() * 2 - 1 - lp) * k;
        d[i] = lp * Math.exp(-t / 0.9) * (i < sr * 0.02 ? i / (sr * 0.02) : 1);
      }
    }
    return b;
  }
  function source(buf) {
    var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    s.start(0, Math.random() * 2); return s;
  }
  function filt(type, f, q) { var n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q) n.Q.value = q; return n; }
  function gain(v) { var g = ctx.createGain(); g.gain.value = v; return g; }
  function chain() { for (var i = 0; i < arguments.length - 1; i++) arguments[i].connect(arguments[i + 1]); return arguments[arguments.length - 1]; }
  function out(node, wet) { node.connect(master); if (wet) { var s = gain(wet); node.connect(s); s.connect(verb); } return node; }

  /* a short decaying burst of filtered noise */
  function burst(t, dur, f, q, level, dest) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf;
    var bp = filt("bandpass", f, q), g = gain(0);
    g.gain.setValueAtTime(level, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    chain(s, bp, g, dest); s.start(t, Math.random() * 2, dur + 0.02);
  }
  function tone(t, f, dur, level, dest, type) {
    var o = ctx.createOscillator(), g = gain(0);
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    chain(o, g, dest); o.start(t); o.stop(t + dur + 0.05);
  }
  /* a bubble: a sine that rises as it rings */
  function bloop(t, f, level, dest) {
    var o = ctx.createOscillator(), g = gain(0), d = 0.03 + Math.random() * 0.05;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * (1.6 + Math.random()), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    chain(o, g, dest); o.start(t); o.stop(t + d + 0.02);
  }
  /* air moving: band-passed noise opening and closing slowly */
  function swell(t, dur, f, level, dest) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf;
    var bp = filt("bandpass", f, 0.7), g = gain(0);
    bp.frequency.setValueAtTime(f * 0.6, t); bp.frequency.linearRampToValueAtTime(f * 1.4, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + dur * 0.55);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    chain(s, bp, g, dest); s.start(t, Math.random() * 2, dur + 0.05);
  }
  /* the knife: a bright metal ring — inharmonic partials, each fading at its own rate */
  function ring(t, level, dest) {
    [[2360, 0.55, 1], [3710, 0.38, 0.55], [5180, 0.24, 0.35], [7020, 0.14, 0.2]].forEach(function (p) {
      tone(t, p[0] * (0.99 + Math.random() * 0.02), p[1], level * p[2], dest);
    });
    burst(t, 0.06, 6000, 1.2, level * 0.5, dest);
  }
  /* the jaws: a soft low thump, then a breath of steam */
  function seal(t, level, dest) {
    var o = ctx.createOscillator(), g = gain(0);
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.18);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    chain(o, g, dest); o.start(t); o.stop(t + 0.5);
    burst(t, 0.03, 1800, 1.5, level * 0.4, dest);
    swell(t + 0.08, 0.9, 5200, level * 0.18, dest);
  }

  /* --- the music: FM electric piano, pad, bass, an occasional melody note -- */
  function epiano(t, midi, vel, dur, dest) {
    var f = 440 * Math.pow(2, (midi - 69) / 12);
    var car = ctx.createOscillator(), car2 = ctx.createOscillator(), mod = ctx.createOscillator();
    var mi = gain(0), amp = gain(0);
    car.frequency.value = f; car2.frequency.value = f + 0.5; mod.frequency.value = f;
    mi.gain.setValueAtTime(f * 0.9 * vel, t); mi.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.8);
    chain(mod, mi); mi.connect(car.frequency); mi.connect(car2.frequency);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(0.05 * vel, t + 0.022);
    amp.gain.exponentialRampToValueAtTime(0.018 * vel, t + 0.9);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    car.connect(amp); car2.connect(amp); amp.connect(dest);
    [car, car2, mod].forEach(function (o) { o.start(t); o.stop(t + dur + 0.05); });
  }
  function pad(t, midis, dur, dest) {
    var g = gain(0);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(1, t + 2.2);
    g.gain.setValueAtTime(1, t + dur - 2.5); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    g.connect(dest);
    midis.forEach(function (m) {
      var f = 440 * Math.pow(2, (m - 69) / 12);
      [-0.3, 0.3].forEach(function (c) {
        var o = ctx.createOscillator(), og = gain(0.006);
        o.type = "triangle"; o.frequency.value = f + c;
        chain(o, og, g); o.start(t); o.stop(t + dur + 0.05);
      });
    });
  }
  function bass(t, midi, dur, dest) {
    var f = 440 * Math.pow(2, (midi - 69) / 12), g = gain(0);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.028, t + 1.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(dest);
    [[f, 1], [f * 2, 0.22]].forEach(function (p) {
      var o = ctx.createOscillator(), og = gain(p[1]); o.frequency.value = p[0];
      chain(o, og, g); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  /* eight chords, warm and a little bright: Dmaj9 Bm11 Gmaj9 A6/9 | Em9 Gmaj7 D/F# Asus4 */
  var CHORDS = [
    [38, 54, 57, 61, 64], [35, 50, 54, 57, 64], [31, 50, 55, 59, 69], [33, 52, 57, 61, 66],
    [40, 55, 59, 62, 66], [31, 50, 55, 59, 66], [42, 54, 57, 62, 69], [33, 52, 57, 62, 64]
  ];
  var BAR = 6, nextBar = 0, bar = 0, music = null, melody = null, padBus = null;
  function scheduleMusic() {
    if (!on || !ctx) return;
    var now = ctx.currentTime;
    while (nextBar < now + 1.2) {
      var ch = CHORDS[bar % CHORDS.length], t = Math.max(nextBar, now + 0.05);
      bass(t, ch[0] < 36 ? ch[0] + 12 : ch[0], BAR + 1.2, music);
      pad(t, ch.slice(2), BAR + 2.4, padBus);
      ch.slice(1).forEach(function (m, i) {
        epiano(t + 0.03 + i * (0.03 + Math.random() * 0.025), m, 0.3 + Math.random() * 0.12, BAR + 1.4, music);
      });
      if (Math.random() < 0.45) {
        var top = ch.slice(2), n = Math.random() < 0.3 ? 2 : 1;
        for (var k = 0; k < n; k++) {
          epiano(t + BAR * (0.45 + k * 0.2 + Math.random() * 0.08), top[Math.floor(Math.random() * top.length)] + 12, 0.18 + Math.random() * 0.08, 3.2, melody);
        }
      }
      nextBar = t + BAR; bar++;
    }
  }

  function build() {
    ctx = new AC();
    noiseBuf = makeNoise(false); brownBuf = makeNoise(true);
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
    master = gain(0); chain(master, filt("lowpass", 9000), comp, ctx.destination);
    verb = ctx.createConvolver(); verb.buffer = makeImpulse();
    chain(verb, filt("highpass", 160), gain(0.55), master);

    music = gain(1);
    layers.music = gain(0);
    out(chain(music, filt("lowpass", 2400), layers.music), 0.6);
    padBus = gain(1);
    var padLp = filt("lowpass", 900, 0.4), padLfo = ctx.createOscillator(), padDepth = gain(260);
    padLfo.frequency.value = 0.045; chain(padLfo, padDepth, padLp.frequency); padLfo.start();
    chain(padBus, padLp, music);
    melody = gain(1); melody.connect(music);
    var echo = ctx.createDelay(1), fb = gain(0.26), echoLp = filt("lowpass", 1600), echoWet = gain(0.3);
    echo.delayTime.value = 0.42;
    chain(melody, echo, echoLp, fb, echo); echoLp.connect(echoWet); echoWet.connect(music);

    /* the press: a low, smooth hum (two sines, no grit) */
    layers.hum = gain(0);
    [[55, 1], [110, 0.35], [165, 0.12]].forEach(function (p) {
      var o = ctx.createOscillator(); o.frequency.value = p[0]; chain(o, gain(p[1] * 0.12), layers.hum); o.start();
    });
    out(chain(layers.hum, filt("lowpass", 400)), 0.15);
    /* events go through these */
    layers.fx = gain(1); out(layers.fx, 0.35);
    layers.fine = gain(1); out(chain(layers.fine, filt("highpass", 2500)), 0.25);
    layers.bubble = gain(1); out(layers.bubble, 0.4);
    layers.ui = gain(0.9); out(layers.ui, 0.25);
  }

  /* moments of the film, as (chapter, position in it): fired once each as the reader
     scrolls past them going forward */
  var MOMENTS = [
    { ch: 0, at: 0.74, fn: function (t) { tone(t, 1480, 0.5, 0.02, layers.fx); swell(t + 0.02, 1.1, 900, 0.03, layers.fx); } },   /* the grain comes free */
    { ch: 1, at: 0.44, fn: function (t) { burst(t, 0.05, 900, 3, 0.05, layers.fx); burst(t + 0.02, 0.08, 2600, 2, 0.025, layers.fx); swell(t + 0.05, 1.3, 1800, 0.03, layers.fx); } },   /* the grain goes between the rollers */
    { ch: 2, at: 0.66, fn: function (t) { ring(t, 0.05, layers.fx); } },                 /* the knife cuts */
    { ch: 2, at: 0.85, fn: function (t) { swell(t, 1.4, 700, 0.07, layers.fx); } },       /* the wheel rushes at the lens */
    { ch: 4, at: 0.31, fn: function (t) { swell(t, 1.2, 1600, 0.035, layers.fx); burst(t + 0.1, 0.25, 900, 0.8, 0.02, layers.fx); } },   /* the powder lands */
    { ch: 4, at: 0.91, fn: function (t) { swell(t, 0.9, 900, 0.04, layers.fx); } },       /* the wheel drops away */
    { ch: 5, at: 0.46, fn: function (t) { burst(t, 0.04, 1500, 4, 0.05, layers.fx); burst(t + 0.015, 0.06, 3000, 2, 0.02, layers.fx); } },   /* it lands on the heap */
    { ch: 5, at: 0.63, fn: function (t) { swell(t, 1.1, 420, 0.035, layers.fx); } },      /* the jaws come down */
    { ch: 5, at: 0.81, fn: function (t) { seal(t, 0.09, layers.fx); } },                  /* the jaws close */
    { ch: 6, at: 0.72, fn: function (t) { tone(t, 1174.7, 1.6, 0.03, layers.fx); tone(t + 0.14, 1760, 1.8, 0.022, layers.fx); } }   /* the family */
  ];
  var lastPos = -1, lastMix = 0, lastCut = 0;
  function mix() {
    var now = performance.now(), fk = lastMix ? Math.min(4, (now - lastMix) / 16.67) : 1;
    lastMix = now;
    var pos = window.__filmPos, L = window.__filmLayout;
    var past = L ? Math.min(1, Math.max(0, (scrollY - L.start) / (innerHeight * 0.8))) : 1;
    var t = ctx.currentTime;
    var w = { hum: 0, music: 0.65 + 0.35 * past, grains: 0, bubbles: 0, shimmer: 0, landing: 0, air: 0 };
    if (pos && past < 1) {
      var k = 1 - past, c = pos.ch, l = pos.local;
      if (c === 0) w.air = 0.8 * k;
      else if (c === 1) { w.hum = (l < 0.2 ? l / 0.2 : 1) * 0.7 * k; w.grains = (l > 0.42 ? 1 : 0) * k; }   /* the rollers turning; semolina pouring out */
      else if (c === 2) w.hum = (l < 0.15 ? l / 0.15 : 1) * 0.9 * k;
      else if (c === 3) { w.bubbles = (l < 0.15 ? l / 0.15 : 1) * k; w.hum = l < 0.12 ? (1 - l / 0.12) * 0.5 * k : 0; }
      else if (c === 4) w.shimmer = (l > 0.12 && l < 0.85 ? 1 : 0.3) * k;
      else if (c === 5) w.landing = (l > 0.22 && l < 0.65 ? 1 : 0) * k;   /* the wheels landing on the heap in the bag */
      else if (c === 6) w.music = 0.85 + 0.15 * l;
      /* the moments: crossed going forward, by a reader moving at a reading pace */
      var p = c + l;
      if (lastPos >= 0 && p > lastPos && p - lastPos < 0.25 && !(pos.lag > 6) && pos.cut === lastCut) {   /* a jump (or a cut) passes through, it does not play them */
        MOMENTS.forEach(function (m) { var mp = m.ch + m.at; if (lastPos < mp && p >= mp) m.fn(t + 0.01); });
      }
      lastPos = p; lastCut = pos.cut;
    }
    layers.hum.gain.setTargetAtTime(w.hum * 0.5, t, 0.4);
    layers.music.gain.setTargetAtTime(w.music * 1.2, t, 0.5);
    /* wheat: air moving round the ear — a slow swell now and then, never a steady hiss */
    if (w.air > 0.05 && Math.random() < 0.006 * fk) swell(t, 2.2 + Math.random() * 1.6, 500 + Math.random() * 400, 0.02 * w.air, layers.fx);
    /* semolina: grains running — tiny, sparse, at random */
    if (w.grains > 0.05 && Math.random() < 0.35 * w.grains * fk) burst(t + Math.random() * 0.03, 0.006 + Math.random() * 0.01, 5000 + Math.random() * 4000, 3, 0.012 + Math.random() * 0.02 * w.grains, layers.fine);
    /* the fryer: bubbles rising */
    if (w.bubbles > 0.05 && Math.random() < 0.4 * w.bubbles * fk) bloop(t + Math.random() * 0.03, 500 + Math.random() * 1100, 0.006 + Math.random() * 0.01 * w.bubbles, layers.bubble);
    /* the powder: a fine shimmer, very sparse and very high */
    if (w.shimmer > 0.05 && Math.random() < 0.18 * w.shimmer * fk) burst(t + Math.random() * 0.03, 0.02 + Math.random() * 0.03, 7000 + Math.random() * 3000, 2, 0.008 + Math.random() * 0.01, layers.fine);
    /* the bag: wheels landing on the heap inside — a dry little clack, now and then */
    if (w.landing > 0.05 && Math.random() < 0.05 * fk) { var tt = t + Math.random() * 0.04; burst(tt, 0.03, 1300 + Math.random() * 900, 4, 0.03, layers.fx); burst(tt + 0.012, 0.05, 2900 + Math.random() * 1200, 2, 0.012, layers.fx); }
    if (t > clock) { scheduleMusic(); clock = t + 0.25; }
    raf = requestAnimationFrame(mix);
  }

  function set(next) {
    on = next;
    btn.setAttribute("aria-pressed", String(on));
    document.documentElement.classList.toggle("has-sound", on);
    if (on) {
      if (!ctx) build();
      ctx.resume();
      if (nextBar < ctx.currentTime) nextBar = ctx.currentTime + 0.3;
      master.gain.setTargetAtTime(0.6, ctx.currentTime, 0.4);
      if (!raf) raf = requestAnimationFrame(mix);
    } else if (ctx) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      cancelAnimationFrame(raf); raf = 0; lastMix = 0;
      setTimeout(function () { if (!on) ctx.suspend(); }, 600);
    }
  }
  var wanted = true;
  try { wanted = sessionStorage.getItem("kx-sound") !== "off"; } catch (e) { /* storage blocked: on */ }
  btn.setAttribute("aria-pressed", String(wanted));
  var GESTURES = ["pointerdown", "pointerup", "touchend", "keydown", "click"];
  var armed = false;
  function arm(v) {
    if (armed === v) return;
    armed = v;
    GESTURES.forEach(function (t) { (v ? addEventListener : removeEventListener)(t, onGesture, true); });
  }
  function onGesture(e) {
    if (e.target && e.target.closest && e.target.closest("[data-sound]")) return;
    if (e.type === "keydown" && (e.metaKey || e.ctrlKey || e.altKey || /^(Shift|Control|Alt|Meta|Tab|Escape)$/.test(e.key))) return;
    if (!wanted) { arm(false); return; }
    if (!on) set(true); else if (ctx && ctx.state !== "running") ctx.resume();
    if (ctx && ctx.state === "running") arm(false);
    else if (ctx) ctx.resume().then(function () { if (ctx.state === "running") arm(false); }, function () {});
  }
  btn.addEventListener("click", function () {
    var next = !(on && ctx && ctx.state === "running");
    wanted = next;
    try { sessionStorage.setItem("kx-sound", next ? "on" : "off"); } catch (e) { /* not remembered, still switched */ }
    set(next);
    arm(false);
  });
  if (wanted) {
    var policy = navigator.getAutoplayPolicy ? navigator.getAutoplayPolicy("audiocontext") : "";
    if (policy === "allowed") set(true);
    arm(true);
  }
  if (/[?&]probe/.test(location.search)) window.__sound = { ctx: function () { return ctx; }, master: function () { return master; } };
  document.addEventListener("visibilitychange", function () {
    if (!ctx || !on) return;
    if (document.hidden) ctx.suspend(); else { ctx.resume(); if (nextBar < ctx.currentTime) nextBar = ctx.currentTime + 0.3; }
  });
  /* small sounds the page asks for: a card met by the pointer, a case added, a request sent */
  document.addEventListener("kx:sfx", function (e) {
    if (!on || !ctx) return;
    var t = ctx.currentTime;
    if (e.detail === "hover") { tone(t, 2093, 0.25, 0.006, layers.ui); tone(t + 0.03, 3136, 0.2, 0.003, layers.ui); }
    else if (e.detail === "tick") { burst(t, 0.02, 3200, 1.6, 0.06, layers.ui); tone(t, 1760, 0.06, 0.02, layers.ui); }
    else if (e.detail === "send") { tone(t, 1318.5, 0.9, 0.06, layers.ui); tone(t + 0.12, 1975.5, 1.1, 0.05, layers.ui); }
  });

  /* the hand: a soft tick on choices */
  document.addEventListener("click", function (e) {
    if (!on || !ctx) return;
    if (e.target.closest("[data-step], [type=submit], [data-copy]")) return;   /* those make their own sound (kx:sfx) */
    if (e.target.closest(".lang__btn, .hdr__link, .hdr__cta, button, a")) {
      var t = ctx.currentTime; burst(t, 0.025, 3600, 1.4, 0.08, layers.ui); tone(t, 1600, 0.07, 0.03, layers.ui);
    }
  }, true);
})();
