<script>
	import RectangularCanvas from './RectangularCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'

	// initial values
	const initBase = '3.00'
	const initDepth = '1.500'
	// const initDepth = '1'
	const initSlope = 0.1
	const initN = 0.013
	const initG = 9.81

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits
	let base = $state(initBase)
	let depth = $state(initDepth)
	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

	// @ts-ignore
	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	// @ts-ignore
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	let slope = $state(initSlope)
	let n = $state(initN)
	let g = $state(initG)

	let bs = $derived(sds(initBase))
	let ys = $derived(sds(initDepth))
	let ss = $derived(sds(initSlope))
	let ns = $derived(sds(initN))
	let gs = $derived(sds(initG))

	const processChange = debounce((e) => {
		if (e.target.id === 'base') {
			if (e.target.value === '') {
				bs = sds(initBase)
			}
		}
	})
</script>

<article>
	<section><RectangularCanvas {aspectRatio} bind:base bind:depth /></section>

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input type="number" bind:value={ss} min="0.001" step="any" />
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input type="number" bind:value={ns} min="0" step="any" />
			</label>
			<label>
				<span class="var-name">{@html ki('g =')}</span>
				<input type="number" bind:value={gs} min="0" step="any" />
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
	<section class="results">
		<div class="heading">Normal Flow</div>
		<Card />
		<div class="heading">Critical Flow</div>
	</section>
</article>
slope: {sds(ss)}, n: {ns}, g: {gs}, test: {sds(1.2)}, test2: {sds(1.20000001)}, {sdigs}

<style lang="scss">
	.inputs-row {
		// font-size: 80%;
		display: flex;
		gap: 0.5em;
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
		padding: 0.25em 0.625em;
		border-radius: 3px;

		&.shrink {
			width: fit-content;
			margin-inline: auto;
		}
	}

	input[type='number'] {
		width: 4em;
		padding: 0;
		border: 1px solid #ccc;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		font-size: 0.625rem;
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
	.results {
		// background: green;
		margin-inline: auto;
		width: 80%;
	}
	.heading {
		color: #088;
		font-size: 120%;
		font-weight: bold;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
</style>
