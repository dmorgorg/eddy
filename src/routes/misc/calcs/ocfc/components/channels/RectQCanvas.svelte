<script>
	import { browser } from '$app/environment'
	// import { Stage, Layer, Rect, Line } from 'svelte-konva'
	// import Konva from 'konva'

	let { aspectRatio } = $props()
	let canvas = $state()
	let divWidth = $state(0)
	let divHeight = $state(0)
	let widthInPixels = $state()
	let b = $state(0)
	let y = $state(0)

	// let stage, rect, line

	$effect(() => {
		const context = canvas.getContext('2d')
		// this will re-run whenever `aspectRatio` changes

		// https://www.geeksforgeeks.org/javascript/javascript-anonymous-functions/
		b = (() => {
			let d
			if (aspectRatio < 1) {
				// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
				d = 36 * aspectRatio + 4
			} else {
				// maps ... 1 to 40, 8 to 89
				d = 7 * aspectRatio + 33
			}
			return Math.round((d / 100) * widthInPixels)
		})()
		y = Math.round(b / aspectRatio)
		if (y > 150) {
			y = 150
			b = Math.round(y * aspectRatio)
		}
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.fillStyle = '#008888'
		context.fillRect(0, 0, b, y)
	})
</script>

{#if browser}
	<!-- this copies the width of the div to the widthInPixel var -->
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<div class="canvas">
			<canvas bind:this={canvas} width={b} height={y}></canvas>
			<!-- <input type="range" bind:value={aspectRatio} min="0.167" max="8" step="any" />
			<br />{aspectRatio}, {widthInPixels}<br /><br />
			{b}, {y} -->
		</div>
	</div>
{/if}

<style>
	.canvas {
		border: 1px solid blue;
		margin-inline: auto;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-inline: 1em;
		padding: 1em;
		width: fit-content;
	}
	canvas {
		/* background: pink; */
		margin-inline: auto;
		width: fit-content;
	}
	.full-width {
		background: yellow;
	}
</style>
