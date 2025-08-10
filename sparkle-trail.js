// Sparkle Mouse Trail Effect
// Add this script to any page for a magical sparkle trail

let sparkleCount = 0;
let lastSparkleTime = 0;
const sparkleDelay = 30; // Milliseconds between sparkles (lower = more frequent)

// Create sparkle trail on mouse movement
document.addEventListener('mousemove', function(e) {
    const currentTime = Date.now();
    
    // Throttle sparkle creation for smooth effect
    if (currentTime - lastSparkleTime < sparkleDelay) return;
    lastSparkleTime = currentTime;

    // Create sparkle element
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    
    // Position sparkle at mouse location with some randomness
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    
    sparkle.style.left = (e.clientX + offsetX) + 'px';
    sparkle.style.top = (e.clientY + offsetY) + 'px';
    
    // Add random size variation
    const size = Math.random() * 6 + 4; // 4-10px
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    
    // Add random animation duration for variety
    const duration = Math.random() * 800 + 1000; // 1000-1800ms
    sparkle.style.animationDuration = duration + 'ms';
    
    // Add to body
    document.body.appendChild(sparkle);
    sparkleCount++;
    
    // Remove sparkle after animation completes
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
            sparkleCount--;
        }
    }, duration);
});

// Initialize sparkle styles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add sparkle CSS if not already present
    if (!document.querySelector('#sparkle-trail-styles')) {
        const style = document.createElement('style');
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
        `;
        document.head.appendChild(style);
    }
});
