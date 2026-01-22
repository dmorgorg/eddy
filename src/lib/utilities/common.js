/**
 * @typedef {Object} CommonUtilities
 * @property {(degrees: number) => number} rad - Converts degrees to radians
 * @property {(radians: number) => number} deg - Converts radians to degrees
 */

/** @type {CommonUtilities} */
export const common = {
	rad: (degrees) => {
		return (degrees * Math.PI) / 180;
	},
	deg: (radians) => {
		return (radians / Math.PI) * 180;
	}
};
