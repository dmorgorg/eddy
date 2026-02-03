<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect } from 'svelte-konva'

	let { aspectRatio = 2 } = $props()

	const paddingHEm = 1
	const paddingVEm = 2

	let divWidth = $state(0)
	let emToPx = $state(16)

	let paddingH = $derived(paddingHEm * emToPx)
	let paddingV = $derived(paddingVEm * emToPx)

	let stageWidth = $derived(aspectRatio < 1 ? 300 * aspectRatio + 2 * paddingH : divWidth)
	let rectWidth = $derived(aspectRatio < 1 ? 300 * aspectRatio : stageWidth - 2 * paddingH)
	let rectHeight = $derived(aspectRatio < 1 ? 300 : rectWidth / aspectRatio)
	let stageHeight = $derived(rectHeight + 2 * paddingV)
	let rectX = $derived((stageWidth - rectWidth) / 2)
	let rectY = $derived((stageHeight - rectHeight) / 2)

	let divElement = $state()
	$effect(() => {
		if (divElement && browser) {
			emToPx = parseFloat(getComputedStyle(divElement).fontSize)
		}
	})
</script>

{#if browser}
	<div bind:this={divElement} bind:clientWidth={divWidth}>
		<Stage width={stageWidth} height={stageHeight}>
			<Layer>
				<Rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} fill="#088" />
			</Layer>
		</Stage>
	</div>
{/if}

<style>
	div {
		width: 100%;
		border: 1px solid red;
		display: flex;
		justify-content: center;
	}
</style>
