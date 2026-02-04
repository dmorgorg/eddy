<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect } from 'svelte-konva'

	const paddingTopEm = 1
	// more space below for the Base input
	const paddingBottomEm = 3

	let emToPx = $state(16)
	let paddingTop = $derived(paddingTopEm * emToPx)
	let paddingBottom = $derived(paddingBottomEm * emToPx)
	let { aspectRatio } = $props()
	let divWidth = $state()
	let divHeight = $state()
	let stageWidth = $derived.by(() => {
		let scale
		if (aspectRatio < 0.5) {
			// maps aspectRatio of 1/6 to 1, 1/5 to 2, ... ,1/2 to 5
			scale = -1 / aspectRatio + 7
		} else {
			// maps aspectRatio of 1 to 6, 2 to 7, etc.
			scale = aspectRatio + 5
		}
		// dividing by 13 would have the widest channel be full width of the page element
		// which is too much. dividing by 20 reduces that toe 0.65 of the page element.
		return Math.round((scale / 13) * divWidth)
	})
	let rectWidth = $derived(stageWidth)
	let rectHeight = $derived(rectWidth / aspectRatio)
	let stageHeight = $derived(rectHeight + paddingTop + paddingBottom)
	let rectX = $derived((stageWidth - rectWidth) / 2)
	let rectY = $derived((stageHeight - rectHeight) / 2)
</script>

{#if browser}
	<div bind:clientWidth={divWidth} bind:clientHeight={divHeight}>
		DivWidth: {divWidth}, StageWidth {stageWidth}, StageHeight {stageHeight} <br />
		Aspect ratio: {aspectRatio} <br />
		StageWidthScaled: {stageWidth}
		<div class="stage">
			<Stage width={stageWidth} height={stageHeight}>
				<Layer>
					<Rect x={rectX} y={rectY} width={stageWidth} height={stageHeight} stroke="#000" />
					<Rect
						x={rectX}
						y={rectY + paddingBottom}
						width={rectWidth}
						height={rectHeight}
						fill="#088"
					/>
				</Layer>
			</Stage>
		</div>
	</div>
{/if}

<style>
	div.stage {
		border: 2px solid black;
		background: white;
		margin-inline: auto;
		width: fit-content;
	}
</style>
