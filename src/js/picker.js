'use strict';

// Color scheme matching the reference image
// Purple for digits 1-4 (stroke numerals) and 19 (max digit = 15+4),
// cyan for multiples of 5 (5, 10, 15), dark gray for 0 and other composites (6-9, 11-14, 16-18)
const DIGIT_COLORS = {
    0:  '#595959',
    1:  '#9e2194', 2: '#9e2194', 3: '#9e2194', 4: '#9e2194',
    5:  '#00a1a4',
    6:  '#595959', 7: '#595959', 8: '#595959', 9: '#595959',
    10: '#00a1a4',
    11: '#595959', 12: '#595959', 13: '#595959', 14: '#595959',
    15: '#00a1a4',
    16: '#595959', 17: '#595959', 18: '#595959',
    19: '#9e2194'
};

const svgCache = {};
let selectedDigits = [];

function getDigitColor(digit) {
    return DIGIT_COLORS[digit] !== undefined ? DIGIT_COLORS[digit] : '#595959';
}

async function loadAllSVGs() {
    const fetches = Array.from({ length: 20 }, (_, i) =>
        fetch(`images/digits/Kaktovik_digit_${i}.svg`)
            .then(r => {
                if (!r.ok) throw new Error(`Failed to load digit ${i}: ${r.status}`);
                return r.text();
            })
            .then(text => { svgCache[i] = text; })
            .catch(err => console.error(err))
    );
    await Promise.all(fetches);
}

function createDigitSVG(digit) {
    if (!svgCache[digit]) {
        // Fallback: return an empty SVG placeholder if the file failed to load
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 30 53');
        svg.setAttribute('aria-hidden', 'true');
        return svg;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCache[digit], 'image/svg+xml');
    const orig = doc.documentElement;
    const w = parseFloat(orig.getAttribute('width'));
    const h = parseFloat(orig.getAttribute('height'));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('aria-hidden', 'true');

    const color = getDigitColor(digit);
    const paths = orig.getElementsByTagName('path');
    for (const path of paths) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', path.getAttribute('d'));
        p.setAttribute('fill', color);
        svg.appendChild(p);
    }

    return svg;
}

function renderGrid() {
    const grid = document.getElementById('digit-grid');
    grid.innerHTML = '';

    for (let row = 0; row < 4; row++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'digit-row';

        for (let col = 0; col < 5; col++) {
            const digit = row * 5 + col;
            const btn = document.createElement('button');
            btn.className = 'digit-cell';
            btn.setAttribute('data-digit', String(digit));
            btn.setAttribute('aria-label', `Add digit ${digit}`);
            btn.addEventListener('click', () => addDigit(digit));

            const svgEl = createDigitSVG(digit);
            svgEl.classList.add('digit-svg');
            btn.appendChild(svgEl);

            const label = document.createElement('span');
            label.className = 'digit-label';
            label.textContent = String(digit);
            btn.appendChild(label);

            rowEl.appendChild(btn);
        }

        grid.appendChild(rowEl);
    }
}

function addDigit(digit) {
    selectedDigits.push(digit);
    // Remove leading zeros
    while (selectedDigits.length > 1 && selectedDigits[0] === 0) {
        selectedDigits.shift();
    }
    updateDisplay();
}

function pickerBackspace() {
    selectedDigits.pop();
    updateDisplay();
}

function pickerClear() {
    selectedDigits = [];
    updateDisplay();
}

function digitsToDecimal() {
    return selectedDigits.reduce((acc, d) => acc * 20 + d, 0);
}

function updateDisplay() {
    document.getElementById('decimal-display').textContent =
        digitsToDecimal().toLocaleString();

    const display = document.getElementById('kaktovik-display');
    display.innerHTML = '';

    const toShow = selectedDigits.length > 0 ? selectedDigits : [0];
    for (const digit of toShow) {
        const span = document.createElement('span');
        span.className = 'display-digit-wrapper';
        const svgEl = createDigitSVG(digit);
        svgEl.classList.add('display-svg');
        span.appendChild(svgEl);
        display.appendChild(span);
    }
}

(async () => {
    document.getElementById('btn-backspace').addEventListener('click', pickerBackspace);
    document.getElementById('btn-clear').addEventListener('click', pickerClear);
    await loadAllSVGs();
    renderGrid();
    updateDisplay();
})();
