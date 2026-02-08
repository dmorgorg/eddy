// @ts-nocheck
export const common = {
	getR: (A, P) => {
		return A / P
	},
	getV: (n, R, s) => {
		return (1 / n) * R ** (2 / 3) * (s / 100) ** 0.5
	},
	getQfromAandV: (A, v) => {
		return A * v
	},
	getNF: (v, A, T, g) => {
		return v / ((g * A) / T) ** 0.5
	},
	// variables are strings which convert fine with * and / but be careful with + to avoid concatenation!
	getE: (y, v, g) => {
		return v ** 2 / 2 / g + +y
	},
	getCriticalSlope: (n, vc, Rc) => {
		return ((n * vc) / Rc ** (2 / 3)) ** 2 * 100
	},
	getVfromQandA: (Q, A) => {
		return Q / A
	},
	getCriticalSlope: (n, vc, Rc) => {
		return ((n * vc) / Rc ** (2 / 3)) ** 2 * 100
	}
}

export const rect = {
	getArea: (b, y) => {
		return b * y
	},
	getP: (b, y) => {
		return +b + 2 * y
	},
	getT: (b) => {
		return b
	},
	getYc: (Q, g, b) => {
		return ((Q * Q) / g / b / b) ** (1 / 3)
	}
}
