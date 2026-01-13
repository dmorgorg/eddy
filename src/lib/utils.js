import katex from 'katex';

export const ki = (/** @type {string} */ tex) => {
	return katex.renderToString(tex);
};
export const kd = (/** @type {string} */ tex) => {
	return katex.renderToString(tex, { displayMode: true });
};

export const sd = (/** @type {any} */ num, /** @type {number} */ digs, extra = true) => {
	function firstNonZero(/** @type {any} */ n) {
		n = n.toString();
		while (n[0] === '0' || n[0] === '.' || n[0] === '-' || n[0] === '+') {
			n = n.slice(1);
		}
		return n[0];
	}
	if (extra) {
		if (firstNonZero(num) === '1') {
			if (firstNonZero(num.toPrecision(digs + 1)) === '9') {
				num = +num.toPrecision(digs); // round to 3 digs, say, to get leading one
				// return Number(num).toPrecision(digs + 1); // round back up to 4 digs
			}
			digs++;
		}

		// deal with any scientific notation
		if (Number(num).toPrecision(digs).indexOf('e') !== -1) {
			// let index = num.toPrecision(digs).indexOf('e');

			num = num.toPrecision(digs);
			let exponent = num[num.length - 1];
			return num.slice(0, -3) * 10 ** exponent;
		}
	}

	// num = Number(num);
	return +num.toPrecision(digs);
};
