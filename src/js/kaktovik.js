// Kaktovik Numeral Arithmetic Operations
// Kaktovik numerals are base-20 (vigesimal)
// Unicode code points: U+1D2C0 (0) through U+1D2D3 (19)

const KAKTOVIK_BASE = 20;
const KAKTOVIK_CODE_POINT_START = 0x1D2C0;

/**
 * Convert a single digit (0-19) to its Kaktovik Unicode character
 * @param {number} digit - Integer 0-19
 * @returns {string} Kaktovik character
 */
function digitToKaktovik(digit) {
    if (digit < 0 || digit >= KAKTOVIK_BASE) throw new Error(`Digit must be 0-19, got ${digit}`);
    return String.fromCodePoint(KAKTOVIK_CODE_POINT_START + digit);
}

/**
 * Convert a non-negative decimal integer to its Kaktovik numeral string
 * @param {number} n - Non-negative integer
 * @returns {string} Kaktovik numeral string
 */
function numberToKaktovik(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error('Input must be a non-negative integer');
    if (n === 0) return String.fromCodePoint(KAKTOVIK_CODE_POINT_START);
    const digits = [];
    let num = n;
    while (num > 0) {
        digits.unshift(num % KAKTOVIK_BASE);
        num = Math.floor(num / KAKTOVIK_BASE);
    }
    return digits.map(d => String.fromCodePoint(KAKTOVIK_CODE_POINT_START + d)).join('');
}

/**
 * Convert a Kaktovik numeral string to a decimal integer
 * @param {string} s - Kaktovik numeral string
 * @returns {number} Decimal integer
 */
function kaktovikToNumber(s) {
    let result = 0;
    for (const char of s) {
        const codePoint = char.codePointAt(0);
        if (codePoint < KAKTOVIK_CODE_POINT_START || codePoint > KAKTOVIK_CODE_POINT_START + 19) {
            throw new Error(`Invalid Kaktovik character`);
        }
        result = result * KAKTOVIK_BASE + (codePoint - KAKTOVIK_CODE_POINT_START);
    }
    return result;
}

/**
 * Add two non-negative integers
 * @param {number} a - First operand (non-negative integer)
 * @param {number} b - Second operand (non-negative integer)
 * @returns {number} Sum
 */
function add(a, b) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
        throw new Error('Operands must be non-negative integers');
    }
    return a + b;
}

/**
 * Subtract b from a (a must be >= b)
 * @param {number} a - Minuend (non-negative integer)
 * @param {number} b - Subtrahend (non-negative integer, <= a)
 * @returns {number} Difference
 */
function subtract(a, b) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
        throw new Error('Operands must be non-negative integers');
    }
    if (a < b) throw new Error('Minuend must be greater than or equal to subtrahend');
    return a - b;
}

/**
 * Perform simple integer division
 * @param {number} a - Dividend
 * @param {number} b - Divisor (non-zero)
 * @returns {{ quotient: number, remainder: number }}
 */
function divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    return {
        quotient: Math.floor(a / b),
        remainder: a % b
    };
}

/**
 * Perform long division showing step-by-step workings in base-20
 * @param {number} dividend - Dividend (non-negative integer)
 * @param {number} divisor  - Divisor (positive integer)
 * @returns {{ quotient: number, remainder: number, steps: Array }}
 */
function longDivide(dividend, divisor) {
    if (divisor === 0) throw new Error('Division by zero');
    if (!Number.isInteger(dividend) || !Number.isInteger(divisor) || dividend < 0 || divisor < 0) {
        throw new Error('Operands must be non-negative integers');
    }

    // Build base-20 digit array for the dividend
    const dividendDigits = [];
    if (dividend === 0) {
        dividendDigits.push(0);
    } else {
        let n = dividend;
        while (n > 0) {
            dividendDigits.unshift(n % KAKTOVIK_BASE);
            n = Math.floor(n / KAKTOVIK_BASE);
        }
    }

    const steps = [];
    const quotientDigits = [];
    let current = 0;

    for (let i = 0; i < dividendDigits.length; i++) {
        current = current * KAKTOVIK_BASE + dividendDigits[i];
        const q = Math.floor(current / divisor);
        const product = q * divisor;
        const remainder = current - product;

        quotientDigits.push(q);
        steps.push({
            partialDividend: current,
            quotientDigit: q,
            product,
            remainder
        });
        current = remainder;
    }

    // Remove leading zeros from quotient digits
    while (quotientDigits.length > 1 && quotientDigits[0] === 0) {
        quotientDigits.shift();
    }

    const quotient = quotientDigits.reduce((acc, d) => acc * KAKTOVIK_BASE + d, 0);

    return { quotient, remainder: current, steps };
}
