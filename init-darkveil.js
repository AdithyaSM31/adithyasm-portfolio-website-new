import { DarkVeil } from './darkveil.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        console.log('Initializing DarkVeil background...');
        new DarkVeil(canvas, {
            speed: 2, // Adjust speed as needed
            warpAmount: 5,
            resolutionScale: 1
        });
    } else {
        console.error('DarkVeil: Canvas element #space-canvas not found');
    }
});
