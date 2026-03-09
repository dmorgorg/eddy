<script>
	import { slide } from 'svelte/transition'
	let { answer, solution } = $props()
	let displayCalc = $state(false)
	/** @type {HTMLElement | null} */
	let cardElement = $state(null)

	function toggleDisplay() {
		displayCalc = !displayCalc
	}

	$effect(() => {
		if (displayCalc && cardElement) {
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="card" bind:this={cardElement}>
	<button class="answer" onclick={toggleDisplay}>
		<div>{@render answer()}</div>
		<span>
			{@html displayCalc ? '&#9650;' : '&#9660;'}
		</span>
	</button>
	{#if displayCalc}
		<section class="solution" transition:slide={{ duration: 500, axis: 'y' }}>
			<div>{@render solution?.()}</div>
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

		&:hover {
			box-shadow: 2px 2px 4px #abb;
			cursor: pointer;
		}

		& > .answer {
			display: flex;
			width: 100%;
			justify-content: space-between;
			padding-bottom: 0.25em;
			background: none;
			border: none;
			cursor: pointer;
			font: inherit;
			text-align: left;

			span {
				color: #088;
			}
		}

		& > .solution {
			border-top: 2px solid #088;
			margin-block-end: -0.5em;
			padding-top: 0.25em;
			padding-bottom: 0.75em;
			overflow: hidden; // eliminates a jump in the end of the transition apparently caused by margin collapse
		}

		// nested card styling
		:global(.card) {
			background-color: #ebefef;
			border: none;
			border-radius: 0;
			box-shadow: none;
			font-size: 0.93em;
			margin-bottom: 2em;
			margin-inline: 0;
			padding-inline: 0;
			padding-top: 0;
		}
		:global(.card > .answer) {
			background-color: #cfd8d8;
			padding-inline: 1em;
		}
		:global(.card > .solution) {
			border-top: none;
			padding-inline: 1em;
		}
	}
	// .heading {
	// 	color: red;
	// }
</style>
