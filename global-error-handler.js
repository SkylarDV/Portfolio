(function() {
    'use strict';
    const errorTracker = {
        count: 0,
        lastError: null,
        lastErrorTime: 0,
        maxErrors: 10,
        cooldownPeriod: 5000
    };
    function reportError(error, context, details = {}) {
        const now = Date.now();
        const errorString = error.toString();
        if (errorTracker.count >= errorTracker.maxErrors) {
            return;
        }
        if (errorTracker.lastError === errorString &&
            now - errorTracker.lastErrorTime < errorTracker.cooldownPeriod) {
            return;
        }
        errorTracker.count++;
        errorTracker.lastError = errorString;
        errorTracker.lastErrorTime = now;
        console.group(`🚨 Portfolio Error [${context}]`);
        console.error('Error:', error);
        console.info('Context:', context);
        if (Object.keys(details).length > 0) {
            console.info('Details:', details);
        }
        console.info('Stack:', error.stack);
        console.groupEnd();
    }
    function showUserNotification(message) {
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
        event.preventDefault();
        return true;
    });
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason instanceof Error ? event.reason : new Error(event.reason);
        const context = 'Unhandled Promise Rejection';
        reportError(error, context);
        event.preventDefault();
    });
    window.addEventListener('error', function(event) {
        if (event.target && event.target !== window) {
            const element = event.target;
            const context = 'Resource Loading Error';
            const details = {
                tagName: element.tagName,
                src: element.src || element.href,
                id: element.id,
                className: element.className
            };
            
            // Handle resource errors more gracefully - don't treat network failures as critical errors
            if (element.tagName.toLowerCase() === 'img') {
                console.warn(`Image failed to load: ${element.src || element.href}`, details);
                handleResourceError(element);
                return;
            }
            
            const error = new Error(`Failed to load ${element.tagName}: ${element.src || element.href}`);
            reportError(error, context, details);
            handleResourceError(element);
        }
    }, true);
    function handleResourceError(element) {
        try {
            switch (element.tagName.toLowerCase()) {
                case 'img':
                    const isGif = element.src && element.src.toLowerCase().includes('.gif');
                    const fallbackWidth = element.width || element.offsetWidth || 400;
                    const fallbackHeight = element.height || element.offsetHeight || 300;
                    
                    // Create a more informative placeholder
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = `
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: ${fallbackWidth}px;
                        height: ${fallbackHeight}px;
                        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                        border: 2px dashed #adb5bd;
                        border-radius: 12px;
                        color: #6c757d;
                        font-family: system-ui, -apple-system, sans-serif;
                        font-size: 14px;
                        text-align: center;
                        flex-direction: column;
                        gap: 8px;
                        position: relative;
                    `;
                    
                    const icon = isGif ? '🎬' : '🖼️';
                    const message = isGif ? 'Animation temporarily\nunavailable' : 'Image temporarily\nunavailable';
                    
                    placeholder.innerHTML = `
                        <div style="font-size: 24px;">${icon}</div>
                        <div style="line-height: 1.4; white-space: pre-line;">${message}</div>
                    `;
                    
                    // Replace the broken image with the placeholder
                    if (element.parentNode) {
                        element.parentNode.insertBefore(placeholder, element);
                        element.style.display = 'none';
                    }
                    
                    element.alt = element.alt || 'Content not available';
                    element.title = 'Resource failed to load: ' + (element.src || 'Unknown source');
                    break;
                case 'video':
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
                    console.warn(`Script failed to load: ${element.src}`);
                    break;
                case 'link':
                    if (element.rel === 'stylesheet') {
                        console.warn(`Stylesheet failed to load: ${element.href}`);
                    }
                    break;
            }
        } catch (fallbackError) {
            console.warn('Error in resource fallback handling:', fallbackError);
        }
    }
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
            if (failedFeatures.length >= 3) {
                showUserNotification('Your browser may not support all features of this portfolio.');
            }
        }
    }
    function initialize() {
        try {
            checkCriticalFeatures();
            errorTracker.count = 0;
            errorTracker.lastError = null;
            console.info('🛡️ Global error handling initialized');
            setInterval(() => {
                if (errorTracker.count > 0) {
                    errorTracker.count = Math.max(0, errorTracker.count - 1);
                }
            }, 30000);
        } catch (error) {
            console.error('Failed to initialize global error handling:', error);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    window.portfolioErrorHandler = {
        report: reportError,
        showNotification: showUserNotification
    };
    // Add this function to filter out non-critical errors
    function shouldReportError(error, source) {
        // Don't report Google Analytics errors (user might have ad blockers)
        if (source && source.includes('googletagmanager')) {
            return false;
        }
        
        // Don't report external CDN errors
        if (source && (source.includes('cdnjs.cloudflare.com') || 
                       source.includes('googleapis.com') ||
                       source.includes('gstatic.com'))) {
            return false;
        }
        
        // Don't report network errors from browser extensions
        if (error.message && error.message.includes('Extension context invalidated')) {
            return false;
        }
        
        return true;
    }
    // Update your error handler to use this filter
    window.addEventListener('error', function(event) {
        if (!shouldReportError(event.error, event.filename)) {
            return; // Silently ignore
        }
        
        const error = event.error || new Error(event.message);
        const context = 'Global Error';
        const details = {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            source: event.target && event.target.tagName ? event.target.tagName : 'Unknown'
        };
        reportError(error, context, details);
        event.preventDefault();
        return true;
    });
    window.addEventListener('error', function(event) {
        if (event.target && event.target.tagName === 'SCRIPT') {
            if (!shouldReportError(event.error, event.target.src)) {
                console.info(`External script blocked: ${event.target.src}`);
                return;
            }
        }
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
            handleResourceError(element);
        }
    }, true);
})();