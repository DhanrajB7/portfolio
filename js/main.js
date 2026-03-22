/* ========================================================================
   DHANRAJ BHALALA — PORTFOLIO JS
   ======================================================================== */

(function () {
    'use strict';

    /* ---- Text Scramble Effect ---- */
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => (this.resolve = resolve));
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += '<span class="scramble-char">' + char + '</span>';
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    /* ---- Noise Texture Generator ---- */
    function generateNoise() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(200, 200);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const v = Math.random() * 255;
            imageData.data[i] = v;
            imageData.data[i + 1] = v;
            imageData.data[i + 2] = v;
            imageData.data[i + 3] = 12;
        }
        ctx.putImageData(imageData, 0, 0);
        const overlay = document.querySelector('.noise-overlay');
        if (overlay) {
            overlay.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
            overlay.style.backgroundRepeat = 'repeat';
            overlay.style.opacity = '1';
        }
    }

    /* ---- Preloader ---- */
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        const counter = document.getElementById('preloaderCount');
        const bar = document.getElementById('preloaderBar');
        if (!preloader) return;

        document.body.classList.add('loading');
        let count = 0;
        const target = 100;
        const duration = 2000;
        const stepTime = duration / target;

        const interval = setInterval(function () {
            count++;
            if (counter) counter.textContent = count;
            if (bar) bar.style.width = count + '%';

            if (count >= target) {
                clearInterval(interval);
                setTimeout(function () {
                    preloader.classList.add('done');
                    document.body.classList.remove('loading');
                    startHeroAnimations();
                }, 400);
            }
        }, stepTime);
    }

    /* ---- Hero Animations ---- */
    function startHeroAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const nameLines = document.querySelectorAll('.hero-name-line');

        // Animate hero elements in sequence
        tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 }, 0.2);
        tl.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.6);
        tl.to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 0.8);
        tl.to('.hero-scroll', { opacity: 1, duration: 1 }, 1.2);

        // Set initial states
        gsap.set('.hero-tag', { y: 20 });
        gsap.set('.hero-subtitle', { y: 20 });
        gsap.set('.hero-cta', { y: 20 });

        // Scramble text effect on name
        nameLines.forEach(function (line, i) {
            const text = line.getAttribute('data-scramble');
            if (text) {
                line.style.opacity = '1';
                const fx = new TextScramble(line);
                setTimeout(function () {
                    fx.setText(text);
                }, 300 + i * 400);
            }
        });
    }

    /* ---- Custom Cursor ---- */
    function initCursor() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch');
            return;
        }

        const dot = document.getElementById('cursorDot');
        const outline = document.getElementById('cursorOutline');
        if (!dot || !outline) return;

        let mouseX = -100, mouseY = -100;
        let outlineX = -100, outlineY = -100;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
        });

        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.transform = 'translate(' + outlineX + 'px, ' + outlineY + 'px)';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effects
        var interactiveEls = document.querySelectorAll('a, button, .btn, .project-card, .skill-tag, .magnetic');
        interactiveEls.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                outline.classList.add('hover');
            });
            el.addEventListener('mouseleave', function () {
                outline.classList.remove('hover');
            });
        });
    }

    /* ---- Navigation ---- */
    function initNavigation() {
        var nav = document.getElementById('nav');
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');

        // Scroll effect
        window.addEventListener('scroll', function () {
            if (nav) {
                if (window.scrollY > 80) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        // Mobile toggle
        if (toggle && links) {
            toggle.addEventListener('click', function () {
                toggle.classList.toggle('active');
                links.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            // Close on link click
            links.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    toggle.classList.remove('active');
                    links.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    }

    /* ---- Scroll Progress ---- */
    function initScrollProgress() {
        var bar = document.getElementById('scrollProgress');
        if (!bar) return;

        window.addEventListener('scroll', function () {
            var scrollTop = document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                bar.style.width = (scrollTop / docHeight) * 100 + '%';
            }
        });
    }

    /* ---- Smooth Scroll ---- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ---- Marquee Duplication ---- */
    function initMarquee() {
        document.querySelectorAll('.marquee-content').forEach(function (el) {
            el.innerHTML = el.innerHTML + el.innerHTML;
        });
    }

    /* ---- GSAP Scroll Animations ---- */
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Reveal-up elements
        gsap.utils.toArray('.reveal-up').forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out'
            });
        });

        // Section headers
        gsap.utils.toArray('.section-header').forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Section line grow
        gsap.utils.toArray('.section-line').forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1,
                ease: 'power3.inOut',
                delay: 0.3
            });
        });

        // Timeline line draw
        var timeline = document.querySelector('.timeline');
        if (timeline) {
            ScrollTrigger.create({
                trigger: timeline,
                start: 'top 80%',
                onEnter: function () {
                    timeline.classList.add('animated');
                }
            });
        }

        // Skills tags stagger — uses CSS class toggle to avoid double-opacity conflict
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var tags = entry.target.querySelectorAll('.skill-tag');
                    tags.forEach(function (tag, i) {
                        setTimeout(function () {
                            tag.classList.add('visible');
                        }, i * 50);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.skill-group').forEach(function (group) {
            skillObserver.observe(group);
        });

        // Parallax on blobs
        gsap.to('.blob-1', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -150,
            ease: 'none'
        });

        gsap.to('.blob-2', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -80,
            ease: 'none'
        });
    }

    /* ---- Counter Animation ---- */
    function initCounters() {
        var counters = document.querySelectorAll('.stat-number[data-target]');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-target'));
                    var current = 0;
                    var increment = Math.max(1, Math.floor(target / 40));
                    var timer = setInterval(function () {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = current;
                        }
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    /* ---- Magnetic Button Effect ---- */
    function initMagnetic() {
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                setTimeout(function () {
                    btn.style.transition = '';
                }, 400);
            });
        });
    }

    /* ---- Project Card Shine + Tilt ---- */
    function initProjectCards() {
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.project-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;

                // Shine effect
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');

                // Tilt
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -5;
                var rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    /* ---- Active Nav Link on Scroll ---- */
    function initActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY + 200;

            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    /* ---- Keyboard Shortcut Easter Egg ---- */
    function initEasterEgg() {
        var sequence = '';
        var target = 'hire';

        document.addEventListener('keydown', function (e) {
            sequence += e.key.toLowerCase();
            if (sequence.length > target.length) {
                sequence = sequence.slice(-target.length);
            }
            if (sequence === target) {
                sequence = '';
                triggerConfetti();
            }
        });
    }

    function triggerConfetti() {
        var colors = ['#64ffda', '#a78bfa', '#f59e0b', '#ec4899', '#3b82f6'];
        for (var i = 0; i < 60; i++) {
            createConfettiPiece(colors[i % colors.length], i);
        }
    }

    function createConfettiPiece(color, index) {
        var piece = document.createElement('div');
        piece.style.cssText =
            'position:fixed;z-index:100000;width:8px;height:8px;border-radius:2px;pointer-events:none;' +
            'background:' + color + ';' +
            'left:' + (Math.random() * 100) + 'vw;' +
            'top:-10px;' +
            'opacity:1;';
        document.body.appendChild(piece);

        var destX = (Math.random() - 0.5) * 300;
        var destY = window.innerHeight + 100;
        var rotation = Math.random() * 720 - 360;
        var duration = 1500 + Math.random() * 1500;

        piece.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + destX + 'px, ' + destY + 'px) rotate(' + rotation + 'deg)', opacity: 0 }
        ], {
            duration: duration,
            delay: index * 20,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });

        setTimeout(function () {
            if (piece.parentNode) piece.parentNode.removeChild(piece);
        }, duration + index * 20 + 100);
    }

    /* ---- Initialize Everything ---- */
    function init() {
        generateNoise();
        initPreloader();
        initCursor();
        initNavigation();
        initScrollProgress();
        initSmoothScroll();
        initMarquee();
        initCounters();
        initMagnetic();
        initProjectCards();
        initActiveNavLink();
        initEasterEgg();

        // GSAP animations after a short delay to ensure DOM is ready
        setTimeout(initScrollAnimations, 100);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
