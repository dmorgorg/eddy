<script>
	import RectangularCanvas from './RectangularCanvas.svelte'

	let width = $state(400)
	let height = $state(200)

	let aspectRatio = $derived(Math.min(Math.max(width / height, 1 / 6), 8))
</script>

<div class="container">
	<RectangularCanvas {aspectRatio} />

	<label>
		Width:
		<input type="number" bind:value={width} step="10" min="1" />
	</label>

	<label>
		Height:
		<input type="number" bind:value={height} step="10" min="1" />
	</label>

	<p>Aspect ratio: {aspectRatio.toFixed(2)}</p>
</div>

<style>
	.container {
		/* width: 50%; */
		margin-inline: auto;
	}
</style>
