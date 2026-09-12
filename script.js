(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      var count = Math.max(16, Math.floor(window.innerWidth / 28));
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.7 + 0.4,
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

  (function () {
    var canvas = document.getElementById("pixel-orbit");
    var wrap = document.querySelector(".hero-stage");
    if (!canvas || !wrap) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var raf = 0;

    function measure() {
      var rect = wrap.getBoundingClientRect();
      var w = Math.max(1, Math.floor(rect.width) || 200);
      var h = Math.max(1, Math.floor(rect.height) || 120);
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

      var cx = w * 0.52;
      var cy = h * 0.55;
      // More elliptical + permanently slanted
      var rx = Math.min(w * 0.46, 102);
      var ry = Math.min(h * 0.22, 28);
      var tilt = -0.55 + Math.sin((now || 0) / 7000) * 0.04;
      var t = (now || 0) / 1000;

      // Fainter orbit guide
      ctx.strokeStyle = "rgba(124, 240, 194, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, tilt, 0, Math.PI * 2);
      ctx.stroke();

      // Pixel path slightly off-course (wobble + radius drift) — no centre pixel
      var a = t * 0.72;
      var wobble = 1 + 0.08 * Math.sin(a * 2.3) + 0.05 * Math.sin(a * 0.7 + 1.1);
      var offA = a + 0.12 * Math.sin(a * 1.6);
      var prx = rx * wobble;
      var pry = ry * (0.92 + 0.1 * Math.sin(a * 1.9));
      var cosT = Math.cos(tilt);
      var sinT = Math.sin(tilt);
      var lx = Math.cos(offA) * prx;
      var ly = Math.sin(offA) * pry;
      var px = cx + lx * cosT - ly * sinT;
      var py = cy + lx * sinT + ly * cosT;
      ctx.fillStyle = "#7cf0c2";
      ctx.fillRect(Math.round(px - 2), Math.round(py - 2), 4, 4);
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
    setTimeout(start, 80);
  })();
})();
