// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
// Requires: GSAP 3.12+ and ScrollTrigger plugin

gsap.registerPlugin(ScrollTrigger);

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {

    // ── Navbar Shrink on Scroll ──
    ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => document.querySelector('.navbar').classList.add('shrink'),
        onLeaveBack: () => document.querySelector('.navbar').classList.remove('shrink'),
    });

    // ── Section Tags Typewriter ──
    document.querySelectorAll('.section-tag').forEach(tag => {
        const text = tag.textContent;
        tag.textContent = '';
        ScrollTrigger.create({
            trigger: tag,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                let i = 0;
                const interval = setInterval(() => {
                    tag.textContent = text.substring(0, i + 1);
                    i++;
                    if (i >= text.length) clearInterval(interval);
                }, 40);
            }
        });
    });

    // ── Services Stagger ──
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            once: true,
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
    });

    // ── Featured Project Split Animation ──
    gsap.from('.featured-info', {
        scrollTrigger: {
            trigger: '.featured-card',
            start: 'top 75%',
            once: true,
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });

    gsap.from('.featured-preview', {
        scrollTrigger: {
            trigger: '.featured-card',
            start: 'top 75%',
            once: true,
        },
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
    });

    // ── Projects Batch Animation ──
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
    });

    // ── Tech Tags Bounce ──
    gsap.from('.featured-tech span', {
        scrollTrigger: {
            trigger: '.featured-tech',
            start: 'top 85%',
            once: true,
        },
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(2)',
    });

    // ── Contact Section Fade ──
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 75%',
            once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 75%',
            once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
    });

    // ── Footer Fade In ──
    gsap.from('.footer-content', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
    });

}
