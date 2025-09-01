// Global Error Handler for Portfolio
// This script provides comprehensive error handling across the entire portfolio

(function() {
    'use strict';
    
    // Track error frequency to prevent spam
    const errorTracker = {
        count: 0,
        lastError: null,
        lastErrorTime: 0,
        maxErrors: 10, // Maximum errors before going silent
        cooldownPeriod: 5000 // 5 seconds between similar errors
    };
    
    // Graceful error reporting with throttling
    function reportError(error, context, details = {}) {
        const now = Date.now();
        const errorString = error.toString();
        
        // Prevent error spam
        if (errorTracker.count >= errorTracker.maxErrors) {
            return; // Silent mode after too many errors
        }
        
        // Throttle similar errors
        if (errorTracker.lastError === errorString && 
            now - errorTracker.lastErrorTime < errorTracker.cooldownPeriod) {
            return;
        }
        
        errorTracker.count++;
        errorTracker.lastError = errorString;
        errorTracker.lastErrorTime = now;
        
        // Log error with context
        console.group(`🚨 Portfolio Error [${context}]`);
        console.error('Error:', error);
        console.info('Context:', context);
        if (Object.keys(details).length > 0) {
            console.info('Details:', details);
        }
        console.info('Stack:', error.stack);
        console.groupEnd();
        
        // Show user-friendly notification for critical errors only
        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            showUserNotification('Some interactive features may not be working properly.');
        }
    }
    
    // Show subtle user notification
    function showUserNotification(message) {
        // Only show one notification at a time
        if (document.querySelector('.error-notification')) {
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 193, 7, 0.9);
            color: #000;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 193, 7, 0.3);
            transition: opacity 0.3s ease-in-out;
        `;
        notification.textContent = message;
        
        if (document.body) {
            document.body.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    
    // Global JavaScript error handler
    window.addEventListener('error', function(event) {
        const error = event.error || new Error(event.message);
        const context = 'Global Error';
        const details = {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            source: event.target && event.target.tagName ? event.target.tagName : 'Unknown'
        };
        
        reportError(error, context, details);
        
        // Prevent default browser error handling for cleaner UX
        event.preventDefault();
        return true;
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason instanceof Error ? event.reason : new Error(event.reason);
        const context = 'Unhandled Promise Rejection';
        
        reportError(error, context);
        
        // Prevent default browser handling
        event.preventDefault();
    });
    
    // Resource loading error handler
    window.addEventListener('error', function(event) {
        // Handle resource loading errors (images, scripts, etc.)
        if (event.target && event.target !== window) {
            const element = event.target;
            const context = 'Resource Loading Error';
            const details = {
                tagName: element.tagName,
                src: element.src || element.href,
                id: element.id,
                className: element.className
            };
            
            const error = new Error(`Failed to load ${element.tagName}: ${element.src || element.href}`);
            reportError(error, context, details);
            
            // Provide fallbacks for specific resources
            handleResourceError(element);
        }
    }, true); // Use capture phase for resource errors
    
    // Handle specific resource errors with fallbacks
    function handleResourceError(element) {
        try {
            switch (element.tagName.toLowerCase()) {
                case 'img':
                    // Replace broken images with placeholder
                    element.style.cssText = `
                        display: inline-block;
                        width: ${element.width || 200}px;
                        height: ${element.height || 150}px;
                        background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
                        border: 2px dashed #ccc;
                        border-radius: 8px;
                        position: relative;
                    `;
                    element.alt = element.alt || 'Image not available';
                    element.title = 'Image failed to load: ' + (element.src || 'Unknown source');
                    break;
                    
                case 'video':
                    // Hide broken videos or show message
                    const videoError = document.createElement('div');
                    videoError.className = 'video-error-placeholder';
                    videoError.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f8f9fa;
                        border: 2px dashed #dee2e6;
                        border-radius: 8px;
                        padding: 20px;
                        color: #6c757d;
                        font-size: 14px;
                        text-align: center;
                        min-height: 200px;
                    `;
                    videoError.textContent = 'Video content is temporarily unavailable';
                    
                    if (element.parentNode) {
                        element.parentNode.insertBefore(videoError, element);
                        element.style.display = 'none';
                    }
                    break;
                    
                case 'script':
                    // Log script failures
                    console.warn(`Script failed to load: ${element.src}`);
                    break;
                    
                case 'link':
                    // Handle CSS loading failures
                    if (element.rel === 'stylesheet') {
                        console.warn(`Stylesheet failed to load: ${element.href}`);
                    }
                    break;
            }
        } catch (fallbackError) {
            console.warn('Error in resource fallback handling:', fallbackError);
        }
    }
    
    // Progressive enhancement checker
    function checkCriticalFeatures() {
        const criticalFeatures = [
            { name: 'CSS Support', test: () => !!window.getComputedStyle },
            { name: 'DOM Manipulation', test: () => !!document.createElement },
            { name: 'Event Handling', test: () => !!document.addEventListener },
            { name: 'Modern JavaScript', test: () => !!window.Promise },
            { name: 'Local Storage', test: () => !!window.localStorage }
        ];
        
        const failedFeatures = criticalFeatures.filter(feature => {
            try {
                return !feature.test();
            } catch (error) {
                return true;
            }
        });
        
        if (failedFeatures.length > 0) {
            console.warn('Some browser features are not supported:', failedFeatures.map(f => f.name));
            
            // Show compatibility notice for old browsers
            if (failedFeatures.length >= 3) {
                showUserNotification('Your browser may not support all features of this portfolio.');
            }
        }
    }
    
    // Initialize error handling
    function initialize() {
        try {
            // Check critical browser features
            checkCriticalFeatures();
            
            // Reset error tracker on page load
            errorTracker.count = 0;
            errorTracker.lastError = null;
            
            console.info('🛡️ Global error handling initialized');
            
            // Periodic error tracker reset (prevent permanent silence)
            setInterval(() => {
                if (errorTracker.count > 0) {
                    errorTracker.count = Math.max(0, errorTracker.count - 1);
                }
            }, 30000); // Reduce error count every 30 seconds
            
        } catch (error) {
            console.error('Failed to initialize global error handling:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Expose error reporting function globally for other scripts
    window.portfolioErrorHandler = {
        report: reportError,
        showNotification: showUserNotification
    };

})();
