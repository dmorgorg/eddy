<script>
	// @ts-nocheck

	import RYC from './RYC.svelte'
	import Card from '../Card.svelte'
	import Carrd from '../Carrd.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, rect } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { rectY } from '../../store.svelte.js'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	// @ts-ignore
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	// let bs = $derived(sds(rectY.base))
	// let ys = $derived(sds(rectY.depth))
	// let ss = $derived(sds(rectY.slope))
	// let ns = $derived(sds(rectY.n))
	// let gs = $derived(sd(rectY.g, 4, extraForSdigs))

	let b = $derived(Number(rectY.base))
	let y = $derived(Number(rectY.depth))
	let s = $derived(Number(rectY.slope))
	let n = $derived(Number(rectY.n))
	let g = $derived(Number(rectY.g))

	// calculations for rectangular channel with y specified
	let A = $derived(sdw(rect.getArea(b, y)))
	let P = $derived(sdw(rect.getP(b, y)))
	let R = $derived(sdw(common.getR(A, P)))
	let v = $derived(sdw(common.getV(n, R, s)))
	let Q = $derived(sdw(common.getQfromAandV(A, v)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sdw(rect.getT(b)))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(rect.getYc(Q, g, b)))
	let Pc = $derived(sdw(rect.getP(b, yc)))
	let Ac = $derived(sdw(rect.getArea(b, yc)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let vc = $derived(sdw(common.getVfromQandA(Q, Ac)))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	// Handles slope, n, g input changes; stores as numbers, updates input with formatted value
	const processChange = debounce((e) => {
		if (e.target.id === 'slope') {
			rectY.slope = e.target.value
			e.target.value = sds(rectY.slope)
		}
		if (e.target.id === 'n') {
			rectY.n = Number(e.target.value)
			e.target.value = sds(rectY.n)
		}
		if (e.target.id === 'g') {
			let formatted
			if (e.target.value.length > 4) {
				// formatted = sd(e.target.value, 5)
				console.log(e.target.value)
				rectY.g = Number(e.target.value)
				console.log(rectY.g)
				e.target.value = sd(rectY.g, 4)
			} else {
				formatted = sds(e.target.value)
				console.log(formatted)
				rectY.g = Number(formatted)
				e.target.value = sds(rectY.g)
			}
		}
	}, 1000)
</script>

<article>
	<!-- <section><RectangularYCanvas {aspectRatio} bind:base={bs} bind:depth={ys} /></section> -->
	<!-- <section><RYC bind:base={bs} bind:depth={ys} /></section> -->
	<section><RYC bind:base={rectY.base} bind:depth={rectY.depth} /></section>

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input
					type="number"
					value={sds(s)}
					id="slope"
					oninput={processChange}
					min="0.001"
					step="any"
					style="width: {digits.sdigs > 3 ? '7em' : '6em'}"
				/>
				<!-- slope input: always formatted -->
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input
					type="number"
					value={sds(n)}
					id="n"
					oninput={processChange}
					min="0"
					step="any"
					style="width: {digits.sdigs > 3 ? '7em' : '6em'}"
				/>
				<!-- n input: always formatted -->
			</label>
			<label>
				<span class="var-name">{@html ki('g =')}</span>
				<input
					type="number"
					value={sds(g)}
					id="g"
					oninput={processChange}
					min="0"
					step="any"
					style="width: 4em"
				/>
				<!-- g input: always formatted -->
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Carrd>
			{#snippet answer()}
				Flow Area: {@html ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A &= by \\\\
						&= ${sds(b)}\\, \\mathsf{m} \\times ${sdw(y)}\\, \\mathsf{m} \\\\
						&= ${A}\\, \\mathsf{m^2}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Wetted Perimeter: {@html ki(`P = ${sds(P)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						P &= b+2y \\\\
						&= ${sds(b)}\\, \\mathsf{m} + 2\\times ${sds(y)}\\, \\mathsf{m} \\\\
						&= ${P}\\, \\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Hydraulic Radius: {@html ki(`R = ${sds(R)}\\, \\mathsf m`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						R &= A/P \\\\
						&= ${A}\\, \\mathsf{m^2} / ${P}\\, \\mathsf{m} \\\\
						&= ${R} \\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Average Flow Velocity: {@html ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						v &= \\frac 1n R^{2/3} S^{1/2} \\\\
						&= \\frac{1}{${sds(n)}} \\left(${R}\\right)^{2/3} \\left(${sdw(s / 100)}\\right)^{1/2} \\\\
						&= ${v} \\, \\mathsf{m/s}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Flow Rate: {@html ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						Q &= Av \\\\
						&= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\
						&= ${Q} \\, \\mathsf{m^3/s}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Specific Energy: {@html ki(`E = ${sds(E)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						E &= y+\\frac{v^2}{2g} \\\\
						&= ${sds(y)}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
							{2(${sds(g)}\\, \\mathsf{m/s^2}) } \\\\
						&= ${E}\\,\\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Free Surface: {@html ki(`T = ${sds(T)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						T &= b \\\\
						&= ${sds(b)}\\, \\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Froude Number: {@html ki(`N_F = ${sds(NF)}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
						&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${sds(g)}\\, \\mathsf{m/s^2})\\cdot(${sdw(
							A
						)}\\, \\mathsf{m^2}/${sds(T)}\\, \\mathsf{m})}} \\\\
						&= ${sdw(NF)}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
	</section>

	<section class="results">
		<div class="heading">Critical Flow</div>
		<Carrd>
			{#snippet answer()}
				For {@html ki(`Q=${sdw(Q)} \\, \\mathsf{m^3\\!/s}`)}, Critical Depth {@html ki(
					`y_c=${sds(yc)} \\, \\mathsf{m}`
				)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						N_F &= 1 \\\\
						\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
						\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
						\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
						&= \\frac{\\left(by_c\\right)^3}{b}	\\\\
						&= b^2y_c^3 \\\\
						\\Rightarrow y_c^3 &= \\frac{Q^2}{b^2g} \\\\
						\\Rightarrow y_c &= \\sqrt[3]{\\frac{Q^2}{b^2g}} \\\\
						\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{(${sds(
							b
						)}\\, \\mathsf{m} )^2(${sds(g)}\\, \\mathsf{m/s^2})}}\\\\
						&= ${yc}\\, \\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Critical Velocity: {@html ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= by_c \\\\
						&= ${sds(b)}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
						&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
						v_c &= Q/A_c \\\\
						&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
						&= ${vc} \\,\\mathsf{m/s}
					\\end{aligned}	
				`)}
			{/snippet}
		</Carrd>
		<Carrd>
			{#snippet answer()}
				Minimum Specific Energy: {@html ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
						&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${sds(g)}\\, \\mathsf{m/s^2}) } \\\\
						&= ${Emin} \\,\\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				Slope for Critical Flow: {@html ki(`S_c = ${sds(Sc)}\\%`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= by_c \\\\
						&= ${sds(b)}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
						&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

						P_c &= b + 2y_c \\\\
						&= ${sds(b)}\\, \\mathsf{m}+2(${yc}\\, \\mathsf{m}) \\\\
						&= ${Pc}\\, \\mathsf{m}\\\\\\\\

						R_c &= A_c/P_c \\\\
						&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
						&= ${Rc}\\,\\mathsf{m}\\\\\\\\

						\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
						&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
						&= ${sdw(Number(Sc) / 100)} \\\\
						&= ${Sc}\\% 								
					\\end{aligned}
				`)}
			{/snippet}
		</Carrd>
		<!-- <Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd> -->
	</section>
</article>

<!-- {bs}, {ys}, {ss}, {ns}, {gs} -->
<!-- {bs}, {b}, {A} -->

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
		width: 34em;
		// width: fit-content;
	}
	.results {
		margin-inline: auto;
		width: 90%;
	}
	.heading {
		color: #088;
		font-size: 120%;
		font-weight: bold;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
</style>
