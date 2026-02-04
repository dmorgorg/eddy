<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect, Line } from 'svelte-konva'

	let { aspectRatio } = $props()

	const paddingTopEm = 1
	// more space below for the Base input
	const paddingBottomEm = 3
	const paddingInlineEm = 1

	let emToPx = $state(16)
	let paddingTop = $derived(paddingTopEm * emToPx)
	let paddingBottom = $derived(paddingBottomEm * emToPx)
	let divWidth = $state(0)
	let divHeight = $state(0)
	let channelBase = $derived.by(() => {
		let scale
		if (aspectRatio < 1) {
			// maps aspectRatio of 1/6 to 1, 1/5 to 2, ... ,1/2 to 5
			scale = -1 / aspectRatio + 5
			console.log(scale)
		} else {
			// maps aspectRatio of 1 to 6, 2 to 7, etc.
			scale = aspectRatio + 5
		}
		// dividing by 13 would have the widest channel be full width of the page element
		// which is too much. dividing by 20 reduces that toe 0.65 of the page element.
		return Math.round((scale / 15) * divWidth)
	})
	let channelDepth = $derived(Math.round(channelBase / aspectRatio))
	let stageWidth = $derived(Math.round(channelBase + 2 * paddingInlineEm * emToPx))
	let stageHeight = $derived(Math.round(channelDepth + paddingTop + paddingBottom))
</script>

aspectRatio: {aspectRatio}, channelBase: {channelBase}, channelDepth: {channelDepth}, divWidth:
{divWidth}

{#if browser}
	<div bind:clientWidth={divWidth} bind:clientHeight={divHeight}>
		<div class="stage"><Stage width={stageWidth} height={stageHeight}></Stage></div>
	</div>
{/if}

<style>
	.stage {
		background: pink;
		margin-inline: auto;
		width: fit-content;
	}
</style>
