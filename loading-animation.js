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
});