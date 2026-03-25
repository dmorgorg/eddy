<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	import { triY } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'
	import { redirect } from '@sveltejs/kit'
	let { zl, zr, b, y = $bindable() } = $props()

	let canvas = $state()
	let canvasWrap = $state()
	// width of canvas containing element
	let widthInPixels = $state(0)

	let canvasPaddingInline = 20
	let canvasPaddingTop = canvasPaddingInline
	let canvasPaddingBottom = $derived(canvasPaddingInline)
	let canvasMaxHeightPixels = 12.75
	let maxD = $state(5) // max depth of channel set to 5 metres

	let channelTopWidth = $derived((zl + zr) * maxD + b)
	let channelAspectRatio = $derived(channelTopWidth / y)
	let channelDepthPixels = $derived.by(() => {
		if ((widthInPixels - 2 * canvasPaddingInline) / channelAspectRatio < canvasMaxHeightPixels)
			return (widthInPixels - 2 * canvasPaddingInline) / channelAspectRatio
	})

	// let channelWidthPixels = $derived.by(() => {
	// 	if (widthInPixels > aspectRatio * maxDepthPixels + 2 * canvasPaddingInline) {
	// 		return aspectRatio * maxDepthPixels
	// 	} else {
	// 		return widthInPixels - 2 * canvasPaddingInline
	// 	}
	// })
	// let channelDepthPixels = $derived(Math.max(channelWidthPixels / aspectRatio, minDepthPixels))
	// let canvasWidthPixels = $derived(widthInPixels)
	// let canvasHeightPixels = $derived(channelDepthPixels + canvasPaddingTop + canvasPaddingBottom)

	// let channelLeftX = $derived(Math.round((widthInPixels - channelWidthPixels) / 2))
	// let channelRightX = $derived(channelLeftX + channelWidthPixels)
	// let surroundTopY = $derived(canvasPaddingTop)
	// let channelBottomY = $derived(canvasPaddingTop + channelDepthPixels)
	// let levelDown = $derived.by(() => {
	// 	let temp = y < 0.5 ? 0.5 : y
	// 	temp = y > 3 ? 3 : y
	// 	return (-0.267 * temp + 0.9) * channelDepthPixels
	// })
	// let waterTopY = $derived(surroundTopY + levelDown)

	// let channelBaseX = $derived(Math.round(channelLeftX + (channelWidthPixels * zl) / (zl + zr)))

	// let extension = $state(10)
	// let leftSlope = $derived(channelDepthPixels / (channelBaseX - channelLeftX))
	// let leftSlopeDX = $derived(levelDown / leftSlope)
	// let rightSlope = $derived(channelDepthPixels / (channelWidthPixels - channelBaseX + channelLeftX))
	// let rightSlopeDX = $derived(levelDown / rightSlope)

	// let extensionLeft = $derived(
	// 	leftSlope < 0.5 ? 1.5 * extension : leftSlope > 0.95 ? 0.5 * extension : extension
	// )
	// let extensionRight = $derived(
	// 	rightSlope < 0.5 ? 1.5 * extension : rightSlope > 0.95 ? 0.5 * extension : extension
	// )

	// let rightExtensionX = $derived(Math.round(extensionRight * Math.cos(Math.atan(rightSlope))))
	// let rightExtensionY = $derived(Math.round(extensionRight * Math.sin(Math.atan(rightSlope))))
	// let leftExtensionX = $derived(Math.round(extensionLeft * Math.cos(Math.atan(leftSlope))))
	// let leftExtensionY = $derived(Math.round(extensionLeft * Math.sin(Math.atan(leftSlope))))

	$effect(() => {
		draw()
	})

	const draw = () => {
		if (!canvas) return
		let lineWidth = 4
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		// ctx.canvas.height = canvasHeightPixels
		ctx.canvas.width = widthInPixels

		// draw grey channel surround/support
		// ctx.fillStyle = '#c1cdcd'
		// ctx.fillRect(0, surroundTopY, widthInPixels, channelDepthPixels + canvasPaddingBottom)
		// // remove grey channel surround from channel
		// ctx.fillStyle = 'white'
		// ctx.beginPath()
		// ctx.moveTo(channelLeftX, surroundTopY)
		// ctx.lineTo(channelBaseX, channelBottomY)
		// ctx.lineTo(channelRightX, surroundTopY)
		// ctx.fill()

		// const gradient = ctx.createLinearGradient(0, canvasPaddingTop + levelDown, 0, channelBottomY)
		// gradient.addColorStop(0, '#0bb')
		// gradient.addColorStop(1, '#066')
		// ctx.fillStyle = gradient
		// ctx.beginPath()
		// ctx.moveTo(channelLeftX + leftSlopeDX, waterTopY)
		// ctx.lineTo(channelBaseX, channelBottomY)
		// ctx.lineTo(channelRightX - rightSlopeDX, waterTopY)
		// ctx.fill()

		// ctx.strokeStyle = 'black'
		// ctx.lineCap = 'round'
		// ctx.lineJoin = 'round'
		// ctx.beginPath()
		// ctx.lineWidth = 3
		// ctx.moveTo(channelLeftX - leftExtensionX, surroundTopY - leftExtensionY)
		// ctx.lineTo(channelBaseX, channelBottomY)
		// ctx.lineTo(channelRightX + rightExtensionX, surroundTopY - rightExtensionY)
		// ctx.stroke()
	}

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}
</script>

{#if browser}
	<div class="w-90" bind:clientWidth={widthInPixels}>
		<!-- bind:this binds canvasWrap var to this DOM element -->
		<div class="canvas-wrap" bind:this={canvasWrap}>
			<div class="rect-wrap">
				<canvas bind:this={canvas} width="200" height="100"> </canvas>
			</div>
		</div>
		channelWidth: {channelTopWidth}, ar: {channelAspectRatio}, channelDepth: {channelDepthPixels}
	</div>
	<!-- leftX: {channelLeftX}, channelWidthPixels: {channelWidthPixels}, rightX: {channelRightX},
	channelDepthPixels: {channelDepthPixels}, channelBaseX: {channelBaseX} <br />
	channelLeftX: {channelLeftX},<br /> -->
	<!-- leftSlopeDX: {leftSlope}, <br /> -->
	<!-- waterTopY: {waterTopY}<br />
	leftSlope: {leftSlope}, leftSlopeDX: {leftSlopeDX} -->
	<!-- {y}, {3.85 * y - 0.9}, {channelDepthPixels} -->
	<!-- {extension}, {rightSlope}, {rightExtensionX} -->
{/if}

<style>
	.w-90 {
		/* background: pink; */
		margin-block: 1em;
		margin-inline: auto;
		width: 90%;
	}
	canvas {
		/* width: 100%; */
		/* height: 100%; */
		/* width: fit-content; */
		margin-inline: auto;
		border: 0.1px solid red;
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
