// ═══════════════════════════════════════════
// 2D STARFIELD + SHOOTING STARS (Performance Optimized)
// ═══════════════════════════════════════════
(function() {
  var P = { m:[232,234,237], a:[0,229,204], ad:[0,191,166], n:[90,99,114] };
  var cv = document.getElementById('starfield'), ctx = cv.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5), W, H;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // Reduced star count
  var count = Math.floor(120 * Math.min((W * H) / (1920 * 1080), 1.2));
  var stars = [];
  for (var i = 0; i < count; i++) {
    var r = Math.random(), cl;
    if (r < .6) cl = P.m; else if (r < .78) cl = P.a; else if (r < .9) cl = P.ad; else cl = P.n;
    var d = Math.random();
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      s: 0.2 + d * 1.5, c: cl,
      a: 0.15 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
      twA: 0.12 + Math.random() * 0.3,
      twS: 0.005 * (0.5 + Math.random()),
      hasGlow: d > 0.5 // Only larger stars get glow
    });
  }

  var shooters = [];
  var nextShoot = performance.now() + 3000 + Math.random() * 6000;

  // Visibility tracking
  var isPageVisible = true;
  document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
  });

  // Throttle to ~24fps for starfield (doesn't need 60fps)
  var FRAME_INTERVAL = 1000 / 24;
  var lastFrameTime = 0;

  function draw(now) {
    requestAnimationFrame(draw);

    if (!isPageVisible) return;
    if (now - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = now;

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.tw += s.twS;
      var a = s.a * (1 - s.twA * (0.5 + 0.5 * Math.sin(s.tw)));
      if (a < 0.03) continue;

      // Only draw glow for select larger stars
      if (s.hasGlow && s.s > 1.2 && a > 0.35) {
        var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.s * 3);
        g.addColorStop(0, 'rgba(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ',' + (a * 0.1) + ')');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.s * 3, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = 'rgba(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ',' + a + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2); ctx.fill();
    }

    // Shooting stars
    for (var j = shooters.length - 1; j >= 0; j--) {
      var ss = shooters[j];
      ss.x += ss.vx; ss.y += ss.vy; ss.life -= ss.dc;
      if (ss.life <= 0) { shooters.splice(j, 1); continue; }
      var tx = ss.x - (ss.vx / 8) * ss.len, ty = ss.y - (ss.vy / 8) * ss.len;
      var gr = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
      gr.addColorStop(0, 'rgba(0,229,204,0)');
      gr.addColorStop(0.6, 'rgba(0,229,204,' + (ss.life * 0.25) + ')');
      gr.addColorStop(1, 'rgba(232,234,237,' + (ss.life * 0.7) + ')');
      ctx.strokeStyle = gr; ctx.lineWidth = ss.w * ss.life; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ss.x, ss.y); ctx.stroke();
    }

    if (now >= nextShoot) {
      var an = (12 + Math.random() * 35) * (Math.PI / 180), sp = 6 + Math.random() * 5;
      shooters.push({
        x: Math.random() * W * 0.8, y: Math.random() * H * 0.4,
        vx: Math.cos(an) * sp, vy: Math.sin(an) * sp,
        len: 70 + Math.random() * 110, life: 1,
        dc: 0.006 + Math.random() * 0.005, w: 0.8 + Math.random() * 1.2
      });
      nextShoot = now + 4000 + Math.random() * 7000;
    }
  }
  requestAnimationFrame(draw);

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
})();
