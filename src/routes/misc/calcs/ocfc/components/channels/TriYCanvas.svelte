<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	import { drawDirectedLineSegment, snap } from '$lib/utilities/canvasUtils.js'
	import { triY } from '../../store.svelte.js'
	let { zl = $bindable(), zr = $bindable(), depth = $bindable() } = $props()

	let canvas = $state()
	let canvasWrap = $state()

	let maxDepthPixels = $state(125)
	let minDepthPixels = $state(50)
	let widthInPixels = $state(0)
	let canvasPaddingInline = $state(20)
	let canvasPaddingTop = $derived(2 * canvasPaddingInline)
	let canvasPaddingBottom = $derived(2 * canvasPaddingInline)
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
	let channelRightX = $derived(canvasPaddingInline + channelWidthPixels)
	let channelTopY = $derived(canvasPaddingTop)
	let channelBottomY = $derived(canvasPaddingTop + channelDepthPixels)
	let channelBaseX = $derived(canvasPaddingInline + (channelWidthPixels * zl) / (zl + zr))

	let extension = $state(15)
	let angleL = $derived(Math.atan(channelDepthPixels / channelBaseX))
	let angleLX = $derived(Math.cos(angleL) * extension)
	let angleLY = $derived(Math.sin(angleL) * extension)
	let angleR = $derived(Math.atan(channelDepthPixels / (channelWidthPixels - channelBaseX)))
	let angleRX = $derived(Math.cos(angleR) * extension)
	let angleRY = $derived(Math.sin(angleR) * extension)

	// console.log('wip: ' + widthInPixels)

	$effect(() => {
		// const { b, y } = setChannelPixels(aspectRatio)
		draw()
	})

	const draw = () => {
		if (!canvas) return
		let lineWidth = 5
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.canvas.height = canvasHeightPixels
		ctx.canvas.width = canvasWidthPixels
		ctx.fillStyle = '#c1cdcd'
		ctx.fillRect(
			0,
			channelTopY,
			channelWidthPixels + 2 * canvasPaddingInline,
			channelDepthPixels + canvasPaddingInline
		)
		const gradient = ctx.createLinearGradient(0, canvasPaddingTop, 0, channelBottomY)
		gradient.addColorStop(0, '#0bb')
		gradient.addColorStop(1, '#066')
		ctx.fillStyle = gradient
		ctx.beginPath()
		ctx.moveTo(channelLeftX, channelTopY)
		ctx.lineTo(channelBaseX, channelBottomY)
		ctx.lineTo(channelRightX, channelTopY)
		ctx.fill()
		ctx.strokeStyle = 'black'
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.beginPath()
		ctx.lineWidth = 4
		ctx.moveTo(channelLeftX - angleLX, channelTopY - angleLY)
		ctx.lineTo(channelBaseX, channelBottomY)
		// ctx.stroke()
		ctx.lineTo(channelRightX + angleRX, channelTopY - angleRY)
		// ctx.lineTo(channelBaseX, channelBottomY)
		ctx.stroke()
	}

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}

	const processChange = debounce((e) => {
		if (e.target.id === 'zl') {
			const formatted = sds(e.target.value)
			zl = Number(formatted)
			e.target.value = formatted
		}
		if (e.target.id === 'zr') {
			const formatted = sds(e.target.value)
			zr = Number(formatted)
			e.target.value = formatted
		}
		if (e.target.id === 'depth') {
			const formatted = sds(e.target.value)
			depth = Number(formatted)
			e.target.value = formatted
		}
	}, 1000)
</script>

{#if browser}
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<!-- bind:this binds canvasWrap var to this DOM element -->
		<div class="canvas-wrap" bind:this={canvasWrap}>
			<div class="rect-wrap">
				<canvas bind:this={canvas} width="200" height="100"> </canvas>
				<label class="depth-label">
					<!-- Depth: -->
					<span class="unit">{@html ki('\\large y=')}</span>
					<input
						type="number"
						value={sds(depth)}
						step="any"
						min="0"
						id="depth"
						oninput={processChange}
					/>
					<span class="unit">{@html ki('\\mathsf{ m}')}</span>
				</label>
				<label class="zl-label">
					<!-- Base: -->
					<span class="unit">{@html ki('\\large z_L=')}</span>
					<input type="number" value={sds(zl)} step="any" min="0" id="zl" oninput={processChange} />
				</label>
				<label class="zr-label">
					<!-- zr: -->
					<span class="unit">{@html ki('\\large z_R=')}</span>
					<input type="number" value={sds(zr)} step="any" min="0" id="zr" oninput={processChange} />
				</label>
			</div>
		</div>
	</div>
{/if}

widthInPixels: {widthInPixels}, aspectRatio: {aspectRatio}<br /> channelWidth: {channelWidthPixels},
channelDepth: {sds(channelDepthPixels)} <br />
canvas.width: {canvasWidthPixels}, canvas.height: {sds(canvasHeightPixels)}<br />
zl: {zl}, zr: {zr}, zl/(zl+zr): {sds(zl / (zl + zr))}, baseX: {channelBaseX}

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
		/* border: 0.1px solid red; */
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
	.depth-label,
	.zl-label,
	.zr-label {
		align-items: center;
		background: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		display: flex;
		font-size: inherit;
		gap: 0.125em;
		justify-content: center;
		/* margin-inline: auto; */
		padding: 0.25em 0.625em;
		white-space: nowrap;
		width: fit-content;
		/* z-index: 10; */
		position: absolute;
		/* left: 50%; */
		/* transform: translate(-50%, -50%); */
	}
	.depth-label {
		box-shadow: none;
		top: 100%;
		left: 50%;
		/* this is for centering the input at left: 50%, etc. */
		transform: translate(-50%, -50%);
	}
	.zl-label {
		box-shadow: none;
		top: 100%;
		left: 0%;
		transform: translate(-50%, -100%);
	}
	.zr-label {
		box-shadow: none;
		top: 100%;
		right: 0%;
		transform: translate(50%, -100%);
	}
	input {
		width: 4em;
		padding: 0;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		font-size: 0.9em;
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
	/* .unit {
		font-size: 0.925em;
	} */
</style>
