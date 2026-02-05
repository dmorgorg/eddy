// @ts-nocheck
import katex from 'katex'

export const ki = (tex) => {
	return katex.renderToString(tex)
}
export const kd = (tex) => {
	return katex.renderToString(tex, { displayMode: true })
}

export const sd = (num, digs, extra = true) => {
	function firstNonZero(n) {
		n = n.toString()
		while (n[0] === '0' || n[0] === '.' || n[0] === '-' || n[0] === '+') {
			n = n.slice(1)
		}
		return n[0]
	}
	if (extra) {
		if (firstNonZero(num) === '1') {
			if (firstNonZero(num.toPrecision(digs + 1)) === '9') {
				num = +num.toPrecision(digs) // round to 3 digs, say, to get leading one
				// return Number(num).toPrecision(digs + 1); // round back up to 4 digs
			}
			digs++
		}

		// deal with any scientific notation
		if (Number(num).toPrecision(digs).indexOf('e') !== -1) {
			// let index = num.toPrecision(digs).indexOf('e');
			num = num.toPrecision(digs)
			let exponent = num[num.length - 1]
			return num.slice(0, -3) * 10 ** exponent
		}
	}
	return num.toPrecision(digs).toString()
}
/**
 * @typedef {Object} DebounceOptions
 * @property {number} [delay] - The delay in milliseconds before the function is called
 */
// https://www.freecodecamp.org/news/javascript-debounce-example/
export const debounce = (func, delay = 2000) => {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}
