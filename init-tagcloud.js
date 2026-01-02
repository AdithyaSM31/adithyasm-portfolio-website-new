document.addEventListener('DOMContentLoaded', () => {
    
    function initTagCanvas() {
        try {
            if (!window.TagCanvas) {
                console.warn('TagCanvas not loaded yet, retrying...');
                setTimeout(initTagCanvas, 500);
                return;
            }

            const canvasId = 'icon-cloud-canvas';
            const tagsId = 'icon-tags';
            const container = document.querySelector('.tagcloud-wrap');

            if (!container) {
                console.error('TagCloud container not found');
                return;
            }

            // Function to resize canvas
            function resizeCanvas() {
                const canvas = document.getElementById(canvasId);
                if (canvas && container) {
                    const width = container.offsetWidth;
                    const height = container.offsetHeight || width; // Square if height not set
                    
                    // Limit max size
                    const size = Math.min(width, height, 600);
                    
                    canvas.width = size;
                    canvas.height = size;
                    
                    // Restart TagCanvas after resize
                    TagCanvas.Start(canvasId, tagsId, getOptions());
                }
            }

            // Configuration options
            function getOptions() {
                return {
                    textColour: null, // Disable text colour
                    outlineColour: 'transparent',
                    reverse: true,
                    depth: 0.8,
                    maxSpeed: 0.05,
                    initial: [0.1, -0.1],
                    wheelZoom: false,
                    fadeIn: 1000,
                    tooltip: null, // Disable default tooltip for cleaner look
                    freezeActive: true,
                    shuffleTags: true,
                    shape: 'sphere',
                    noSelect: true,
                    imageScale: 0.25, // Scale images down significantly
                    imageMode: 'image', // Force image mode
                    frontSelect: true,
                    lock: null
                };
            }

            // Initial start
            resizeCanvas();
            console.log('TagCanvas initialized');

            // Handle resize with debounce
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(resizeCanvas, 250);
            });

        } catch (e) {
            console.error('TagCanvas error:', e);
        }
    }

    // Start initialization
    initTagCanvas();
});
