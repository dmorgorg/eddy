<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect } from 'svelte-konva'

	let { aspectRatio } = $props()
	let divWidth = $state()
</script>

{#if browser}
	<div bind:clientWidth={divWidth}>
		hello
		{divWidth}
	</div>
{/if}

<style>
	div {
		border: 2px solid black;
		background: white;
	}
</style>
