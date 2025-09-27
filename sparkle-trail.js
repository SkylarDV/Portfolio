(function() {
    'use strict';
    function handleSparkleError(error, context) {
        console.warn(`Sparkle effect error in ${context}:`, error);
        if (error.name === 'ReferenceError' || error.name === 'TypeError') {
            console.warn('Disabling sparkle effects due to critical error');
            document.removeEventListener('mousemove', createSparkleTrail);
            return false;
        }
        return true;
    }
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
    if (!checkBrowserSupport()) {
        console.info('Sparkle effects disabled: browser does not support required features');
        return;
    }
    let sparkleCount = 0;
    let lastSparkleTime = 0;
    let sparkleDelay = 30;
    let performanceTier = 'high';
    let maxSparkles = 50;
    function detectPerformance() {
        try {
            const userAgent = navigator.userAgent.toLowerCase();
            const hardwareConcurrency = navigator.hardwareConcurrency || 2;
            const deviceMemory = navigator.deviceMemory || 2;
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isOldDevice = /windows phone|iemobile|wpdesktop/i.test(userAgent) ||
                               (isMobile && (hardwareConcurrency <= 2 || deviceMemory <= 2));
            let score = 50;
            score += Math.min(hardwareConcurrency * 8, 32);
            score += Math.min((deviceMemory || 4) * 4, 20);
            if (connection) {
                const effectiveType = connection.effectiveType;
                if (effectiveType === '4g') score += 10;
                else if (effectiveType === '3g') score += 5;
                else if (effectiveType === '2g') score -= 10;
                else if (effectiveType === 'slow-2g') score -= 20;
            }
            if (isMobile) score -= 15;
            if (isOldDevice) score -= 25;
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    try {
                        if (battery.level < 0.2) {
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
            if (score >= 75) {
                performanceTier = 'high';
                sparkleDelay = 30;
                maxSparkles = 50;
            } else if (score >= 50) {
                performanceTier = 'medium';
                sparkleDelay = 60;
                maxSparkles = 30;
            } else if (score >= 25) {
                performanceTier = 'low';
                sparkleDelay = 120;
                maxSparkles = 15;
            } else {
                performanceTier = 'minimal';
                sparkleDelay = 200;
                maxSparkles = 8;
            }
            console.log(`Sparkle performance tier: ${performanceTier} (score: ${score})`);
            console.log(`Sparkle settings: delay=${sparkleDelay}ms, max=${maxSparkles}`);
        } catch (error) {
            handleSparkleError(error, 'performance detection');
            performanceTier = 'low';
            sparkleDelay = 120;
            maxSparkles = 15;
            console.log('Using fallback performance settings due to error');
        }
    }
    function cleanupSparkles() {
        try {
            if (sparkleCount > maxSparkles) {
                const sparkles = document.querySelectorAll('.sparkle-trail');
                const excessCount = sparkleCount - maxSparkles;
                for (let i = 0; i < excessCount && i < sparkles.length; i++) {
                    if (sparkles[i] && sparkles[i].parentNode) {
                        sparkles[i].parentNode.removeChild(sparkles[i]);
                        sparkleCount--;
                    }
                }
            }
        } catch (error) {
            handleSparkleError(error, 'sparkle cleanup');
            sparkleCount = 0;
        }
    }
    // Cache mouse position and use it without reading layout
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        // Store position without reading layout
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function createSparkle() {
        requestAnimationFrame(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Use cached position instead of reading getBoundingClientRect()
            sparkle.style.left = mouseX + 'px';
            sparkle.style.top = mouseY + 'px';
            sparkle.style.transform = 'translate(-50%, -50%)';
            
            document.body.appendChild(sparkle);
            
            // Remove after animation using timeout instead of reading animation state
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1000);
        });
    }

    function createSparkleTrail(e) {
        try {
            const currentTime = Date.now();
            if (currentTime - lastSparkleTime < sparkleDelay) return;
            lastSparkleTime = currentTime;
            if (sparkleCount >= maxSparkles) {
                cleanupSparkles();
                return;
            }
            const sparkle = document.createElement('div');
            if (!sparkle) {
                throw new Error('Failed to create sparkle element');
            }
            sparkle.className = 'sparkle-trail';
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            sparkle.style.left = (e.clientX + offsetX) + 'px';
            sparkle.style.top = (e.clientY + offsetY) + 'px';
            const baseSize = performanceTier === 'minimal' ? 3 :
                            performanceTier === 'low' ? 4 :
                            performanceTier === 'medium' ? 6 : 8;
            const size = Math.random() * (baseSize - 2) + 3;
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            const baseDuration = performanceTier === 'minimal' ? 800 :
                                performanceTier === 'low' ? 1000 :
                                performanceTier === 'medium' ? 1200 : 1500;
            const duration = Math.random() * 600 + baseDuration;
            sparkle.style.animationDuration = duration + 'ms';
            if (!document.body) {
                throw new Error('Document body not available');
            }
            document.body.appendChild(sparkle);
            sparkleCount++;
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
                sparkleCount = Math.max(sparkleCount - 1, 0);
            }
        }
    }
    if (document.addEventListener) {
        document.addEventListener('mousemove', createSparkleTrail, { passive: true });
    }
    let frameCount = 0;
    let lastFpsCheck = Date.now();
    let avgFps = 60;
    function monitorPerformance() {
        try {
            frameCount++;
            const now = Date.now();
            if (now - lastFpsCheck > 2000) {
                avgFps = (frameCount * 1000) / (now - lastFpsCheck);
                frameCount = 0;
                lastFpsCheck = now;
                if (avgFps < 30 && performanceTier !== 'minimal') {
                    sparkleDelay = Math.min(sparkleDelay * 1.5, 200);
                    maxSparkles = Math.max(maxSparkles * 0.8, 8);
                    console.log('Performance adjustment: reduced sparkles due to low FPS');
                } else if (avgFps > 50 && sparkleDelay > 30) {
                    sparkleDelay = Math.max(sparkleDelay * 0.9, 30);
                    maxSparkles = Math.min(maxSparkles * 1.1, 50);
                }
            }
            if (requestAnimationFrame) {
                requestAnimationFrame(monitorPerformance);
            }
        } catch (error) {
            handleSparkleError(error, 'performance monitoring');
        }
    }
    function initializeSparkles() {
        try {
            detectPerformance();
            if (requestAnimationFrame) {
                requestAnimationFrame(monitorPerformance);
            }
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
    function handleVisibilityChange() {
        try {
            if (document.hidden) {
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
    if (document.addEventListener) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSparkles);
        } else {
            initializeSparkles();
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
        console.warn('addEventListener not supported, sparkle effects disabled');
    }
})();