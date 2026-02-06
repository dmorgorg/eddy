<script>
	import RectangularCanvas from './RectangularCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'
	import { rectY } from '../../rect.svelte'
	// let { test } = rectY

	// initial values
	const initBase = '3'
	const initDepth = '1.5'
	// const initDepth = '1'
	const initSlope = '0.1'
	const initN = '0.013'
	const initG = '9.81'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	// @ts-ignore
	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	// @ts-ignore
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	let bs = $derived(sds(rectY.base))
	let ys = $derived(sds(rectY.depth))
	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(bs) / Number(ys), 1 / 6), 8) * 100) / 100
	)

	// let bs = $state(+initBase)
	// let y = $state(+initDepth)

	let ss = $derived(sds(rectY.slope))
	let ns = $derived(sds(rectY.n))
	let gs = $derived(sds(rectY.g))

	const processChange = debounce((e) => {
		if (e.target.id === 'slope') {
			// let slope = e.target.value
			ss = sds(e.target.value)
			// force binding back to input when backspacing/delete of trailing decimal zeros don't update
			e.target.value = ss
		}
		if (e.target.id === 'n') {
			ns = sds(e.target.value)
			e.target.value = ns
		}
		if (e.target.id === 'g') {
			gs = sds(e.target.value)
			e.target.value = gs
		}
	})
</script>

<article>
	<section><RectangularCanvas {aspectRatio} bind:base={bs} bind:depth={ys} /></section>

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input
					type="number"
					value={ss}
					id="slope"
					onkeydown={processChange}
					min="0.001"
					step="any"
					style="width: {digits.sdigs > 3 ? '6em' : '5em'}"
				/>
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input
					type="number"
					bind:value={ns}
					id="n"
					onkeydown={processChange}
					min="0"
					step="any"
					style="width: {digits.sdigs > 3 ? '6em' : '4em'}"
				/>
			</label>
			<label>
				<span class="var-name">{@html ki('g =')}</span>
				<input
					type="number"
					bind:value={gs}
					id="g"
					oninput={processChange}
					min="0"
					step="any"
					style="width: {digits.sdigs > 3 ? '6em' : '4em'}"
				/>
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
{bs}, {ys}, {ss}, {ns}, {gs}

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

		// &.shrink {
		// 	width: fit-content;
		// 	margin-inline: auto;
		// }
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
