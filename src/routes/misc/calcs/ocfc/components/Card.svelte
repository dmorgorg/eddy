<script>
	import { slide } from 'svelte/transition'
	let { answer = 'answer', solution = 'solution' } = $props()
	let displayCalc = $state(false)

	function toggleDisplay() {
		displayCalc = !displayCalc
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="card" onclick={toggleDisplay} onkeydown={toggleDisplay}>
	<section class="answer">
		<div>{@html answer}</div>
		<span>
			{@html displayCalc ? '&#9650;' : '&#9660;'}
		</span>
	</section>
	{#if displayCalc}
		<section class="solution" transition:slide>
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

		// &:hover {
		// 	box-shadow: 2px 2px 4px #8aa;
		// 	box-shadow: 2px 2px 4px red;
		// }

		& > .answer {
			display: flex;
			justify-content: space-between;

			span {
				color: #088;
			}
		}

		& > .solution {
			// border-top: 2px solid #088;
			margin-block: 0.5em;
		}
	}
</style>
