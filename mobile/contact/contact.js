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
        
        // Add animations
        animateSections();
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
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: 'mdakhinoorislam.official.2005@gmail.com'
            };
            
            // Validate form
            if (!data.from_name || !data.from_email || !data.subject || !data.message) {
                showStatus('error', 'Please fill in all fields');
                return;
            }
            
            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
            
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
                
                // Show success message
                showStatus('success', '✓ Message sent successfully! I\'ll get back to you soon.');
                
                // Reset form
                form.reset();
                
                // Haptic feedback for success
                if ('vibrate' in navigator) {
                    navigator.vibrate([50, 30, 50]);
                }
                
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
    
})();
