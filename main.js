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
            // Using Google Drive Preview link for high-stability and cross-device compatibility
            iframe.src = `https://drive.google.com/file/d/1rdcTvUjjd7KASs3S6nMB8dAOLa_eCSUa/preview`;
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
                message: `Your verification code for Hinest Interiors estimate is: ${otpCode}`
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

            const baseRate = 1200;
            const roomRate = 85000;
            let roomsTotal = Object.values(calcData.rooms).reduce((a, b) => a + b, 0) * roomRate;
            let addonsTotal = calcData.addons.reduce((a, b) => a + b, 0);
            let sizeBase = calcData.size * baseRate * calcData.multiplier;
            let statusMultiplier = 1;
            if (calcData.status === 'under-const') statusMultiplier = 1.1;
            if (calcData.status === 'ready') statusMultiplier = 1.05;
            const finalTotal = Math.round((sizeBase + roomsTotal + addonsTotal) * statusMultiplier);

            if (formId === 'calc-final-form') {
                const hiddenSize = document.getElementById('hidden-size');
                const hiddenTotal = document.getElementById('hidden-total');
                const hiddenRooms = document.getElementById('hidden-rooms');
                const hiddenAddons = document.getElementById('hidden-addons');

                if (hiddenSize) hiddenSize.value = `${calcData.size} sq ft`;
                if (hiddenTotal) hiddenTotal.value = `₹${finalTotal.toLocaleString('en-IN')}`;
                if (hiddenRooms) hiddenRooms.value = JSON.stringify(calcData.rooms);
                if (hiddenAddons) hiddenAddons.value = `${calcData.addons.length} addons selected`;
            }

            // Prepare data for Google Sheets
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzS6634C2W80vWzW_2N9H6Wq_Y_K6X6_6_6/exec'; // Placeholder: User will replace this
            const formData = new FormData(form);
            if (formId === 'calc-final-form') {
                formData.append('total_estimate', `₹${finalTotal.toLocaleString('en-IN')}`);
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
                body: formData,
                mode: 'no-cors' // Google Script requires no-cors if not using specialized headers
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
    // Multi-Step Cost Calculator Logic
    // ==========================================
    let currentStep = 1;
    const totalSteps = 5;
    const calcData = {
        size: null,
        status: 'ready',
        rooms: { living: 0, kitchen: 0, bedroom: 0, bathroom: 0, dining: 0 },
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
            if (currentStep === 1) {
                const sizeVal = document.getElementById('calc-size').value;
                if (!sizeVal) {
                    showCalcMessage("Please select your flat size first.");
                    return;
                }
                calcData.size = parseInt(sizeVal);
            } else if (currentStep === 2) {
                const totalRooms = Object.values(calcData.rooms).reduce((a, b) => a + b, 0);
                if (totalRooms === 0) {
                    showCalcMessage("Please select at least one room to design.");
                    return;
                }
            } else if (currentStep === 3) {
                if (calcData.addons.length === 0) {
                    showCalcMessage("Please select at least one add-on feature.");
                    return;
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

});
