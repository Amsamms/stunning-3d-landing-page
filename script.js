document.addEventListener('DOMContentLoaded', function() {

    // Mouse tracking for interactive effects
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        // Update sphere rotation based on mouse position
        const sphere = document.querySelector('.sphere-inner');
        if (sphere) {
            const rotationX = mouseY * 10;
            const rotationY = mouseX * 10;
            sphere.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }

        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-cube, .floating-diamond');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * speed * 10;
            const y = mouseY * speed * 10;
            element.style.transform = `translate(${x}px, ${y}px) ${element.classList.contains('floating-diamond') ? 'rotate(45deg)' : ''}`;
        });

        // Cursor trail effect
        createCursorTrail(e.clientX, e.clientY);
    });

    // Cursor trail effect
    function createCursorTrail(x, y) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #ff006e, #8338ec);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 0.8s ease-out forwards;
        `;

        document.body.appendChild(trail);

        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 800);
    }

    // Add trail fade animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.dataset.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`;
        observer.observe(card);
    });

    // Button interactions
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }

        .cta-button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);

    // Dynamic particle generation
    function createDynamicParticle() {
        const particle = document.createElement('div');
        const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${randomColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            box-shadow: 0 0 10px ${randomColor};
            animation: dynamicFloat ${15 + Math.random() * 10}s linear forwards;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 25000);
    }

    // Add dynamic float animation
    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
        @keyframes dynamicFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(dynamicStyle);

    // Generate particles periodically
    setInterval(createDynamicParticle, 2000);

    // Sphere interaction
    const sphere = document.querySelector('.sphere');
    if (sphere) {
        sphere.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.filter = 'brightness(1.2)';
        });

        sphere.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });

        sphere.addEventListener('click', function() {
            // Create explosion effect
            for (let i = 0; i < 20; i++) {
                const spark = document.createElement('div');
                const angle = (i / 20) * Math.PI * 2;
                const velocity = 100 + Math.random() * 50;

                spark.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 4px;
                    height: 4px;
                    background: linear-gradient(45deg, #ff006e, #06ffa5);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: sparkFly 1s ease-out forwards;
                    transform: translate(-50%, -50%);
                `;

                spark.style.setProperty('--angle', angle + 'rad');
                spark.style.setProperty('--velocity', velocity + 'px');

                this.appendChild(spark);

                setTimeout(() => {
                    if (spark.parentNode) {
                        spark.parentNode.removeChild(spark);
                    }
                }, 1000);
            }
        });
    }

    // Add spark animation
    const sparkStyle = document.createElement('style');
    sparkStyle.textContent = `
        @keyframes sparkFly {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(
                    calc(-50% + cos(var(--angle)) * var(--velocity)),
                    calc(-50% + sin(var(--angle)) * var(--velocity))
                ) scale(0);
            }
        }
    `;
    document.head.appendChild(sparkStyle);

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add smooth scroll behavior if needed
        });
    });

    // Performance optimization - reduce animations on slower devices
    if (navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--reduced-motion', '1');

        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });
    }

    // Text typing effect for hero title
    function typewriterEffect() {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            line.style.opacity = '1';

            setTimeout(() => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    line.textContent += text.charAt(i);
                    i++;
                    if (i > text.length) {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }, index * 1000);
        });
    }

    // Uncomment to enable typewriter effect
    // typewriterEffect();

    // Add glitch effect on logo hover
    const logo = document.querySelector('.logo-text');
    if (logo) {
        const originalText = logo.textContent;

        logo.addEventListener('mouseenter', function() {
            let glitchInterval = setInterval(() => {
                const glitchChars = '!@#$%^&*(){}[]|\\:";\'<>?,./~`';
                let glitchedText = '';

                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.3) {
                        glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        glitchedText += originalText[i];
                    }
                }

                this.textContent = glitchedText;
            }, 50);

            setTimeout(() => {
                clearInterval(glitchInterval);
                this.textContent = originalText;
            }, 500);
        });
    }

    // Add audio context for sound effects (optional)
    let audioContext;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playTone(frequency, duration) {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    // Add sound effects to interactions
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            initAudio();
            playTone(800, 0.1);
        });
    });

    if (sphere) {
        sphere.addEventListener('click', () => {
            initAudio();
            playTone(400, 0.2);
        });
    }

    console.log('🚀 Stunning 3D Landing Page loaded successfully!');
});