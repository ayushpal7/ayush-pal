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

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (handled by CSS transition for smooth feel, or JS for lag)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // --- Canvas Background Animation (Fireflies/Particles) ---
    const canvas = document.getElementById('bgCanvas');
    let mouseX = 0, mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1; // 1 to 4px
                this.speedX = Math.random() * 2 - 1; // Faster
                this.speedY = Math.random() * 2 - 1;
                this.color = `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.5 + 0.3})`; // RGB rainbow
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction - move away from mouse
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * 5;
                    this.y += Math.sin(angle) * 5;
                }

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
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
            const particleCount = 50; // Number of fireflies
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0,0,0,0)'; // Transparent clear
            
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
