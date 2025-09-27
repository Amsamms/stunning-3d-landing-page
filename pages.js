// Pages-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {

    // Counter animation for stats
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            entry.target.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    // FAQ toggle functionality
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    }

    // Contact form handling
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const submitBtn = this.querySelector('.submit-btn');
                const buttonText = submitBtn.querySelector('.button-text');
                const originalText = buttonText.textContent;

                // Show loading state
                submitBtn.classList.add('loading');
                buttonText.textContent = 'Sending...';

                // Simulate form submission
                try {
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Success state
                    submitBtn.classList.remove('loading');
                    submitBtn.style.background = 'linear-gradient(45deg, #06ffa5, #3a86ff)';
                    buttonText.textContent = 'Message Sent!';

                    // Reset form
                    contactForm.reset();

                    // Show success notification
                    showNotification('Thank you! Your message has been sent successfully.', 'success');

                } catch (error) {
                    // Error state
                    submitBtn.classList.remove('loading');
                    submitBtn.style.background = 'linear-gradient(45deg, #ff006e, #ff4757)';
                    buttonText.textContent = 'Error - Try Again';

                    showNotification('Oops! Something went wrong. Please try again.', 'error');
                }

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.style.background = 'linear-gradient(45deg, #ff006e, #8338ec)';
                    buttonText.textContent = originalText;
                }, 3000);
            });

            // Form input animations
            const formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');

            formInputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });

                // Check if input has value on load
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 0, 110, 0.1)'};
            border: 1px solid ${type === 'success' ? 'rgba(6, 255, 165, 0.3)' : 'rgba(255, 0, 110, 0.3)'};
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: #ffffff;
            backdrop-filter: blur(10px);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Portfolio filter (if on services page)
    function initPortfolioFilter() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const service = this.dataset.service;

                portfolioItems.forEach(item => {
                    if (service && item.dataset.category === service) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                        }, 300);
                    } else {
                        item.style.opacity = '0.3';
                    }
                });

                // Reset after 3 seconds
                setTimeout(() => {
                    portfolioItems.forEach(item => {
                        item.style.opacity = '1';
                    });
                }, 3000);
            });
        });
    }

    // Service card interactions
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            const serviceBtn = card.querySelector('.service-btn');

            if (serviceBtn) {
                serviceBtn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const serviceName = card.querySelector('.service-title').textContent;
                    showNotification(`Interested in ${serviceName}? Contact us for a detailed quote!`, 'info');

                    // Scroll to contact section if on same page, otherwise redirect
                    if (window.location.pathname.includes('contact.html')) {
                        const contactForm = document.getElementById('contactForm');
                        if (contactForm) {
                            contactForm.scrollIntoView({ behavior: 'smooth' });
                            // Pre-fill service field
                            const serviceSelect = contactForm.querySelector('#service');
                            if (serviceSelect) {
                                const serviceValue = card.dataset.service;
                                serviceSelect.value = serviceValue || '';
                            }
                        }
                    } else {
                        setTimeout(() => {
                            window.location.href = 'contact.html';
                        }, 1500);
                    }
                });
            }
        });
    }

    // Team member hover effects
    function initTeamMembers() {
        const teamMembers = document.querySelectorAll('.team-member');

        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                const avatar = this.querySelector('.member-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1.1) rotateY(180deg)';
                }
            });

            member.addEventListener('mouseleave', function() {
                const avatar = this.querySelector('.member-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1) rotateY(0deg)';
                }
            });
        });
    }

    // Process step interactions
    function initProcessSteps() {
        const processSteps = document.querySelectorAll('.process-step');

        processSteps.forEach((step, index) => {
            step.addEventListener('click', function() {
                // Remove active class from all steps
                processSteps.forEach(s => s.classList.remove('active'));

                // Add active class to clicked step
                this.classList.add('active');

                // Add visual feedback
                this.style.transform = 'translateX(20px) scale(1.02)';

                setTimeout(() => {
                    this.style.transform = 'translateX(10px)';
                }, 200);
            });
        });
    }

    // Smooth scroll for CTA buttons
    function initCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button');

        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Social link interactions
    function initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');

        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const platform = this.querySelector('span').textContent;
                showNotification(`${platform} link clicked! This would open the actual social media page.`, 'info');

                // Add click animation
                this.style.transform = 'translateY(-15px) scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1)';
                }, 200);
            });
        });
    }

    // Page transition effects
    function initPageTransitions() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href && href.endsWith('.html')) {
                    e.preventDefault();

                    // Add page transition effect
                    document.body.style.opacity = '0';
                    document.body.style.transform = 'scale(0.98)';

                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    // 3D object interactions (About page)
    function init3DObjects() {
        const floatingObjects = document.querySelectorAll('.floating-object');

        floatingObjects.forEach(obj => {
            obj.addEventListener('click', function() {
                // Create explosion effect
                for (let i = 0; i < 10; i++) {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: 4px;
                        height: 4px;
                        background: linear-gradient(45deg, #ff006e, #06ffa5);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1000;
                    `;

                    const angle = (i / 10) * Math.PI * 2;
                    const velocity = 50 + Math.random() * 30;

                    particle.style.animation = `
                        objectExplosion 0.8s ease-out forwards
                    `;

                    particle.style.setProperty('--angle', angle + 'rad');
                    particle.style.setProperty('--velocity', velocity + 'px');

                    this.appendChild(particle);

                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 800);
                }
            });
        });
    }

    // Add explosion animation
    const explosionStyle = document.createElement('style');
    explosionStyle.textContent = `
        @keyframes objectExplosion {
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
    document.head.appendChild(explosionStyle);

    // Initialize all page-specific features
    animateCounters();
    initFAQ();
    initContactForm();
    initPortfolioFilter();
    initServiceCards();
    initTeamMembers();
    initProcessSteps();
    initCTAButtons();
    initSocialLinks();
    initPageTransitions();
    init3DObjects();

    // Page-specific initializations
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'about.html':
            console.log('🎨 About page loaded with 3D DNA helix!');
            break;
        case 'services.html':
            console.log('🚀 Services page loaded with interactive portfolio!');
            break;
        case 'contact.html':
            console.log('📞 Contact page loaded with holographic form!');
            break;
        default:
            console.log('🏠 Home page active');
    }

    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.98)';

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    }, 100);
});