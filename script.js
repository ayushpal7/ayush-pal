document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.section-heading, .service-row, .about-text, .portfolio-item');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            hamburger?.setAttribute('aria-label', 'Open menu');

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Canvas Background Animation (Optimized) ---
    const canvas = document.getElementById('bgCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        let width, height;
        let particles = [];
        let mouseX = 0, mouseY = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `hsla(${Math.random() * 360}, 100%, 50%, 0.4)`;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Simple boundary wrapping
                if (this.x > width + 10) this.x = -10;
                if (this.x < -10) this.x = width + 10;
                if (this.y > height + 10) this.y = -10;
                if (this.y < -10) this.y = height + 10;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = 25; // Reduced from 50
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let frameCount = 0;
        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();
    }

});
