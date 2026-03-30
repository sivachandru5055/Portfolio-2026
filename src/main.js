document.addEventListener('DOMContentLoaded', () => {
    // Disable right-click across the entire document
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse movement vignette effect - REMOVED per user request
    /*
    const vignette = document.querySelector('.background-vignette');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        vignette.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 255, 0.15) 0%, transparent 80%)`;
    });
    */

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass, .section-title, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navRight = document.querySelector('.nav-right');

    menuToggle.addEventListener('click', () => {
        navRight.classList.toggle('active');
        menuToggle.classList.toggle('active'); // For styling hamburger to X
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navRight.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Function to toggle certificate card expansion
    const certCards = document.querySelectorAll('.certificate-card');
    const toggleCertCard = (card) => {
        const isActive = card.classList.contains('active');
        // Close other cards
        certCards.forEach(c => {
            if (c !== card) c.classList.remove('active');
        });
        
        if (!isActive) {
            card.classList.add('active');
            // Center the card in view for better experience
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } else {
            card.classList.remove('active');
        }
    };

    certCards.forEach(card => {
        // Main card click listener
        card.addEventListener('click', (e) => {
            // If clicking controls, don't toggle active (let control handlers handle it)
            if (e.target.closest('.carousel-controls')) return;
            toggleCertCard(card);
        });

        // Ensure clicking the 'View Certificate' link also triggers the toggle
        const viewLink = card.querySelector('.view-cert');
        if (viewLink) {
            viewLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent duplicate trigger from card click
                toggleCertCard(card);
            });
        }

        // Carousel Slider Logic for cards with multiple images
        const track = card.querySelector('.carousel-track');
        const images = card.querySelectorAll('.carousel-track img');
        if (images.length > 1) {
            const dotsContainer = card.querySelector('.carousel-dots');
            const prevBtn = card.querySelector('.prev');
            const nextBtn = card.querySelector('.next');
            
            // Defensive null check: Skip if navigation controls are missing
            if (!dotsContainer || !prevBtn || !nextBtn) return;

            let currentIndex = 0;
            let autoSlideTimer;

            // Create dots
            images.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    resetAutoSlide();
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            });

            const dots = card.querySelectorAll('.dot');

            const updateDots = () => {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                currentIndex = index;
                const offset = -currentIndex * 100;
                track.style.transform = `translateX(${offset}%)`;
                updateDots();

                // Update description dynamically
                const description = card.querySelector('.cert-description');
                if (description && images[currentIndex]) {
                    const newDesc = images[currentIndex].getAttribute('data-description');
                    if (newDesc) {
                        description.style.opacity = '0';
                        setTimeout(() => {
                            description.textContent = newDesc;
                            description.style.opacity = '1';
                        }, 300); // Pulse transition sync
                    }
                }
            };

            const startAutoSlide = () => {
                autoSlideTimer = setInterval(() => {
                    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                    goToSlide(currentIndex);
                }, 4000); // Increased readability time
            };

            const resetAutoSlide = () => {
                clearInterval(autoSlideTimer);
                startAutoSlide();
            };

            // Start auto slide on load
            startAutoSlide();

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetAutoSlide();
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                goToSlide(currentIndex);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetAutoSlide();
                currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                goToSlide(currentIndex);
            });
        }
    });

    // Particle System
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 25 : 60; // Reduce noise on small screens

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 15 + 15;
            this.alpha = Math.random() * 0.5 + 0.4;
            const chars = ['{', '}', '<', '>', '/', ';', '[', ']', '(', ')', '&&', '||', '=>', 'html', 'css', 'js', ' react', 'python', 'SOP', 'if', 'else', 'else if', 'for', 'while', 'import', 'const'];
            this.char = chars[Math.floor(Math.random() * chars.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
        }

        draw() {
            ctx.font = `bold ${this.size}px 'Courier New', monospace`; // Bold for visibility
            ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`; // Correct neon cyan
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();
}

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    console.log("Cursor system initialized");
    
    const interactables = document.querySelectorAll('a, button, .btn, .project-card, .contact-item, .menu-toggle, .certificate-card, .view-cert, input, textarea');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        if (!isVisible) {
            cursorDot.style.opacity = "1";
            cursorOutline.style.opacity = "1";
            document.body.style.cursor = 'none';
            interactables.forEach(el => el.style.cursor = 'none');
            isVisible = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animateCursor() {
        if (isVisible) {
            const dist = 0.15;
            outlineX += (mouseX - outlineX) * dist;
            outlineY += (mouseY - outlineY) * dist;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
} else {
    console.error("Cursor elements not found in DOM");
}

// Background collaboration on scroll
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Limit effect to top of page
        if (scrolled < 1000) {
            const scale = 1 + (scrolled * 0.0005); // Smooth scaling
            const yPos = scrolled * 0.2; // Parallax movement
            heroBg.style.transform = `scale(${scale}) translateY(${yPos}px)`;
        }
    });
}

// Back to top button logic
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Stat Counters Animation ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out effect: f(t) = t * (2 - t)
            const easedProgress = progress * (2 - progress);
            obj.innerText = Math.floor(easedProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsCard = document.querySelector('.stats-card');
    if (statsCard) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nums = entry.target.querySelectorAll('span[data-target]');
                    nums.forEach(num => {
                        const target = parseInt(num.getAttribute('data-target'));
                        // Start animation after a tiny delay for better visual anticipation
                        setTimeout(() => {
                            animateValue(num, 0, target, 2000);
                        }, 200);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.3 // Trigger when 30% visible
        });
        statsObserver.observe(statsCard);
    }

    // --- Contact Form Submission (Direct Email Relay) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-circle-notch fa-spin"></i>';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        formStatus.textContent = "Message sent successfully! 🚀";
                        formStatus.className = "form-status success";
                        contactForm.reset();
                    } else {
                        formStatus.textContent = result.message || "Oops! There was a problem submitting your form.";
                        formStatus.className = "form-status error";
                    }
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        formStatus.textContent = data.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.textContent = "Oops! There was a problem submitting your form.";
                    }
                    formStatus.className = "form-status error";
                }
            } catch (error) {
                formStatus.textContent = "Oops! There was a problem submitting your form.";
                formStatus.className = "form-status error";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                
                // Keep success message visible for 5 seconds
                if (formStatus.classList.contains('success')) {
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }
});
