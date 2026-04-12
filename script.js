/* ============================================
   NEXTLEARN – Script JS
   Interactions, animations, smooth scroll
   JavaScript Vanilla (ES6)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Références DOM ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.stat-number');
    const notifyForm = document.getElementById('notifyForm');

    // ---- Overlay pour le menu mobile ----
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ============================================
    // NAVBAR – Comportement au scroll
    // ============================================
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ============================================
    // MENU MOBILE – Toggle
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

    // Fermer le menu quand on clique un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ============================================
    // NAVIGATION ACTIVE – Surligner le lien actif en fonction du scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ============================================
    // ANIMATIONS AU SCROLL – Intersection Observer
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Ne pas désactiver l'observation pour permettre de rejouer l'animation
                // si on veut un effet "one-time", décommenter :
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // COMPTEUR ANIMÉ – Stats du hero
    // ============================================
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'), 10);
                const duration = 2000; // ms
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function (ease-out)
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);

                    num.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        num.textContent = target;
                    }
                }

                requestAnimationFrame(updateCount);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    // Aussi vérifier au chargement  
    animateCounters();

    // ============================================
    // SMOOTH SCROLL – Navigation interne
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            const navHeight = navbar.offsetHeight;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ============================================
    // FORMULAIRE NOTIFICATION iOS
    // ============================================
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = notifyForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                // Remplacer le formulaire par un message de succès
                const parent = notifyForm.parentElement;
                notifyForm.style.display = 'none';

                const successMsg = document.createElement('div');
                successMsg.style.cssText = `
                    padding: 14px 20px;
                    background: rgba(26, 73, 125, 0.08);
                    border-radius: 8px;
                    color: #1a497d;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
                successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Merci ! Vous serez notifié(e) dès la sortie iOS.';

                const infoEl = parent.querySelector('.notify-info');
                if (infoEl) infoEl.style.display = 'none';

                parent.appendChild(successMsg);
            }
        });
    }

    // ============================================
    // BOUTON RETOUR EN HAUT – Apparition
    // ============================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        function toggleBackToTop() {
            if (window.scrollY > 600) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'all';
            } else {
                backToTop.style.opacity = '0.3';
                backToTop.style.pointerEvents = 'all';
            }
        }

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
    }

    // ============================================
    // PARALLAX LÉGER – Particules du hero
    // ============================================
    const particles = document.querySelectorAll('.particle');

    function handleParallax() {
        const scrollY = window.scrollY;

        particles.forEach((particle, index) => {
            const speed = 0.02 + (index * 0.01);
            const yOffset = scrollY * speed;
            particle.style.transform = `translateY(${yOffset}px)`;
        });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ============================================
    // BOUTON TÉLÉCHARGEMENT – Compteur factice
    // ============================================
    const downloadBtn = document.getElementById('downloadBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Animation visuelle du bouton
            downloadBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                downloadBtn.style.transform = '';
            }, 200);

            // Alerte de téléchargement (à remplacer par le vrai lien)
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: #1a497d;
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                font-family: 'Poppins', sans-serif;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 0 10px 40px rgba(26, 73, 125, 0.3);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInToast 0.4s ease-out;
            `;
            toast.innerHTML = '<i class="fas fa-download"></i> Téléchargement bientôt disponible !';

            // Ajouter l'animation keyframe
            if (!document.getElementById('toast-style')) {
                const style = document.createElement('style');
                style.id = 'toast-style';
                style.textContent = `
                    @keyframes slideInToast {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutToast {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOutToast 0.4s ease-in forwards';
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        });
    }

    // ============================================
    // ANIMATION D'ENTRÉE INITIALE
    // ============================================
    // Déclencher les animations du hero au chargement
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 150);
        });
    }, 200);

    // ============================================
    // ORBITAL TIMELINE – Fonctionnalités V1
    // ============================================
    (function initOrbitalTimeline() {
        const container = document.getElementById('orbitalContainer');
        const viewport = document.getElementById('orbitalViewport');
        const connectionsSvg = document.getElementById('orbitalConnections');
        const nodes = document.querySelectorAll('.orbital-node');

        if (!container || !viewport || nodes.length === 0) return;

        let rotationAngle = 0;
        let autoRotate = true;
        let activeNodeId = null;
        let animFrameId = null;
        let lastTimestamp = 0;

        const ROTATION_SPEED = 0.3; // degrés par frame (~50ms)
        const FRAME_INTERVAL = 50;

        // Calculer le rayon en fonction de la taille du viewport
        function getRadius() {
            const vw = viewport.offsetWidth;
            return vw * 0.4; // 40% de la largeur du viewport
        }

        // Calculer la position d'un nœud
        function calculateNodePosition(index, total) {
            const angle = ((index / total) * 360 + rotationAngle) % 360;
            const radius = getRadius();
            const radian = (angle * Math.PI) / 180;

            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);

            const zIndex = Math.round(100 + 50 * Math.cos(radian));
            const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

            return { x, y, angle, zIndex, opacity };
        }

        // Mettre à jour les positions de tous les nœuds
        function updateNodePositions() {
            const total = nodes.length;

            nodes.forEach((node, index) => {
                const pos = calculateNodePosition(index, total);
                const isActive = node.classList.contains('is-active');

                // Centrer le nœud : translate depuis le centre du viewport
                node.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;
                node.style.zIndex = isActive ? 200 : pos.zIndex;
                node.style.opacity = isActive ? 1 : pos.opacity;
            });

            updateConnections();
        }

        // Dessiner les connexions SVG
        function updateConnections() {
            if (!connectionsSvg) return;

            const viewportRect = viewport.getBoundingClientRect();
            const centerX = viewportRect.width / 2;
            const centerY = viewportRect.height / 2;
            const total = nodes.length;

            let svgContent = '';

            nodes.forEach((node, index) => {
                const relatedStr = node.getAttribute('data-related');
                if (!relatedStr) return;

                const relatedIds = relatedStr.split(',').map(Number);
                const pos1 = calculateNodePosition(index, total);

                relatedIds.forEach(relId => {
                    const relIndex = Array.from(nodes).findIndex(n =>
                        parseInt(n.getAttribute('data-node-id')) === relId
                    );
                    if (relIndex === -1 || relIndex <= index) return; // Avoid duplicates

                    const pos2 = calculateNodePosition(relIndex, total);

                    const isActive =
                        (activeNodeId && (
                            parseInt(node.getAttribute('data-node-id')) === activeNodeId ||
                            relId === activeNodeId
                        ));

                    svgContent += `<line 
                        x1="${centerX + pos1.x}" y1="${centerY + pos1.y}" 
                        x2="${centerX + pos2.x}" y2="${centerY + pos2.y}" 
                        class="${isActive ? 'connection-active' : ''}" />`;
                });
            });

            connectionsSvg.innerHTML = svgContent;
        }

        // Animation loop
        function animate(timestamp) {
            if (!autoRotate) {
                animFrameId = requestAnimationFrame(animate);
                return;
            }

            if (timestamp - lastTimestamp >= FRAME_INTERVAL) {
                rotationAngle = (rotationAngle + ROTATION_SPEED) % 360;
                updateNodePositions();
                lastTimestamp = timestamp;
            }

            animFrameId = requestAnimationFrame(animate);
        }

        // Centrer la vue sur un nœud
        function centerOnNode(nodeIndex) {
            const total = nodes.length;
            const targetAngle = (nodeIndex / total) * 360;
            rotationAngle = 270 - targetAngle;
            updateNodePositions();
        }

        // Obtenir les IDs liés
        function getRelatedIds(nodeId) {
            const node = document.querySelector(`.orbital-node[data-node-id="${nodeId}"]`);
            if (!node) return [];
            const relatedStr = node.getAttribute('data-related');
            return relatedStr ? relatedStr.split(',').map(Number) : [];
        }

        // Toggle un nœud
        function toggleNode(clickedNode) {
            const nodeId = parseInt(clickedNode.getAttribute('data-node-id'));
            const wasActive = clickedNode.classList.contains('is-active');

            // Retirer tous les états
            nodes.forEach(n => {
                n.classList.remove('is-active', 'is-related');
            });

            if (wasActive) {
                activeNodeId = null;
                autoRotate = true;
            } else {
                activeNodeId = nodeId;
                autoRotate = false;
                clickedNode.classList.add('is-active');

                // Marquer les nœuds liés
                const relatedIds = getRelatedIds(nodeId);
                relatedIds.forEach(relId => {
                    const relNode = document.querySelector(`.orbital-node[data-node-id="${relId}"]`);
                    if (relNode) relNode.classList.add('is-related');
                });

                // Centrer sur le nœud
                const nodeIndex = Array.from(nodes).indexOf(clickedNode);
                centerOnNode(nodeIndex);
            }

            updateConnections();
        }

        // ---- Event Listeners ----

        // Clic sur un nœud
        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleNode(node);
            });
        });

        // Clic sur un tag lié dans la card
        document.querySelectorAll('.related-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const gotoId = parseInt(tag.getAttribute('data-goto'));
                const targetNode = document.querySelector(`.orbital-node[data-node-id="${gotoId}"]`);
                if (targetNode) {
                    toggleNode(targetNode);
                }
            });
        });

        // Clic sur le fond pour tout désélectionner
        container.addEventListener('click', (e) => {
            if (e.target === container || e.target === viewport) {
                nodes.forEach(n => n.classList.remove('is-active', 'is-related'));
                activeNodeId = null;
                autoRotate = true;
                updateConnections();
            }
        });

        // Observer l'entrée en vue pour démarrer l'animation
        const orbitalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animFrameId) {
                        animFrameId = requestAnimationFrame(animate);
                    }
                } else {
                    if (animFrameId) {
                        cancelAnimationFrame(animFrameId);
                        animFrameId = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        orbitalObserver.observe(container);

        // Mise à jour initiale
        updateNodePositions();

        // Resize listener
        window.addEventListener('resize', () => {
            updateNodePositions();
        });
    })();

});
