(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Background sky — decorative; skip when reduced motion
  (function () {
    var canvas = document.getElementById("orbit");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [];
    var raf = 0;

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      dots = [];
      var count = Math.max(12, Math.floor(window.innerWidth / 32));
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.45 + 0.15
        });
      }
    }

    function tick() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -4) d.x = w + 4;
        if (d.x > w + 4) d.x = -4;
        if (d.y < -4) d.y = h + 4;
        if (d.y > h + 4) d.y = -4;
        ctx.fillStyle = "rgba(244, 240, 255," + d.a + ")";
        ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.ceil(d.r), Math.ceil(d.r));
      }
      raf = window.requestAnimationFrame(tick);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduceMq.matches) {
        ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
        return;
      }
      resize();
      seed();
      raf = window.requestAnimationFrame(tick);
    }

    window.addEventListener("resize", function () {
      if (!reduceMq.matches) {
        resize();
        seed();
      }
    });
    if (reduceMq.addEventListener) reduceMq.addEventListener("change", start);
    else if (reduceMq.addListener) reduceMq.addListener(start);
    start();
  })();

  // Hero orbit under tagline — always in document flow, always animates
  (function () {
    var canvas = document.getElementById("pixel-orbit");
    var wrap = document.querySelector(".hero-orbit");
    if (!canvas || !wrap) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var raf = 0;

    function measure() {
      var rect = wrap.getBoundingClientRect();
      var w = Math.max(1, Math.floor(rect.width) || 320);
      var h = Math.max(1, Math.floor(rect.height) || 128);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }

    function draw(now) {
      var s = measure();
      var w = s.w;
      var h = s.h;
      ctx.clearRect(0, 0, w, h);

      var cx = w * 0.5;
      var cy = h * 0.52;
      var rx = Math.min(w * 0.4, 120);
      var ry = Math.min(h * 0.34, 46);
      var t = (now || 0) / 1000;

      ctx.strokeStyle = "rgba(124, 240, 194, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(196, 168, 255, 0.22)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.12, ry * 1.18, 0.18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#f4f0ff";
      ctx.fillRect(Math.round(cx - 3), Math.round(cy - 3), 6, 6);
      ctx.fillStyle = "#7cf0c2";
      ctx.fillRect(Math.round(cx + 2), Math.round(cy - 6), 3, 3);

      var a = t * 0.95;
      var px = cx + Math.cos(a) * rx;
      var py = cy + Math.sin(a) * ry;
      ctx.fillStyle = "rgba(124, 240, 194, 0.28)";
      ctx.fillRect(Math.round(px - 6), Math.round(py - 6), 12, 12);
      ctx.fillStyle = "#7cf0c2";
      ctx.fillRect(Math.round(px - 2.5), Math.round(py - 2.5), 5, 5);

      var b = t * 0.55 + 1.4;
      var qx = cx + Math.cos(b) * rx * 0.7;
      var qy = cy + Math.sin(b) * ry * 0.7;
      ctx.fillStyle = "#ff8f9f";
      ctx.fillRect(Math.round(qx - 2), Math.round(qy - 2), 4, 4);
    }

    function loop(now) {
      draw(now);
      raf = window.requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      measure();
      raf = window.requestAnimationFrame(loop);
    }

    if (window.ResizeObserver) {
      new ResizeObserver(function () { measure(); }).observe(wrap);
    }
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", function () {
      setTimeout(measure, 150);
    });

    start();
    setTimeout(start, 60);
    setTimeout(measure, 300);
  })();
})();
