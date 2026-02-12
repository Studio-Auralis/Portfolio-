// ═══════════════════════════════════════════
// THREE.JS — 3D COSMOS SCENE
// ═══════════════════════════════════════════
(function() {

  /* ── RENDERER ── */
  var canvas = document.getElementById('three-scene');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);

  /* ── LIGHTS ── */
  scene.add(new THREE.AmbientLight(0x0D1117, 0.5));
  var lA = new THREE.PointLight(0x00E5CC, 0.8, 60); lA.position.set(-8, 5, 10); scene.add(lA);
  var lB = new THREE.PointLight(0x00BFA6, 0.4, 50); lB.position.set(8, -4, 8); scene.add(lB);
  var lC = new THREE.PointLight(0x5A6372, 0.3, 40); lC.position.set(0, 8, -5); scene.add(lC);

  /* ═══════════════════════════════════════════
     CRYSTAL CORE (Icosahedron)
     ═══════════════════════════════════════════ */
  var coreMat = new THREE.MeshStandardMaterial({
    color: 0x0D1117, emissive: 0x00E5CC, emissiveIntensity: 0.1,
    roughness: 0.05, metalness: 1, transparent: true, opacity: 0.5
  });
  var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), coreMat);
  scene.add(core);

  var wireMat = new THREE.MeshBasicMaterial({ color: 0x00E5CC, wireframe: true, transparent: true, opacity: 0.12 });
  var wireShell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.58, 1), wireMat);
  scene.add(wireShell);

  var glowMat = new THREE.MeshBasicMaterial({ color: 0x00E5CC, transparent: true, opacity: 0.035 });
  var glowSphere = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), glowMat);
  scene.add(glowSphere);

  /* ═══════════════════════════════════════════
     ORBITAL RINGS (3 anneaux)
     ═══════════════════════════════════════════ */
  function mkRing(r, tube, op, em) {
    var m = new THREE.MeshStandardMaterial({
      color: 0x00E5CC, emissive: 0x00E5CC, emissiveIntensity: em,
      transparent: true, opacity: op, roughness: 0.15, metalness: 0.9, side: THREE.DoubleSide
    });
    return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 220), m);
  }
  var r1 = mkRing(4.8, 0.022, 0.28, 0.18); r1.rotation.x = Math.PI * 0.42; r1.rotation.z = 0.3; scene.add(r1);
  var r2 = mkRing(5.6, 0.014, 0.14, 0.08); r2.rotation.x = Math.PI * 0.42; r2.rotation.z = 0.3; scene.add(r2);
  var r3 = mkRing(3.8, 0.018, 0.18, 0.12); r3.rotation.x = Math.PI * 0.6; r3.rotation.z = -0.4; scene.add(r3);

  /* ═══════════════════════════════════════════
     ORBITING PARTICLES
     ═══════════════════════════════════════════ */
  var orbiters = [];
  function mkOrbiters(n, rr, tx, tz) {
    for (var i = 0; i < n; i++) {
      var sz = 0.02 + Math.random() * 0.05;
      var mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.3 ? 0x00E5CC : 0xE8EAED,
        transparent: true, opacity: 0.2 + Math.random() * 0.5
      });
      var m = new THREE.Mesh(new THREE.SphereGeometry(sz, 6, 6), mat);
      scene.add(m);
      orbiters.push({
        mesh: m,
        angle: (i / n) * Math.PI * 2 + Math.random() * 0.3,
        radius: rr + (Math.random() - 0.5) * 0.5,
        speed: 0.0003 + Math.random() * 0.0007,
        tX: tx, tZ: tz,
        yOff: (Math.random() - 0.5) * 0.3,
        bOp: mat.opacity
      });
    }
  }
  mkOrbiters(30, 4.8, Math.PI * 0.42, 0.3);
  mkOrbiters(15, 3.8, Math.PI * 0.6, -0.4);

  /* ═══════════════════════════════════════════
     FLOATING GEOMETRY (octahedra + tetrahedra)
     ═══════════════════════════════════════════ */
  var floaters = [];
  var geoTypes = [
    function(s) { return new THREE.OctahedronGeometry(s, 0); },
    function(s) { return new THREE.TetrahedronGeometry(s, 0); },
    function(s) { return new THREE.IcosahedronGeometry(s, 0); }
  ];

  for (var i = 0; i < 12; i++) {
    var sz = 0.1 + Math.random() * 0.35;
    var geo = geoTypes[Math.floor(Math.random() * geoTypes.length)](sz);
    var useWire = Math.random() > 0.45;
    var mat = useWire
      ? new THREE.MeshBasicMaterial({ color: 0x00E5CC, wireframe: true, transparent: true, opacity: 0.06 + Math.random() * 0.1 })
      : new THREE.MeshStandardMaterial({
          color: i % 3 === 0 ? 0x00BFA6 : (i % 3 === 1 ? 0x00E5CC : 0x5A6372),
          emissive: 0x00E5CC, emissiveIntensity: 0.03,
          roughness: 0.1, metalness: 0.9,
          transparent: true, opacity: 0.06 + Math.random() * 0.12
        });
    var mesh = new THREE.Mesh(geo, mat);
    var angle = Math.random() * Math.PI * 2;
    var dist = 7 + Math.random() * 12;
    var ySpread = (Math.random() - 0.5) * 14;
    mesh.position.set(Math.cos(angle) * dist, ySpread, -3 + Math.random() * -15);
    scene.add(mesh);
    floaters.push({
      mesh: mesh,
      rx: 0.001 + Math.random() * 0.004,
      ry: 0.002 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
      floatSpd: 0.2 + Math.random() * 0.5,
      floatAmp: 0.002 + Math.random() * 0.005,
      baseY: ySpread
    });
  }

  /* ═══════════════════════════════════════════
     PARTICLE DUST (2 layers)
     ═══════════════════════════════════════════ */
  function mkDust(count, color, size, opacity, spread) {
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.8 - 5;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: color, size: size, transparent: true, opacity: opacity,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    return new THREE.Points(geo, mat);
  }

  var dust1 = mkDust(400, 0x00E5CC, 0.06, 0.3, 65); scene.add(dust1);
  var dust2 = mkDust(200, 0xE8EAED, 0.04, 0.18, 55); scene.add(dust2);
  var dust3 = mkDust(100, 0x00BFA6, 0.08, 0.15, 50); scene.add(dust3);

  /* ═══════════════════════════════════════════
     MOUSE + SCROLL TRACKING
     ═══════════════════════════════════════════ */
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  document.addEventListener('mousemove', function(e) {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  var scrollProgress = 0;
  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  window.addEventListener('scroll', function() {
    var max = getMaxScroll();
    scrollProgress = max > 0 ? window.pageYOffset / max : 0;
  }, { passive: true });

  /* ═══════════════════════════════════════════
     ANIMATION LOOP
     ═══════════════════════════════════════════ */
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    var sp = scrollProgress; // 0 → 1

    // Smooth mouse
    mx += (tmx - mx) * 0.02;
    my += (tmy - my) * 0.02;

    // Camera: mouse parallax + scroll drift lent
    camera.position.x = mx * 1.5 + Math.sin(sp * Math.PI * 0.5) * 2;
    camera.position.y = -my * 1.0 - sp * 3;
    camera.position.z = 20 - sp * 4;
    camera.lookAt(0, -sp * 2, 0);

    // ── CORE ──
    core.rotation.x = t * 0.1 + sp * 0.5;
    core.rotation.y = t * 0.15;
    wireShell.rotation.x = -t * 0.07 - sp * 0.3;
    wireShell.rotation.y = -t * 0.12;

    var breathe = 1 + Math.sin(t * 0.7) * 0.035;
    core.scale.setScalar(breathe);
    wireShell.scale.setScalar(breathe * 1.03);
    glowSphere.scale.setScalar(breathe * 1.2 + Math.sin(t * 1.3) * 0.03);
    glowMat.opacity = 0.03 + Math.sin(t * 1.1) * 0.015;
    coreMat.emissiveIntensity = 0.08 + Math.sin(t * 0.9) * 0.04 + sp * 0.06;

    // ── RINGS ──
    r1.rotation.y = t * 0.04 + sp * 0.8;
    r2.rotation.y = -t * 0.028 - sp * 0.5;
    r3.rotation.y = t * 0.035 + sp * 0.6;
    r1.material.opacity = 0.22 + Math.sin(t * 0.45) * 0.06;

    // ── ORBITERS ──
    for (var i = 0; i < orbiters.length; i++) {
      var o = orbiters[i];
      o.angle += o.speed;
      var cx = Math.cos(o.angle) * o.radius;
      var cy = Math.sin(o.angle) * o.radius;
      var cosX = Math.cos(o.tX), sinX = Math.sin(o.tX);
      var cosZ = Math.cos(o.tZ), sinZ = Math.sin(o.tZ);
      var y1 = cy * cosX, z1 = cy * sinX;
      o.mesh.position.set(cx * cosZ - y1 * sinZ, cx * sinZ + y1 * cosZ + o.yOff, z1);
      o.mesh.material.opacity = o.bOp * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + o.angle * 2)));
    }

    // ── FLOATERS ──
    for (var j = 0; j < floaters.length; j++) {
      var f = floaters[j];
      f.mesh.rotation.x += f.rx;
      f.mesh.rotation.y += f.ry;
      f.mesh.position.y = f.baseY + Math.sin(t * f.floatSpd + f.phase) * 1.5;
    }

    // ── DUST scroll parallax ──
    dust1.rotation.y = t * 0.006 + sp * 0.3;
    dust1.rotation.x = Math.sin(t * 0.008) * 0.04;
    dust1.position.y = -sp * 5;
    dust2.rotation.y = -t * 0.004 - sp * 0.2;
    dust2.position.y = -sp * 3;
    dust3.rotation.y = t * 0.005;
    dust3.position.y = -sp * 7;

    // ── LIGHTS pulse ──
    lA.intensity = 0.7 + Math.sin(t * 0.6) * 0.15;
    lB.intensity = 0.35 + Math.sin(t * 0.45 + 1) * 0.1;
    lA.position.x = -8 + Math.sin(t * 0.2) * 2;
    lB.position.x = 8 + Math.cos(t * 0.15) * 2;

    renderer.render(scene, camera);
  }
  animate();

  /* ── RESIZE ── */
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── REDUCED MOTION ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) clock.stop();

})();
