<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	let { base = $bindable(), depth = $bindable() } = $props()

	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}

	let canvas = $state()
	let divWidth = $state(0)
	let divHeight = $state(0)
	let widthInPixels = $state()
	let bpx = $state(0)
	let ypx = $state(0)

	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

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

	$effect(() => {
		// this will re-run whenever bpx,ypx change

		// https://www.geeksforgeeks.org/javascript/javascript-anonymous-functions/
		bpx = (() => {
			let d
			if (aspectRatio < 1) {
				// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
				d = 36 * aspectRatio + 4
			} else {
				// maps ... 1 to 40, 8 to 89
				d = 7 * aspectRatio + 33
			}
			return Math.round((d / 100) * widthInPixels)
		})()
		ypx = Math.round(bpx / aspectRatio)
		if (ypx > 150) {
			ypx = 150
			bpx = Math.round(ypx * aspectRatio)
		}
		const context = canvas.getContext('2d')
		// context.clearRect(0, 0, canvas.width, canvas.height)
		const gradient = context.createLinearGradient(0, 0, 0, ypx)
		gradient.addColorStop(0, '#0cc')
		gradient.addColorStop(1, '#066')
		context.fillStyle = gradient
		context.fillRect(0, 0, bpx, ypx)
	})
</script>

{#if browser}
	<!-- this copies the width of the div to the widthInPixel var -->
	<div class="full-width" bind:clientWidth={widthInPixels}>
		<div class="canvas">
			<canvas bind:this={canvas} width={bpx} height={ypx}></canvas>
			<!-- <input type="range" bind:value={aspectRatio} min="0.167" max="8" step="any" /> -->
			<label class="base-input">
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
			<label class="depth-input">
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
	}
	canvas {
		/* background: pink; */
		margin-inline: auto;
		width: fit-content;
	}
	.full-width {
		display: block;
	}
	.base-input,
	.depth-input {
		align-items: center;
		background: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		/* position: absolute; */
		/* transform: translate(-50%, -50%); */
		display: flex;
		font-size: 1em;
		gap: 0.125em;
		padding: 0.25em 0.625em;
		white-space: nowrap;
		width: fit-content;
		z-index: 10;
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
		/* font-size: 0.875em; */
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
