$(document).ready(function() {
    
    // Initialize all animations and interactions
    initializeAnimations();
    initializeNavigation();
    initializeProductInteractions();
    initializeFormValidation();
    initializeScrollAnimations();
    initializeFloatingElements();
    initializeImageHandling();
    
    // Image loading and error handling
    function initializeImageHandling() {
        // Handle image loading errors with fallbacks
        $('img').on('error', function() {
            const img = $(this);
            const container = img.closest('.product-image, .image-container, .about-image');
            
            // Add error class for styling
            container.addClass('image-error');
            
            // Try alternative image sources
            const currentSrc = img.attr('src');
            
            if (currentSrc.includes('picsum.photos')) {
                // Try a different random image
                const randomNum = Math.floor(Math.random() * 100) + 1;
                img.attr('src', `https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Krosh+Product+${randomNum}`);
            } else if (currentSrc.includes('via.placeholder.com')) {
                // Use data URI as final fallback
                img.attr('src', createPlaceholderDataURI(400, 300, img.attr('alt')));
            }
        });
        
        // Ensure all images have loading="lazy" for better performance
        $('img').attr('loading', 'lazy');
        
        // Create intersection observer for lazy loading fallback
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            $('img[data-src]').each(function() {
                imageObserver.observe(this);
            });
        }
    }
    
    // Create placeholder data URI
    function createPlaceholderDataURI(width, height, altText) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff6b9d');
        gradient.addColorStop(1, '#c39bd3');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(altText || 'Krosh Product', width / 2, height / 2 - 10);
        ctx.fillText('🧶', width / 2, height / 2 + 20);
        
        return canvas.toDataURL();
    }
    
    // Initialize animations
    function initializeAnimations() {
        // Stagger animation for navigation items
        $('.nav-link').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
        
        // Stagger animation for feature cards
        $('.animate-feature-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.2) + 's');
        });
        
        // Stagger animation for product cards
        $('.animate-product-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
        
        // Stagger animation for stats
        $('.animate-stat').each(function(index) {
            $(this).css('animation-delay', (index * 0.2) + 's');
        });
        
        // Stagger animation for social links
        $('.animate-social-link').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
    }
    
    // Navigation functionality
    function initializeNavigation() {
        // Smooth scrolling for navigation links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000, 'easeInOutQuart');
            }
        });
        
        // Navbar background change on scroll
        $(window).scroll(function() {
            const scrollTop = $(window).scrollTop();
            
            if (scrollTop > 50) {
                $('.custom-navbar').addClass('scrolled');
            } else {
                $('.custom-navbar').removeClass('scrolled');
            }
        });
        
        // Active navigation highlighting
        $(window).scroll(function() {
            const scrollPos = $(window).scrollTop() + 100;
            
            $('section[id]').each(function() {
                const sectionTop = $(this).offset().top;
                const sectionHeight = $(this).outerHeight();
                const sectionId = $(this).attr('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    $('.nav-link').removeClass('active');
                    $(`.nav-link[href="#${sectionId}"]`).addClass('active');
                }
            });
        });
    }
    
    // Product interactions
    function initializeProductInteractions() {
        // Add to cart animation
        $('.add-to-cart-btn').on('click', function(e) {
            e.preventDefault();
            
            const button = $(this);
            const originalText = button.html();
            
            // Change button state
            button.html('<i class="fas fa-check me-2"></i>Added!');
            button.addClass('btn-success').removeClass('btn-pink');
            
            // Update cart count with animation
            const cartBadge = $('.cart-icon .badge');
            const currentCount = parseInt(cartBadge.text());
            cartBadge.text(currentCount + 1);
            
            // Animate cart icon
            $('.cart-icon').addClass('animate__animated animate__bounce');
            
            // Show success message
            showNotification('Product added to cart!', 'success');
            
            // Reset button after 2 seconds
            setTimeout(function() {
                button.html(originalText);
                button.removeClass('btn-success').addClass('btn-pink');
                $('.cart-icon').removeClass('animate__animated animate__bounce');
            }, 2000);
        });
        
        // Product card hover effects
        $('.product-card').hover(
            function() {
                $(this).find('.product-image img').addClass('zoomed');
            },
            function() {
                $(this).find('.product-image img').removeClass('zoomed');
            }
        );
        
        // Quick view functionality
        $('.product-overlay .btn').on('click', function(e) {
            e.preventDefault();
            showProductQuickView($(this).closest('.product-card'));
        });
    }
    
    // Form validation and submission
    function initializeFormValidation() {
        $('.contact-form').on('submit', function(e) {
            e.preventDefault();
            
            const form = $(this);
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.html();
            
            // Validate form
            if (validateForm(form)) {
                // Show loading state
                submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');
                submitBtn.prop('disabled', true);
                
                // Simulate form submission
                setTimeout(function() {
                    showNotification('Message sent successfully!', 'success');
                    form[0].reset();
                    
                    // Reset button
                    submitBtn.html(originalText);
                    submitBtn.prop('disabled', false);
                }, 2000);
            }
        });
        
        // Real-time form validation
        $('.form-control').on('blur', function() {
            validateField($(this));
        });
    }
    
    // Scroll animations using Intersection Observer
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter($(entry.target));
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        $('.feature-card, .product-card, .about-content, .contact-item, .stat-number').each(function() {
            this.classList.add('fade-in-on-scroll');
            observer.observe(this);
        });
    }
    
    // Floating elements animation
    function initializeFloatingElements() {
        // Add random movement to floating kittens
        $('.floating-kitten').each(function() {
            const element = $(this);
            const randomDelay = Math.random() * 2;
            const randomDuration = 4 + Math.random() * 4;
            
            element.css({
                'animation-delay': randomDelay + 's',
                'animation-duration': randomDuration + 's'
            });
        });
        
        // Create floating hearts on click
        $(document).on('click', '.hero-section, .product-card', function(e) {
            createFloatingHeart(e.pageX, e.pageY);
        });
    }
    
    // Helper functions
    function validateForm(form) {
        let isValid = true;
        
        form.find('.form-control[required]').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.val().trim();
        const fieldType = field.attr('type');
        let isValid = true;
        
        // Remove existing error states
        field.removeClass('is-invalid');
        field.next('.invalid-feedback').remove();
        
        // Check if required field is empty
        if (field.attr('required') && !value) {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid email address');
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.addClass('is-invalid');
        field.after(`<div class="invalid-feedback">${message}</div>`);
    }
    
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show notification" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        // Add custom styles for notification
        notification.css({
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            animation: 'slideInRight 0.5s ease-out'
        });
        
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            notification.alert('close');
        }, 5000);
    }
    
    function animateCounter(element) {
        const target = parseInt(element.text().replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 50);
        let current = 0;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (element.text().includes('+')) {
                displayValue += '+';
            }
            
            element.text(displayValue);
        }, 50);
    }
    
    function createFloatingHeart(x, y) {
        const heart = $('<i class="fas fa-heart floating-heart"></i>');
        
        heart.css({
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            color: '#ff6b9d',
            fontSize: '1.5rem',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'heartFloat 2s ease-out forwards'
        });
        
        $('body').append(heart);
        
        setTimeout(function() {
            heart.remove();
        }, 2000);
    }
    
    function showProductQuickView(productCard) {
        const productTitle = productCard.find('.product-title').text();
        const productImage = productCard.find('.product-image img').attr('src');
        const productPrice = productCard.find('.price').text();
        const productDescription = productCard.find('.product-description').text();
        
        const modalHTML = `
            <div class="modal fade" id="productQuickView" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${productTitle}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${productImage}" alt="${productTitle}" class="img-fluid rounded">
                                </div>
                                <div class="col-md-6">
                                    <h4 class="text-pink">${productPrice}</h4>
                                    <p>${productDescription}</p>
                                    <div class="mb-3">
                                        <label class="form-label">Size:</label>
                                        <select class="form-select">
                                            <option>Small</option>
                                            <option>Medium</option>
                                            <option>Large</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Color:</label>
                                        <div class="d-flex gap-2">
                                            <div class="color-option" style="background: #ff6b9d; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;"></div>
                                            <div class="color-option" style="background: #c39bd3; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;"></div>
                                            <div class="color-option" style="background: #ffd93d; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;"></div>
                                        </div>
                                    </div>
                                    <button class="btn btn-pink btn-lg w-100 add-to-cart-btn">
                                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        $('#productQuickView').remove();
        
        // Add new modal
        $('body').append(modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('productQuickView'));
        modal.show();
    }
    
    // Parallax effect for hero section
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const parallaxSpeed = 0.5;
        
        $('.floating-kitten').each(function() {
            const yPos = -(scrolled * parallaxSpeed);
            $(this).css('transform', `translateY(${yPos}px)`);
        });
    });
    
    // Typing effect for hero title (optional)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.html('');
        
        function type() {
            if (i < text.length) {
                element.append(text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Initialize typing effect for hero title (uncomment to enable)
    // setTimeout(function() {
    //     const heroTitle = $('.hero-title');
    //     const originalText = heroTitle.html();
    //     typeWriter(heroTitle, originalText, 100);
    // }, 1000);
    
    // Custom easing for smooth scrolling
    $.easing.easeInOutQuart = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };
    
    // Loading screen (optional)
    function showLoadingScreen() {
        const loader = $(`
            <div id="loading-screen" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #fef9e7 0%, #e8daef 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                flex-direction: column;
            ">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🐱🐰</div>
                <div style="font-family: 'Fredoka', cursive; font-size: 2rem; color: #ff6b9d; margin-bottom: 1rem;">Krosh</div>
                <div class="spinner-border text-pink" role="status"></div>
            </div>
        `);
        
        $('body').append(loader);
        
        setTimeout(function() {
            loader.fadeOut(1000, function() {
                loader.remove();
            });
        }, 2000);
    }
    
    // Show loading screen on page load (uncomment to enable)
    // showLoadingScreen();
    
    // Add CSS for additional animations
    $('<style>').text(`
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification {
            animation: slideInRight 0.5s ease-out;
        }
        
        .color-option {
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .color-option:hover {
            border-color: #ff6b9d;
            transform: scale(1.1);
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98) !important;
            box-shadow: 0 4px 30px rgba(255, 107, 157, 0.15) !important;
        }
        
        .nav-link.active {
            color: var(--primary-pink) !important;
            font-weight: 600;
        }
        
        .floating-heart {
            animation: heartFloat 2s ease-out forwards;
        }
        
        .zoomed {
            transform: scale(1.1) !important;
        }
    `).appendTo('head');
    
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        $('.product-card').on('touchstart', function() {
            $(this).addClass('hover');
        });
        
        $('.product-card').on('touchend', function() {
            setTimeout(() => {
                $(this).removeClass('hover');
            }, 300);
        });
    }
    
    // Keyboard navigation support
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.modal').modal('hide');
        }
    });
    
    // Console welcome message
    console.log(`
    🐱🐰 Welcome to Krosh! 🐰🐱
    Handmade with love for beautiful girls.
    
    Made with:
    - HTML5 & CSS3
    - Bootstrap 5
    - jQuery
    - Love & Creativity ❤️
    `);
});