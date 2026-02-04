<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect, Line } from 'svelte-konva'

	let { aspectRatio } = $props()
	let stage

	const paddingTopEm = 1
	// more space below for the Base input
	const paddingBottomEm = 3
	const paddingInlineEm = 1

	let emToPx = $state(16)
	let paddingTop = $derived(paddingTopEm * emToPx)
	let paddingBottom = $derived(paddingBottomEm * emToPx)
	let paddingInline = $derived(paddingInlineEm * emToPx)
	let divWidth = $state(0)
	let divHeight = $state(0)
	let channelBase = $derived.by(() => {
		if (aspectRatio < 1) {
			// maps aspectRatio of 1/6 to 15% of divWidth, 1 to 50% of divWidth
			// return (Math.round(-6 / aspectRatio + 46) * (divWidth - 2 * paddingInline)) / 100
			let depth = 20 / aspectRatio + 130
			return depth * aspectRatio
		} else {
			// maps aspectRatio of 1 to 6, 2 to 7, etc.
			return Math.round(((60 * aspectRatio + 220) / 7) * (divWidth - 2 * paddingInline)) / 100
		}
	})
	let channelDepth = $derived(Math.round(channelBase / aspectRatio))
	let stageWidth = $derived(Math.round(channelBase + 2 * paddingInlineEm * emToPx))
	let stageHeight = $derived(Math.round(channelDepth + paddingTop + paddingBottom))
	let channelLeft = $derived((stageWidth - channelBase) / 2)
</script>

<!-- aspectRatio: {aspectRatio}, channelBase: {channelBase}, channelDepth: {channelDepth}, divWidth:
{divWidth}, %: {Math.round((channelBase / divWidth) * 100) / 100} -->

{#if browser}
	<div bind:clientWidth={divWidth} bind:clientHeight={divHeight}>
		<div class="stage">
			<Stage width={stageWidth} height={stageHeight} bind:this={stage}>
				<Layer>
					<Rect x={0} y={0} width={stageWidth} height={stageHeight} stroke="#000" />
					<Rect x={channelLeft} y={20} width={channelBase} height={channelDepth} fill="#088" />
					<Line
						x={20}
						y={100}
						points={[0, 0, 100, 0, 100, 100]}
						tension={0.5}
						closed
						stroke="black"
						fillLinearGradientStartPoint={{ x: -50, y: -50 }}
						fillLinearGradientEndPoint={{ x: 50, y: 50 }}
						fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
					/>
				</Layer>
			</Stage>
		</div>
	</div>
{/if}

<style>
	.stage {
		/* background: pink; */
		margin-inline: auto;
		width: fit-content;
	}
</style>
