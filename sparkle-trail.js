// Sparkle Mouse Trail Effect with Error Boundaries
// Add this script to any page for a magical sparkle trail with performance adaptation

(function() {
    'use strict';
    
    // Global error handler for sparkle effects
    function handleSparkleError(error, context) {
        console.warn(`Sparkle effect error in ${context}:`, error);
        
        // Disable sparkles on critical errors to prevent cascading failures
        if (error.name === 'ReferenceError' || error.name === 'TypeError') {
            console.warn('Disabling sparkle effects due to critical error');
            document.removeEventListener('mousemove', createSparkleTrail);
            return false;
        }
        
        // For other errors, attempt graceful continuation
        return true;
    }
    
    // Check if browser supports required features
    function checkBrowserSupport() {
        try {
            return !!(
                document.createElement &&
                document.addEventListener &&
                requestAnimationFrame &&
                setTimeout &&
                Date.now
            );
        } catch (error) {
            handleSparkleError(error, 'browser support check');
            return false;
        }
    }
    
    // Early exit if browser doesn't support required features
    if (!checkBrowserSupport()) {
        console.info('Sparkle effects disabled: browser does not support required features');
        return;
    }

    let sparkleCount = 0;
    let lastSparkleTime = 0;
    let sparkleDelay = 30; // Base delay (30ms = maximum sparkles)
    let performanceTier = 'high'; // Will be determined by device capabilities
    let maxSparkles = 50; // Maximum sparkles on screen at once

    // Performance detection and adaptive settings
    function detectPerformance() {
        try {
            const userAgent = navigator.userAgent.toLowerCase();
            const hardwareConcurrency = navigator.hardwareConcurrency || 2;
            const deviceMemory = navigator.deviceMemory || 2; // GB, if available
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            // Check for mobile devices (generally less powerful)
            const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            
            // Check for older/low-end devices
            const isOldDevice = /windows phone|iemobile|wpdesktop/i.test(userAgent) || 
                               (isMobile && (hardwareConcurrency <= 2 || deviceMemory <= 2));
            
            // Performance scoring (0-100)
            let score = 50; // Base score
            
            // Hardware scoring
            score += Math.min(hardwareConcurrency * 8, 32); // +8 per core, max +32
            score += Math.min((deviceMemory || 4) * 4, 20); // +4 per GB RAM, max +20
            
            // Network scoring (affects overall experience)
            if (connection) {
                const effectiveType = connection.effectiveType;
                if (effectiveType === '4g') score += 10;
                else if (effectiveType === '3g') score += 5;
                else if (effectiveType === '2g') score -= 10;
                else if (effectiveType === 'slow-2g') score -= 20;
            }
            
            // Device type penalties
            if (isMobile) score -= 15;
            if (isOldDevice) score -= 25;
            
            // Battery level consideration (if available)
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    try {
                        if (battery.level < 0.2) {
                            // Very low battery - reduce sparkles significantly
                            sparkleDelay = Math.max(sparkleDelay * 3, 150);
                            maxSparkles = Math.max(maxSparkles / 3, 10);
                        }
                    } catch (error) {
                        handleSparkleError(error, 'battery level check');
                    }
                }).catch(error => {
                    handleSparkleError(error, 'battery API access');
                });
            }
            
            // Determine performance tier and settings
            if (score >= 75) {
                performanceTier = 'high';
                sparkleDelay = 30; // Maximum sparkles (current amount)
                maxSparkles = 50;
            } else if (score >= 50) {
                performanceTier = 'medium';
                sparkleDelay = 60; // Half the sparkles
                maxSparkles = 30;
            } else if (score >= 25) {
                performanceTier = 'low';
                sparkleDelay = 120; // Quarter the sparkles
                maxSparkles = 15;
            } else {
                performanceTier = 'minimal';
                sparkleDelay = 200; // Minimal sparkles but never zero
                maxSparkles = 8;
            }
            
            console.log(`Sparkle performance tier: ${performanceTier} (score: ${score})`);
            console.log(`Sparkle settings: delay=${sparkleDelay}ms, max=${maxSparkles}`);
        } catch (error) {
            handleSparkleError(error, 'performance detection');
            // Fallback to safe defaults on error
            performanceTier = 'low';
            sparkleDelay = 120;
            maxSparkles = 15;
            console.log('Using fallback performance settings due to error');
        }
    }

    // Adaptive sparkle cleanup when limit is reached
    function cleanupSparkles() {
        try {
            if (sparkleCount > maxSparkles) {
                const sparkles = document.querySelectorAll('.sparkle-trail');
                const excessCount = sparkleCount - maxSparkles;
                
                // Remove oldest sparkles
                for (let i = 0; i < excessCount && i < sparkles.length; i++) {
                    if (sparkles[i] && sparkles[i].parentNode) {
                        sparkles[i].parentNode.removeChild(sparkles[i]);
                        sparkleCount--;
                    }
                }
            }
        } catch (error) {
            handleSparkleError(error, 'sparkle cleanup');
            // Reset count on error to prevent infinite buildup
            sparkleCount = 0;
        }
    }
    
    // Create sparkle trail on mouse movement
    function createSparkleTrail(e) {
        try {
            const currentTime = Date.now();
            
            // Throttle sparkle creation based on performance tier
            if (currentTime - lastSparkleTime < sparkleDelay) return;
            lastSparkleTime = currentTime;

            // Skip if we've hit the maximum sparkle count
            if (sparkleCount >= maxSparkles) {
                cleanupSparkles();
                return;
            }

            // Create sparkle element
            const sparkle = document.createElement('div');
            if (!sparkle) {
                throw new Error('Failed to create sparkle element');
            }
            
            sparkle.className = 'sparkle-trail';
            
            // Position sparkle at mouse location with some randomness
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            
            sparkle.style.left = (e.clientX + offsetX) + 'px';
            sparkle.style.top = (e.clientY + offsetY) + 'px';
            
            // Add random size variation (smaller on lower-end devices)
            const baseSize = performanceTier === 'minimal' ? 3 : 
                            performanceTier === 'low' ? 4 : 
                            performanceTier === 'medium' ? 6 : 8;
            const size = Math.random() * (baseSize - 2) + 3; // 3-6px to 3-8px range
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            
            // Add random animation duration (shorter on lower-end devices for better performance)
            const baseDuration = performanceTier === 'minimal' ? 800 : 
                                performanceTier === 'low' ? 1000 : 
                                performanceTier === 'medium' ? 1200 : 1500;
            const duration = Math.random() * 600 + baseDuration; // Variable duration based on performance
            sparkle.style.animationDuration = duration + 'ms';
            
            // Add to body
            if (!document.body) {
                throw new Error('Document body not available');
            }
            document.body.appendChild(sparkle);
            sparkleCount++;
            
            // Remove sparkle after animation completes
            setTimeout(() => {
                try {
                    if (sparkle && sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                        sparkleCount--;
                    }
                } catch (error) {
                    handleSparkleError(error, 'sparkle removal');
                }
            }, duration);
        } catch (error) {
            if (handleSparkleError(error, 'sparkle creation')) {
                // Continue with reduced functionality
                sparkleCount = Math.max(sparkleCount - 1, 0);
            }
        }
    }
    
    // Add event listener with error handling
    if (document.addEventListener) {
        document.addEventListener('mousemove', createSparkleTrail);
    }

    // Performance monitoring and dynamic adjustment
    let frameCount = 0;
    let lastFpsCheck = Date.now();
    let avgFps = 60;

    function monitorPerformance() {
        try {
            frameCount++;
            const now = Date.now();
            
            if (now - lastFpsCheck > 2000) { // Check every 2 seconds
                avgFps = (frameCount * 1000) / (now - lastFpsCheck);
                frameCount = 0;
                lastFpsCheck = now;
                
                // Dynamically adjust sparkles based on actual performance
                if (avgFps < 30 && performanceTier !== 'minimal') {
                    // Performance is poor, reduce sparkles
                    sparkleDelay = Math.min(sparkleDelay * 1.5, 200);
                    maxSparkles = Math.max(maxSparkles * 0.8, 8);
                    console.log('Performance adjustment: reduced sparkles due to low FPS');
                } else if (avgFps > 50 && sparkleDelay > 30) {
                    // Performance is good, can potentially increase sparkles slightly
                    sparkleDelay = Math.max(sparkleDelay * 0.9, 30);
                    maxSparkles = Math.min(maxSparkles * 1.1, 50);
                }
            }
            
            if (requestAnimationFrame) {
                requestAnimationFrame(monitorPerformance);
            }
        } catch (error) {
            handleSparkleError(error, 'performance monitoring');
            // Stop monitoring on critical error
        }
    }

    // Initialize sparkle styles when DOM is loaded
    function initializeSparkles() {
        try {
            // Detect device performance first
            detectPerformance();
            
            // Start performance monitoring
            if (requestAnimationFrame) {
                requestAnimationFrame(monitorPerformance);
            }
            
            // Add sparkle CSS if not already present
            if (!document.querySelector('#sparkle-trail-styles')) {
                const style = document.createElement('style');
                if (!style) {
                    throw new Error('Failed to create style element');
                }
                
                style.id = 'sparkle-trail-styles';
                style.textContent = `
                    .sparkle-trail {
                        position: fixed;
                        pointer-events: none;
                        z-index: 9999;
                        width: 8px;
                        height: 8px;
                        background: radial-gradient(circle, #ffffff 0%, #ffffff 30%, rgba(255,255,255,0.8) 60%, transparent 100%);
                        border-radius: 50%;
                        animation: sparkleTrailAnimation 1.5s ease-out forwards;
                        box-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6);
                        will-change: transform, opacity;
                    }

                    @keyframes sparkleTrailAnimation {
                        0% {
                            opacity: 1;
                            transform: scale(0) rotate(0deg);
                        }
                        50% {
                            opacity: 0.9;
                            transform: scale(1.2) rotate(180deg);
                        }
                        100% {
                            opacity: 0;
                            transform: scale(0.2) rotate(360deg);
                        }
                    }
                    
                    /* Reduced animation complexity for lower-end devices */
                    @media (max-width: 768px), (prefers-reduced-motion: reduce) {
                        .sparkle-trail {
                            animation: sparkleTrailAnimationSimple 1.2s ease-out forwards;
                            box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
                        }
                        
                        @keyframes sparkleTrailAnimationSimple {
                            0% {
                                opacity: 1;
                                transform: scale(0);
                            }
                            50% {
                                opacity: 0.8;
                                transform: scale(1);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(0.3);
                            }
                        }
                    }
                `;
                
                if (document.head) {
                    document.head.appendChild(style);
                } else {
                    throw new Error('Document head not available');
                }
            }
        } catch (error) {
            handleSparkleError(error, 'sparkle initialization');
            console.warn('Sparkle effects failed to initialize properly');
        }
    }
    
    // Pause sparkles when page is not visible (performance optimization)
    function handleVisibilityChange() {
        try {
            if (document.hidden) {
                // Page is not visible, clean up existing sparkles
                const sparkles = document.querySelectorAll('.sparkle-trail');
                sparkles.forEach(sparkle => {
                    if (sparkle && sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                });
                sparkleCount = 0;
            }
        } catch (error) {
            handleSparkleError(error, 'visibility change handling');
        }
    }
    
    // Initialize when DOM is ready
    if (document.addEventListener) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSparkles);
        } else {
            // DOM already loaded
            initializeSparkles();
        }
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
        // Fallback for older browsers
        console.warn('addEventListener not supported, sparkle effects disabled');
    }

})(); // Close IIFE