<script>
	// @ts-nocheck

	const raf = typeof window === undefined ? () => {} : requestAnimationFrame

	function ease(x) {
		// easeInOutCubic(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
		// easeInOutQuad(x) {
		// return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
	}

	class Tween {
		value = $state()

		constructor(value) {
			this.value = value
		}

		interpolator(a, b) {
			const delta = b - a
			return (t = a + t * delta)
		}

		to(target) {
			const duration = 2000
			const delay = 2000
			// const start = performance.now() + delay // time stamp for when page opened
			const start = performance.now() + delay // time stamp for when page opened
			const interpolator = this.interpolator(this.value, target)

			const task = this.loop(() => {
				const now = performance.now()
				const elapsed = now - start
				if (elapsed > duration) {
					this.value = target
					return true
				}
				this.value = interpolator(ease(elapsed / duration))
				return false
			})
			return task.promise

			// requestAnimationFrame(frame)
		}
		loop(frame) {
			const { promise, resolve } = Promise.withResolvers()

			const run = (now) => {
				const done = frame(now)
				done ? resolve() : requestAnimationFrame(run)
			}
			requestAnimationFrame(run)

			return { promise }
		}
	}

	const progress = new Tween(0)

	async function animate() {
		await progress.to(100)
		await progress.to(0)
	}
</script>
