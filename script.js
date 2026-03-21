document.addEventListener('DOMContentLoaded', () => {
    
    // --- Typing Effect ---
    const roles = ["Web Developer", "Graphic Designer", "Tech Enthusiast", "UI/UX Designer"];
    const typingElement = document.querySelector('.typing-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const nextRoleDelay = 2000;

    function type() {
        if (!typingElement) return;
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeedCurrent = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeedCurrent = nextRoleDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeedCurrent = 500;
        }

        setTimeout(type, typeSpeedCurrent);
    }
    
    // Start typing loop
    type();

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

    const revealElements = document.querySelectorAll('.section-title, .card, .about-text, .portfolio-item');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Custom Cursor (Optimized) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let rafId = null;
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
                
                outlineX += (mouseX - outlineX) * 0.2;
                outlineY += (mouseY - outlineY) * 0.2;
                cursorOutline.style.left = outlineX + 'px';
                cursorOutline.style.top = outlineY + 'px';
                
                rafId = null;
            });
        }
    });

    // --- 3D Tilt Effect for Cards (Optimized) ---
    const cards = document.querySelectorAll('.card');
    let tiltRafId = null;
    let currentCard = null;
    let tiltX = 0, tiltY = 0;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            currentCard = card;
            if (!tiltRafId) {
                tiltRafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    tiltX = ((y - centerY) / centerY) * -8;
                    tiltY = ((x - centerX) / centerX) * 8;
                    
                    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
                    tiltRafId = null;
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            currentCard = null;
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
