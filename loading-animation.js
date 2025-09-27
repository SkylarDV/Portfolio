document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const startTime = Date.now();
    const minimumLoadTime = 2500;
    let pageLoaded = false;
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.visibility = 'visible';
        loadingOverlay.style.display = 'flex';
    }
    window.addEventListener('load', function() {
        pageLoaded = true;
        checkAndHideLoading();
    });
    setTimeout(function() {
        hideLoadingAnimation();
    }, 5000);
    function checkAndHideLoading() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumLoadTime - elapsedTime;
        if (remainingTime > 0) {
            setTimeout(hideLoadingAnimation, remainingTime);
        } else {
            hideLoadingAnimation();
        }
    }
    function hideLoadingAnimation() {
        if (loadingOverlay && loadingOverlay.style.opacity !== '0') {
            console.log('Starting loading screen fade-out...');
            const loadingCircle = loadingOverlay.querySelector('.loading-circle');
            if (loadingCircle) {
                loadingCircle.style.transition = 'opacity 0.3s ease-out';
                loadingCircle.style.opacity = '0';
            }
            setTimeout(() => {
                loadingOverlay.style.transition = 'opacity 0.8s ease-out';
                loadingOverlay.style.opacity = '0';
                setTimeout(function() {
                    console.log('Removing loading screen from DOM...');
                    if (loadingOverlay.parentNode) {
                        loadingOverlay.parentNode.removeChild(loadingOverlay);
                    }
                }, 800);
            }, 200);
        }
    }

    // Batch DOM reads and writes
    function updateLoadingProgress() {
        // Batch all DOM reads first
        const overlay = document.getElementById('loading-overlay');
        const progressCircle = document.querySelector('.progress-ring-circle');
        
        // Use requestAnimationFrame to avoid forced reflow
        requestAnimationFrame(() => {
            // Batch all DOM writes together
            if (progressCircle) {
                const circumference = 2 * Math.PI * 78;
                const offset = circumference - (progress / 100 * circumference);
                progressCircle.style.strokeDashoffset = offset;
            }
            
            if (progress >= 100 && overlay) {
                // Use CSS transitions instead of reading layout properties
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(0.8)';
                
                // Clean removal after transition
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        });
    }
});