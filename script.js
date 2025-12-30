(function() {
    'use strict';

    window.__app = window.__app || {};

    function throttle(func, delay) {
        var timeoutId;
        var lastExecTime = 0;
        return function() {
            var context = this;
            var args = arguments;
            var currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(context, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    func.apply(context, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    function debounce(func, delay) {
        var timeoutId;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                func.apply(context, args);
            }, delay);
        };
    }

    function initBurgerMenu() {
        if (window.__app.burgerInit) return;
        window.__app.burgerInit = true;

        var toggler = document.querySelector('.navbar-toggler');
        var collapse = document.querySelector('.navbar-collapse');
        var navLinks = document.querySelectorAll('.nav-link');
        var body = document.body;

        if (!toggler || !collapse) return;

        var isOpen = false;

        function openMenu() {
            collapse.classList.add('show');
            collapse.style.maxHeight = 'calc(100vh - 70px)';
            toggler.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden';
            isOpen = true;
        }

        function closeMenu() {
            collapse.classList.remove('show');
            collapse.style.maxHeight = '0';
            toggler.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            isOpen = false;
        }

        toggler.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    closeMenu();
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (isOpen && !collapse.contains(e.target) && !toggler.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth >= 768 && isOpen) {
                closeMenu();
            }
        }, 150));
    }

    function initScrollEffects() {
        if (window.__app.scrollEffectsInit) return;
        window.__app.scrollEffectsInit = true;

        var animatedElements = document.querySelectorAll('.card, .btn, img, .hero-section, .accordion-item, .service-card, .breadcrumb');

        if ('IntersectionObserver' in window) {
            var observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            animatedElements.forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                observer.observe(el);
            });
        } else {
            animatedElements.forEach(function(el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInit) return;
        window.__app.scrollSpyInit = true;

        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        function updateActiveLink() {
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
            var headerOffset = 100;

            sections.forEach(function(section) {
                var top = section.offsetTop - headerOffset;
                var bottom = top + section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(updateActiveLink, 150));
        updateActiveLink();
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInit) return;
        window.__app.smoothScrollInit = true;

        document.addEventListener('click', function(e) {
            var target = e.target.closest('a[href^="#"]');
            if (!target) return;

            var href = target.getAttribute('href');
            if (href === '#' || href === '#!') return;

            var targetId = href.substring(1);
            var targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                var header = document.querySelector('.navbar');
                var offset = header ? header.offsetHeight : 80;
                var targetPosition = targetElement.offsetTop - offset;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    }

    function initMicroInteractions() {
        if (window.__app.microInteractionsInit) return;
        window.__app.microInteractionsInit = true;

        var interactiveElements = document.querySelectorAll('.btn, .card, .nav-link, .accordion-button, a[class*="btn"]');

        interactiveElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                this.style.transform = 'translateY(-2px)';
            });

            el.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });

            el.addEventListener('mousedown', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                var currentPosition = getComputedStyle(this).position;
                if (currentPosition === 'static') {
                    this.style.position = 'relative';
                }
                if (getComputedStyle(this).overflow !== 'hidden') {
                    this.style.overflow = 'hidden';
                }

                this.appendChild(ripple);

                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        });

        var style = document.createElement('style');
        style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
        document.head.appendChild(style);
    }

    function initCountUp() {
        if (window.__app.countUpInit) return;
        window.__app.countUpInit = true;

        var counters = document.querySelectorAll('[data-count]');

        if (counters.length === 0) return;

        function animateCount(element) {
            var target = parseInt(element.getAttribute('data-count'));
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = timestamp - startTime;
                var current = Math.min(Math.floor((progress / duration) * target), target);
                element.textContent = current.toLocaleString();

                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function(counter) {
                observer.observe(counter);
            });
        }
    }

    function initFormValidation() {
        if (window.__app.formValidationInit) return;
        window.__app.formValidationInit = true;

        var forms = document.querySelectorAll('form');

        var patterns = {
            firstName: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
            lastName: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
            name: /^[a-zA-ZÀ-ÿs-']{2,100}$/,
            email: /^[^s@]+@[^s@]+.[^s@]+$/,
            phone: /^[ds+-()]{10,20}$/,
            message: /^.{10,}$/
        };

        var errorMessages = {
            firstName: 'Bitte geben Sie einen gültigen Vornamen ein (2-50 Zeichen)',
            lastName: 'Bitte geben Sie einen gültigen Nachnamen ein (2-50 Zeichen)',
            name: 'Bitte geben Sie einen gültigen Namen ein (2-100 Zeichen)',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
            message: 'Die Nachricht muss mindestens 10 Zeichen enthalten',
            privacy: 'Bitte akzeptieren Sie die Datenschutzerklärung',
            required: 'Dieses Feld ist erforderlich'
        };

        function showError(input, message) {
            var errorElement = input.parentElement.querySelector('.invalid-feedback');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'invalid-feedback';
                input.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.classList.add('is-visible');
            input.classList.add('is-invalid');
        }

        function clearError(input) {
            var errorElement = input.parentElement.querySelector('.invalid-feedback');
            if (errorElement) {
                errorElement.classList.remove('is-visible');
            }
            input.classList.remove('is-invalid');
        }

        function validateField(input) {
            var name = input.name || input.id;
            var value = input.value.trim();
            var type = input.type;

            clearError(input);

            if (input.hasAttribute('required') && !value) {
                showError(input, errorMessages.required);
                return false;
            }

            if (type === 'checkbox' && input.hasAttribute('required') && !input.checked) {
                showError(input, errorMessages[name] || errorMessages.required);
                return false;
            }

            if (value && patterns[name]) {
                if (!patterns[name].test(value)) {
                    showError(input, errorMessages[name]);
                    return false;
                }
            }

            if (type === 'email' && value) {
                if (!patterns.email.test(value)) {
                    showError(input, errorMessages.email);
                    return false;
                }
            }

            return true;
        }

        forms.forEach(function(form) {
            var inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    validateField(this);
                });

                input.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            });

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var isValid = true;
                inputs.forEach(function(input) {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    var firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                var submitButton = form.querySelector('button[type="submit"]');
                var originalText = submitButton ? submitButton.innerHTML : '';

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Wird gesendet...';
                }

                setTimeout(function() {
                    if (navigator.onLine) {
                        window.location.href = 'thank_you.html';
                    } else {
                        alert('Fehler: Keine Internetverbindung. Bitte versuchen Sie es später erneut.');
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.innerHTML = originalText;
                        }
                    }
                }, 800);
            });
        });
    }

    function initScrollToTop() {
        if (window.__app.scrollToTopInit) return;
        window.__app.scrollToTopInit = true;

        var scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.setAttribute('aria-label', 'Nach oben scrollen');
        scrollTopBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: linear-gradient(135deg, #d4a5c0, #e8b4cb); color: white; border: none; border-radius: 50%; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 999; font-size: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);';
        document.body.appendChild(scrollTopBtn);

        function toggleScrollTopBtn() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        }

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        scrollTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        });

        window.addEventListener('scroll', throttle(toggleScrollTopBtn, 150));
    }

    function initImages() {
        if (window.__app.imagesInit) return;
        window.__app.imagesInit = true;

        var images = document.querySelectorAll('img');

        images.forEach(function(img) {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJpbGQgbmljaHQgdmVyZsO8Z2JhcjwvdGV4dD48L3N2Zz4=';
            });
        });
    }

    function initModalPrivacy() {
        if (window.__app.modalPrivacyInit) return;
        window.__app.modalPrivacyInit = true;

        var privacyLinks = document.querySelectorAll('a[href*="privacy"]');

        privacyLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === 'privacy.html') {
                    return;
                }

                e.preventDefault();

                var modal = document.createElement('div');
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 0.3s ease;';

                var modalContent = document.createElement('div');
                modalContent.style.cssText = 'background: white; padding: 40px; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto; position: relative; transform: scale(0.9); transition: transform 0.3s ease;';
                modalContent.innerHTML = '<h2 style="margin-top: 0;">Datenschutzerklärung</h2><p>Weitere Informationen finden Sie auf unserer <a href="privacy.html" style="color: #d4a5c0; text-decoration: underline;">Datenschutzseite</a>.</p><button style="margin-top: 20px; padding: 12px 24px; background: linear-gradient(135deg, #d4a5c0, #e8b4cb); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Schließen</button>';

                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                setTimeout(function() {
                    modal.style.opacity = '1';
                    modalContent.style.transform = 'scale(1)';
                }, 10);

                var closeBtn = modalContent.querySelector('button');
                closeBtn.addEventListener('click', function() {
                    modal.style.opacity = '0';
                    modalContent.style.transform = 'scale(0.9)';
                    setTimeout(function() {
                        modal.remove();
                    }, 300);
                });

                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.opacity = '0';
                        modalContent.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            modal.remove();
                        }, 300);
                    }
                });
            });
        });
    }

    function initCardHoverEffects() {
        if (window.__app.cardHoverInit) return;
        window.__app.cardHoverInit = true;

        var cards = document.querySelectorAll('.card, .service-card, .accordion-item');

        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }

    window.__app.init = function() {
        if (window.__app.initialized) return;
        window.__app.initialized = true;

        initBurgerMenu();
        initScrollEffects();
        initScrollSpy();
        initSmoothScroll();
        initMicroInteractions();
        initCountUp();
        initFormValidation();
        initScrollToTop();
        initImages();
        initModalPrivacy();
        initCardHoverEffects();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }
})();
