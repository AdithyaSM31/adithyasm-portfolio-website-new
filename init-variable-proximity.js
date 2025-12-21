import { VariableProximity } from './variable-proximity.js';

document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        new VariableProximity(line, {
            radius: 100,
            fromFontVariationSettings: "'wght' 600",
            toFontVariationSettings: "'wght' 1200",
            falloff: 'linear'
        });
    });
    
    console.log('Variable Proximity Effect initialized on hero title');
});
