// @ts-nocheck
import katex from 'katex';

export const ki = (tex) => {
	return katex.renderToString(tex);
};
export const kd = (tex) => {
	return katex.renderToString(tex, { displayMode: true });
};

export const utils = {
	rad: (degrees) => {
		return (degrees * Math.PI) / 180;
	},
	deg: (radians) => {
		return (radians / Math.PI) * 180;
	},
	// num is a number, sigDigs an integer, returns num as a string with the specified number of sig digs

	sd: (num, digs = 3, extraDig = true) => {
		if (num === null) return 0;
		if (extraDig) {
			if (num !== null) {
				let n = num.toString();
				while (n[0] === '0' || n[0] === '.') {
					n = n.slice(1);
				}
				if (n[0] == '1') {
					digs++;
				}
			}
		}
		return parseFloat(num).toPrecision(digs);
		// }
	},
	delay: 2000,

	// https://www.freecodecamp.org/news/javascript-debounce-example/
	debounce: function (func, delay = this.delay) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}
};
