/* ============================================
   NEXTLEARN – Script JS UPGRADÉ
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.stat-number');
    const notifyForm = document.getElementById('notifyForm');
    const cursorGlow = document.getElementById('cursorGlow');
    const scrollProgress = document.getElementById('scrollProgress');

    // Overlay mobile
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ============================================
    // CURSEUR LUMINEUX
    // ============================================
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // ============================================
    // BARRE DE PROGRESSION SCROLL
    // ============================================
    if (scrollProgress) {
        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

    // ============================================
    // NAVBAR SCROLL
    // ============================================
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ============================================
    // MENU MOBILE
    // ============================================
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ============================================
    // NAVIGATION ACTIVE
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ============================================
    // SCROLL REVEAL – Intersection Observer + Staggered
    // ============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // Staggered reveal for grids and lists
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, i * 120);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    // Auto-tag stagger items in grids
    document.querySelectorAll('.v1-grid .v1-card, .v2-grid .v2-card, .contact-grid .contact-card').forEach(el => {
        el.classList.add('stagger-item');
    });
    document.querySelectorAll('.v1-grid, .v2-grid, .contact-grid').forEach(grid => {
        staggerObserver.observe(grid);
    });

    // Progressive reveal for all sections
    document.querySelectorAll('.section-header, .hero-content, .about-content, .about-vision, .download-card, .founders-header, .carousel-wrapper').forEach(el => {
        el.classList.add('progressive-reveal');
    });

    const progressiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                progressiveObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.progressive-reveal').forEach(el => progressiveObserver.observe(el));

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            const offset = navbar.offsetHeight;
            const pos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });

    // ============================================
    // FORMULAIRE NOTIFICATION iOS
    // ============================================
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = notifyForm.querySelector('input[type="email"]').value.trim();
            if (email) {
                notifyForm.style.display = 'none';
                const msg = document.createElement('div');
                msg.style.cssText = `
                    padding: 14px 20px;
                    background: rgba(26,73,125,0.08);
                    border-radius: 8px;
                    color: #1a497d;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: fadeSlideIn 0.4s ease-out;
                `;
                msg.innerHTML = '<i class="fas fa-check-circle"></i> Merci ! Vous serez notifié(e) dès la sortie iOS.';
                const info = notifyForm.parentElement.querySelector('.notify-info');
                if (info) info.style.display = 'none';
                notifyForm.parentElement.appendChild(msg);

                if (!document.getElementById('fade-slide-style')) {
                    const s = document.createElement('style');
                    s.id = 'fade-slide-style';
                    s.textContent = `@keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
                    document.head.appendChild(s);
                }
            }
        });
    }

    // ============================================
    // DÉPLACEMENT SECTION À PROPOS APRÈS V1
    // ============================================
    const aboutSection = document.getElementById('about');
    const featuresV1 = document.getElementById('features-v1');
    if (aboutSection && featuresV1) {
        featuresV1.parentNode.insertBefore(aboutSection, featuresV1.nextSibling);
    }

    // ============================================
    // ALERTE SPAM AVANT TÉLÉCHARGEMENT
    // ============================================
    function showSpamAlert(downloadUrl) {
        const overlay = document.createElement('div');
        overlay.className = 'ios-alert-overlay';
        overlay.innerHTML = `
            <div class="ios-alert-box">
                <button class="ios-alert-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
                <div class="ios-alert-icon" style="background:rgba(255,171,0,0.12);color:#e6a200;"><i class="fas fa-exclamation-triangle"></i></div>
                <h3 class="ios-alert-title">Vérifiez vos spams !</h3>
                <p class="ios-alert-text">Lors de votre inscription, un <strong>e-mail de vérification</strong> vous sera envoyé. Il est possible qu'il arrive dans votre dossier <strong>Spam / Courrier indésirable</strong>. Pensez à le vérifier si vous ne le trouvez pas dans votre boîte de réception.</p>
                <button class="ios-alert-btn">Compris, télécharger l'APK</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.ios-alert-btn').addEventListener('click', () => {
            overlay.remove();
            if (downloadUrl && downloadUrl !== '#') {
                window.location.href = downloadUrl;
            }
        });

        overlay.querySelector('.ios-alert-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) overlay.remove();
        });
    }

    // Hero Android download button
    const heroAndroidBtn = document.querySelector('.hero-buttons .btn-primary');
    if (heroAndroidBtn) {
        heroAndroidBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSpamAlert(heroAndroidBtn.getAttribute('href'));
        });
    }

    // Download section Android button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSpamAlert('apk/nextlearn_v1_1.0_android.apk');
        });
    }

    // ============================================
    // GESTION BOUTON iOS – ALERTE STYLÉE + REDIRECTION
    // ============================================
    document.querySelectorAll('.ios-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.createElement('div');
            overlay.className = 'ios-alert-overlay';
            overlay.innerHTML = `
                <div class="ios-alert-box">
                    <button class="ios-alert-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
                    <div class="ios-alert-icon"><i class="fab fa-apple"></i></div>
                    <h3 class="ios-alert-title">Version iOS à venir !</h3>
                    <p class="ios-alert-text">L'application iOS est en cours de développement et sera disponible prochainement. En attendant, découvrez la version web de NextLearn.</p>
                    <button class="ios-alert-btn">Continuer vers la version Web</button>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.ios-alert-btn').addEventListener('click', () => {
                overlay.remove();
                window.open('https://frontend-v1-nextlearn-mobile.vercel.app/', '_blank', 'noopener,noreferrer');
            });

            overlay.querySelector('.ios-alert-close').addEventListener('click', () => {
                overlay.remove();
            });

            overlay.addEventListener('click', (ev) => {
                if (ev.target === overlay) overlay.remove();
            });
        });
    });

    // ============================================
    // CARROUSEL FONDATEURS
    // ============================================
    const carousel = document.getElementById('foundersCarousel');
    const slides = carousel ? carousel.querySelectorAll('.founder-slide') : [];
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    let currentSlide = 0;
    let autoPlayInterval;

    function goToSlide(index) {
        if (!slides.length) return;
        currentSlide = ((index % slides.length) + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(-${currentSlide * 100}%)`;
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
            startAutoPlay();
        });
    });

    // Touch/swipe pour mobile
    if (carousel) {
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        }, { passive: true });
    }

    if (slides.length > 0) startAutoPlay();

});
