<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { RectangleBTween } from '../../RectangleBTween.svelte.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	let { base = $bindable(), depth = $bindable() } = $props()

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}

	let canvas = $state()
	let canvasWrap = $state()
	let ctx
	// let divWidth = $state(0)
	// let divHeight = $state(0)
	let widthInPixels = $state()
	let bpx = $state(0)
	let ypx = $state(0)
	let baseLineY = $state(0)
	let lastWidthInPixels = $state(0)
	let lastCanvas = $state(null)
	let emToPx = $state(16)
	const maxDepthPx = 150
	let wallRisePx = $derived(0 * emToPx)
	let dimensionInsetPx = $derived(0.35 * emToPx)
	let baseLineOffsetPx = $derived(2 * emToPx)
	let canvasTopPaddingPx = $derived(1 * emToPx)
	let canvasBottomPaddingPx = $derived(3 * emToPx)

	const availableWidth = widthInPixels || canvasWrap?.clientWidth || 0

	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

	$effect(() => {
		setChannelPixels(base, depth)
	})

	const setChannelPixels = (baseInput, depthInput) => {
		bpx = (() => {
			let d
			if (aspectRatio < 1) {
				// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
				d = 36 * aspectRatio + 4
			} else {
				// maps ... 1 to 40, 8 to 89
				d = 7 * aspectRatio + 33
			}
			return Math.round((d / 100) * availableWidth)
		})()
		ypx = Math.round(bpx / aspectRatio)
		if (ypx > maxDepthPx) {
			ypx = maxDepthPx
			bpx = Math.round(ypx * aspectRatio)
		}
	}
	const computeRatio = (baseValue, depthValue) => {
		const rawRatio = Number(baseValue) / Number(depthValue)
		return Math.min(Math.max(rawRatio, 1 / 6), 8)
	}
	const ratioTween = new RectangleBTween(computeRatio(base, depth))

	const processChange = debounce((e) => {
		if (e.target.id === 'base') {
			base = sds(e.target.value)
			// force binding back to input when backspacing/delete of trailing decimal zeros don't update
			e.target.value = base
		}
		if (e.target.id === 'depth') {
			depth = sds(e.target.value)
			e.target.value = depth
		}
	})

	const debouncedRatioTween = debounce(() => {
		ratioTween.to(computeRatio(base, depth), {
			onUpdate: (value) => DrawRectangular(base, depth, value)
		})
	})

	const ensureCanvasSize = () => {
		if (!canvas) return
		const availableWidth = widthInPixels || canvasWrap?.clientWidth || 0
		if (!availableWidth) return
		canvas.width = availableWidth
	}

	const updateEmToPx = () => {
		if (!canvasWrap) return
		const fontSize = parseFloat(getComputedStyle(canvasWrap).fontSize)
		emToPx = Number.isFinite(fontSize) ? fontSize : 16
	}

	$effect(() => {
		if (!browser) return
		// void canvasWrap is used to mark canvasWrap as a dependency for the $effect. In Svelte, reading a value inside an effect makes the effect re‑run when that value changes. void canvasWrap is just a terse way to read it without using it. (Tx for that, Claude! ;) )
		void canvasWrap
		updateEmToPx()
	})

	const DrawRectangular = (baseValue, depthValue, ratioOverride) => {
		if (!canvas) return
		// const availableWidth = widthInPixels || canvasWrap?.clientWidth || 0
		if (!availableWidth) return
		const ratio = Number.isFinite(ratioOverride)
			? ratioOverride
			: computeRatio(baseValue, depthValue)

		// https://www.geeksforgeeks.org/javascript/javascript-anonymous-functions/
		// bpx = (() => {
		// 	let d
		// 	if (ratio < 1) {
		// 		// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
		// 		d = 36 * ratio + 4
		// 	} else {
		// 		// maps ... 1 to 40, 8 to 89
		// 		d = 7 * ratio + 33
		// 	}
		// 	return Math.round((d / 100) * availableWidth)
		// })()
		// ypx = Math.round(bpx / ratio)
		// if (ypx > maxDepthPx) {
		// 	ypx = maxDepthPx
		// 	bpx = Math.round(ypx * ratio)
		// }
		const xOffset = Math.round((availableWidth - bpx) / 2)
		const waterTop = canvasTopPaddingPx + wallRisePx
		const waterBottom = waterTop + ypx
		const canvasHeight = waterBottom + baseLineOffsetPx + canvasBottomPaddingPx
		if (canvas.height !== Math.round(canvasHeight)) {
			canvas.height = Math.round(canvasHeight)
		}
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)
		const gradient = context.createLinearGradient(0, waterTop, 0, waterBottom)
		gradient.addColorStop(0, '#0cc')
		gradient.addColorStop(1, '#066')
		context.fillStyle = gradient
		context.fillRect(xOffset, waterTop, bpx, ypx)

		// Draw channel walls: left/right/bottom, extending wallRise above water surface
		const wallLineWidth = 3
		const wallSnap = (value) =>
			wallLineWidth % 2 === 0 ? Math.round(value) : Math.round(value) + 0.5
		const wallTop = wallLineWidth / 2
		context.strokeStyle = '#333'
		context.lineWidth = wallLineWidth
		context.lineCap = 'round'
		context.beginPath()
		context.moveTo(wallSnap(xOffset), wallSnap(wallTop))
		context.lineTo(wallSnap(xOffset), wallSnap(waterBottom))
		context.lineTo(wallSnap(xOffset + bpx), wallSnap(waterBottom))
		context.lineTo(wallSnap(xOffset + bpx), wallSnap(wallTop))
		context.stroke()

		context.strokeStyle = '#111'
		context.fillStyle = '#111'
		const dimLineWidth = 1
		context.lineWidth = dimLineWidth
		context.lineCap = 'butt'
		// snap is to avoid drawing on a partial pixel, resulting in blurriness
		const snap = (value) => (dimLineWidth % 2 === 0 ? Math.round(value) : Math.round(value) + 0.5)

		const yLineTop = snap(waterTop)
		const yLineBottom = snap(waterBottom - dimensionInsetPx)
		const yLineX = snap(xOffset + bpx / 2)
		drawDirectedLineSegment(context, yLineX, yLineTop, yLineX, yLineBottom)

		baseLineY = snap(waterBottom + baseLineOffsetPx)
		const bLineLeft = snap(xOffset + dimensionInsetPx)
		const bLineRight = snap(xOffset + bpx - dimensionInsetPx)
		drawDirectedLineSegment(context, bLineLeft, baseLineY, bLineRight, baseLineY)
	}

	$effect(() => {
		void base
		void depth
		debouncedRatioTween()
	})

	$effect(() => {
		void canvas
		const widthNow = widthInPixels
		void wallRisePx
		void dimensionInsetPx
		void baseLineOffsetPx
		void canvasTopPaddingPx
		void canvasBottomPaddingPx
		if (!canvas || !widthNow) return
		if (canvas === lastCanvas && widthNow === lastWidthInPixels) return
		lastWidthInPixels = widthNow
		lastCanvas = canvas
		ensureCanvasSize()
		ratioTween.to(computeRatio(base, depth), {
			onUpdate: (value) => DrawRectangular(base, depth, value),
			duration: 0
		})
	})
