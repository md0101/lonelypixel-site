(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var canvas = document.getElementById("orbit");
  if (!canvas) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;

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
    var count = Math.floor(window.innerWidth / 28);
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

      ctx.beginPath();
      ctx.fillStyle = "rgba(244, 240, 255," + d.a + ")";
      ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.ceil(d.r), Math.ceil(d.r));
    }

    // soft orbit ring
    var cx = w * 0.72;
    var cy = h * 0.22;
    var t = Date.now() / 1000;
    ctx.strokeStyle = "rgba(124, 240, 194, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 90, 42, Math.sin(t / 6) * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    var px = cx + Math.cos(t * 0.7) * 90;
    var py = cy + Math.sin(t * 0.7) * 42;
    ctx.fillStyle = "#7cf0c2";
    ctx.fillRect(Math.round(px), Math.round(py), 3, 3);

    raf = window.requestAnimationFrame(tick);
  }

  function start() {
    resize();
    seed();
    cancelAnimationFrame(raf);
    tick();
  }

  window.addEventListener("resize", function () {
    resize();
    seed();
  });

  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      cancelAnimationFrame(raf);
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      start();
    }
  });

  start();
})();


  // Hero orbit under the tagline (clear on mobile)
  (function () {
    var canvas = document.getElementById("pixel-orbit");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    var raf = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      var w = canvas.clientWidth || 320;
      var h = canvas.clientHeight || 144;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }

    function drawFrame(t) {
      var s = size();
      var w = s.w;
      var h = s.h;
      ctx.clearRect(0, 0, w, h);

      var cx = w * 0.5;
      var cy = h * 0.52;
      var rx = Math.min(w * 0.38, 110);
      var ry = Math.min(h * 0.32, 42);

      // soft ellipse
      ctx.strokeStyle = "rgba(124, 240, 194, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.15, 0, Math.PI * 2);
      ctx.stroke();

      // faint lilac outer ring
      ctx.strokeStyle = "rgba(196, 168, 255, 0.18)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.15, ry * 1.2, 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // centre lonely pixel
      ctx.fillStyle = "#f4f0ff";
      ctx.fillRect(Math.round(cx - 3), Math.round(cy - 3), 6, 6);
      ctx.fillStyle = "#7cf0c2";
      ctx.fillRect(Math.round(cx + 2), Math.round(cy - 6), 3, 3);

      if (reduce.matches) return;

      var a = t / 1000;
      var px = cx + Math.cos(a * 0.9) * rx;
      var py = cy + Math.sin(a * 0.9) * ry;
      // orbiting pixel with glow
      ctx.fillStyle = "rgba(124, 240, 194, 0.25)";
      ctx.fillRect(Math.round(px - 5), Math.round(py - 5), 10, 10);
      ctx.fillStyle = "#7cf0c2";
      ctx.fillRect(Math.round(px - 2), Math.round(py - 2), 5, 5);

      // second slower coral mote
      var b = a * 0.55 + 1.2;
      var qx = cx + Math.cos(b) * rx * 0.72;
      var qy = cy + Math.sin(b) * ry * 0.72;
      ctx.fillStyle = "#ff8f9f";
      ctx.fillRect(Math.round(qx - 1.5), Math.round(qy - 1.5), 3, 3);
    }

    function tick(now) {
      drawFrame(now || 0);
      if (!reduce.matches) raf = requestAnimationFrame(tick);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        drawFrame(0);
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    window.addEventListener("resize", function () {
      drawFrame(performance.now());
    });
    reduce.addEventListener("change", start);
    start();
  })();

