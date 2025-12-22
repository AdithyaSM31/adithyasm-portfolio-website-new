import { VariableProximity } from './variable-proximity.js';

document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        new VariableProximity(line, {
            radius: 150, // Increased radius for better visibility
            fromFontVariationSettings: "'wght' 400", // Start at regular weight
            toFontVariationSettings: "'wght' 900",   // Go to maximum bold weight
            falloff: 'gaussian' // Smoother transition
        });
    });
    
    console.log('Variable Proximity Effect initialized on hero title');
});
