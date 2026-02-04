<script>
	import RectangularCanvas from './RectangularCanvas.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'

	// initial values
	const initBase = '1'
	// const initDepth = '1.500'
	const initDepth = '1'
	const initSlope = 0.1
	const initN = 0.013
	const initG = 9.81

	let base = $state(initBase)
	let depth = $state(initDepth)
	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

	// let base = $state(initBase)
	// let depth = $state(initDepth)
	let slope = $state(initSlope)
	let n = $state(initN)
	let g = $state(initG)
</script>

<article>
	<section><RectangularCanvas {aspectRatio} /></section>
	<label class="shrink">
		Base:
		<input type="number" bind:value={base} step="any" min="0" />
		<span class="unit">{@html ki('\\mathsf{m}')}</span>
	</label>

	<label class="shrink">
		Depth:
		<input type="number" bind:value={depth} step="any" min="0" />
		<span class="unit">{@html ki('\\mathsf{m}')}</span>
	</label>

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input type="number" bind:value={slope} min="0.001" step="any" />
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input type="number" bind:value={n} min="0" step="any" />
			</label>
			<label>
				<span class="var-name">{@html ki('g =')}</span>
				<input type="number" bind:value={g} min="0" step="any" />
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
</article>

<style lang="scss">
	.inputs-row {
		display: flex;
		gap: 1em;
		justify-content: center;
		margin: 0 auto;
		// border: 1px solid black;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.25em;
		white-space: nowrap;
		background: white;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		// padding: 4px 6px;
		padding: 0.25em 0.625em;
		border-radius: 3px;

		&.shrink {
			width: fit-content;
			margin-inline: auto;
		}
	}

	input[type='number'] {
		width: 5em;
		padding: 0.125em;
		padding: 0;
		border: 1px solid #ccc;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	input[type='number']:focus {
		// box-shadow: 1px 1px black;
		// background: #088;
		border: 0.125em solid #088;
		// box-sizing: border-box;
		outline: none;
		// outline: 1px #000 solid;
		// color: white;
		// border-color: #088;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	article {
		// border: 2px solid green;
		margin-inline: auto;
		width: 38em;
	}
</style>
