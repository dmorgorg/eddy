<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	import { trapY } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'
	import { redirect } from '@sveltejs/kit'
	let { zl, zr, b, y = $bindable() } = $props()

	let canvas = $state()
	let canvasWrap = $state()
	// width of canvas containing element
	let elWidthPx = $state(0)
	// fudge for drawing, no slope less than 1 in 6
	let zedL = $derived(Math.min(zl, 6))
	let zedR = $derived(Math.min(zr, 6))

	let canvasPaddingInline = 20
	let canvasPaddingTop = $derived(canvasPaddingInline)
	let canvasPaddingBottom = $derived(canvasPaddingInline)
	let maxDPx = 100
	// full depth of channel set to 5 metres, for drawing channel irrespective of water level
	let d = $state(5)
	// this value is the free width in metres
	let T = $derived((zedL + zedR) * d + b)
	let aspectRatio = $derived(sd(T / d, 4))
	let dPx = $derived.by(() => {
		if (elWidthPx - 2 * canvasPaddingInline < maxDPx * aspectRatio)
			return Math.round((elWidthPx - 2 * canvasPaddingInline) / aspectRatio)
		else return maxDPx
	})
	let TPx = $derived(Math.round(dPx * aspectRatio))
	let bPx = $derived(TPx - (zedL + zedR) * dPx)

	let surroundTopY = $derived(Math.round(canvasPaddingTop))
	let surroundBottomY = $derived(Math.round(canvasPaddingTop + dPx + canvasPaddingBottom))

	let channelLeftX = $derived(Math.round((elWidthPx - TPx) / 2))
	let channelRightX = $derived(channelLeftX + TPx)
	let bLeftX = $derived(channelLeftX + zedL * dPx)
	// if b=0, get drawing artifacts from rightX possibly < leftX
	let bRightX = $derived(Math.max(channelRightX - zedR * dPx, bLeftX))
	let channelBottomY = $derived(Math.round(surroundTopY + dPx))

	let levelDown = $derived.by(() => {
		let temp = y <= 0.25 ? 0.25 : y
		temp = y > 15 ? 15 : y
		// Used Lagrange intgerpolation for a quadratic that levels off at higher values
		return ((0.267 * temp * temp - 10.33 * temp + 95) * dPx) / 100
	})
	let waterTopY = $derived(surroundTopY + levelDown)

	// let channelBaseX = $derived(Math.round(channelLeftX + (TPx * zl) / (zl + zr)))

	let extension = $state(10)
	let leftSlope = $derived(dPx / (bLeftX - channelLeftX))
	let leftSlopeDX = $derived(levelDown / leftSlope)
	let rightSlope = $derived(dPx / (channelRightX - bRightX))
	let rightSlopeDX = $derived(levelDown / rightSlope)

	let extensionLeft = $derived(
		leftSlope < 0.5 ? 1.5 * extension : leftSlope > 0.95 ? 0.5 * extension : extension
	)
	let extensionRight = $derived(
		rightSlope < 0.5 ? 1.5 * extension : rightSlope > 0.95 ? 0.5 * extension : extension
	)

	let rightExtensionX = $derived(Math.round(extensionRight * Math.cos(Math.atan(rightSlope))))
	let rightExtensionY = $derived(Math.round(extensionRight * Math.sin(Math.atan(rightSlope))))
	let leftExtensionX = $derived(Math.round(extensionLeft * Math.cos(Math.atan(leftSlope))))
	let leftExtensionY = $derived(Math.round(extensionLeft * Math.sin(Math.atan(leftSlope))))

	$effect(() => {
		draw()
	})

	const draw = () => {
		if (!canvas) return
		let lineWidth = 4
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.canvas.height = dPx + 2 * canvasPaddingInline
		ctx.canvas.width = elWidthPx

		// draw grey channel surround/support
		ctx.fillStyle = '#c1cdcd'
		ctx.fillRect(0, surroundTopY, elWidthPx, surroundBottomY)
		//  remove grey channel surround from channel
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.moveTo(channelLeftX, surroundTopY)
		ctx.lineTo(bLeftX, channelBottomY)
		ctx.lineTo(bRightX, channelBottomY)
		ctx.lineTo(channelRightX, surroundTopY)
		ctx.fill()
		// ctx.stroke()

		const gradient = ctx.createLinearGradient(0, canvasPaddingTop + levelDown, 0, channelBottomY)
		gradient.addColorStop(0, '#0bb')
		gradient.addColorStop(1, '#066')
		ctx.fillStyle = gradient
		ctx.strokeStyle = 'red'
		ctx.beginPath()
		ctx.moveTo(channelLeftX + leftSlopeDX, waterTopY)
		// ctx.moveTo(channelLeftX, waterTopY)
		ctx.lineTo(bLeftX, channelBottomY)
		ctx.lineTo(bRightX, channelBottomY)
		ctx.lineTo(channelRightX - rightSlopeDX, waterTopY)
		ctx.fill()
		// ctx.stroke()

		ctx.strokeStyle = 'black'
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.moveTo(channelLeftX - leftExtensionX, surroundTopY - leftExtensionY)
		ctx.lineTo(bLeftX, channelBottomY)
		ctx.lineTo(bRightX, channelBottomY)
		ctx.lineTo(channelRightX + rightExtensionX, surroundTopY - rightExtensionY)
		ctx.stroke()
	}

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}
</script>

{#if browser}
	<div bind:clientWidth={elWidthPx}>
		<!-- bind:this binds canvasWrap var to this DOM element -->
		<div class="canvas-wrap" bind:this={canvasWrap}>
			<!-- <div class="rect-wrap"> -->
			<canvas bind:this={canvas} width="200" height="100"> </canvas>
		</div>
		<!-- </div> -->
	</div>
	<!-- y: {y}, levelD: {sds(levelDown)}, waterTopY: {sds(waterTopY)}, channelBY: {channelBottomY}, dPx: {dPx} -->
	<!-- b: {bPx}, T: {T}, TPx: {TPx}, d: {dPx}, ar: {aspectRatio}, elWidthPx: {elWidthPx} -->
{/if}

<style>
	/* .w-90 {
		background: yellow;
		margin-block: 1em;
		margin-inline: auto;
		width: 90%;
		width: 40em;
	} */
	/* canvas { */
	/* width: 100%; */
	/* height: 100%; */
	/* width: fit-content; */
	/* margin-inline: 0; */
	/* border: 0.1px solid red; */
	/* } */
	/* .canvas-wrap { */
	/* background: darkseagreen; */

	/* margin-inline: auto; */
	/* padding-top: 1em; */
	/* padding-bottom: 3em; */
	/* padding-inline: 1em; */
	/* padding: 0; */
	/* width: fit-content; */
	/* width: 100%; */
	/* width: 20em; */
	/* } */
	/* .rect-wrap {
		position: relative;
		display: inline-block;
		width: 100%;
	} */
</style>
