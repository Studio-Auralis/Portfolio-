// ============================================
// NAVIGATION
// ============================================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

// Scroll effect for navbar (throttled)
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            setActiveLink();
            scrollTicking = false;
        });
    }
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksItems.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// setActiveLink is now called inside the throttled scroll handler above

// ============================================
// TYPING EFFECT
// ============================================
const typingText = document.querySelector('.typing-text');
const words = ['Web Developer', 'Automatisation IA', 'Agent IA Creator', 'Full Stack Dev'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});

// ============================================
// PROJECTS FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// VIDEO PLAY/PAUSE ON HOVER
// ============================================
const projectVideos = document.querySelectorAll('.project-video');

projectVideos.forEach(videoContainer => {
    const video = videoContainer.querySelector('video');
    const playBtn = videoContainer.querySelector('.play-btn');

    if (video && playBtn) {
        // Play on hover
        videoContainer.addEventListener('mouseenter', () => {
            if (video.src) {
                video.play().catch(() => {});
            }
        });

        // Pause on leave
        videoContainer.addEventListener('mouseleave', () => {
            if (video.src) {
                video.pause();
            }
        });

        // Toggle play/pause on button click
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.src) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }
});

// ============================================
// SCROLL ANIMATIONS (Simple AOS alternative)
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Here you can add your form submission logic
        // For example, send to a backend API or email service

        console.log('Form submitted:', { name, email, message });

        // Show success feedback
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="btn-text">Envoyé !</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const targetId = this.getAttribute('href');

            // Ignorer les liens vides
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

// ============================================
// PARALLAX EFFECT - Handled by cosmos-3d.js
// ============================================

// ============================================
// CUSTOM CURSOR ARROW (Optimized)
// ============================================
const createCustomCursor = () => {
    // Create cursor arrow
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<img src="cursor-arrow.svg" alt="" class="cursor-arrow">';
    document.body.appendChild(cursor);

    // Use rAF for smooth cursor updates
    let cursorX = 0, cursorY = 0, rafPending = false;
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
                cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
                rafPending = false;
            });
        }
    }, { passive: true });

    // Detect hover on clickable elements
    const clickableElements = document.querySelectorAll('a, button, .btn, .nav-link, .filter-btn, .project-link, .hamburger, .service-card, .project-card');

    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Add styles for custom cursor (optimized - no heavy filters)
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10001;
            will-change: transform;
            contain: layout style;
        }

        .cursor-arrow {
            width: 24px;
            height: 32px;
            display: block;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
            transition: transform 0.1s ease;
        }

        .custom-cursor.cursor-hover .cursor-arrow {
            transform: scale(1.2);
        }

        @media (max-width: 768px) {
            .custom-cursor {
                display: none;
            }
        }
    `;
    document.head.appendChild(cursorStyle);
};

// Only enable custom cursor on desktop
if (window.innerWidth > 768) {
    createCustomCursor();
}

// ============================================
// PRELOADER (Optional)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// ROBOT EYES FOLLOW CURSOR
// ============================================
const robot = document.querySelector('.robot');
const pupils = document.querySelectorAll('.pupil');

if (robot && pupils.length > 0) {
    let eyeRaf = false;
    document.addEventListener('mousemove', (e) => {
        if (eyeRaf) return;
        eyeRaf = true;
        requestAnimationFrame(() => {
            const robotRect = robot.getBoundingClientRect();
            const robotCenterX = robotRect.left + robotRect.width / 2;
            const robotCenterY = robotRect.top + robotRect.height / 2;
            const angle = Math.atan2(e.clientY - robotCenterY, e.clientX - robotCenterX);
            const maxDistance = 4;
            const moveX = Math.cos(angle) * maxDistance;
            const moveY = Math.sin(angle) * maxDistance;
            pupils.forEach(pupil => {
                pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            });
            eyeRaf = false;
        });
    }, { passive: true });
}

// ============================================
// CLICKABLE PROJECT CARDS
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Ne pas déclencher si on clique sur un lien ou bouton
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }

        // Trouver le premier lien "Voir" dans la carte
        const viewLink = card.querySelector('.project-link');
        if (viewLink) {
            // Ouvrir dans un nouvel onglet
            window.open(viewLink.href, '_blank');
        }
    });

    // Ajouter un curseur pointer pour indiquer que c'est cliquable
    card.style.cursor = 'pointer';
});

// ============================================
// LAZY-LOAD IFRAME
// ============================================
(function() {
    const iframe = document.querySelector('.featured-preview iframe[data-src]');
    if (!iframe) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                iframe.src = iframe.dataset.src;
                observer.unobserve(iframe);
            }
        });
    }, { rootMargin: '200px 0px' });
    observer.observe(iframe);
})();

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🚀 Portfolio Dev & IA', 'font-size: 24px; font-weight: bold; color: #00f5ff;');
console.log('%cBienvenue dans la console ! Intéressé par le code ?', 'font-size: 14px; color: #7b2cbf;');
