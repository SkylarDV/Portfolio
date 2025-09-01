// Hamburger Menu Functionality with Error Boundaries
(function() {
    'use strict';
    
    // Global error boundary for this module
    function handleError(error, context) {
        console.warn(`Hamburger Menu Error (${context}):`, error);
        // Fallback: Ensure mobile nav is accessible even if JavaScript fails
        try {
            const mobileNav = document.querySelector('.mobile-nav');
            const hamburger = document.querySelector('.hamburger');
            if (mobileNav && hamburger) {
                // Add CSS-only fallback
                hamburger.style.display = 'none';
                mobileNav.style.position = 'static';
                mobileNav.style.transform = 'none';
                mobileNav.style.visibility = 'visible';
                mobileNav.style.opacity = '1';
            }
        } catch (fallbackError) {
            console.warn('Hamburger menu fallback failed:', fallbackError);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        try {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileDropdowns = document.querySelectorAll('.mobile-nav .dropdown');

    // Check if required elements exist
    if (!hamburger || !mobileNav) {
        console.warn('Hamburger menu: Required elements not found');
        return;
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        try {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        } catch (error) {
            handleError(error, 'toggleMobileMenu');
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        try {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Close all dropdowns
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        } catch (error) {
            handleError(error, 'closeMobileMenu');
        }
    }

    // Toggle dropdown in mobile menu
    function toggleMobileDropdown(dropdown) {
        try {
            // Close other dropdowns
            mobileDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        } catch (error) {
            handleError(error, 'toggleMobileDropdown');
        }
    }

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            try {
                toggleMobileMenu();
            } catch (error) {
                handleError(error, 'hamburger click');
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function(e) {
            try {
                closeMobileMenu();
            } catch (error) {
                handleError(error, 'overlay click');
            }
        });
    }

    // Handle dropdown toggles in mobile menu
    mobileDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                try {
                    e.preventDefault();
                    toggleMobileDropdown(dropdown);
                } catch (error) {
                    handleError(error, 'dropdown toggle');
                }
            });
        }
    });

    // Close menu when clicking on nav links (except dropdowns)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link:not(.dropdown-toggle)');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            try {
                closeMobileMenu();
            } catch (error) {
                handleError(error, 'nav link click');
            }
        });
    });

    // Close menu when clicking on dropdown content links
    const mobileDropdownLinks = document.querySelectorAll('.mobile-nav .dropdown-content a');
    mobileDropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            try {
                closeMobileMenu();
            } catch (error) {
                handleError(error, 'dropdown link click');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        try {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        } catch (error) {
            handleError(error, 'window resize');
        }
    });

    // Prevent body scroll when menu is open
    if (mobileNav) {
        mobileNav.addEventListener('touchmove', (e) => {
            try {
                e.stopPropagation();
            } catch (error) {
                handleError(error, 'touchmove');
            }
        });
    }
    
        } catch (error) {
            handleError(error, 'DOMContentLoaded');
        }
    });

    // Language switching function (if it doesn't exist)
    if (typeof switchLanguage === 'undefined') {
        function switchLanguage(lang) {
            try {
                console.log('Language switched to:', lang);
                // Add language switching logic here if needed
                // For now, just update the display
                const languageToggle = document.querySelector('.language-dropdown .dropdown-toggle');
                if (languageToggle) {
                    const textNode = Array.from(languageToggle.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    if (textNode) {
                        textNode.textContent = lang.toUpperCase();
                    }
                }
                
                // Update mobile language toggle as well
                const mobileLanguageToggle = document.querySelector('.mobile-nav .language-dropdown .dropdown-toggle');
                if (mobileLanguageToggle) {
                    const textNode = Array.from(mobileLanguageToggle.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    if (textNode) {
                        textNode.textContent = lang.toUpperCase();
                    }
                }
            } catch (error) {
                handleError(error, 'switchLanguage');
            }
        }
    }

})();
