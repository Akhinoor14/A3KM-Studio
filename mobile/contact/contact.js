/* ============================================================================
   MOBILE CONTACT PAGE - JAVASCRIPT
   Contact form handling with EmailJS
   ============================================================================ */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Initialize EmailJS
        emailjs.init('Yj4RUOwG4oxZyKFoh'); // Your EmailJS public key
        
        // Setup form handler
        setupContactForm();
        
        // Character counter for textarea
        setupCharCounter();
        
        // Add animations
        animateSections();
        
        // Input validation and effects
        setupInputEffects();
    }
    
    /**
     * Setup contact form submission
     */
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        
        if (!form || !submitBtn || !formStatus) {
            console.error('Contact form elements not found');
            return;
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Enhanced form validation
            const inputs = form.querySelectorAll('.input-wrapper input, .input-wrapper textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                const wrapper = input.closest('.input-wrapper');
                if (!validateInput(input, wrapper)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                showStatus('error', '⚠ Please fix the errors in the form');
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: 'mdakhinoorislam.official.2005@gmail.com'
            };
            
            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';
            
            try {
                // Send main email to you
                const response = await emailjs.send(
                    'service_l3om32p',  // Your Gmail service
                    'template_5lv0are', // Portfolio Contact Form
                    {
                        from_name: data.from_name,
                        from_email: data.from_email,
                        subject: data.subject,
                        message: data.message,
                        to_email: 'mdakhinoorislam.official.2005@gmail.com'
                    }
                );
                
                console.log('Email sent successfully:', response);
                
                // Send auto-reply to sender
                try {
                    await emailjs.send(
                        'service_l3om32p',  // Your Gmail service
                        'template_ruuu6ra', // Portfolio Auto Reply
                        {
                            from_name: data.from_name,
                            from_email: data.from_email,
                            subject: data.subject,
                            message: data.message
                        }
                    );
                    console.log('Auto-reply sent successfully');
                } catch (autoReplyError) {
                    console.warn('Auto-reply failed:', autoReplyError);
                    // Don't show error to user for auto-reply failure
                }
                
                // Show success confetti
                showSuccessConfetti();
                
                // Show success message
                showStatus('success', '✓ Message sent successfully! I\'ll get back to you soon.');
                
                // Reset form
                form.reset();
                
                // Remove validation classes
                inputs.forEach(input => {
                    const wrapper = input.closest('.input-wrapper');
                    wrapper.classList.remove('valid', 'invalid', 'filled');
                });
                
            } catch (error) {
                console.error('Error sending email:', error);
                showStatus('error', '✗ Failed to send message. Please try again or contact via email directly.');
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnSpinner.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
    
    /**
     * Show status message
     */
    function showStatus(type, message) {
        const formStatus = document.getElementById('formStatus');
        
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 10000);
        }
    }
    
    /**
     * Animate sections on scroll
     */
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    /**
     * Setup character counter for textarea
     */
    function setupCharCounter() {
        const textarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (!textarea || !charCount) return;
        
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = this.maxLength;
            
            charCount.textContent = currentLength;
            
            // Change color based on length
            charCount.classList.remove('warning', 'danger');
            if (currentLength >= maxLength) {
                charCount.classList.add('danger');
            } else if (currentLength >= maxLength * 0.9) {
                charCount.classList.add('warning');
            }
        });
    }
    
    /**
     * Setup input validation and effects - ENHANCED
     */
    function setupInputEffects() {
        const inputs = document.querySelectorAll('.input-wrapper input, .input-wrapper textarea');
        
        inputs.forEach(input => {
            // Add focus/blur effects
            input.addEventListener('focus', function() {
                const wrapper = this.closest('.input-wrapper');
                wrapper.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                const wrapper = this.closest('.input-wrapper');
                wrapper.classList.remove('focused');
                
                // Validate on blur
                if (this.value.trim()) {
                    wrapper.classList.add('filled');
                    validateInput(input, wrapper);
                } else {
                    wrapper.classList.remove('filled');
                }
            });
            
            // Real-time email validation
            if (input.type === 'email') {
                input.addEventListener('input', function() {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const wrapper = this.closest('.input-wrapper');
                    
                    if (this.value && !emailPattern.test(this.value)) {
                        wrapper.classList.add('invalid');
                        wrapper.classList.remove('valid');
                    } else if (this.value) {
                        wrapper.classList.remove('invalid');
                        wrapper.classList.add('valid');
                    } else {
                        wrapper.classList.remove('invalid', 'valid');
                    }
                });
            }
            
            // Real-time validation for other inputs
            if (input.name === 'from_name') {
                input.addEventListener('input', function() {
                    const wrapper = this.closest('.input-wrapper');
                    if (this.value.trim().length < 2) {
                        wrapper.classList.add('invalid');
                        wrapper.classList.remove('valid');
                    } else {
                        wrapper.classList.remove('invalid');
                        wrapper.classList.add('valid');
                    }
                });
            }
            
            if (input.name === 'subject') {
                input.addEventListener('input', function() {
                    const wrapper = this.closest('.input-wrapper');
                    if (this.value.trim().length < 3) {
                        wrapper.classList.add('invalid');
                        wrapper.classList.remove('valid');
                    } else {
                        wrapper.classList.remove('invalid');
                        wrapper.classList.add('valid');
                    }
                });
            }
            
            if (input.name === 'message') {
                input.addEventListener('input', function() {
                    const wrapper = this.closest('.input-wrapper');
                    if (this.value.trim().length < 10) {
                        wrapper.classList.add('invalid');
                        wrapper.classList.remove('valid');
                    } else {
                        wrapper.classList.remove('invalid');
                        wrapper.classList.add('valid');
                    }
                });
            }
        });
    }
    
    /**
     * Validate individual input
     */
    function validateInput(input, wrapper) {
        let isValid = false;
        
        if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(input.value);
        } else if (input.name === 'from_name') {
            isValid = input.value.trim().length >= 2;
        } else if (input.name === 'subject') {
            isValid = input.value.trim().length >= 3;
        } else if (input.name === 'message') {
            isValid = input.value.trim().length >= 10;
        } else {
            isValid = input.value.trim().length > 0;
        }
        
        if (isValid) {
            wrapper.classList.remove('invalid');
            wrapper.classList.add('valid');
        } else {
            wrapper.classList.add('invalid');
            wrapper.classList.remove('valid');
            
            // Shake animation on invalid
            shakeElement(wrapper);
        }
        
        return isValid;
    }
    
    /**
     * Shake animation for invalid inputs
     */
    function shakeElement(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'inputShake 0.4s cubic-bezier(.36,.07,.19,.97)';
        }, 10);
    }
    
    /**
     * Success confetti animation
     */
    function showSuccessConfetti() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const confettiCount = 30;
        const colors = ['#CC0000', '#8B0000', '#FF0000', '#FFFFFF', 'rgba(255,255,255,0.8)'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: 1;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 10000;
                animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }
    }
    
})();
