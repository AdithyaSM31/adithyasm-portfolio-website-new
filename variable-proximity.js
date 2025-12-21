export class VariableProximity {
    constructor(container, options = {}) {
        this.container = container;
        this.label = options.label || container.textContent.trim();
        this.fromSettings = options.fromFontVariationSettings || "'wght' 400, 'opsz' 9";
        this.toSettings = options.toFontVariationSettings || "'wght' 1000, 'opsz' 40";
        this.radius = options.radius || 100;
        this.falloff = options.falloff || 'linear';

        this.letterRefs = [];
        this.mousePosition = { x: -1000, y: -1000 };
        this.animationId = null;

        this.init();
    }

    init() {
        this.setupDOM();
        this.parsedSettings = this.parseSettingsRange();

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.animate = this.animate.bind(this);

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        this.animate();
    }

    setupDOM() {
        this.container.innerHTML = '';
        this.container.classList.add('variable-proximity');
        this.container.setAttribute('aria-label', this.label);
        this.container.style.position = 'relative';

        const words = this.label.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'variable-proximity-word';

            word.split('').forEach(char => {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'variable-proximity-letter';
                letterSpan.textContent = char;
                letterSpan.style.fontVariationSettings = this.fromSettings;
                this.letterRefs.push(letterSpan);
                wordSpan.appendChild(letterSpan);
            });

            this.container.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.style.display = 'inline-block';
                space.innerHTML = '&nbsp;';
                this.container.appendChild(space);
            }
        });
    }

    parseSettingsRange() {
        const parse = (str) => new Map(str.split(',').map(s => {
            const parts = s.trim().split(' ');
            return [parts[0].replace(/['"]/g, ''), parseFloat(parts[1])];
        }));

        const from = parse(this.fromSettings);
        const to = parse(this.toSettings);

        return Array.from(from.entries()).map(([axis, fromValue]) => ({
            axis,
            fromValue,
            toValue: to.get(axis) ?? fromValue
        }));
    }

    handleMouseMove(e) {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.mousePosition.x = e.touches[0].clientX;
            this.mousePosition.y = e.touches[0].clientY;
        }
    }

    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    calculateFalloff(distance) {
        const norm = Math.min(Math.max(1 - distance / this.radius, 0), 1);
        switch (this.falloff) {
            case 'exponential': return norm ** 2;
            case 'gaussian': return Math.exp(-((distance / (this.radius / 2)) ** 2) / 2);
            case 'linear': default: return norm;
        }
    }

    animate() {
        this.letterRefs.forEach(letter => {
            const rect = letter.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            const distance = this.calculateDistance(
                this.mousePosition.x,
                this.mousePosition.y,
                letterCenterX,
                letterCenterY
            );

            if (distance >= this.radius) {
                if (letter.style.fontVariationSettings !== this.fromSettings) {
                    letter.style.fontVariationSettings = this.fromSettings;
                }
                return;
            }

            const falloffValue = this.calculateFalloff(distance);
            const newSettings = this.parsedSettings.map(({ axis, fromValue, toValue }) => {
                const val = fromValue + (toValue - fromValue) * falloffValue;
                return `'${axis}' ${val}`;
            }).join(', ');

            letter.style.fontVariationSettings = newSettings;
        });

        this.animationId = requestAnimationFrame(this.animate);
    }

    destroy() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        cancelAnimationFrame(this.animationId);
    }
}
