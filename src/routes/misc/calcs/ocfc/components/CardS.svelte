<script>
	import { slide } from 'svelte/transition'
	let { answer, solution, children } = $props()
	let displayCalc = $state(false)

	function toggleDisplay() {
		displayCalc = !displayCalc
	}
</script>

<article>
	<button class="card" onclick={toggleDisplay} onkeydown={toggleDisplay}>
		<div class="answer">
			{@render answer()}
			<span>
				{@html displayCalc ? '&#9650;' : '&#9660;'}
			</span>
		</div>
		{#if displayCalc}
			<div class="solution" transition:slide={{ duration: 500, axis: 'y' }}>
				<div>{@render solution?.()}</div>
			</div>
		{/if}
	</button>
</article>

<style lang="scss">
	button.card {
		// all: unset;
		background-color: white;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		border-radius: 3px;
		margin-block: 0.5em;
		// margin-inline: auto;
		padding: 0.25em 0.625em;
		padding-bottom: 0;
		// width: 100%;

		.answer {
			align-items: center;
			display: flex;
			width: 100%;
			justify-content: space-between;
			padding-bottom: 0.25em;
			background: none;
			border: none;
			cursor: pointer;
			font: inherit;
			text-align: left;
			// background: yellow;

			// div {
			// 	width: 100%;
			// }

			span {
				color: #088;
			}
		}

		.solution {
			border-top: 2px solid #088;
			display: block;
			margin-block-end: -0.5em;
			padding-top: 0.25em;
			padding-bottom: 0;
			overflow: hidden; // eliminates a jump in the end of the transition apparently caused by margin collapse
			width: 100%;
		}
	}
</style>
