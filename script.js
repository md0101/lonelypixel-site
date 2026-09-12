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
