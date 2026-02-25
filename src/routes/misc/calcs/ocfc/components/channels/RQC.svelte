<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	// import { RectangleBTween } from '../../RectangleBTween.svelte.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	let { base = $bindable(), Qflow = $bindable(), depth = $bindable() } = $props()

	let canvas = $state()
	let canvasWrap = $state()
	let canvasPaddingTop = $state(8)
	let channelExtension = $state(8)
	let channelExtensionY = $derived(canvasPaddingTop)
	let waterTopY = $derived(canvasPaddingTop + channelExtension)
	let waterBottomY = $derived(waterTopY + ypx)
	let waterLeftX = $derived(canvasPaddingLeft)
	let waterRightX = $derived(canvasPaddingLeft + bpx)
	let canvasPaddingBottom = $state(48)
	let canvasPaddingLeft = $state(8)
	let canvasPaddingRight = $state(8)

	let baseDimensionYPixels = $derived(waterBottomY + 24)
	let widthInPixels = $state(0)
	let maxDepthPixels = $derived(widthInPixels * 0.5)
	let bpx = $state(0)
	let ypx = $state(0)

	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

	$effect(() => {
		setChannelPixels(aspectRatio)
	})

	const setChannelPixels = (aspectRatio) => {
		bpx = (() => {
			let d
			if (aspectRatio < 1) {
				// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
				d = 36 * aspectRatio + 4
			} else {
				// maps ... 1 to 40, 8 to 89
				d = 7 * aspectRatio + 33
			}
			return Math.round((d / 100) * widthInPixels.toFixed(2))
		})()
		ypx = Math.round(bpx / aspectRatio)
		if (ypx > maxDepthPixels) {
			ypx = maxDepthPixels
			bpx = Math.round(ypx * aspectRatio)
		}
	}

	const draw = (basePixels, depthPixels) => {
		if (!canvas) return
		let lineWidth = 5
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.canvas.height = depthPixels + canvasPaddingTop + canvasPaddingBottom + channelExtension
		ctx.canvas.width = basePixels + canvasPaddingLeft + canvasPaddingRight
		// draw water in channel
		const gradient = ctx.createLinearGradient(0, canvasPaddingTop, 0, ypx)
		gradient.addColorStop(0, '#0dd')
		// gradient.addColorStop(0.5, 'yellow')
		gradient.addColorStop(1, '#077')
		ctx.fillStyle = gradient
		// ctx.fillStyle = 'yellow'
		ctx.fillRect(waterLeftX, waterTopY, basePixels, depthPixels)

		//draw walls
		ctx.beginPath()
		ctx.lineWidth = lineWidth + 2
		ctx.moveTo(waterLeftX, channelExtensionY - 2)
		ctx.lineTo(snap(waterLeftX, lineWidth), snap(waterBottomY, lineWidth))
		ctx.lineTo(snap(waterLeftX + bpx, lineWidth), snap(waterBottomY, lineWidth))
		ctx.lineTo(snap(waterRightX, lineWidth), snap(channelExtensionY - 2, lineWidth))
		ctx.strokeStyle = 'black'
		// ctx.lineCap = 'round'
		ctx.stroke()
		//draw walls
		ctx.beginPath()
		ctx.lineWidth = lineWidth - 1
		ctx.moveTo(waterLeftX, channelExtensionY)
		ctx.lineTo(snap(waterLeftX, lineWidth), snap(waterBottomY, lineWidth))
		ctx.lineTo(snap(waterLeftX + bpx, lineWidth), snap(waterBottomY, lineWidth))
		ctx.lineTo(snap(waterRightX, lineWidth), snap(channelExtensionY, lineWidth))
		ctx.strokeStyle = '#c1cdcd'
		// ctx.lineCap = 'round'
		ctx.stroke()

		// draw directed line segment from top-center to bottom-center of rectangle
		const midX = waterLeftX + basePixels / 2
		drawDirectedLineSegment(ctx, midX, waterTopY, midX, waterBottomY - 3, 'black', 2, 7)
		// draw directed line segment for base width dimension
		drawDirectedLineSegment(
			ctx,
			waterLeftX + 2,
			baseDimensionYPixels,
			waterRightX - 2,
			baseDimensionYPixels,
			'black'
		)
	}

	$effect(() => {
		// void bpx
		// void ypx
		draw(bpx, ypx)
	})

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}

	const processChange = debounce((e) => {
		if (e.target.id === 'base') {
			const formatted = sds(e.target.value)
			base = Number(formatted)
			e.target.value = formatted
		}
		if (e.target.id === 'Qflow') {
			const formatted = sds(e.target.value)
			Qflow = Number(formatted)
			e.target.value = formatted
		}
	})
</script>

{#if browser}
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<!-- bind:this binds canvasWrap var to this DOM element -->
		<div class="canvas-wrap" bind:this={canvasWrap}>
			<div class="rect-wrap">
				<canvas bind:this={canvas} width="100" height="100"> </canvas>
				<label class="depth-label" style="top: {waterTopY + ypx / 2 - 1}px;">
					<!-- Depth: -->
					<span class="unit">{@html ki('\\large Q=')}</span>
					<input
						type="number"
						value={sds(Qflow)}
						step="any"
						min="0"
						id="Qflow"
						oninput={processChange}
					/>
					<span class="unit">{@html ki('\\mathsf{ m^3/s}')}</span>
				</label>
				<label class="base-label" style="top: {baseDimensionYPixels}px;">
					<!-- Base: -->
					<span class="unit">{@html ki('\\large b=')}</span>
					<input
						type="number"
						value={sds(base)}
						step="any"
						min="0"
						id="base"
						oninput={processChange}
					/>
					<span class="unit">{@html ki('\\mathsf{m}')}</span>
				</label>
			</div>
		</div>
	</div>
	<!-- {bpx}, {ypx},{aspectRatio} <br />
	{widthInPixels}, {base}, {depth}, {(bpx / widthInPixels).toFixed(2)}, {(
		ypx / widthInPixels
	).toFixed(2)} <br /> -->
{/if}

<style>
	.full-width {
		/* background: pink; */
		margin-block: 1em;
		margin-inline: auto;
		/* width: 90%; */
	}
	canvas {
		/* width: 100%;
		height: 100%; */
		width: fit-content;
		margin-inline: auto;
		/* border: 2px solid red; */
	}
	.canvas-wrap {
		/* background: darkseagreen; */
		margin-inline: auto;
		padding-top: 1em;
		padding-bottom: 3em;
		padding-inline: 1em;
		padding: 0;
		width: fit-content;
		/* width: 20em; */
	}
	.rect-wrap {
		/* border: 1px solid blue; */
		position: relative;
		display: inline-block;
	}
	.base-label,
	.depth-label {
		align-items: center;
		background: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		display: flex;
		font-size: 0.95em;
		gap: 0.125em;
		justify-content: center;
		margin-inline: auto;
		padding: 0.25em 0.625em;
		white-space: nowrap;
		width: fit-content;
		/* z-index: 10; */
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.depth-label {
		box-shadow: none;
	}
	input {
		width: 4em;
		padding: 0;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		/* font-size: 0.875em; */
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;

		&:focus,
		&:hover {
			border: 0.125em solid #088;
			outline: none;
		}
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.unit {
		font-size: 0.925em;
	}
</style>
