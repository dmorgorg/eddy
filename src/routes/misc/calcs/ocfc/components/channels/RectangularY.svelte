<script>
	// @ts-nocheck

	import RYC from './RYC.svelte'
	import Card from '../Card.svelte'
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

	let bs = $derived(sds(rectY.base))
	let ys = $derived(sds(rectY.depth))
	let ss = $derived(sds(rectY.slope))
	let ns = $derived(sds(rectY.n))
	let gs = $derived(sd(rectY.g, 4, extraForSdigs))

	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(bs) / Number(ys), 1 / 6), 8) * 100) / 100
	)

	let b = $derived(Number(bs))
	let y = $derived(Number(ys))
	let s = $derived(Number(ss))
	let n = $derived(Number(ns))
	let g = $derived(Number(gs))

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
			let value = e.target.value
			// n.b. the string length counts the decimal point!
			if (value.length > 4) {
				console.log(value.length)
				// allow g=9.806
				gs = sd(value, 4)
			} else {
				gs = sds(value)
			}
			// gs = sd(e.target.value, 4, false)
			e.target.value = gs
		}
	})
</script>

<article>
	<!-- <section><RectangularYCanvas {aspectRatio} bind:base={bs} bind:depth={ys} /></section> -->
	<!-- <section><RYC bind:base={bs} bind:depth={ys} /></section> -->
	<section><RYC bind:base={bs} bind:depth={ys} /></section>

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
					style="width: {digits.sdigs > 3 ? '7em' : '6em'}"
				/>
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input
					type="number"
					value={ns}
					id="n"
					onkeydown={processChange}
					min="0"
					step="any"
					style="width: {digits.sdigs > 3 ? '7em' : '6em'}"
				/>
			</label>
			<label>
				<span class="var-name">{@html ki('g =')}</span>
				<input
					type="number"
					value={gs}
					id="g"
					oninput={processChange}
					min="0"
					step="any"
					style="width: 4em"
				/>
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>
		<Card
			answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
			solution={kd(`
						\\begin{aligned}
							A &= by \\\\
							&= ${bs}\\, \\mathsf{m} \\times ${ys}\\, \\mathsf{m} \\\\
							&= ${A}\\, \\mathsf{m^2}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf{m}`)}"
			solution={kd(`
						\\begin{aligned}
							P &= b+2y \\\\
							&= ${bs}\\, \\mathsf{m} + 2\\times ${ys}\\, \\mathsf{m} \\\\
							&= ${P}\\, \\mathsf{m}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
			solution={kd(`
						\\begin{aligned}
							R &= A/P \\\\
							&= ${A}\\, \\mathsf{m^2} / ${P}\\, \\mathsf{m} \\\\
							&= ${R} \\mathsf{m}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Average Flow Velocity: {ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}  "
			solution={kd(`
						\\begin{aligned}
							v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							&= \\frac{1}{${ns}} \\left(${R}\\right)^{2/3} \\left(${sdw(s / 100)}\\right)^{1/2} \\\\
							&= ${v} \\, \\mathsf{m/s}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
			solution={kd(`
						\\begin{aligned}
							Q &= Av \\\\
							&= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\
							&= ${Q} \\, \\mathsf{m^3/s}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
			solution={kd(`
						\\begin{aligned}
							E &= y+\\frac{v^2}{2g} \\\\
							&= ${ys}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
								{2(${gs}\\, \\mathsf{m/s^2}) } \\\\
							&= ${E}\\,\\mathsf{m}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
			solution={kd(`
						\\begin{aligned}
							T &= b \\\\
							&= ${sds(b)}\\, \\mathsf{m} \\\\
							
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
			solution={kd(`
						\\begin{aligned}
							N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${gs}\\, \\mathsf{m/s^2})\\cdot(${sdw(
								A
							)}\\, \\mathsf{m^2}/${sds(T)}\\, \\mathsf{m})}} \\\\
							&= ${sdw(NF)}
						\\end{aligned}
					`)}
		/>
	</section>

	<section class="results">
		<div class="heading">Critical Flow</div>
		<Card
			answer="For {ki(`Q=${sdw(Q)} \\, \\mathsf{m^3\\!/s}`)}, Critical Depth {ki(
				`y_c=${sds(yc)} \\, \\mathsf{m}`
			)}"
			solution={kd(`
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
								bs
							)}\\, \\mathsf{m} )^2(${gs}\\, \\mathsf{m/s^2})}}\\\\
							&= ${yc}\\, \\mathsf{m}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Critical Velocity: {ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}  "
			solution={kd(`
						\\begin{aligned}
							A_c &= by_c \\\\
							&= ${bs}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
							&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
							v_c &= Q/A_c \\\\
							&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
							&= ${vc} \\,\\mathsf{m/s}
						\\end{aligned}	
					`)}
		/>
		<Card
			answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}"
			solution={kd(`
						\\begin{aligned}
							E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
							&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${gs}\\, \\mathsf{m/s^2}) } \\\\
							&= ${Emin} \\,\\mathsf{m}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc)}\\%`)}"
			solution={kd(`
						\\begin{aligned}
							A_c &= by_c \\\\
							&= ${bs}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
							&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

							P_c &= b + 2y_c \\\\
							&= ${bs}\\, \\mathsf{m}+2(${yc}\\, \\mathsf{m}) \\\\
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
		/>
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
