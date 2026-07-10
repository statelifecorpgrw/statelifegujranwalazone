/* ============================================================
   STATE LIFE INSURANCE — GUJRANWALA BRANCH
   script.js — vanilla JS + GSAP/ScrollTrigger + Three.js + Lenis
   Every feature degrades gracefully if a CDN library fails to load,
   and prefers-reduced-motion is respected throughout.
   ============================================================ */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------------------------------------------------
     Preloader
  --------------------------------------------------------- */
  function initPreloader() {
    var pre = document.getElementById('preloader');
    if (!pre) return;
    var fill = document.getElementById('preloaderFill');
    var pct = document.getElementById('preloaderPct');
    var progress = 0;
    var finished = false;

    function tick() {
      if (finished) return;
      progress += Math.random() * 14 + 8;
      if (progress > 100) progress = 100;
      if (fill) fill.style.width = progress + '%';
      if (pct) pct.textContent = Math.round(progress);
      if (progress < 100) {
        setTimeout(tick, 100);
      } else {
        finish();
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      setTimeout(function () {
        pre.classList.add('is-done');
        document.body.classList.add('is-loaded');
        window.dispatchEvent(new Event('preloaderDone'));
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }, 300);
    }

    setTimeout(tick, 150);
    setTimeout(finish, 3200); // safety net: never stay stuck on the loader
  }

  /* ---------------------------------------------------------
     Header: scroll state + mobile nav toggle
  --------------------------------------------------------- */
  function initHeader() {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');

    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---------------------------------------------------------
     Top scroll-progress bar
  --------------------------------------------------------- */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    var onScroll = function () {
      var d = document.documentElement;
      var scrollTop = d.scrollTop || document.body.scrollTop;
      var scrollHeight = d.scrollHeight - d.clientHeight;
      var p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = p + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     Custom cursor (dot + lagging ring) — desktop only
  --------------------------------------------------------- */
  function initCursor() {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function raf() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(raf);
    })();

    var hoverables = document.querySelectorAll('a, button, .card-3d, summary, input, select, textarea');
    Array.prototype.forEach.call(hoverables, function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------- */
  function initMagnetic() {
    var items = document.querySelectorAll('.magnetic');
    Array.prototype.forEach.call(items, function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width / 2;
        var relY = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + relX * 0.3 + 'px,' + relY * 0.3 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     Reveal-on-scroll (IntersectionObserver — no GSAP dependency)
  --------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* Give the hero its own cinematic, staggered reveal right as the
     preloader lifts, rather than an instant appearance underneath it. */
  function initHeroReveal() {
    var heroEls = document.querySelectorAll('#hero .reveal');
    if (!heroEls.length) return;
    window.addEventListener('preloaderDone', function () {
      Array.prototype.forEach.call(heroEls, function (el, i) {
        setTimeout(function () { el.classList.add('is-visible'); }, prefersReducedMotion ? 0 : 110 * i);
      });
    });
  }

  /* ---------------------------------------------------------
     3D tilt on cards (pointer-driven, desktop only)
  --------------------------------------------------------- */
  function initTilt() {
    var cards = document.querySelectorAll('.card-3d');
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (px - 0.5) * 10;
        var ry = (0.5 - py) * 10;
        card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------------------------------------------------
     Animated stat counters (Achievements section)
  --------------------------------------------------------- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count-to]');
    if (!nums.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        io.unobserve(el);

        if (prefersReducedMotion) {
          el.textContent = target + suffix;
          return;
        }
        var duration = 1400;
        var start = performance.now();
        function frame(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     Smooth scroll (Lenis) synced with ScrollTrigger
  --------------------------------------------------------- */
  function initSmoothScroll() {
    if (prefersReducedMotion || !window.Lenis) return;

    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', function () {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.__lenis = lenis;

    // Smooth-scroll anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });
  }

  /* ---------------------------------------------------------
     "Why Choose" pinned horizontal-scroll banner track
     Desktop/pointer only — mobile falls back to native swipe
     (handled purely in CSS via scroll-snap).
  --------------------------------------------------------- */
  function initWhyChoosePin() {
    var pinEl = document.getElementById('whyChoosePin');
    var track = document.getElementById('whyChooseTrack');
    var viewport = document.querySelector('.why-choose__viewport');
    var progressBar = document.getElementById('whyChooseProgressBar');
    if (!pinEl || !track || !viewport) return;

    function teardown() {
      if (window.__whyChooseTween) {
        if (window.__whyChooseTween.scrollTrigger) window.__whyChooseTween.scrollTrigger.kill();
        window.__whyChooseTween.kill();
        window.__whyChooseTween = null;
      }
      if (window.gsap) window.gsap.set(track, { clearProps: 'transform' });
    }

    function setup() {
      teardown();
      if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion || window.innerWidth < 900) return;

      var distance = function () {
        return Math.max(track.scrollWidth - viewport.clientWidth, 0);
      };

      window.__whyChooseTween = window.gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: function () { return '+=' + distance(); },
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
          }
        }
      });
    }

    setup();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 250);
    });
  }

  /* ---------------------------------------------------------
     Hero — Three.js floating 3D shield + particle field
  --------------------------------------------------------- */
  function initHeroScene() {
    var canvas = document.getElementById('heroCanvas');
    var heroSection = document.getElementById('hero');
    if (!canvas || !heroSection || !window.THREE) return;

    var THREE = window.THREE;
    var width = heroSection.clientWidth;
    var height = heroSection.clientHeight;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    var isSmallScreen = window.innerWidth < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2));
    renderer.setSize(width, height);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0x9fb4d8, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 6);
    scene.add(key);
    var goldLight = new THREE.PointLight(0xe3c171, 2.2, 22);
    goldLight.position.set(-3, -2, 4);
    scene.add(goldLight);
    var rimLight = new THREE.PointLight(0x6f8bc9, 1.1, 22);
    rimLight.position.set(3, -3, -4);
    scene.add(rimLight);

    // Build a shield silhouette, then extrude it for real depth
    var shape = new THREE.Shape();
    shape.moveTo(0, 1.55);
    shape.bezierCurveTo(0.95, 1.55, 1.35, 1.15, 1.35, 0.65);
    shape.lineTo(1.35, -0.35);
    shape.bezierCurveTo(1.35, -1.15, 0.75, -1.75, 0, -2.05);
    shape.bezierCurveTo(-0.75, -1.75, -1.35, -1.15, -1.35, -0.35);
    shape.lineTo(-1.35, 0.65);
    shape.bezierCurveTo(-1.35, 1.15, -0.95, 1.55, 0, 1.55);

    var geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.09,
      bevelSegments: isSmallScreen ? 2 : 4, curveSegments: isSmallScreen ? 14 : 24
    });
    geometry.center();

    var navyMat = new THREE.MeshStandardMaterial({ color: 0x16294f, metalness: 0.55, roughness: 0.3 });
    var goldMat = new THREE.MeshStandardMaterial({ color: 0xd8b364, metalness: 0.85, roughness: 0.25 });

    var shieldGroup = new THREE.Group();
    var shieldMesh = new THREE.Mesh(geometry, [goldMat, navyMat]);
    shieldGroup.add(shieldMesh);

    var edges = new THREE.EdgesGeometry(geometry, 25);
    var edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf0dca6, transparent: true, opacity: 0.35 }));
    shieldGroup.add(edgeLines);

    shieldGroup.rotation.x = 0.15;
    scene.add(shieldGroup);

    // Ambient floating particles
    var particleCount = window.innerWidth < 700 ? 90 : 220;
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
      color: 0xe3c171, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true
    }));
    scene.add(particles);

    var targetRotX = 0.15, targetRotY = 0;

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', function (e) {
        var nx = (e.clientX / window.innerWidth) * 2 - 1;
        var ny = (e.clientY / window.innerHeight) * 2 - 1;
        targetRotY = nx * 0.4;
        targetRotX = 0.15 - ny * 0.25;
      });
    }

    var heroVisible = true;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { heroVisible = entry.isIntersecting; });
      }, { threshold: 0 });
      io.observe(heroSection);
    }

    function animate(t) {
      requestAnimationFrame(animate);
      if (!heroVisible || document.hidden) return;

      if (!prefersReducedMotion) {
        shieldGroup.rotation.y += (targetRotY - shieldGroup.rotation.y) * 0.06;
        shieldGroup.rotation.x += (targetRotX - shieldGroup.rotation.x) * 0.06;
        shieldGroup.rotation.y += 0.0022;
        particles.rotation.y += 0.0007;
        goldLight.intensity = 2.0 + Math.sin(t * 0.0012) * 0.5;
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
    if (prefersReducedMotion) renderer.render(scene, camera);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 150);
    });
  }

  /* ---------------------------------------------------------
     Contact form (front-end only — see index.html note)
  --------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('quoteForm');
    var status = document.getElementById('formStatus');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // TODO (developer): connect this to a real backend / email service
      // before launch. This front-end-only handler just confirms receipt.
      if (status) status.textContent = 'Thanks — your Gujranwala team will be in touch shortly.';
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  function initFooterYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  function init() {
    initPreloader();
    initHeader();
    initScrollProgress();
    initFooterYear();
    initContactForm();
    initReveal();
    initHeroReveal();
    initCounters();

    if (!isTouch) {
      initCursor();
      initMagnetic();
      initTilt();
    }

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      initWhyChoosePin();
    }

    initSmoothScroll();
    initHeroScene();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
