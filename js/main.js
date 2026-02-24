/* ============================================
   STUDIO AURALIS — Main JavaScript
   GSAP + ScrollTrigger + Canvas Particles
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ===========================================
  // 1. LOADER (removed — content shows instantly)
  // ===========================================

  // ===========================================
  // 2. CUSTOM CURSOR
  // ===========================================
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    var cursorVisible = false;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      if (!cursorVisible) {
        cursorVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '.6';
        ringX = mouseX;
        ringY = mouseY;
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    var hoverElements = document.querySelectorAll('a, button, [data-hover]');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('is-hover', 'is-project');
        ring.classList.remove('is-hover', 'is-project');
        dot.textContent = '';
      });
    });

    // Project cards → "VOIR" cursor
    var projectCards = document.querySelectorAll('.projet-card, .phare-mockup');
    projectCards.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('is-project');
        ring.classList.add('is-project');
        dot.textContent = 'VOIR';
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('is-project');
        ring.classList.remove('is-project');
        dot.textContent = '';
      });
    });
  }

  // ===========================================
  // 3. NAVBAR
  // ===========================================
  function initNavbar() {
    var navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // Mobile burger
    var burger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===========================================
  // 4. HERO PARTICLES (Canvas 2D)
  // ===========================================
  var heroParticlesReady = false;

  function initParticles() {
    if (window.innerWidth < 768) return;

    var canvas = document.getElementById('heroParticles');
    var ctx = canvas.getContext('2d');
    var heroSection = document.getElementById('hero');
    var mouseX = -9999, mouseY = -9999;
    var time = 0;

    var colors = [
      [0, 229, 204],
      [80, 255, 235],
      [0, 191, 166],
      [0, 200, 180],
      [0, 170, 152]
    ];

    function pickColor() {
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function resize() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      // Reposition stars on resize
      stars.forEach(function (s) {
        if (s.x > canvas.width) s.x = Math.random() * canvas.width;
        if (s.y > canvas.height) s.y = Math.random() * canvas.height * 0.6;
      });
    }
    var resizeTimer;
    function debouncedResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
    window.addEventListener('resize', debouncedResize);

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', function () {
      mouseX = -9999;
      mouseY = -9999;
    });

    // ── Constellation nodes ──
    var nodes = [];
    var NODE_COUNT = 50;
    var CONNECT_DIST = 140;
    var MOUSE_DIST = 180;

    for (var i = 0; i < NODE_COUNT; i++) {
      var col = pickColor();
      var sz = 1 + Math.random() * 2;
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: sz,
        baseSize: sz,
        r: col[0], g: col[1], b: col[2],
        opacity: 0,
        targetOpacity: 0.15 + Math.random() * 0.35,
        fadeIn: false,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      });
    }

    // ── Background twinkling stars ──
    var stars = [];
    for (var s = 0; s < 35; s++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.65,
        size: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        maxOpacity: 0.05 + Math.random() * 0.15
      });
    }

    // ── Shooting stars ──
    var shootingStars = [];
    var nextShootTime = 80 + Math.random() * 160;

    function spawnShootingStar() {
      var col = pickColor();
      var fast = Math.random() > 0.5;
      var startX = Math.random() * canvas.width;
      var startY = Math.random() * canvas.height * 0.35;
      shootingStars.push({
        x: startX, y: startY,
        vx: (Math.random() > 0.3 ? 1 : -1) * (fast ? 7 + Math.random() * 5 : 4 + Math.random() * 4),
        vy: (fast ? 3 + Math.random() * 2 : 2 + Math.random() * 2),
        length: fast ? 60 + Math.random() * 50 : 25 + Math.random() * 35,
        life: 1,
        decay: fast ? 0.005 + Math.random() * 0.004 : 0.012 + Math.random() * 0.008,
        width: fast ? 1 + Math.random() * 0.6 : 0.5 + Math.random() * 0.5,
        r: col[0], g: col[1], b: col[2]
      });
    }

    // Fade-in trigger
    function fadeInParticles() {
      nodes.forEach(function (n) {
        setTimeout(function () { n.fadeIn = true; }, Math.random() * 2000);
      });
    }
    window._heroParticlesFadeIn = fadeInParticles;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      // ── Update constellation nodes ──
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.fadeIn && n.opacity < n.targetOpacity) n.opacity += 0.003;
        if (!n.fadeIn) { n.opacity = 0; continue; }

        n.x += n.vx;
        n.y += n.vy;

        // Mouse gravity
        var dxM = mouseX - n.x;
        var dyM = mouseY - n.y;
        var distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < MOUSE_DIST && distM > 30) {
          var force = (MOUSE_DIST - distM) / MOUSE_DIST * 0.008;
          n.vx += (dxM / distM) * force;
          n.vy += (dyM / distM) * force;
        }

        // Speed limit + gentle friction
        var spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > 0.5) { n.vx *= 0.98; n.vy *= 0.98; }

        // Wrap edges
        if (n.x < -30) n.x = canvas.width + 29;
        if (n.x > canvas.width + 30) n.x = -29;
        if (n.y < -30) n.y = canvas.height + 29;
        if (n.y > canvas.height + 30) n.y = -29;

        // Pulse
        var pulse = Math.sin(time * n.pulseSpeed + n.pulsePhase);
        var curSize = n.baseSize + pulse * 0.5;
        var curOp = n.opacity + pulse * 0.05;
        if (curOp < 0) curOp = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(curSize, 0.3), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + n.r + ',' + n.g + ',' + n.b + ',' + curOp + ')';
        ctx.fill();

        // Glow halo removed for performance
      }

      // ── Connection lines between nodes ──
      ctx.lineWidth = 0.5;
      for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].fadeIn) continue;
        for (var j = i + 1; j < nodes.length; j++) {
          if (!nodes[j].fadeIn) continue;
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var lineOp = (1 - dist / CONNECT_DIST) * 0.12 * Math.min(nodes[i].opacity, nodes[j].opacity) / 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(0,229,204,' + lineOp + ')';
            ctx.stroke();
          }
        }

        // Mouse-to-node connections
        var dxM = mouseX - nodes[i].x;
        var dyM = mouseY - nodes[i].y;
        var distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < MOUSE_DIST) {
          var mOp = (1 - distM / MOUSE_DIST) * 0.2 * nodes[i].opacity / 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = 'rgba(0,229,204,' + mOp + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.lineWidth = 0.5;
        }
      }

      // ── Twinkling stars ──
      for (var si = 0; si < stars.length; si++) {
        var st = stars[si];
        var op = st.maxOpacity * (0.3 + 0.7 * Math.abs(Math.sin(time * st.speed + st.phase)));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,245,240,' + op + ')';
        ctx.fill();
      }

      // ── Shooting stars ──
      nextShootTime--;
      if (nextShootTime <= 0) {
        spawnShootingStar();
        if (Math.random() < 0.15) {
          setTimeout(function () { spawnShootingStar(); }, 150 + Math.random() * 300);
        }
        nextShootTime = 100 + Math.random() * 220;
      }

      for (var shi = shootingStars.length - 1; shi >= 0; shi--) {
        var ss = shootingStars[shi];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;
        if (ss.life <= 0) { shootingStars.splice(shi, 1); continue; }

        var sSpd = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
        var tailX = ss.x - (ss.vx / sSpd) * ss.length * ss.life;
        var tailY = ss.y - (ss.vy / sSpd) * ss.length * ss.life;

        var sg = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        sg.addColorStop(0, 'rgba(' + ss.r + ',' + ss.g + ',' + ss.b + ',0)');
        sg.addColorStop(0.7, 'rgba(' + ss.r + ',' + ss.g + ',' + ss.b + ',' + (ss.life * 0.3) + ')');
        sg.addColorStop(1, 'rgba(' + ss.r + ',' + ss.g + ',' + ss.b + ',' + (ss.life * 0.6) + ')');
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = sg;
        ctx.lineWidth = ss.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        var hg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 3);
        hg.addColorStop(0, 'rgba(200,240,235,' + (ss.life * 0.4) + ')');
        hg.addColorStop(1, 'rgba(' + ss.r + ',' + ss.g + ',' + ss.b + ',0)');
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===========================================
  // 4b. HERO PARALLAX + GLOW
  // ===========================================
  function initHeroParallax() {
    if (window.innerWidth < 768) return;

    var heroGlow = document.getElementById('heroGlow');
    var heroStats = document.getElementById('heroStats');
    var heroOrbs = document.querySelectorAll('.hero-orb');
    var hero = document.getElementById('hero');
    var targetStatsX = 0, targetStatsY = 0;
    var currentStatsX = 0, currentStatsY = 0;
    var targetOrbOffset = { x: 0, y: 0 };
    var currentOrbOffset = { x: 0, y: 0 };

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width - 0.5;
      var cy = (e.clientY - rect.top) / rect.height - 0.5;

      // Stats move slightly, 5px
      targetStatsX = cx * 5;
      targetStatsY = cy * 5;

      // Orbs react to mouse — gentle offset
      targetOrbOffset.x = cx * 20;
      targetOrbOffset.y = cy * 20;

      // Glow follows cursor
      heroGlow.style.left = e.clientX - rect.left + 'px';
      heroGlow.style.top = e.clientY - rect.top + 'px';
    });

    function tick() {
      currentStatsX += (targetStatsX - currentStatsX) * 0.08;
      currentStatsY += (targetStatsY - currentStatsY) * 0.08;
      currentOrbOffset.x += (targetOrbOffset.x - currentOrbOffset.x) * 0.03;
      currentOrbOffset.y += (targetOrbOffset.y - currentOrbOffset.y) * 0.03;

      heroStats.style.transform = 'translate(' + currentStatsX + 'px,' + currentStatsY + 'px)';

      // Orbs get different parallax multipliers
      heroOrbs.forEach(function (orb, i) {
        var mult = [1, -0.6, 0.8][i] || 1;
        orb.style.translate = (currentOrbOffset.x * mult) + 'px ' + (currentOrbOffset.y * mult) + 'px';
      });

      requestAnimationFrame(tick);
    }
    tick();
  }

  // ===========================================
  // 5. HERO ANIMATION (after loader)
  // ===========================================
  function initHeroAnimation() {
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    gsap.set('.hero-overline', { x: -15 });
    gsap.set('.hero-word--serif', { scale: 1.03 });

    // t=0.1 — Overline glides in gently
    tl.to('.hero-overline', { x: 0, opacity: 1, duration: 1.0 }, 0.1);

    // t=0.15 — Gold line grows
    tl.to('.hero-gold-line', { width: 60, duration: 0.8, ease: 'power2.out' }, 0.15);

    // t=0.2 — Title words rise softly with stagger
    var words = gsap.utils.toArray('.hero-word:not(.hero-word--serif)');
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.1
    }, 0.2);

    // t=0.7 — "inoubliables." serif word
    tl.to('.hero-word--serif', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: 'expo.out'
    }, 0.7);

    // t=0.9 — Subtitle fades in
    tl.to('.hero-subtitle', { opacity: 1, duration: 0.7 }, 0.9);

    // t=1.05 — Buttons rise
    tl.to('.hero-buttons .btn-primary', {
      opacity: 1, y: 0, duration: 0.7
    }, 1.05);
    tl.to('.hero-buttons .btn-outline', {
      opacity: 1, y: 0, duration: 0.7
    }, 1.15);

    // t=1.2 — Stats with count-up
    tl.to('.hero-stat', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      onStart: function () {
        document.querySelectorAll('.hero-stat-value[data-count]').forEach(function (el) {
          var target = parseInt(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var duration = 1800;
          var start = performance.now();
          function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
      }
    }, 1.2);

    // t=1.5 — Scroll cue
    tl.to('.scroll-cue', { opacity: 1, duration: 0.6 }, 1.5);
  }

  // ===========================================
  // 6. SERVICES ANIMATIONS
  // ===========================================
  function initServicesAnimation() {
    gsap.from('.services .overline', {
      scrollTrigger: { trigger: '.services', start: 'top 80%' },
      x: -20, opacity: 0, duration: 0.8
    });
    gsap.from('.services .section-title', {
      scrollTrigger: { trigger: '.services', start: 'top 80%' },
      y: 40, opacity: 0, duration: 1, delay: 0.1
    });
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '.services-grid', start: 'top 85%' },
      y: 50, opacity: 0, duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  // ===========================================
  // 7. PROJET PHARE ANIMATIONS
  // ===========================================
  function initPhareAnimation() {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.phare', start: 'top 70%' }
    });

    tl.from('.phare-overline', { y: 20, opacity: 0, duration: 0.6 });
    tl.from('.phare-tags', { x: -30, opacity: 0, duration: 0.6 }, '-=0.3');
    tl.from('.phare-title', { x: -30, opacity: 0, duration: 0.8 }, '-=0.4');
    tl.from('.phare-desc', { x: -30, opacity: 0, duration: 0.7 }, '-=0.5');
    tl.from('.phare-stats', { y: 30, opacity: 0, duration: 0.6 }, '-=0.2');

    // Mockup from right with rotation
    tl.from('.phare-mockup', {
      x: 60, rotateY: -8, scale: 0.9, opacity: 0, duration: 1.2,
      ease: 'power3.out'
    }, '-=0.8');

    // Button last with bounce
    tl.from('.phare .btn-pill', {
      y: 20, opacity: 0, duration: 0.6,
      ease: 'back.out(1.2)'
    }, '-=0.3');

    // Floating mockup animation (idle)
    gsap.to('.phare-mockup', {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 2
    });

    // Mockup parallax on scroll
    gsap.to('.phare-mockup', {
      scrollTrigger: {
        trigger: '.phare',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotateX: 4,
      rotateY: -2,
      ease: 'none'
    });

    // Phare glow pulse
    gsap.to('.phare-glow', {
      scale: 1.15,
      opacity: 0.8,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }

  // ===========================================
  // 8. PROJETS GRID ANIMATIONS
  // ===========================================
  function initProjetsAnimation() {
    gsap.from('.projets .overline', {
      scrollTrigger: { trigger: '.projets', start: 'top 80%' },
      x: -20, opacity: 0, duration: 0.8
    });
    gsap.from('.projets .section-title', {
      scrollTrigger: { trigger: '.projets', start: 'top 80%' },
      y: 40, opacity: 0, duration: 1, delay: 0.1
    });

    // Stagger reveal for 3 expertise columns
    var cols = gsap.utils.toArray('.projet-col');
    cols.forEach(function (col, i) {
      gsap.from(col, {
        scrollTrigger: { trigger: col, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out'
      });
    });
  }

  // ===========================================
  // 8b. AUTOMATISATION CANVAS — Pipeline Animation
  // ===========================================
  function initAutoCanvas() {
    var canvas = document.getElementById('autoCanvas');
    if (!canvas) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, ctx;
    var TEAL = '#00f5d4';
    var labels = ['SCRAPE', 'ANALYSE', 'SCORE', 'EMAIL', 'SUIVI'];
    var nodeCount = 5;

    // Node state — animated by GSAP
    var nodeStates = [];
    for (var i = 0; i < nodeCount; i++) {
      nodeStates.push({ scale: 0, opacity: 0, ringScale: 1, ringOpacity: 0.4, yOff: 0 });
    }
    // Edge state — animated by GSAP
    var edgeStates = [];
    for (var j = 0; j < nodeCount - 1; j++) {
      edgeStates.push({ progress: 0 });
    }
    // Particle state — travels sequentially across edges
    var particle = { edge: 0, t: 0, active: false };
    var canvasOpacity = { v: 0 };

    function getNodePositions() {
      var padX = W * 0.12;
      var spacing = (W - padX * 2) / (nodeCount - 1);
      var cy = H * 0.44;
      var positions = [];
      for (var k = 0; k < nodeCount; k++) {
        positions.push({ x: padX + spacing * k, y: cy });
      }
      return positions;
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    }
    resize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    });

    var rafId;
    function draw() {
      rafId = requestAnimationFrame(draw);
      if (!ctx || canvasOpacity.v <= 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = canvasOpacity.v;
      var pos = getNodePositions();

      // Draw connection lines
      for (var ei = 0; ei < edgeStates.length; ei++) {
        var es = edgeStates[ei];
        if (es.progress <= 0) continue;
        var a = pos[ei], b = pos[ei + 1];
        var ex = a.x + (b.x - a.x) * es.progress;
        var ey = a.y + (b.y - a.y) * es.progress;
        var grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, 'rgba(0,245,212,.25)');
        grad.addColorStop(1, 'rgba(0,245,212,.05)');
        ctx.beginPath();
        ctx.moveTo(a.x, a.y + nodeStates[ei].yOff);
        ctx.lineTo(ex, ey + (nodeStates[ei].yOff + nodeStates[ei + 1].yOff) * es.progress * 0.5);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw nodes
      for (var ni = 0; ni < nodeCount; ni++) {
        var ns = nodeStates[ni];
        if (ns.opacity <= 0) continue;
        var p = pos[ni];
        var ny = p.y + ns.yOff;
        var s = ns.scale;

        // Pulsating ring
        var rr = 18 * ns.ringScale * s;
        ctx.beginPath();
        ctx.arc(p.x, ny, rr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,245,212,' + (ns.ringOpacity * ns.opacity) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, ny, 16 * s, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,245,212,' + (0.08 * ns.opacity) + ')';
        ctx.fill();

        // Core node (6px radius = 12px diameter)
        ctx.beginPath();
        ctx.arc(p.x, ny, 6 * s, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,245,212,' + (0.9 * ns.opacity) + ')';
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, ny, 2.5 * s, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.6 * ns.opacity) + ')';
        ctx.fill();

        // Label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0,245,212,' + (0.5 * ns.opacity) + ')';
        ctx.fillText(labels[ni], p.x, ny + 30 * s);
      }

      // Particle
      if (particle.active && !reduced) {
        var pe = particle.edge;
        var pt = particle.t;
        if (pe < pos.length - 1) {
          var pa = pos[pe], pb = pos[pe + 1];
          var px = pa.x + (pb.x - pa.x) * pt;
          var py = (pa.y + nodeStates[pe].yOff) + ((pb.y + nodeStates[pe + 1].yOff) - (pa.y + nodeStates[pe].yOff)) * pt;
          var alpha = Math.sin(pt * Math.PI);
          // Glow
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,245,212,' + (alpha * 0.15) + ')';
          ctx.fill();
          // Core
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,245,212,' + (alpha * 0.95) + ')';
          ctx.fill();
          // Bright center
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.8) + ')';
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    }

    // === GSAP Animations ===
    if (reduced) {
      canvasOpacity.v = 1;
      nodeStates.forEach(function (ns) { ns.scale = 1; ns.opacity = 1; });
      edgeStates.forEach(function (es) { es.progress = 1; });
      draw();
      return;
    }

    var tl = gsap.timeline({
      scrollTrigger: { trigger: canvas, start: 'top 75%' },
      onStart: function () { draw(); }
    });

    // 1) Canvas fade in
    tl.to(canvasOpacity, { v: 1, duration: 0.4, ease: 'power2.out' });

    // 2) Nodes appear left→right with back.out
    nodeStates.forEach(function (ns, idx) {
      tl.to(ns, {
        scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)'
      }, 0.4 + idx * 0.15);
    });

    // 3) Lines draw left→right after nodes
    var lineStart = 0.4 + nodeCount * 0.15;
    edgeStates.forEach(function (es, idx) {
      tl.to(es, {
        progress: 1, duration: 0.6, ease: 'power2.inOut'
      }, lineStart + idx * 0.1);
    });

    // 4) Start loops after entrance
    tl.call(function () {
      // Ring pulse on each node: scale 1→2.5, opacity 0.4→0
      nodeStates.forEach(function (ns, idx) {
        gsap.to(ns, {
          ringScale: 2.5, ringOpacity: 0, duration: 2,
          repeat: -1, delay: idx * 0.4, ease: 'power1.out',
          onRepeat: function () { ns.ringScale = 1; ns.ringOpacity = 0.4; }
        });
      });

      // Vertical oscillation
      nodeStates.forEach(function (ns, idx) {
        gsap.to(ns, {
          yOff: -3, duration: 3, yoyo: true, repeat: -1,
          ease: 'sine.inOut', delay: idx * 0.3
        });
      });

      // Sequential particle traveling
      particle.active = true;
      function animateParticle() {
        var dur = 2.5;
        var ptl = gsap.timeline({ onComplete: animateParticle });
        for (var k = 0; k < nodeCount - 1; k++) {
          (function (edge) {
            ptl.call(function () { particle.edge = edge; particle.t = 0; });
            ptl.to(particle, { t: 1, duration: dur / (nodeCount - 1), ease: 'none' });
          })(k);
        }
        // Pause at end before restart
        ptl.to({}, { duration: 0.5 });
      }
      animateParticle();
    });
  }

  // ===========================================
  // 8c. AGENTS SVG — Orbital Network Animation
  // ===========================================
  function initAgentsSvg() {
    var svg = document.getElementById('agentsSvg');
    if (!svg) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var msgs = gsap.utils.toArray('#agentsSvg .ag-msg');
    var insights = gsap.utils.toArray('#agentsSvg .ag-insight');
    var traces = gsap.utils.toArray('#agentsSvg .ag-trace');
    var agentBars = gsap.utils.toArray('#agentsSvg .ag-agent-bar');
    var typingDots = gsap.utils.toArray('#agentsSvg .ag-typing-dot');
    var liveDot = svg.querySelector('.ag-live-dot');
    var cursor = svg.querySelector('.ag-cursor');
    var progressBar = svg.querySelector('.ag-progress-bar');
    var maturityArc = svg.querySelector('.ag-maturity-arc');
    var confidenceBar = svg.querySelector('.ag-confidence-bar');
    var particles = gsap.utils.toArray('#agentsSvg .ag-particle');
    var orchPing = svg.querySelector('.ag-orch-ping');
    var orchLines = gsap.utils.toArray('#agentsSvg .ag-orch-line');
    var statusDots = gsap.utils.toArray('#agentsSvg .ag-status-dot');

    // Initial hidden state
    gsap.set(msgs, { opacity: 0, y: 8 });
    gsap.set(insights, { opacity: 0, x: 10 });
    gsap.set(traces, { opacity: 0, x: -5 });
    agentBars.forEach(function (b) { gsap.set(b, { attr: { width: 0 } }); });
    gsap.set(progressBar, { attr: { width: 0 } });
    gsap.set(maturityArc, { attr: { 'stroke-dasharray': '0 100' } });
    if (confidenceBar) gsap.set(confidenceBar, { attr: { width: 0 } });
    gsap.set(particles, { opacity: 0 });

    if (reduced) {
      gsap.set(msgs, { opacity: 1, y: 0 });
      gsap.set(insights, { opacity: 1, x: 0 });
      gsap.set(traces, { opacity: 1, x: 0 });
      agentBars.forEach(function (b) {
        var t = parseFloat(b.getAttribute('data-target')) || 0;
        gsap.set(b, { attr: { width: t } });
      });
      gsap.set(progressBar, { attr: { width: 62 } });
      gsap.set(maturityArc, { attr: { 'stroke-dasharray': '72 100' } });
      if (confidenceBar) gsap.set(confidenceBar, { attr: { width: 179 } });
      return;
    }

    // Scroll-triggered entrance
    var tl = gsap.timeline({
      scrollTrigger: { trigger: svg, start: 'top 75%' }
    });

    // 1) Agent progress bars fill
    tl.to(agentBars[0], { attr: { width: 120 }, duration: 0.8, ease: 'power2.out' }, 0);
    tl.to(agentBars[1], { attr: { width: 87 }, duration: 0.8, ease: 'power2.out' }, 0.15);
    tl.to(agentBars[2], { attr: { width: 0 }, duration: 0.1 }, 0.3);

    // 2) Progress bar fills (89% of 70px)
    tl.to(progressBar, { attr: { width: 62 }, duration: 1.2, ease: 'power2.out' }, 0);

    // 3) Chat messages appear one by one
    tl.to(msgs[0], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.3);
    tl.to(msgs[1], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.6);
    tl.to(msgs[2], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.9);

    // 4) Insights slide in from right
    tl.to(insights[0], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.4);
    tl.to(insights[1], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.6);
    tl.to(insights[2], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.8);

    // 5) Maturity arc draws (72% of 2*PI*16 ≈ 100 → 72)
    tl.to(maturityArc, { attr: { 'stroke-dasharray': '72 100' }, duration: 1, ease: 'power2.out' }, 0.8);

    // 6) Confidence bar fills (94% of 190px = 179)
    if (confidenceBar) {
      tl.to(confidenceBar, { attr: { width: 179 }, duration: 1, ease: 'power2.out' }, 0.5);
    }

    // 7) Trace lines appear
    traces.forEach(function (t, i) {
      tl.to(t, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0.5 + i * 0.15);
    });

    // 8) Start looping animations
    tl.call(function () {
      // Live dot pulse
      gsap.to(liveDot, {
        opacity: 0.3, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // Blinking cursor
      if (cursor) {
        gsap.to(cursor, {
          opacity: 0, duration: 0.5, yoyo: true, repeat: -1, ease: 'steps(1)'
        });
      }

      // Typing dots animation
      typingDots.forEach(function (dot, i) {
        gsap.to(dot, {
          opacity: 1, duration: 0.4, yoyo: true, repeat: -1,
          delay: i * 0.15, ease: 'sine.inOut'
        });
      });

      // Status dots pulse
      statusDots.forEach(function (dot) {
        gsap.to(dot, {
          opacity: 0.4, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut'
        });
      });

      // Orchestration ping traveling between nodes
      if (orchPing) {
        function runOrchPing() {
          var pingTl = gsap.timeline({ onComplete: runOrchPing });
          pingTl.set(orchPing, { attr: { cx: 30, cy: 346 }, opacity: 0 });
          pingTl.to(orchPing, { opacity: 0.8, duration: 0.2 });
          pingTl.to(orchPing, { attr: { cx: 70, cy: 346 }, duration: 0.8, ease: 'power1.inOut' });
          pingTl.to(orchPing, { attr: { cx: 110, cy: 346 }, duration: 0.8, ease: 'power1.inOut' });
          pingTl.to(orchPing, { opacity: 0, duration: 0.3 });
          pingTl.to({}, { duration: 1 });
        }
        runOrchPing();
      }

      // Flowing dashes on orchestration lines
      orchLines.forEach(function (line) {
        gsap.to(line, {
          strokeDashoffset: -10, duration: 1.5, repeat: -1, ease: 'none'
        });
      });

      // Floating particles between sidebar and main panel
      function animateParticle(p, delay) {
        var startX = 140 + Math.random() * 15;
        var startY = 60 + Math.random() * 120;
        var endX = 155 + Math.random() * 180;
        var endY = 50 + Math.random() * 140;
        gsap.set(p, { attr: { cx: startX, cy: startY }, opacity: 0 });
        gsap.to(p, {
          attr: { cx: endX, cy: endY }, opacity: 0.6,
          duration: 2 + Math.random() * 2, delay: delay,
          ease: 'power1.inOut',
          onComplete: function () {
            gsap.to(p, {
              opacity: 0, duration: 0.5,
              onComplete: function () { animateParticle(p, Math.random() * 2); }
            });
          }
        });
      }
      particles.forEach(function (p, i) {
        animateParticle(p, i * 0.8);
      });
    });
  }

  // ===========================================
  // 9. A PROPOS ANIMATIONS
  // ===========================================
  function initAproposAnimation() {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.apropos', start: 'top 75%' }
    });

    tl.from('.apropos .overline', { x: -20, opacity: 0, duration: 0.6 });
    tl.from('.apropos .section-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3');
    tl.from('.apropos-desc', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4');

    // Metrics from right
    tl.from('.apropos-metric', {
      x: 30, opacity: 0, duration: 0.6,
      stagger: 0.12
    }, '-=0.5');

    // Quote
    tl.from('.apropos-quote', { y: 30, opacity: 0, duration: 0.8 }, '-=0.2');
  }

  // ===========================================
  // 10. PROCESS / TIMELINE ANIMATIONS
  // ===========================================
  function initProcessAnimation() {
    gsap.from('.process .overline', {
      scrollTrigger: { trigger: '.process', start: 'top 80%' },
      x: -20, opacity: 0, duration: 0.8
    });
    gsap.from('.process .section-title', {
      scrollTrigger: { trigger: '.process', start: 'top 80%' },
      y: 40, opacity: 0, duration: 1, delay: 0.1
    });

    // Line draws progressively
    gsap.to('#timelineLine', {
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1
      },
      scaleY: 1,
      ease: 'none'
    });

    // Timeline items
    var items = gsap.utils.toArray('.timeline-item');
    items.forEach(function (item) {
      var isLeft = item.classList.contains('timeline-item--left');
      var node = item.querySelector('.timeline-node');

      gsap.from(item.querySelector('.timeline-content'), {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        x: isLeft ? -30 : 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: function () {
          node.classList.add('is-visible');
        }
      });

      gsap.from(node, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        scale: 0,
        duration: 0.4,
        ease: 'back.out(2)'
      });
    });
  }

  // ===========================================
  // 10b. TESTIMONIALS — Infinite Sliding Carousel
  // ===========================================
  function initTestimonialsAnimation() {
    // ScrollTrigger reveal
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.testimonials', start: 'top 75%' }
    });

    tl.from('.testimonials .overline', { x: -20, opacity: 0, duration: 0.6 });
    tl.from('.testimonials .section-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3');
    tl.from('.testimonials-carousel', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    // Infinite sliding carousel
    var track = document.getElementById('testimonialsTrack');
    if (!track) return;

    var originalCards = track.querySelectorAll('.testimonial-card');
    var cardCount = originalCards.length;
    if (!cardCount) return;

    // Clone cards for seamless loop
    originalCards.forEach(function (card) {
      track.appendChild(card.cloneNode(true));
    });

    var gap = 32;
    var isAnimating = false;
    var currentX = 0;
    var autoplayTimer;

    function getSlideDistance() {
      var card = track.querySelector('.testimonial-card');
      return card.offsetWidth + gap;
    }

    function slideNext() {
      if (isAnimating) return;
      isAnimating = true;
      var dist = getSlideDistance();
      currentX -= dist;

      gsap.to(track, {
        x: currentX,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: function () {
          // Move first card to end for infinite loop
          var first = track.querySelector('.testimonial-card');
          track.appendChild(first);
          currentX += dist;
          gsap.set(track, { x: currentX });
          isAnimating = false;
        }
      });
    }

    function slidePrev() {
      if (isAnimating) return;
      isAnimating = true;
      var dist = getSlideDistance();

      // Move last card to beginning
      var allCards = track.querySelectorAll('.testimonial-card');
      var last = allCards[allCards.length - 1];
      track.insertBefore(last, track.firstChild);
      currentX -= dist;
      gsap.set(track, { x: currentX });

      currentX += dist;
      gsap.to(track, {
        x: currentX,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: function () { isAnimating = false; }
      });
    }

    function startAutoplay() {
      autoplayTimer = setInterval(slideNext, 4000);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    // Pause on hover
    var carousel = document.getElementById('testimonialsCarousel');
    carousel.addEventListener('mouseenter', function () { clearInterval(autoplayTimer); });
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      clearInterval(autoplayTimer);
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (diff > 50) slideNext();
      else if (diff < -50) slidePrev();
      startAutoplay();
    }, { passive: true });

    // Recalculate on resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        currentX = 0;
        gsap.set(track, { x: 0 });
      }, 200);
    });

    startAutoplay();
  }

  // ===========================================
  // 11. CONTACT FORM + ANIMATIONS
  // ===========================================
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var steps = form.querySelectorAll('.form-step');
    var progressFill = document.getElementById('formProgressFill');
    var currentStep = 1;
    var formData = {};

    function goToStep(stepNum) {
      // Hide all steps
      steps.forEach(function (s) { s.classList.remove('form-step--active'); });

      // Show target step
      var target = form.querySelector('[data-step="' + stepNum + '"]');
      if (target) {
        target.classList.add('form-step--active');
        // Re-trigger animation
        target.style.animation = 'none';
        target.offsetHeight; // reflow
        target.style.animation = '';
      }

      // Update progress bar
      if (stepNum === 'success') {
        progressFill.style.width = '100%';
      } else {
        progressFill.style.width = (stepNum * 33) + '%';
      }

      currentStep = stepNum;
    }

    // Step 1 & 2 — choice buttons
    var allChoices = form.querySelectorAll('.form-choice');
    allChoices.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = btn.closest('.form-step');
        var stepNum = parseInt(step.dataset.step);
        var value = btn.dataset.value;

        // Visual select
        step.querySelectorAll('.form-choice').forEach(function (c) {
          c.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');

        // Store data
        if (stepNum === 1) formData.service = value;
        if (stepNum === 2) formData.budget = value;

        // Auto-advance after small delay
        setTimeout(function () {
          goToStep(stepNum + 1);
        }, 400);
      });
    });

    // Web3Forms — replace with your real access key from web3forms.com
    var WEB3FORMS_KEY = 'b1c80127-96ec-4e57-8b47-86fb86226532';

    // Step 3 — submit
    var submitBtn = document.getElementById('formSubmit');
    submitBtn.addEventListener('click', function () {
      var name = document.getElementById('formName').value.trim();
      var email = document.getElementById('formEmail').value.trim();
      var message = document.getElementById('formMessage').value.trim();

      if (!name || !email) {
        if (!name) shakeField(document.getElementById('formName'));
        if (!email) shakeField(document.getElementById('formEmail'));
        return;
      }

      formData.name = name;
      formData.email = email;
      formData.message = message;

      // Disable button during send
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Nouveau projet — ' + (formData.service || 'Non spécifié'),
          from_name: formData.name,
          email: formData.email,
          service: formData.service || 'Non spécifié',
          budget: formData.budget || 'Non spécifié',
          message: formData.message || '',
          botcheck: ''
        })
      }).then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            goToStep('success');
          } else {
            throw new Error(data.message);
          }
        }).catch(function (err) {
          console.error('Web3Forms error:', err);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer';
          // Fallback mailto
          var subject = encodeURIComponent('Nouveau projet — ' + (formData.service || 'Non spécifié'));
          var body = encodeURIComponent(
            'Bonjour,\n\n' +
            'Nom : ' + formData.name + '\n' +
            'Email : ' + formData.email + '\n' +
            'Service : ' + (formData.service || 'Non spécifié') + '\n' +
            'Budget : ' + (formData.budget || 'Non spécifié') + '\n' +
            (formData.message ? 'Message : ' + formData.message + '\n' : '') +
            '\n---\nEnvoyé depuis studio-auralis.com'
          );
          window.location.href = 'mailto:contact@studio-auralis.com?subject=' + subject + '&body=' + body;
        });
    });

    function shakeField(el) {
      gsap.to(el, {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.5,
        ease: 'power2.out'
      });
      el.style.borderColor = '#ff4444';
      setTimeout(function () {
        el.style.borderColor = '';
      }, 1500);
    }
  }

  function initContactAnimation() {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.contact', start: 'top 70%' }
    });

    tl.from('.contact .overline', { y: 20, opacity: 0, duration: 0.6 });

    // Title word by word
    tl.to('.contact-word', {
      opacity: 1, y: 0, duration: 0.8,
      stagger: 0.1
    }, '-=0.2');

    tl.to('.contact-subtitle', { opacity: 1, duration: 0.6 }, '-=0.3');

    // Form appears
    tl.from('.contact-form', {
      y: 30, opacity: 0, duration: 0.8,
      ease: 'power3.out'
    }, '-=0.2');

    // Contact infos
    tl.from('.contact-info', {
      y: 20, opacity: 0, duration: 0.6,
      stagger: 0.1
    }, '-=0.2');

    // Glow pulse
    gsap.to('.contact-glow', {
      scale: 1.2,
      opacity: 0.8,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }

  // ===========================================
  // 12. DECORATIVE LINE ANIMATIONS
  // ===========================================
  function initDecorations() {
    // Footer line reveal
    gsap.from('.footer-line', {
      scrollTrigger: { trigger: '.footer', start: 'top 95%' },
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.8,
      ease: 'power3.out'
    });

    // Footer content
    gsap.from('.footer-inner', {
      scrollTrigger: { trigger: '.footer', start: 'top 95%' },
      y: 20, opacity: 0, duration: 0.6, delay: 0.3
    });
  }

  // ===========================================
  // 13. SMOOTH SCROLL for NAV LINKS
  // ===========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===========================================
  // INIT
  // ===========================================
  function init() {
    initCursor();
    initNavbar();
    initParticles();
    initHeroParallax();
    initHeroAnimation();
    initSmoothScroll();

    // Fade in particles immediately
    if (window._heroParticlesFadeIn) window._heroParticlesFadeIn();

    // ScrollTrigger animations
    initServicesAnimation();
    initPhareAnimation();
    initProjetsAnimation();
    initAutoCanvas();
    initAgentsSvg();
    initAproposAnimation();
    initProcessAnimation();
    initTestimonialsAnimation();
    initContactForm();
    initContactAnimation();
    initDecorations();

    // Scroll to hash target (e.g. index.html#projets from sub-pages)
    if (window.location.hash) {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        document.documentElement.style.scrollBehavior = 'auto';
        // Keep forcing scroll every frame until GSAP stops fighting
        var forceCount = 0;
        function forceScroll() {
          window.scrollTo(0, hashTarget.offsetTop);
          forceCount++;
          if (forceCount < 120) requestAnimationFrame(forceScroll);
          else {
            ScrollTrigger.refresh();
            document.documentElement.style.scrollBehavior = '';
          }
        }
        forceScroll();
      }
    }

  }

  // Init as soon as DOM is ready (no waiting for images)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