</script>

{#if browser}
	<!-- this copies the width of the div to the widthInPixel var -->
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<div class="canvas" bind:this={canvasWrap}>
			<div class="rect-wrap">
				<canvas bind:this={canvas}></canvas>
				<label class="depth-input" style="top: {canvasTopPaddingPx + wallRisePx + ypx / 2}px;">
					<!-- Depth: -->
					<span class="unit">{@html ki('y=')}</span>
					<input
						type="number"
						bind:value={depth}
						step="any"
						min="0"
						id="depth"
						oninput={processChange}
					/>
					<span class="unit">{@html ki('\\mathsf{ m}')}</span>
				</label>
				<label class="base-input" style="top: {baseLineY}px;">
					<!-- Base: -->
					<span class="unit">{@html ki('b=')}</span>
					<input
						type="number"
						bind:value={base}
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
{/if}

<style>
	.canvas {
		/* border: 1px solid blue; */
		margin-inline: auto;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-inline: 1em;
		padding: 1em;
		width: fit-content;
		/* border: 3px solid red; */
	}
	.rect-wrap {
		position: relative;
		display: inline-block;
	}

	.full-width {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.base-input,
	.depth-input {
		align-items: center;
		background: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		display: flex;
		font-size: 1em;
		gap: 0.125em;
		justify-content: center;
		margin-inline: auto;
		padding: 0.25em 0.625em;
		white-space: nowrap;
		width: fit-content;
		/* z-index: 10; */
	}
	.depth-input {
		box-shadow: none;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.base-input {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.base-input .unit,
	.depth-input .unit {
		font-size: 0.925em;
	}
	.base-input input,
	.depth-input input {
		width: 4em;
		padding: 0;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}
	.base-input input:focus,
	.depth-input input:focus {
		border: 0.125em solid #088;
		outline: none;
	}
	.base-input input::-webkit-outer-spin-button,
	.base-input input::-webkit-inner-spin-button,
	.depth-input input::-webkit-outer-spin-button,
	.depth-input input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
