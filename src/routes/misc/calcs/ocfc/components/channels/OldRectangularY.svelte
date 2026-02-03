<script>
	import OldRectangularCanvas from './OldRectangularCanvas.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'

	// initial values
	const initBase = 3
	const initDepth = 1.75
	const initSlope = 0.1
	const initN = 0.013
	const initG = 9.81

	// variables ending in s are strings
	let bs = $derived(initBase)
	let ys = $derived(initDepth)
	let ss = $derived(initSlope)
	let ns = $derived(initN)
	let gs = $derived(initG)

	let base = $state(initBase)
	let depth = $state(initDepth)
	let slope = $state(initSlope)
	let n = $state(initN)
	let g = $state(initG)

	let baseLabelPos = $state({ x: 0, y: 0 })
	let depthLabelPos = $state({ x: 0, y: 0 })

	// Input values (update immediately as user types)
	let baseInput = $state(base)
	let depthInput = $state(depth)

	const debounceDelay = 2000 // ms

	const updateBase = debounce((value) => {
		base = value
	}, debounceDelay)

	const updateDepth = debounce((value) => {
		depth = value
	}, debounceDelay)

	// @ts-ignore
	function handleBaseInput(e) {
		baseInput = parseFloat(e.target.value)
		updateBase(baseInput)
	}

	// @ts-ignore
	function handleDepthInput(e) {
		depthInput = parseFloat(e.target.value)
		updateDepth(depthInput)
	}
</script>

<article>
	<section>
		<OldRectangularCanvas bind:base bind:depth yOrQ="y" bind:baseLabelPos bind:depthLabelPos>
			<label
				class="input-label base-label"
				style="left: {baseLabelPos.x}px; top: {baseLabelPos.y}px;"
			>
				<span class="var-name">{@html ki('b =')}</span>
				<input type="number" value={baseInput} oninput={handleBaseInput} min="0.01" step="any" />
				<span class="unit">{@html ki('\\mathsf{m}')}</span>
			</label>
			<label
				class="input-label depth-label"
				style="left: {depthLabelPos.x}px; top: {depthLabelPos.y}px;"
			>
				<span class="var-name">{@html ki('y =')}</span>
				<input type="number" value={depthInput} oninput={handleDepthInput} min="0.01" step="any" />
				<span class="unit">{@html ki('\\mathsf{m}')}</span>
			</label>
		</OldRectangularCanvas>
		<div class="params-row">
			<label class="param-input">
				<span class="var-name">{@html ki('S =')}</span>
				<input type="number" bind:value={slope} min="0.001" step="0.01" />
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label class="param-input">
				<span class="var-name">{@html ki('n =')}</span>
				<input type="number" bind:value={n} min="0.001" step="0.001" />
			</label>
			<label class="param-input">
				<span class="var-name">{@html ki('g =')}</span>
				<input type="number" bind:value={g} min="0.1" step="0.01" />
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
</article>

<style>
	.params-row {
		display: flex;
		justify-content: space-around;
		/* width: 100%; */
		/* max-width: 400px; */
		margin: 0 auto;
		/* gap: 1rem; */
		/* border: 1px solid black; */
	}

	.param-input {
		display: flex;
		align-items: center;
		gap: 0.25em;
		white-space: nowrap;
		background: white;
		border: 1px solid black;
		padding: 4px 6px;
		border-radius: 3px;
	}

	input[type='number'] {
		width: 4em;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}
	input[type='number']:focus {
		box-shadow: 1px 1px black;
		background: #088;
		border: none;
		color: white;
		outline: none;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.input-label {
		position: absolute;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 4px;
		background: white;
		border: 1px solid black;
		padding: 4px 6px;
		border-radius: 3px;
	}

	/* .input-label input[type='number'] {
		width: 80px;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	} */
	/* 
	.input-label input[type='number']::-webkit-outer-spin-button,
	.input-label input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.input-label input[type='number']:focus {
		outline: none;
		border: 2px solid black;
	} */

	.base-label {
		transform: translateX(-50%);
	}

	.depth-label {
		transform: translate(-50%, -50%);
	}
</style>
