<script>
	import { slide } from 'svelte/transition'
	let { answer = 'answer', solution = 'solution' } = $props()
	let displayCalc = $state(false)

	function toggleDisplay() {
		displayCalc != displayCalc
	}
</script>

<article class="card">
	<section class="answer">
		<div>{@html answer} <span>{@html displayCalc ? '&#9650;' : '&#9660;'}</span></div>
	</section>
	{#if displayCalc}
		<section class="solution" transition:slide>
			<div>{@html solution}</div>
		</section>
	{/if}
</article>

<style>
	.card {
		background: pink;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		padding: 0.25em 0.625em;
		border-radius: 3px;
		margin-top: 1em;
	}
</style>
