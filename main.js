/* Hinest Infrastructure - Interactive Logic */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.transition = 'opacity 0.4s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 400);
        }, 500);
    }
    animateHero();

    // 2. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // 3. Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const mobileClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (mobileClose) mobileClose.addEventListener('click', toggleMenu);
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
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
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline();
        tl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8 }, 0.2)
          .from('.title-line', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15 }, 0.4)
          .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, 0.9)
          .from('.hero-btns', { y: 30, opacity: 0, duration: 0.8 }, 1.1)
          .to('.hero-img', { scale: 1, duration: 3, ease: 'power2.out' }, 0);
    }

    // 6. Scroll Reveal
    function initScrollAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));

        // Stats counter & Parallax hero
        if (typeof gsap !== 'undefined') {
            document.querySelectorAll('.stat-num').forEach(stat => {
                const target = +stat.dataset.target;
                gsap.to(stat, {
                    scrollTrigger: { trigger: stat, start: 'top 90%' },
                    innerText: target, duration: 2.5, snap: { innerText: 1 }, ease: 'power2.out'
                });
            });

            if (document.querySelector('.hero-img')) {
                gsap.to('.hero-img', {
                    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
                    y: 200, ease: 'none'
                });
            }
        }
    }

    // 7. Scroll Reveal - Re-initialized for all dynamic content
    initScrollAnimations();

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

    // How to Proceed 1s Lazy Load Navigation
    const proceedButtons = document.querySelectorAll('.btn-proceed-standalone, a[href*="how-to-proceed.html"]');
    proceedButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = btn.getAttribute('href') || 'how-to-proceed.html';

            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> LOADING...`;
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.85';

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1000);
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
            
            const btnText = card.classList.contains('expanded') ? 'Read Less' : 'Read More';
            link.innerHTML = `${btnText} <i class="fas fa-arrow-right"></i>`;
            
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = card.classList.contains('expanded') ? 'rotate(-90deg)' : 'none';
            }
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

    // Preload Brochure for "no-delay" experience
    window.addEventListener('load', () => {
        if (exploreModal) {
            const iframe = exploreModal.querySelector('iframe');
            if (iframe) {
                iframe.src = `https://drive.google.com/file/d/1rdcTvUjjd7KASs3S6nMB8dAOLa_eCSUa/preview`;
            }
        }
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

        const statusMsg = form.querySelector('.form-status-msg');

        const showMessage = (text, type = 'success') => {
            if (!statusMsg) {
                alert(text);
                return;
            }
            statusMsg.textContent = text;
            statusMsg.className = `form-status-msg ${type}`;
            statusMsg.style.display = 'block';
            gsap.fromTo(statusMsg, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
            if (type === 'error') {
                setTimeout(() => {
                    gsap.to(statusMsg, { opacity: 0, duration: 0.3, onComplete: () => statusMsg.style.display = 'none' });
                }, 5000);
            }
        };

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

        // 6-Box OTP Logic
        if (formId === 'calc-final-form') {
            const boxes = form.querySelectorAll('.otp-box');
            boxes.forEach((box, idx) => {
                // Paste Handler
                box.addEventListener('paste', (e) => {
                    e.stopPropagation(); // Stop global paste blocker
                    const data = (e.clipboardData || window.clipboardData).getData('text').trim();
                    if (data.length > 0) {
                        const chars = data.split('');
                        chars.forEach((char, charIdx) => {
                            if (idx + charIdx < boxes.length) {
                                boxes[idx + charIdx].value = char;
                            }
                        });
                        // Focus the correct box after pasting
                        const nextFocusIdx = Math.min(idx + chars.length, boxes.length - 1);
                        boxes[nextFocusIdx].focus();
                    }
                    e.preventDefault();
                });

                box.addEventListener('input', (e) => {
                    const val = e.target.value;
                    if (val && idx < boxes.length - 1) {
                        boxes[idx + 1].focus();
                    }
                });
                box.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                        boxes[idx - 1].focus();
                    }
                });
            });
        }

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

        let isOtpSent = false;
        let generatedOtp = null;

        const sendOtpEmail = async (userEmail, otpCode, firstName, lastName) => {
            return emailjs.send("service_9sw7y1f", "template_zn5tk8b", {
                to_email: userEmail,
                email: userEmail,
                reply_to: userEmail,
                first_name: firstName,
                last_name: lastName,
                passcode: otpCode,
                time: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: `Your verification code for Hinest Infrastructure estimate is: ${otpCode}`
            });
        };



        // Submission Logic
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.querySelectorAll('.form-group.has-error').length > 0) {
                showMessage("Please correct the errors in the form.", "error");
                return;
            }

            const mobileInput = form.querySelector('input[name="mobile"]');
            const emailInput = form.querySelector('input[name="email"]');
            if (mobileInput.value.length < 10) {
                showMessage("Please enter a valid 10-digit mobile number.", "error");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // OTP Workflow for Calculator
            if (formId === 'calc-final-form') {
                if (!isOtpSent) {
                    submitBtn.textContent = 'Sending OTP...';
                    submitBtn.disabled = true;
                    generatedOtp = Math.floor(100000 + Math.random() * 900000);
                    
                    const firstName = form.querySelector('input[name="firstname"]').value;
                    const lastName = form.querySelector('input[name="lastname"]').value;

                    try {
                        const res = await sendOtpEmail(emailInput.value, generatedOtp, firstName, lastName);
                        console.log("OTP Sent Successfully:", res);
                        isOtpSent = true;
                        document.getElementById('calc-otp-group').style.display = 'block';
                        submitBtn.textContent = 'VERIFY';
                        submitBtn.disabled = false;
                        showMessage(`Verification code sent to ${emailInput.value}`, "success");
                        // Focus first box
                        const firstBox = form.querySelector('.otp-box');
                        if (firstBox) firstBox.focus();
                    } catch (err) {
                        console.error("OTP Error Detail:", err);
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        showMessage("Failed to send OTP. Please try again.", "error");
                    }
                    return;
                } else {
                    const boxes = form.querySelectorAll('.otp-box');
                    let enteredOtp = "";
                    boxes.forEach(box => enteredOtp += box.value);
                    
                    if (enteredOtp !== generatedOtp.toString()) {
                        document.getElementById('calc-otp-group').classList.add('has-error');
                        showMessage("Invalid OTP code. Please try again.", "error");
                        return;
                    }
                }
            }

            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            let finalTotal = 0;
            if (calcData.service === 'construction') {
                const constAddonsTotal = calcData.constAddons.reduce((a, b) => a + b, 0);
                finalTotal = Math.round((calcData.builtUpSqft * calcData.constructionRate) + constAddonsTotal);
            } else {
                const baseRate = 1200;
                const roomRate = 85000;
                let roomsTotal = Object.values(calcData.rooms).reduce((a, b) => a + b, 0) * roomRate;
                let addonsTotal = calcData.addons.reduce((a, b) => a + b, 0);
                let sizeBase = calcData.size * baseRate * calcData.multiplier;
                let statusMultiplier = 1;
                if (calcData.status === 'under-const') statusMultiplier = 1.1;
                if (calcData.status === 'ready') statusMultiplier = 1.05;
                finalTotal = Math.round((sizeBase + roomsTotal + addonsTotal) * statusMultiplier);
            }

            if (formId === 'calc-final-form') {
                const hiddenService = document.getElementById('hidden-service');
                const hiddenSize = document.getElementById('hidden-size');
                const hiddenTotal = document.getElementById('hidden-total');
                const hiddenRooms = document.getElementById('hidden-rooms');
                const hiddenAddons = document.getElementById('hidden-addons');
                const hiddenConstType = document.getElementById('hidden-const-type');
                const hiddenConstDim = document.getElementById('hidden-const-dimensions');
                const hiddenConstBuiltup = document.getElementById('hidden-const-builtup');

                if (hiddenService) hiddenService.value = calcData.service === 'construction' ? 'Construction' : 'Interior Design';
                
                if (calcData.service === 'construction') {
                    if (hiddenSize) hiddenSize.value = `${calcData.sqft} sq ft plot`;
                    if (hiddenTotal) hiddenTotal.value = `₹${finalTotal.toLocaleString('en-IN')}`;
                    if (hiddenRooms) hiddenRooms.value = `Construction Scope (${calcData.constructionTypeLabel || 'Standard'})`;
                    if (hiddenAddons) hiddenAddons.value = `${calcData.constAddons.length} construction add-ons selected`;
                    if (hiddenConstType) hiddenConstType.value = calcData.constructionTypeLabel || 'G+1 Residential';
                    if (hiddenConstDim) hiddenConstDim.value = `${calcData.length}m x ${calcData.breadth}m = ${calcData.sqm} sqm (${calcData.sqft} sq ft)`;
                    if (hiddenConstBuiltup) hiddenConstBuiltup.value = `${calcData.builtUpSqft} sq ft (${calcData.floors} Floors)`;
                } else {
                    if (hiddenSize) hiddenSize.value = `${calcData.size} sq ft`;
                    if (hiddenTotal) hiddenTotal.value = `₹${finalTotal.toLocaleString('en-IN')}`;
                    if (hiddenRooms) hiddenRooms.value = JSON.stringify(calcData.rooms);
                    if (hiddenAddons) hiddenAddons.value = `${calcData.addons.length} interior add-ons selected`;
                    if (hiddenConstType) hiddenConstType.value = 'N/A';
                    if (hiddenConstDim) hiddenConstDim.value = 'N/A';
                    if (hiddenConstBuiltup) hiddenConstBuiltup.value = 'N/A';
                }
            }

            // Prepare data for Google Sheets
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxSdRvm9DA1Xf3BdiDhRmoNoSLaw5cG-MgNaSQWanJZe9zBXk_FilhzaqvLCsrChll4/exec';
            
            // Convert FormData to URLSearchParams for better Google Script compatibility
            const sheetData = new URLSearchParams();
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                sheetData.append(key, value);
            }
            if (formId === 'calc-final-form') {
                sheetData.append('total_estimate', `₹${finalTotal.toLocaleString('en-IN')}`);
            }

            // Send to FormSubmit (Email)
            const formSubmitPromise = fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            // Send to Google Sheets (Sheets)
            const googleSheetsPromise = fetch(scriptURL, { 
                method: 'POST', 
                body: sheetData,
                mode: 'no-cors'
            });

            Promise.allSettled([formSubmitPromise, googleSheetsPromise])
            .then(results => {
                const formResult = results[0];
                if (formResult.status === 'fulfilled') {
                    gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                        form.style.display = 'none';
                        const successMsg = document.getElementById(successMsgId);
                        if (successMsg) {
                            successMsg.style.display = 'block';
                            gsap.fromTo(successMsg, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                        }
                    }});
                } else {
                    throw new Error('Email submission failed');
                }
            })
            .catch(error => {
                console.error('Submission Error:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showMessage("Submission failed. Please try again.", "error");
            });
        });
    };

    // Initialize both forms
    setupConsultationForm('consultation-form', 'form-success', 'char-count');
    setupConsultationForm('book-form-static', 'form-success-static', 'b-char-count');
    setupConsultationForm('calc-final-form', 'calc-result-box', null);

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

    // Terms & Conditions Modal Logic
    const termsModal = document.getElementById('terms-modal');
    const termsTrigger = document.getElementById('terms-trigger');
    const termsCloseBtn = document.getElementById('terms-modal-close');
    const termsOverlay = document.getElementById('terms-modal-overlay');

    const openTerms = (e) => {
        if (e) e.preventDefault();
        if (termsModal) {
            termsModal.style.display = 'flex';
            setTimeout(() => termsModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeTerms = () => {
        if (termsModal) {
            termsModal.classList.remove('active');
            setTimeout(() => {
                termsModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 500);
        }
    };

    if (termsTrigger) termsTrigger.addEventListener('click', openTerms);
    if (termsCloseBtn) termsCloseBtn.addEventListener('click', closeTerms);
    if (termsOverlay) termsOverlay.addEventListener('click', closeTerms);

    // Privacy Policy Modal Logic
    const privacyModal = document.getElementById('privacy-modal');
    const privacyTrigger = document.getElementById('privacy-trigger');
    const privacyCloseBtn = document.getElementById('privacy-modal-close');
    const privacyOverlay = document.getElementById('privacy-modal-overlay');

    const openPrivacy = (e) => {
        if (e) e.preventDefault();
        if (privacyModal) {
            privacyModal.style.display = 'flex';
            setTimeout(() => privacyModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closePrivacy = () => {
        if (privacyModal) {
            privacyModal.classList.remove('active');
            setTimeout(() => {
                privacyModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 500);
        }
    };

    if (privacyTrigger) privacyTrigger.addEventListener('click', openPrivacy);
    if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', closePrivacy);
    if (privacyOverlay) privacyOverlay.addEventListener('click', closePrivacy);

    // ==========================================
    // RULES MODAL (TRIPURA AMC BYE-LAWS) LOGIC
    // ==========================================
    const rulesModal = document.getElementById('rules-modal');
    const rulesTriggers = document.querySelectorAll('.rules-trigger');
    const rulesCloseBtn = document.getElementById('rules-modal-close');
    const rulesOverlay = document.getElementById('rules-modal-overlay');

    const openRules = (e) => {
        if (e) e.preventDefault();
        if (rulesModal) {
            rulesModal.style.display = 'flex';
            setTimeout(() => rulesModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    };

    const closeRules = () => {
        if (rulesModal) {
            rulesModal.classList.remove('active');
            setTimeout(() => {
                rulesModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        }
    };

    rulesTriggers.forEach(btn => btn.addEventListener('click', openRules));
    if (rulesCloseBtn) rulesCloseBtn.addEventListener('click', closeRules);
    if (rulesOverlay) rulesOverlay.addEventListener('click', closeRules);

    // Auto open if hash is #rules
    if (window.location.hash === '#rules') {
        openRules();
    }

    // Rules TOC Smooth Scroll & Active State
    const rulesTocLinks = document.querySelectorAll('.rules-toc-link');
    const rulesScrollContainer = document.getElementById('rules-scroll-content');

    rulesTocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection && rulesScrollContainer) {
                rulesScrollContainer.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });
                rulesTocLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active TOC link on scroll
    if (rulesScrollContainer) {
        rulesScrollContainer.addEventListener('scroll', () => {
            const sections = rulesScrollContainer.querySelectorAll('.rules-card');
            let current = '';
            sections.forEach(sec => {
                const sectionTop = sec.offsetTop - rulesScrollContainer.offsetTop - 50;
                if (rulesScrollContainer.scrollTop >= sectionTop) {
                    current = sec.getAttribute('id');
                }
            });
            if (current) {
                rulesTocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Rules Live Search Filter
    const rulesSearchInput = document.getElementById('rules-search-input');
    const rulesSearchClear = document.getElementById('rules-search-clear');

    if (rulesSearchInput) {
        rulesSearchInput.addEventListener('input', () => {
            const query = rulesSearchInput.value.toLowerCase().trim();
            if (rulesSearchClear) rulesSearchClear.style.display = query ? 'block' : 'none';

            const cards = rulesScrollContainer ? rulesScrollContainer.querySelectorAll('.rules-card') : [];
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    if (rulesSearchClear) {
        rulesSearchClear.addEventListener('click', () => {
            if (rulesSearchInput) {
                rulesSearchInput.value = '';
                rulesSearchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // AMC Sanction Fee Calculator inside Rules Modal
    window.calculateRulesAMCFee = function() {
        const typeEl = document.getElementById('rules-calc-type');
        const measEl = document.getElementById('rules-calc-measurement');
        if (!typeEl || !measEl) return;

        const type = typeEl.value;
        const measurement = parseFloat(measEl.value) || 0;
        const measurementContainer = document.getElementById('rules-measurement-container');
        const unitLabel = document.getElementById('rules-unit-label');

        let newRate = 0;
        let oldRate = 0;
        let isFixed = false;

        if (type.includes('sanitary')) {
            if (measurementContainer) measurementContainer.style.display = 'none';
            isFixed = true;
        } else {
            if (measurementContainer) measurementContainer.style.display = 'block';
            if (unitLabel) unitLabel.innerText = type === 'boundary_wall' ? 'Total Length (Running ft)' : 'Total Covered Area (Sq. mtr)';
        }

        if (type === 'residential_load_bearing') {
            if (measurement <= 100) { newRate = 80; oldRate = 60; }
            else if (measurement <= 300) { newRate = 100; oldRate = 70; }
            else { newRate = 200; oldRate = 140; }
        } else if (type === 'residential_rcc') {
            if (measurement < 140) { newRate = 130; oldRate = 90; }
            else if (measurement <= 300) { newRate = 160; oldRate = 120; }
            else { newRate = 200; oldRate = 150; }
        } else if (type === 'commercial_rcc') {
            newRate = 300; oldRate = 200;
        } else if (type === 'boundary_wall') {
            newRate = 55; oldRate = 35;
        } else if (type === 'sanitary_residential') {
            newRate = 120; oldRate = 120;
        } else if (type === 'sanitary_commercial') {
            newRate = 250; oldRate = 250;
        }

        let totalNew = isFixed ? newRate : newRate * measurement;
        let totalOld = isFixed ? oldRate : oldRate * measurement;
        let diff = totalNew - totalOld;

        if (!isFixed && measurement <= 0) {
            totalNew = 0; totalOld = 0; diff = 0;
        }

        const formatINR = num => '₹' + Math.round(num).toLocaleString('en-IN');

        const resNew = document.getElementById('rules-res-new');
        const resOld = document.getElementById('rules-res-old');
        const resDiff = document.getElementById('rules-res-diff');

        if (resNew) resNew.innerText = formatINR(totalNew);
        if (resOld) resOld.innerText = formatINR(totalOld);
        if (resDiff) resDiff.innerText = '+ ' + formatINR(diff);
    };

    // Run calculator on initial load
    if (document.getElementById('rules-calc-type')) {
        window.calculateRulesAMCFee();
    }

    // ==========================================
    // Multi-Step Cost Calculator Logic
    // ==========================================
    let currentStep = 1;
    const totalSteps = 5;
    const calcData = {
        service: '',
        size: null,
        status: 'ready',
        rooms: { living: 0, kitchen: 0, bedroom: 0, bathroom: 0, dining: 0 },
        addons: [],
        multiplier: 1.5,

        // Construction Specific Data
        constructionType: '',
        constructionTypeLabel: '',
        length: 0,
        breadth: 0,
        sqm: 0,
        sqft: 0,
        floors: 2,
        builtUpSqft: 0,
        constructionRate: 2350,
        constAddons: []
    };

    const updateServiceFlowUI = () => {
        const service = calcData.service;
        const isConstruction = service === 'construction';
        const isInterior = service === 'interior';

        // Toggle step content wrappers
        document.querySelectorAll('#interior-step-1-wrapper, #interior-step-2-wrapper, #interior-step-3-wrapper, #interior-step-4-wrapper').forEach(el => {
            if (el) el.style.display = isInterior ? 'block' : 'none';
        });
        document.querySelectorAll('#construction-step-1-wrapper, #construction-step-2-wrapper, #construction-step-3-wrapper, #construction-step-4-wrapper').forEach(el => {
            if (el) el.style.display = isConstruction ? 'block' : 'none';
        });

        // Update titles & stepper labels
        const step1Label = document.querySelector('.step-item[data-step="1"] .step-label');
        const step2Label = document.querySelector('.step-item[data-step="2"] .step-label');
        const title1 = document.getElementById('calc-step1-title');
        const title2 = document.getElementById('calc-step2-title');
        const title3 = document.getElementById('calc-step3-title');
        const title4 = document.getElementById('calc-step4-title');

        if (isConstruction) {
            if (step1Label) step1Label.textContent = 'Area';
            if (step2Label) step2Label.textContent = 'Scope';
            if (title1) title1.textContent = 'Structure & Plot Dimensions';
            if (title2) title2.textContent = 'Included Construction Scope';
            if (title3) title3.textContent = 'Select Construction Add-ons';
            if (title4) title4.textContent = 'Select Construction Finish Level';
        } else if (isInterior) {
            if (step1Label) step1Label.textContent = 'Size';
            if (step2Label) step2Label.textContent = 'Rooms';
            if (title1) title1.textContent = 'Tell us about your home';
            if (title2) title2.textContent = 'Configure your space';
            if (title3) title3.textContent = 'Enhance your design';
            if (title4) title4.textContent = 'Choose your finish level';
        } else {
            if (step1Label) step1Label.textContent = 'Service';
            if (step2Label) step2Label.textContent = 'Details';
            if (title1) title1.textContent = 'Tell us about your project';
        }
    };

    // Service Selection Listener
    const calcServiceSelect = document.getElementById('calc-service-type');
    if (calcServiceSelect) {
        calcServiceSelect.addEventListener('change', (e) => {
            calcData.service = e.target.value;
            updateServiceFlowUI();
        });
    }

    // Construction Type Listener
    const constTypeSelect = document.getElementById('calc-construction-type');
    const floorMap = {
        'g1-res': { floors: 2, label: 'G+1 Residential' },
        'g2-res': { floors: 3, label: 'G+2 Residential' },
        'g3-res': { floors: 4, label: 'G+3 Residential' },
        'g4-res': { floors: 5, label: 'G+4 Residential' },
        'g1-com': { floors: 2, label: 'G+1 Commercial' },
        'g2-com': { floors: 3, label: 'G+2 Commercial' },
        'g3-com': { floors: 4, label: 'G+3 Commercial' },
        'g4-com': { floors: 5, label: 'G+4 Commercial' }
    };

    const updateConstructionAreaMath = () => {
        const builtUp = Math.round(calcData.sqft * calcData.floors);
        calcData.builtUpSqft = builtUp;

        const sqmElem = document.getElementById('const-area-sqm-val');
        const sqftElem = document.getElementById('const-area-sqft-val');
        const builtupElem = document.getElementById('const-total-builtup-val');

        if (sqmElem) sqmElem.textContent = `${calcData.sqm} sqm`;
        if (sqftElem) sqftElem.textContent = `${calcData.sqft.toLocaleString('en-IN')} sq ft`;
        if (builtupElem) builtupElem.textContent = `${builtUp.toLocaleString('en-IN')} sq ft`;
    };

    if (constTypeSelect) {
        constTypeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            calcData.constructionType = val;
            if (floorMap[val]) {
                calcData.floors = floorMap[val].floors;
                calcData.constructionTypeLabel = floorMap[val].label;
            }
            updateConstructionAreaMath();
        });
    }

    // Dimension inputs formula logic (l x b = area [sqm] x 10.76 = sqfoot)
    const constLenInput = document.getElementById('const-len');
    const constBreadthInput = document.getElementById('const-breadth');
    const constSqftInput = document.getElementById('const-sqft-direct');

    const handleDimensionCalc = () => {
        const l = parseFloat(constLenInput ? constLenInput.value : 0) || 0;
        const b = parseFloat(constBreadthInput ? constBreadthInput.value : 0) || 0;

        calcData.length = l;
        calcData.breadth = b;

        if (l > 0 && b > 0) {
            const sqm = Math.round((l * b) * 100) / 100;
            const sqft = Math.round(sqm * 10.76);
            calcData.sqm = sqm;
            calcData.sqft = sqft;
            if (constSqftInput) constSqftInput.value = sqft;
            updateConstructionAreaMath();
        }
    };

    if (constLenInput) constLenInput.addEventListener('input', handleDimensionCalc);
    if (constBreadthInput) constBreadthInput.addEventListener('input', handleDimensionCalc);

    if (constSqftInput) {
        constSqftInput.addEventListener('input', (e) => {
            const sqft = parseFloat(e.target.value) || 0;
            calcData.sqft = sqft;
            const sqm = Math.round((sqft / 10.76) * 100) / 100;
            calcData.sqm = sqm;
            updateConstructionAreaMath();
        });
    }

    // Construction Addon Cards
    document.querySelectorAll('.addon-card.const-addon').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const price = parseInt(card.dataset.price);
            const index = calcData.constAddons.indexOf(price);
            if (index > -1) {
                calcData.constAddons.splice(index, 1);
            } else {
                calcData.constAddons.push(price);
            }
        });
    });

    // Construction Package Cards
    document.querySelectorAll('.package-card.const-package').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card.const-package').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            calcData.constructionRate = parseFloat(card.dataset.rate);
        });
    });

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
            if (nextBtn) nextBtn.textContent = 'Proceed';
        }
    };

    const showCalcMessage = (text, type = 'error') => {
        const globalStatus = document.getElementById('calc-global-status');
        if (!globalStatus) return;
        globalStatus.textContent = text;
        globalStatus.className = `form-status-msg ${type}`;
        globalStatus.style.display = 'block';
        gsap.fromTo(globalStatus, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
        setTimeout(() => {
            gsap.to(globalStatus, { opacity: 0, duration: 0.3, onComplete: () => globalStatus.style.display = 'none' });
        }, 5000);
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
    document.querySelectorAll('.addon-card:not(.const-addon)').forEach(card => {
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
    document.querySelectorAll('.package-card:not(.const-package)').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card:not(.const-package)').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            calcData.multiplier = parseFloat(card.dataset.multiplier);
        });
    });

    // Navigation Click
    const nextBtn = document.getElementById('calc-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep === 1) {
                const serviceSelect = document.getElementById('calc-service-type');
                const serviceWrapper = document.getElementById('calc-service-type-wrapper');
                if (!calcData.service || calcData.service === '') {
                    showCalcMessage("Please select a Service Type (Construction or Interior Design) to proceed.");
                    if (serviceWrapper) {
                        serviceWrapper.classList.add('has-error');
                        setTimeout(() => serviceWrapper.classList.remove('has-error'), 3000);
                    }
                    return;
                }

                if (calcData.service === 'interior') {
                    const sizeSelect = document.getElementById('calc-size');
                    const sizeWrapper = document.getElementById('calc-size-wrapper');
                    const sizeVal = sizeSelect ? sizeSelect.value : '';
                    if (!sizeVal || sizeVal === "") {
                        showCalcMessage("Please select your flat size first.");
                        if (sizeWrapper) {
                            sizeWrapper.classList.add('has-error');
                            setTimeout(() => sizeWrapper.classList.remove('has-error'), 3000);
                        }
                        return;
                    }
                    calcData.size = parseInt(sizeVal);
                } else if (calcData.service === 'construction') {
                    const constTypeSelect = document.getElementById('calc-construction-type');
                    const constTypeWrapper = document.getElementById('calc-construction-type-wrapper');
                    const constTypeVal = constTypeSelect ? constTypeSelect.value : '';

                    if (!constTypeVal || constTypeVal === "" || !calcData.constructionType) {
                        showCalcMessage("Please select Building Type & Structure to proceed.");
                        if (constTypeWrapper) {
                            constTypeWrapper.classList.add('has-error');
                            setTimeout(() => constTypeWrapper.classList.remove('has-error'), 3000);
                        }
                        return;
                    }

                    if (!calcData.sqft || calcData.sqft <= 0) {
                        showCalcMessage("Please enter plot dimensions (l × b) or Sq Ft.");
                        const lenInput = document.getElementById('const-len');
                        if (lenInput) lenInput.focus();
                        return;
                    }
                }
            } else if (currentStep === 2) {
                if (calcData.service === 'interior') {
                    const totalRooms = Object.values(calcData.rooms).reduce((a, b) => a + b, 0);
                    if (totalRooms === 0) {
                        showCalcMessage("Please select at least one room to design.");
                        return;
                    }
                }
            } else if (currentStep === 3) {
                if (calcData.service === 'interior') {
                    if (calcData.addons.length === 0) {
                        showCalcMessage("Please select at least one add-on feature.");
                        return;
                    }
                }
            }
            
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

    // Reset Calculator Listener
    const resetBtn = document.getElementById('calc-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentStep = 1;
            calcData.service = '';
            calcData.size = null;
            calcData.status = 'ready';
            calcData.rooms = { living: 0, kitchen: 0, bedroom: 0, bathroom: 0, dining: 0 };
            calcData.addons = [];
            calcData.multiplier = 1.5;

            calcData.constructionType = '';
            calcData.constructionTypeLabel = '';
            calcData.length = 0;
            calcData.breadth = 0;
            calcData.sqm = 0;
            calcData.sqft = 0;
            calcData.floors = 2;
            calcData.builtUpSqft = 0;
            calcData.constructionRate = 2350;
            calcData.constAddons = [];

            // Reset DOM Selects & Custom Dropdowns
            const resetCustomDropdown = (id, placeholder) => {
                const sel = document.getElementById(id);
                if (sel) sel.value = '';
                const wrapper = document.getElementById(`${id}-wrapper`);
                if (wrapper) {
                    const valSpan = wrapper.querySelector('.custom-select-value');
                    const trigger = wrapper.querySelector('.custom-select-trigger');
                    if (valSpan) valSpan.textContent = placeholder;
                    if (trigger) trigger.classList.add('placeholder');
                    wrapper.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                }
            };

            resetCustomDropdown('calc-service-type', 'Select Service Type');
            resetCustomDropdown('calc-size', 'Select Size');
            resetCustomDropdown('calc-construction-type', 'Select Building Type');

            // Reset Inputs & Cards
            const constLen = document.getElementById('const-len');
            const constBreadth = document.getElementById('const-breadth');
            const constSqft = document.getElementById('const-sqft-direct');
            if (constLen) constLen.value = '';
            if (constBreadth) constBreadth.value = '';
            if (constSqft) constSqft.value = '';

            document.querySelectorAll('.room-count').forEach(span => span.textContent = '0');
            document.querySelectorAll('.addon-card').forEach(card => card.classList.remove('selected'));
            
            // Reset Packages
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            const defaultInteriorPkg = document.querySelector('#interior-step-4-wrapper .package-card[data-multiplier="1.5"]');
            const defaultConstPkg = document.querySelector('#construction-step-4-wrapper .package-card[data-rate="2350"]');
            if (defaultInteriorPkg) defaultInteriorPkg.classList.add('selected');
            if (defaultConstPkg) defaultConstPkg.classList.add('selected');

            // Reset Status buttons
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            const defaultStatus = document.querySelector('.status-btn[data-status="ready"]');
            if (defaultStatus) defaultStatus.classList.add('active');

            // Reset final form
            const finalForm = document.getElementById('calc-final-form');
            if (finalForm) {
                finalForm.reset();
                finalForm.style.display = 'block';
                const otpGroup = document.getElementById('calc-otp-group');
                if (otpGroup) otpGroup.style.display = 'none';
            }
            const resultBox = document.getElementById('calc-result-box');
            if (resultBox) resultBox.style.display = 'none';

            updateConstructionAreaMath();
            updateServiceFlowUI();
            updateStepUI();

            const quoteSection = document.getElementById('quote');
            if (quoteSection) window.scrollTo({ top: quoteSection.offsetTop - 80, behavior: 'smooth' });
        });
    }

    // 15. Content Protection - Disable Right Click, Copy, Paste, Selection, and Drag
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    document.addEventListener('copy', event => {
        if (event.target.classList.contains('otp-box')) return;
        event.preventDefault();
    });
    document.addEventListener('cut', event => {
        if (event.target.classList.contains('otp-box')) return;
        event.preventDefault();
    });
    document.addEventListener('paste', event => {
        if (event.target.classList.contains('otp-box')) return;
        event.preventDefault();
    });
    
    document.addEventListener('dragstart', event => event.preventDefault());
    document.addEventListener('selectstart', event => event.preventDefault());

    // Block keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+U, F12 etc.)
    document.addEventListener('keydown', (e) => {
        if (
            (e.ctrlKey || e.metaKey) && 
            (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u' || e.key === 's' || e.key === 'i' || e.key === 'j')
        ) {
            if (e.target.classList.contains('otp-box')) return;
            e.preventDefault();
            return false;
        }
        
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
    });

    // 16. Custom Stylish Responsive Dropdown Generator
    function setupCustomDropdowns() {
        document.querySelectorAll('select').forEach(select => {
            if (select.dataset.customized === 'true') return;
            select.dataset.customized = 'true';
            
            // Hide native select element
            select.style.display = 'none';

            // Create wrapper element
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            if (select.id) wrapper.id = `${select.id}-wrapper`;

            // Trigger button
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            trigger.tabIndex = 0;

            const valSpan = document.createElement('span');
            valSpan.className = 'custom-select-value';
            
            const selectedOpt = select.options[select.selectedIndex];
            if (selectedOpt && selectedOpt.value !== "") {
                valSpan.textContent = selectedOpt.text;
            } else {
                valSpan.textContent = selectedOpt ? selectedOpt.text : 'Select Option';
                trigger.classList.add('placeholder');
            }

            const arrow = document.createElement('i');
            arrow.className = 'fas fa-chevron-down custom-select-arrow';

            trigger.appendChild(valSpan);
            trigger.appendChild(arrow);

            // Options list
            const optionsMenu = document.createElement('div');
            optionsMenu.className = 'custom-select-options';

            Array.from(select.options).forEach(opt => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'custom-option';
                optionDiv.dataset.value = opt.value;
                if (opt.selected && opt.value !== "") optionDiv.classList.add('selected');

                const textSpan = document.createElement('span');
                textSpan.textContent = opt.text;

                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check custom-option-check';

                optionDiv.appendChild(textSpan);
                optionDiv.appendChild(checkIcon);

                optionDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (opt.disabled && opt.value === "") return;

                    select.value = opt.value;
                    valSpan.textContent = opt.text;
                    trigger.classList.remove('placeholder');

                    // Update selected class
                    optionsMenu.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                    optionDiv.classList.add('selected');

                    // Close dropdown
                    trigger.classList.remove('active');
                    optionsMenu.classList.remove('active');

                    // Dispatch change event to notify any JS listeners
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                });

                optionsMenu.appendChild(optionDiv);
            });

            // Toggle on click
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = optionsMenu.classList.contains('active');
                
                // Close any other open dropdowns
                document.querySelectorAll('.custom-select-options.active').forEach(m => {
                    if (m !== optionsMenu) {
                        m.classList.remove('active');
                        if (m.previousElementSibling) m.previousElementSibling.classList.remove('active');
                    }
                });

                if (isOpen) {
                    trigger.classList.remove('active');
                    optionsMenu.classList.remove('active');
                } else {
                    trigger.classList.add('active');
                    optionsMenu.classList.add('active');
                }
            });

            // Keyboard accessibility
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    trigger.click();
                } else if (e.key === 'Escape') {
                    trigger.classList.remove('active');
                    optionsMenu.classList.remove('active');
                }
            });

            // Mount to DOM
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
            wrapper.appendChild(trigger);
            wrapper.appendChild(optionsMenu);
        });
    }

    setupCustomDropdowns();

    // Close open dropdowns when clicking anywhere outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-select-trigger.active').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.custom-select-options.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Content Protection & Toast Notification
    (function initContentProtection() {
        let toastTimeout = null;

        function createToastElement() {
            let toast = document.getElementById('content-protection-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'content-protection-toast';
                toast.className = 'content-protection-toast';
                toast.innerHTML = `
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>Not allowed. Content protection enabled.</span>
                `;
                document.body.appendChild(toast);
            }
            return toast;
        }

        function showProtectionToast() {
            const toast = createToastElement();
            
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }

            toast.classList.remove('show');
            void toast.offsetWidth;
            toast.classList.add('show');

            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // 1. Right Click Protection (All Devices)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showProtectionToast();
        });

        // 2. Text Selection Protection (Phones & Desktop)
        document.addEventListener('selectstart', (e) => {
            const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (targetTag === 'input' || targetTag === 'textarea') return;
            
            e.preventDefault();
            showProtectionToast();
        });

        // 3. Copy / Cut Protection
        document.addEventListener('copy', (e) => {
            const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (targetTag === 'input' || targetTag === 'textarea') return;
            
            e.preventDefault();
            showProtectionToast();
        });

        document.addEventListener('cut', (e) => {
            const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (targetTag === 'input' || targetTag === 'textarea') return;
            
            e.preventDefault();
            showProtectionToast();
        });

        // 4. Print Protection (Ctrl+P / Cmd+P & Print Events)
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
                e.preventDefault();
                e.stopPropagation();
                showProtectionToast();
                return false;
            }
        }, true);

        window.addEventListener('beforeprint', () => {
            showProtectionToast();
        });
    })();

});
