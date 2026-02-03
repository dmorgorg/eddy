<script>
	// @ts-nocheck

	// easings.net
	function easeOutQuad(x) {
		return 1 - (1 - x) * (1 - x)
	}

	// could also use a function
	class Tween {
		value = $state()

		constructor(value) {
			this.value = value
		}
		// interpolator(0,100)(0.67)->67
		interpolator(a, b) {
			const delta = b - a
			return (t) => a + t * delta
		}

		to(target) {
			const duration = 2000
			const start = performance.now() // returns a time stamp in milliseconds
			const interpolator = this.interpolator(this.value, target)

			const frame = () => {
				const now = performance.now()
				const elapsed = now - start
				if (elapsed > duration) {
					this.value = target
					return true
				}
				this.value = interpolator(easeOutQuad(elapsed / duration))
				requestAnimationFrame(frame)
			}
			requestAnimationFrame(frame)
		}
	}
	const progress = new Tween(0)
</script>

<button onclick={() => progress.to(100)}>
	{progress.value.toFixed()}
</button>
