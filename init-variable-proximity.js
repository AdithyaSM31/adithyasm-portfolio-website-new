import { VariableProximity } from './variable-proximity.js';

document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        new VariableProximity(line, {
            radius: 150,
            fromFontVariationSettings: "'wght' 100", // Ultra Thin
            toFontVariationSettings: "'wght' 1000",  // Ultra Black
            falloff: 'gaussian'
        });
    });
    
    console.log('Variable Proximity Effect initialized on hero title');
});
