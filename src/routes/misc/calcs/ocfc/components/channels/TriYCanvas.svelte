<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	import { triY } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'
	let { zl, zr, depth = $bindable() } = $props()

	let canvas = $state()
	let canvasWrap = $state()
	let verticalError = $state(false)

	// maximum drawing height
	let maxDepthPixels = $state(100)
	// minimum drawing height
	let minDepthPixels = $state(50)
	// width of element
	let widthInPixels = $state(0)

	let canvasPaddingInline = $state(20)
	let canvasPaddingTop = $derived(0.5 * canvasPaddingInline)
	let canvasPaddingBottom = $derived(0.5 * canvasPaddingInline)

	let aspectRatio = $derived(zl + zr)

	let channelWidthPixels = $derived.by(() => {
		if (widthInPixels > aspectRatio * maxDepthPixels + 2 * canvasPaddingInline) {
			return aspectRatio * maxDepthPixels
		} else {
			return widthInPixels - 2 * canvasPaddingInline
		}
	})
	let channelDepthPixels = $derived(Math.max(channelWidthPixels / aspectRatio, minDepthPixels))

	let canvasWidthPixels = $derived(channelWidthPixels + 2 * canvasPaddingInline)
	let canvasHeightPixels = $derived(channelDepthPixels + canvasPaddingTop + canvasPaddingBottom)

	let channelLeftX = $derived(canvasPaddingInline)
	let channelRightX = $derived(channelLeftX + channelWidthPixels)
	let channelTopY = $derived(canvasPaddingTop)
	let channelBottomY = $derived(canvasPaddingTop + channelDepthPixels)
	let levelDown = $state(5)
	let waterTopY = $derived(channelTopY + levelDown)

	let channelBaseX = $derived(canvasPaddingInline + (channelWidthPixels * zl) / (zl + zr))

	// let extension = $state(15)
	let leftSlope = $derived(channelDepthPixels / (channelBaseX - canvasPaddingInline))
	let leftSlopeDX = $derived(levelDown / leftSlope)
	let rightSlope = $derived(
		channelDepthPixels / (channelWidthPixels - channelBaseX + canvasPaddingBottom)
	)
	let rightSlopeDX = $derived(levelDown / rightSlope)

	$effect(() => {
		// const { b, y } = setChannelPixels(aspectRatio)
		draw()
	})

	const draw = () => {
		if (!canvas) return
		let lineWidth = 4
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.canvas.height = canvasHeightPixels
		ctx.canvas.width = canvasWidthPixels
		ctx.fillStyle = '#c1cdcd'
		ctx.fillRect(
			0,
			channelTopY,
			channelWidthPixels + 2 * canvasPaddingInline,
			channelDepthPixels + canvasPaddingBottom
		)
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.moveTo(channelLeftX, channelTopY)
		ctx.lineTo(channelBaseX, channelBottomY)
		ctx.lineTo(channelRightX, channelTopY)
		ctx.fill()

		const gradient = ctx.createLinearGradient(0, canvasPaddingTop + levelDown, 0, channelBottomY)
		gradient.addColorStop(0, '#0bb')
		gradient.addColorStop(1, '#066')
		ctx.fillStyle = gradient
		ctx.beginPath()
		ctx.moveTo(channelLeftX + leftSlopeDX, waterTopY)
		ctx.lineTo(channelBaseX, channelBottomY)
		ctx.lineTo(channelRightX - rightSlopeDX, waterTopY)
		ctx.fill()
		ctx.strokeStyle = 'black'
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.beginPath()
		ctx.lineWidth = 3
		ctx.moveTo(channelLeftX, channelTopY)
		ctx.lineTo(channelBaseX, channelBottomY)
		// ctx.stroke()
		ctx.lineTo(channelRightX, channelTopY)
		// ctx.lineTo(channelBaseX, channelBottomY)
		ctx.stroke()
	}

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}
</script>

{#if browser}
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<!-- bind:this binds canvasWrap var to this DOM element -->
		<div class="canvas-wrap" bind:this={canvasWrap}>
			<div class="rect-wrap">
				<canvas bind:this={canvas} width="200" height="100"> </canvas>
			</div>
		</div>
	</div>
{/if}

<style>
	.full-width {
		/* background: pink; */
		margin-block: 1em;
		margin-inline: auto;
		/* width: 90%; */
	}
	canvas {
		/* width: 100%; */
		/* height: 100%; */
		/* width: fit-content; */
		margin-inline: auto;
		/* border: 0.1px solid red; */
	}
	.canvas-wrap {
		/* background: darkseagreen; */

		/* margin-inline: auto; */
		/* padding-top: 1em; */
		/* padding-bottom: 3em; */
		/* padding-inline: 1em; */
		padding: 0;
		/* width: fit-content; */
		/* width: 100%; */
		/* width: 20em; */
	}
	.rect-wrap {
		/* border: 1px solid blue; */
		position: relative;
		display: inline-block;
		width: 100%;
	}
</style>
