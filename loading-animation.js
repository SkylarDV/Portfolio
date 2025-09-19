// Loading Animation Controller
document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const startTime = Date.now();
    const minimumLoadTime = 2500; // 2.5 seconds to ensure circle animation completes
    let pageLoaded = false;
    
    // Ensure the loading overlay is visible initially
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.visibility = 'visible';
        loadingOverlay.style.display = 'flex';
    }
    
    // Hide loading animation when window is fully loaded
    window.addEventListener('load', function() {
        pageLoaded = true;
        checkAndHideLoading();
    });
    
    // Fallback: Hide loading animation after maximum 5 seconds
    setTimeout(function() {
        hideLoadingAnimation();
    }, 5000);
    
    function checkAndHideLoading() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumLoadTime - elapsedTime;
        
        if (remainingTime > 0) {
            // Wait for the remaining time to reach minimum display duration
            setTimeout(hideLoadingAnimation, remainingTime);
        } else {
            // Minimum time has passed, hide immediately
            hideLoadingAnimation();
        }
    }
    
    function hideLoadingAnimation() {
        if (loadingOverlay && loadingOverlay.style.opacity !== '0') {
            console.log('Starting loading screen fade-out...');
            
            // First, fade out the loading circle elements
            const loadingCircle = loadingOverlay.querySelector('.loading-circle');
            if (loadingCircle) {
                loadingCircle.style.transition = 'opacity 0.3s ease-out';
                loadingCircle.style.opacity = '0';
            }
            
            // Then fade out the background overlay after a short delay
            setTimeout(() => {
                loadingOverlay.style.transition = 'opacity 0.8s ease-out';
                loadingOverlay.style.opacity = '0';
                
                // Remove the overlay from DOM after transition completes
                setTimeout(function() {
                    console.log('Removing loading screen from DOM...');
                    if (loadingOverlay.parentNode) {
                        loadingOverlay.parentNode.removeChild(loadingOverlay);
                    }
                }, 800); // Match the background fade duration
            }, 200); // Small delay before background starts fading
        }
    }
});