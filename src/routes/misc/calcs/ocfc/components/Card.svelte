<script>
	import { slide } from 'svelte/transition'
	let { answer, solution } = $props()
	let displayContent = $state(false)
	/** @param {Event} e */
	function toggleDisplay(e) {
		e.stopPropagation()
		displayContent = !displayContent
	}
	/** @type {HTMLElement | null} */
	let cardElement = $state(null)

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="card" bind:this={cardElement} onclick={(e) => toggleDisplay(e)}>
	<section class="answer">
		<div>{@render answer()}</div>
		<span>
			{@html displayContent ? '&#9650;' : '&#9660;'}
		</span>
	</section>
	{#if displayContent}
		<section class="solution" transition:slide={{ duration: 500, axis: 'y' }}>
			<div>{@render solution()}</div>
		</section>
	{/if}
</article>

<style>
	.card {
		background-color: white;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		border-radius: 3px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		font-weight: normal;
		gap: 0;
		margin-block: 0.5em;

		/* margin-inline: 0; */
		padding: 0.5em 0.625em;
		padding-bottom: 0;
		/* width: 100%; */

		/* nested card styling */
		:global(.card) {
			border: none;
			border-radius: 13px;
			box-shadow: none;
			font-size: 0.93em;
			margin-bottom: 2em;
			margin-inline: 0;
			padding-inline: 0;
			padding-top: 0;
		}
		:global(.card > .answer) {
			background-color: #cfd8d8;
			padding: 0.25em 1em;
		}
		:global(.card > .solution) {
			background-color: #ebefef;
			border-top: none;
			padding-inline: 1em;
			padding-bottom: 1em;
		}
	}
	.answer {
		align-items: center;
		background: none;
		border: none;
		display: flex;
		font: inherit;
		justify-content: space-between;
		margin-block: 0;
		padding-bottom: 0.375em;
		text-align: left;
		span {
			color: #088;
		}
	}
	.solution {
		border-top: 2px solid #088;
		padding-block: 0.65em;
		padding-bottom: 0;
		padding-inline: 5%;
		text-align: left;
		width: 100%;
	}
</style>
