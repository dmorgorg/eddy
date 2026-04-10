import katex from 'katex'
import Decimal from 'decimal.js'

Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

/**
 * Fades a packed 24-bit RGB color toward black over fadeSteps steps.
 * Returns null when fully faded (use as signal to skip \textcolor).
 * @param {number} age - Steps since this value was last updated
 * @param {number} fadeSteps - Total steps to fade over
 * @param {number} color - Packed 24-bit RGB integer, e.g. 0xff0000 for red
 * @returns {string|null}
 */
export const makeHex = (age, fadeSteps, color = 0xff0000) => {
	if (age >= fadeSteps) return null
	const factor = 1 - age / fadeSteps
	const toHex = (/** @type {number} */ n) => Math.round(n).toString(16).padStart(2, '0')
	const r = ((color >> 16) & 0xff) * factor
	const g = ((color >> 8) & 0xff) * factor
	const b = (color & 0xff) * factor
	return `${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Wraps a KaTeX string in \textcolor if a color is provided.
 * @param {string|null} color - Hex color string without '#', or null for black
 * @param {string} tex - KaTeX string to colorize
 * @returns {string}
 */
export const colorize = (color, tex) => (color ? `\\textcolor{#${color}}{${tex}}` : tex)

export const ki = (/** @type {string} */ tex) => {
	return katex.renderToString(tex)
}
export const kd = (/** @type {string} */ tex) => {
	return katex.renderToString(tex, { displayMode: true })
}

/**
 * Converts a number to the correct number of significant digits
 * @param {number} num - The number to format
 * @param {number} sigdig - Number of significant digits
 * @param {boolean} extra - If true and first non-zero digit is 1, use sigdig+1
 * @returns {string} Formatted number as string (to preserve trailing zeros)
 */
export const sd = (num, sigdig, extra = true) => {
	if (num === 0) return '0'

	const absNum = Math.abs(num)
	const sign = num < 0 ? '-' : ''

	// Find the first non-zero digit
	const match = absNum.toString().match(/[1-9]/)
	const firstNonZeroDigit = match ? parseInt(match[0]) : 1

	// Adjust significant digits if extra is true and first digit is 1
	const actualSigdig = extra && firstNonZeroDigit === 1 ? sigdig + 1 : sigdig

	// Calculate the order of magnitude
	const magnitude = Math.floor(Math.log10(absNum))

	// Calculate decimal places needed
	const decimalPlaces = actualSigdig - magnitude - 1

	let result
	if (decimalPlaces >= 0) {
		// Use toFixed for numbers that need decimal places
		result = sign + absNum.toFixed(decimalPlaces)
	} else {
		// For large numbers, round to the appropriate place
		const factor = Math.pow(10, -decimalPlaces)
		result = sign + (Math.round(absNum / factor) * factor).toString()
	}

	// Check if result is in exponential notation and convert if necessary
	if (result.includes('e')) {
		const numVal = parseFloat(result)
		// Determine appropriate decimal places to avoid exponential notation
		const expMagnitude = Math.floor(Math.log10(Math.abs(numVal)))
		const expDecimalPlaces = Math.max(0, actualSigdig - expMagnitude - 1)
		result = numVal.toFixed(expDecimalPlaces)
	}

	return result
}

/**
 * Like sd() but uses Decimal.js for consistent ROUND_HALF_UP behaviour.
 * @param {number} num
 * @param {number} sigdig
 * @param {boolean} extra - If true and first non-zero digit is 1, use sigdig+1
 * @returns {string}
 */
export const sdD = (num, sigdig, extra = true) => {
	if (num === 0) return '0'
	if (num == null || !isFinite(num)) return String(num)

	const d = new Decimal(num)
	const absD = d.abs()
	const sign = d.isNegative() ? '-' : ''

	const firstNonZeroDigit = parseInt(absD.toString().match(/[1-9]/)?.[0] ?? '1')
	const actualSigdig = extra && firstNonZeroDigit === 1 ? sigdig + 1 : sigdig

	const magnitude = absD.log(10).floor().toNumber()
	const decimalPlaces = actualSigdig - magnitude - 1

	let result
	if (decimalPlaces >= 0) {
		result = sign + absD.toDecimalPlaces(decimalPlaces).toFixed(decimalPlaces)
	} else {
		const factor = new Decimal(10).pow(-decimalPlaces)
		result = sign + absD.div(factor).toDecimalPlaces(0).mul(factor).toFixed()
	}

	// Convert exponential notation if it slips through
	if (result.includes('e')) {
		const numVal = new Decimal(result.replace(sign, ''))
		const expMagnitude = numVal.log(10).floor().toNumber()
		const expDecimalPlaces = Math.max(0, actualSigdig - expMagnitude - 1)
		result = sign + numVal.toDecimalPlaces(expDecimalPlaces).toFixed(expDecimalPlaces)
	}

	return result
}

// OLD sd function - commented out
// export const sd = (/** @type {any} */ num, /** @type {number} */ digs, extra = true) => {
// 	function firstNonZero(/** @type {any} */ n) {
// 		n = n.toString();
// 		while (n[0] === '0' || n[0] === '.' || n[0] === '-' || n[0] === '+') {
// 			n = n.slice(1);
// 		}
// 		return n[0];
// 	}
// 	if (extra) {
// 		if (firstNonZero(num) === '1') {
// 			if (firstNonZero(num.toPrecision(digs + 1)) === '9') {
// 				num = +num.toPrecision(digs); // round to 3 digs, say, to get leading one
// 				// return Number(num).toPrecision(digs + 1); // round back up to 4 digs
// 			}
// 			digs++;
// 		}
//
// 		// deal with any scientific notation
// 		if (Number(num).toPrecision(digs).indexOf('e') !== -1) {
// 			// let index = num.toPrecision(digs).indexOf('e');
//
// 			num = num.toPrecision(digs);
// 			let exponent = num[num.length - 1];
// 			return num.slice(0, -3) * 10 ** exponent;
// 		}
// 	}
//
// 	// num = Number(num);
// 	return +num.toPrecision(digs);
// };

// https://www.freecodecamp.org/news/javascript-debounce-example/
export const debounce = (/** @type {(arg0: any) => void} */ func, delay = 2000) => {
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer
	return (/** @type {any[]} */ ...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			// @ts-ignore
			func.apply(this, args)
		}, delay)
	}
}
