<script>
	let { answer, solution, children } = $props()
	let displayCalc = $state(false)
	let cardElement = $state(null)

	function toggleDisplay() {
		displayCalc = !displayCalc
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="card" onclick={toggleDisplay} onkeydown={toggleDisplay}>
	<section class="answer">
		<div>{@render answer()}</div>
		<span>
			{@html displayCalc ? '&#9650;' : '&#9660;'}
		</span>
	</section>
	{#if displayCalc}
		{@render solution()}
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
