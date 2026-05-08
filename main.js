/* Hinest Interiors - Interactive Logic */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(preloader, { opacity: 0, duration: 0.8, onComplete: () => {
                preloader.style.display = 'none';
                animateHero();
            }});
        }, 1800);
    });

    // 2. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // 3. Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    });

    // 5. Hero Animation
    function animateHero() {
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline();
        tl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8 }, 0.2)
          .from('.title-line', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15 }, 0.4)
          .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, 0.9)
          .from('.hero-btns', { y: 30, opacity: 0, duration: 0.8 }, 1.1)
          .to('.hero-img', { scale: 1, duration: 3, ease: 'power2.out' }, 0);
        initScrollAnimations();
    }

    // 6. Scroll Reveal
    function initScrollAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));

        // Stats counter
        document.querySelectorAll('.stat-num').forEach(stat => {
            const target = +stat.dataset.target;
            gsap.to(stat, {
                scrollTrigger: { trigger: stat, start: 'top 90%' },
                innerText: target, duration: 2.5, snap: { innerText: 1 }, ease: 'power2.out'
            });
        });

        // Parallax hero
        gsap.to('.hero-img', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
            y: 200, ease: 'none'
        });
    }

    // 7. Quote Calculator
    document.getElementById('q-calc').addEventListener('click', () => {
        const area = +document.getElementById('q-area').value;
        const type = document.getElementById('q-type').value;
        if (!area || area <= 0) return;
        const rates = { residential: 1800, commercial: 2200, villa: 2500 };
        const cost = area * (rates[type] || 1800);
        document.getElementById('quote-value').textContent = '₹' + cost.toLocaleString('en-IN');
        const result = document.getElementById('quote-result');
        result.classList.add('show');
        gsap.from(result, { opacity: 0, x: -20, duration: 0.6 });
    });

    // 8. Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // 9. Image Protection
    document.addEventListener('contextmenu', e => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', e => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
});
