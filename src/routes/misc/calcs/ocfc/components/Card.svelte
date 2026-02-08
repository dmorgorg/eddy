<script>
	import { slide, fly } from 'svelte/transition'
	let { answer = 'answer', solution = 'solution' } = $props()
	let displayCalc = $state(false)
	/** @type {HTMLElement | null} */
	let cardElement = $state(null)

	function toggleDisplay() {
		displayCalc = !displayCalc
	}

	$effect(() => {
		if (displayCalc && cardElement) {
			// Convert 1em to pixels using the element's font size
			const emInPx = parseFloat(getComputedStyle(cardElement).fontSize)
			const paddingBottom = emInPx

			// Use ResizeObserver to scroll as the card expands
			const observer = new ResizeObserver(() => {
				if (!cardElement) return

				const rect = cardElement.getBoundingClientRect()

				// Get next sibling card if it exists
				const nextCard = cardElement.nextElementSibling

				let targetBottom = rect.bottom + paddingBottom

				// If there's a next card, ensure its answer section is visible
				if (nextCard && nextCard.classList.contains('card')) {
					const nextRect = nextCard.getBoundingClientRect()
					const answerSection = nextCard.querySelector('.answer')

					if (answerSection) {
						const answerRect = answerSection.getBoundingClientRect()
						// Ensure the answer section of next card is fully visible
						targetBottom = Math.max(targetBottom, answerRect.bottom + paddingBottom)
					} else {
						// Fallback: ensure at least the start of the next card is visible
						targetBottom = Math.max(targetBottom, nextRect.top + emInPx * 2)
					}
				}

				// Check if target bottom is below the viewport
				if (targetBottom > window.innerHeight) {
					// Calculate how much to scroll
					const scrollAmount = targetBottom - window.innerHeight
					window.scrollBy({
						top: scrollAmount,
						behavior: 'instant'
					})
				}
			})

			observer.observe(cardElement)

			// Cleanup observer when card closes
			return () => observer.disconnect()
		}
	})
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="card" bind:this={cardElement} onclick={toggleDisplay} onkeydown={toggleDisplay}>
	<section class="answer">
		<div>{@html answer}</div>
		<span>
			{@html displayCalc ? '&#9650;' : '&#9660;'}
		</span>
	</section>
	{#if displayCalc}
		<!-- <section class="solution" in:fly={{ y: -59, duration: 1500 }}> -->
		<section class="solution" transition:slide={{ duration: 500, axis: 'y' }}>
			<div>{@html solution}</div>
		</section>
	{/if}
</article>

<style lang="scss">
	.card {
		background-color: white;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		border-radius: 3px;
		margin-block: 0.5em;
		margin-inline: auto;
		padding: 0.25em 0.625em;
		padding-bottom: 0;

		// &:hover {
		// 	box-shadow: 2px 2px 4px #8aa;
		// 	box-shadow: 2px 2px 4px red;
		// }

		& > .answer {
			display: flex;
			justify-content: space-between;
			padding-bottom: 0.25em;

			span {
				color: #088;
			}
		}

		& > .solution {
			border-top: 2px solid #088;
			margin-block-end: -0.5em;
			padding-top: 0.25em;
			padding-bottom: 0;
			overflow: hidden; // eliminates a jump in the end of the transition apparently caused by margin collapse
		}
	}
</style>
