<script>
	let { answer, solution } = $props()
	let displayContent = $state(false)
	/** @type {HTMLDetailsElement | null} */
	let cardElement = $state(null)

	function handleToggle() {
		displayContent = cardElement?.open ?? false
	}

	// AI magic code generated to scroll up when dropdowns go out of view. I don't really understand it...
	$effect(() => {
		if (displayContent && cardElement) {
			const emInPx = parseFloat(getComputedStyle(cardElement).fontSize)
			const paddingBottom = emInPx

			const observer = new ResizeObserver(() => {
				if (!cardElement) return

				const rect = cardElement.getBoundingClientRect()
				const nextCard = cardElement.nextElementSibling

				let targetBottom = rect.bottom + paddingBottom

				if (nextCard && nextCard.classList.contains('card')) {
					const answerSection = nextCard.querySelector('.answer')
					if (answerSection) {
						const answerRect = answerSection.getBoundingClientRect()
						targetBottom = Math.max(targetBottom, answerRect.bottom + paddingBottom)
					} else {
						targetBottom = Math.max(targetBottom, nextCard.getBoundingClientRect().top + emInPx * 2)
					}
				}

				if (targetBottom > window.innerHeight) {
					window.scrollBy({ top: targetBottom - window.innerHeight, behavior: 'instant' })
				}
			})

			observer.observe(cardElement)
			return () => observer.disconnect()
		}
	})
</script>

<details class="card" bind:this={cardElement} ontoggle={handleToggle}>
	<summary class="answer">
		<div>{@render answer()}</div>
		<span>
			{@html displayContent ? '&#9650;' : '&#9660;'}
		</span>
	</summary>
	<div class="solution-wrapper">
		<section class="solution">
			<div>{@render solution()}</div>
		</section>
	</div>
</details>

<style lang="scss">
	details.card {
		background-color: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		margin-block: 0.75em;
	}
	summary.answer {
		background: white;
		border-radius: 3px;
		display: flex;
		justify-content: space-between;
		padding: 1em;
		span {
			color: #088;
		}
	}
	.solution-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 500ms ease;
	}
	details[open] .solution-wrapper {
		grid-template-rows: 1fr;
	}
	.solution {
		overflow: hidden;
		border-top: 2px solid #088;
	}
</style>
