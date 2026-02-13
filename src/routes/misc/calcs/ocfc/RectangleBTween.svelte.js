// @ts-nocheck

// easings.net
function ease(x) {
	// easeInOutCubic(x) {
	// return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
	// easeInOutQuad(x) {
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export class RectangleBTween {
	value = $state()

	constructor(value) {
		this.value = value
	}

	// interpolator(0,100)(0.3) => 30
	interpolator(a, b) {
		if (a === b || a !== a) return () => a

		if (typeof a === 'number') {
			const delta = b - a
			// return a function
			return (t) => a + t * delta
		}

		if (typeof a === 'object') {
			const interpolators = {}
			Object.keys(b).forEach((key) => {
				interpolators[key] = this.interpolator(a[key], b[key])
			})
			return (t) => {
				const result = {}
				Object.keys(b).forEach((key) => {
					result[key] = interpolators[key](t)
				})
				return result
			}
		}
	}

	to(target) {
		const duration = 2000
		const start = performance.now()
		const interpolator = this.interpolator(this.value, target)

		// callback function
		const frame = () => {
			const now = performance.now()
			const elapsed = now - start
			if (elapsed > duration) {
				this.value = target
				return true // when finished
			}
			this.value = interpolator(ease(elapsed / duration))
			requestAnimationFrame(frame)
		}
		requestAnimationFrame(frame)
	}
}
