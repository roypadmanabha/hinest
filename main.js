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

    // 10. Process Accordion (Mobile)
    const processHeaders = document.querySelectorAll('.process-step-header');
    processHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth > 1024) return;
            const step = header.parentElement;
            const isActive = step.classList.contains('active');
            
            // Close all others
            document.querySelectorAll('.process-step').forEach(s => s.classList.remove('active'));
            
            // Toggle current
            if (!isActive) step.classList.add('active');
        });
    });

    // 11. Service Card Expansion (Mobile)
    document.querySelectorAll('.service-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth > 1024) return; // Only on mobile
            e.preventDefault();
            const card = link.closest('.service-card');
            const isExpanded = card.classList.contains('expanded');
            
            // Close other expanded cards and reset their text
            document.querySelectorAll('.service-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('expanded');
                    const otherLink = c.querySelector('.service-link');
                    if (otherLink) otherLink.innerHTML = 'Read More';
                }
            });

            card.classList.toggle('expanded');
            link.innerHTML = card.classList.contains('expanded') ? 'Read Less' : 'Read More';
        });
    });

    // 12. Explore Modal
    const exploreModal = document.getElementById('explore-modal');
    const exploreTriggers = document.querySelectorAll('.explore-trigger');
    const exploreCloseBtn = document.getElementById('explore-modal-close');
    const exploreOverlay = document.getElementById('explore-modal-overlay');

    const openExplore = (e) => {
        if (e) e.preventDefault();
        
        // Ensure mobile menu closes
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');

        // Use native renderer with CSS masking to support large 94MB file without toolbars
        const iframe = exploreModal.querySelector('iframe');
        if (iframe && (iframe.src === '' || iframe.src.includes('about:blank'))) {
            iframe.src = 'assets/explore.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH';
        }

        exploreModal.style.display = 'flex';
        setTimeout(() => exploreModal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    };

    const closeExplore = () => {
        exploreModal.classList.remove('active');
        setTimeout(() => {
            exploreModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    };

    exploreTriggers.forEach(trigger => {
        trigger.addEventListener('click', openExplore);
    });

    if(exploreCloseBtn) exploreCloseBtn.addEventListener('click', closeExplore);
    if(exploreOverlay) exploreOverlay.addEventListener('click', closeExplore);

    // 13. Consult Modal Logic
    const consultModal = document.getElementById('consult-modal');
    const consultTriggers = document.querySelectorAll('.consult-trigger');
    const consultCloseBtn = document.getElementById('consult-modal-close');
    const consultOverlay = document.getElementById('consult-modal-overlay');
    const consultForm = document.getElementById('consultation-form');
    const descTextarea = document.getElementById('c-desc');
    const charCount = document.getElementById('char-count');

    const openConsult = (e) => {
        if (e) e.preventDefault();

        // Ensure mobile menu closes if open
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');

        if (consultModal) {
            consultModal.style.display = 'flex';
            setTimeout(() => consultModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeConsult = () => {
        if (consultModal) {
            consultModal.classList.remove('active');
            setTimeout(() => {
                consultModal.style.display = 'none';
                document.body.style.overflow = '';
                // Reset form if submitted
                if (consultForm) consultForm.style.display = 'block';
                const successMsg = document.getElementById('form-success');
                if (successMsg) successMsg.style.display = 'none';
            }, 500);
        }
    };

    consultTriggers.forEach(t => t.addEventListener('click', openConsult));
    if(consultCloseBtn) consultCloseBtn.addEventListener('click', closeConsult);
    if(consultOverlay) consultOverlay.addEventListener('click', closeConsult);

    // Character Counter
    if(descTextarea) {
        descTextarea.addEventListener('input', () => {
            const remaining = 200 - descTextarea.value.length;
            charCount.textContent = remaining;
            charCount.style.color = remaining < 20 ? '#ff4d4d' : 'var(--accent)';
        });
    }

    // Form Submission
    if(consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation check (Name alphabets only is already handled by pattern attribute)
            
            // Premium transition to success message
            gsap.to(consultForm, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                consultForm.style.display = 'none';
                const successMsg = document.getElementById('form-success');
                successMsg.style.display = 'block';
                gsap.fromTo(successMsg, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
            }});
        });
    }
});
