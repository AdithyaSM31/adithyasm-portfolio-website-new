import { VariableProximity } from './variable-proximity.js';

document.addEventListener('DOMContentLoaded', () => {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        new VariableProximity(line, {
            radius: 150,
            fromFontVariationSettings: "'wght' 400",
            toFontVariationSettings: "'wght' 900",
            falloff: 'gaussian'
        });
    });
    
    console.log('Variable Proximity Effect initialized on hero title');
});
