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

        // Use PDF.js Viewer (Mozilla) for maximum stability on mobile and large 94MB files
        const iframe = exploreModal.querySelector('iframe');
        if (iframe && (iframe.src === '' || iframe.src.includes('about:blank'))) {
            const pdfUrl = encodeURIComponent('https://roypadmanabha.github.io/hinest/assets/explore.pdf');
            // Using a hosted PDF.js viewer that renders via canvas (bypassing native mobile issues)
            iframe.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${pdfUrl}#pagemode=none&toolbar=0&view=FitH`;
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

    // Function to setup any Consultation Form (Modal or Static)
    const setupConsultationForm = (formId, successMsgId, charCountId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const descTextarea = form.querySelector('textarea');
        const charCount = document.getElementById(charCountId);

        // Auto-Capitalization & Real-time Validation for this specific form
        const setupField = (inputSelector, type) => {
            const input = form.querySelector(inputSelector);
            if (!input) return;

            const group = input.closest('.form-group');
            const error = group ? group.querySelector('.field-error') : null;

            input.addEventListener('input', (e) => {
                let val = e.target.value;
                let original = val;

                if (type === 'alpha') {
                    val = val.replace(/[^A-Za-z\s]/g, '');
                    if (val.length > 0) {
                        val = val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }
                } else if (type === 'num') {
                    val = val.replace(/[^0-9]/g, '');
                }

                e.target.value = val;

                if (original !== val && error) {
                    group.classList.add('has-error');
                    setTimeout(() => group.classList.remove('has-error'), 2000);
                }

                if (type === 'num' && input.type === 'tel' && error) {
                    const invalidPatterns = [
                        "1234567890", "0123456789", "9876543210", "0987654321",
                        "1111111111", "2222222222", "3333333333", "4444444444", 
                        "5555555555", "6666666666", "7777777777", "8888888888", "9999999999", "0000000000"
                    ];
                    if (val.length > 0 && val.length < 10) {
                        group.classList.add('has-error');
                        error.textContent = "10 digits required";
                    } else if (val.length === 10 && invalidPatterns.includes(val)) {
                        group.classList.add('has-error');
                        error.textContent = "Invalid number pattern";
                    } else {
                        group.classList.remove('has-error');
                    }
                }
            });
        };

        setupField('input[name="firstname"]', 'alpha');
        setupField('input[name="lastname"]', 'alpha');
        setupField('input[name="city"]', 'alpha');
        setupField('input[name="mobile"]', 'num');

        // Character Counter
        if(descTextarea && charCount) {
            descTextarea.addEventListener('input', () => {
                const val = descTextarea.value;
                const remaining = 200 - val.length;
                const group = descTextarea.closest('.form-group');
                charCount.textContent = remaining;
                charCount.style.color = remaining < 20 ? '#ff4d4d' : 'var(--accent)';
                if (val.length > 0 && val.length < 20) {
                    group.classList.add('has-error');
                } else {
                    group.classList.remove('has-error');
                }
            });
        }

        // Submission Logic
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.querySelectorAll('.form-group.has-error').length > 0) {
                alert("Please correct the errors in the form before submitting.");
                return;
            }

            const mobileInput = form.querySelector('input[name="mobile"]');
            if (mobileInput.value.length < 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                    form.style.display = 'none';
                    const successMsg = document.getElementById(successMsgId);
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        gsap.fromTo(successMsg, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                    }
                }});
            })
            .catch(error => {
                console.error('FormSubmit Error:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Oops! There was a problem submitting your form. Please try again.');
            });
        });
    };

    // Initialize both forms
    setupConsultationForm('consultation-form', 'form-success', 'char-count');
    setupConsultationForm('book-form-static', 'form-success-static', 'b-char-count');

    const openConsult = (e) => {
        if (e) e.preventDefault();
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
                if (consultForm) {
                    consultForm.reset();
                    consultForm.style.display = 'block';
                    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
                }
                const successMsg = document.getElementById('form-success');
                if (successMsg) successMsg.style.display = 'none';
                if (charCount) charCount.textContent = '200';
            }, 500);
        }
    };

    consultTriggers.forEach(t => t.addEventListener('click', openConsult));
    if(consultCloseBtn) consultCloseBtn.addEventListener('click', closeConsult);
    if(consultOverlay) consultOverlay.addEventListener('click', closeConsult);

    // ==========================================
    // Multi-Step Cost Calculator Logic
    // ==========================================
    let currentStep = 1;
    const totalSteps = 5;
    const calcData = {
        size: 1200,
        status: 'ready',
        rooms: { living: 1, kitchen: 1, bedroom: 2, bathroom: 2, dining: 1 },
        addons: [],
        multiplier: 1.5
    };

    const updateStepUI = () => {
        // Content
        document.querySelectorAll('.calc-step-content').forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(`step-${currentStep}`);
        if (activeContent) activeContent.classList.add('active');

        // Progress Steps
        document.querySelectorAll('.step-item').forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');
            if (stepNum === currentStep) s.classList.add('active');
            if (stepNum < currentStep) s.classList.add('completed');
        });

        // Nav Buttons
        const prevBtn = document.getElementById('calc-prev');
        const nextBtn = document.getElementById('calc-next');
        const navBtns = document.getElementById('calc-nav-btns');

        if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps) {
            if (navBtns) navBtns.style.display = 'none';
        } else {
            if (navBtns) navBtns.style.display = 'flex';
            if (nextBtn) nextBtn.textContent = currentStep === totalSteps - 1 ? 'Go to Final Details' : 'Next Step';
        }
    };

    // Size Selection
    const calcSizeSelect = document.getElementById('calc-size');
    if (calcSizeSelect) {
        calcSizeSelect.addEventListener('change', (e) => {
            calcData.size = parseInt(e.target.value);
        });
    }

    // Status Buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calcData.status = btn.dataset.status;
        });
    });

    // Room Controls
    document.querySelectorAll('.room-item').forEach(item => {
        const room = item.dataset.room;
        const countSpan = item.querySelector('.room-count');
        const plusBtn = item.querySelector('.plus');
        const minusBtn = item.querySelector('.minus');

        if (plusBtn && countSpan) {
            plusBtn.addEventListener('click', () => {
                calcData.rooms[room]++;
                countSpan.textContent = calcData.rooms[room];
            });
        }

        if (minusBtn && countSpan) {
            minusBtn.addEventListener('click', () => {
                if (calcData.rooms[room] > 0) {
                    calcData.rooms[room]--;
                    countSpan.textContent = calcData.rooms[room];
                }
            });
        }
    });

    // Addons
    document.querySelectorAll('.addon-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const price = parseInt(card.dataset.price);
            const index = calcData.addons.indexOf(price);
            if (index > -1) {
                calcData.addons.splice(index, 1);
            } else {
                calcData.addons.push(price);
            }
        });
    });

    // Packages
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            calcData.multiplier = parseFloat(card.dataset.multiplier);
        });
    });

    // Navigation Click
    const nextBtn = document.getElementById('calc-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepUI();
                const quoteSection = document.getElementById('quote');
                if (quoteSection) window.scrollTo({ top: quoteSection.offsetTop - 80, behavior: 'smooth' });
            }
        });
    }

    const prevBtn = document.getElementById('calc-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            }
        });
    }

    // Final Calculation
    const calcFinalForm = document.getElementById('calc-final-form');
    if (calcFinalForm) {
        calcFinalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const mobileInput = document.getElementById('calc-mobile');
            if (mobileInput && mobileInput.value.length < 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }

            const baseRate = 1200; // Per sft base
            const roomRate = 85000; // Fixed per room design base
            
            let roomsTotal = Object.values(calcData.rooms).reduce((a, b) => a + b, 0) * roomRate;
            let addonsTotal = calcData.addons.reduce((a, b) => a + b, 0);
            let sizeBase = calcData.size * baseRate * calcData.multiplier;

            let statusMultiplier = 1;
            if (calcData.status === 'under-const') statusMultiplier = 1.1;
            if (calcData.status === 'ready') statusMultiplier = 1.05;

            const finalTotal = Math.round((sizeBase + roomsTotal + addonsTotal) * statusMultiplier);

            const totalDisplay = document.getElementById('calc-total');
            if (totalDisplay) totalDisplay.textContent = '₹' + finalTotal.toLocaleString('en-IN');
            
            calcFinalForm.style.display = 'none';
            const resultBox = document.getElementById('calc-result-box');
            if (resultBox) {
                resultBox.style.display = 'block';
                gsap.from(resultBox, { opacity: 0, scale: 0.9, duration: 0.5 });
            }
        });
    }
});
