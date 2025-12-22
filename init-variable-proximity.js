import { VariableProximity } from './variable-proximity.js';

document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        new VariableProximity(line, {
            radius: 300, // Significantly increased radius for maximum visibility
            fromFontVariationSettings: "'wght' 400",
            toFontVariationSettings: "'wght' 900",
            falloff: 'gaussian'
        });
    });
    
    console.log('Variable Proximity Effect initialized on hero title');
});
