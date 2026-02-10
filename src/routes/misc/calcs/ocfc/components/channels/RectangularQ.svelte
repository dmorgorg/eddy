<script>
	import RectangularQCanvas from './RectangularQCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, rect } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { rectQ } from '../../rect.svelte'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	// @ts-ignore
	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	// @ts-ignore
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	const getQFromY = (y = 0) => {
		var A = b * y
		let v = common.getV(n, common.getR(rect.getArea(b, y), rect.getP(b, y)), s)
		return A * v
	}

	const getYFromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2
		console.log(delta + ', ' + low + ', ' + high)
		if (Math.abs(low - high) < delta) {
			return (low + high) * 0.5
		}
		// search
		if (getQFromY(mid) < Q) {
			return getYFromQ(mid, high)
		} else {
			return getYFromQ(low, mid)
		}
	}

	let bs = $derived(sds(rectQ.base))
	let Qs = $derived(sds(rectQ.Q))
	let ss = $derived(sds(rectQ.slope))
	let ns = $derived(sds(rectQ.n))
	let gs = $derived(sd(rectQ.g, 3, extraForSdigs))

	let b = $derived(Number(bs))
	let Q = $derived(Number(Qs))
	let s = $derived(Number(ss))
	let n = $derived(Number(ns))
	let g = $derived(Number(gs))

	let y = $derived(sdw(getYFromQ()))
	let ys = $derived(sdw(y))
	let A = $derived(sdw(rect.getArea(b, y)))
	let v = $derived(sdw(common.getVfromQandA(Q, A)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sds(b))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(rect.getYc(Q, g, b)))
	let Ac = $derived(sdw(rect.getArea(b, yc)))
	let vc = $derived(sdw(common.getVfromQandA(Q, Ac)))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(rect.getP(b, yc)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	let aspectRatio = $derived(
		Math.round(Math.min(Math.max(Number(bs) / Number(ys), 1 / 6), 8) * 100) / 100
	)

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
	<section><RectangularQCanvas {aspectRatio} bind:base={bs} bind:depth={Qs} /></section>

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
		<!-- <section class="normal"> -->
		<div class="heading">Normal (Uniform) Flow</div>
		<Card
			answer="Depth of flow: {ki(`${sds(ys)}\\, \\mathsf{m}`)}"
			solution="{kd(`
							\\begin{aligned}
								Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\
								&= \\frac 1n \\cdot by\\cdot\\left(\\frac{by}{b+2y}\\right)^{2/3}\\!\\!\\cdot S^{ 1/2 } \\\\
								\\Rightarrow ${Qs}\\, \\mathsf{m^3\\!/s} &= \\frac 1{${ns}} \\cdot (${bs}\\, \\mathsf{m})y\\\\
								&\\qquad\\times\\left(\\frac{${bs}y}{${bs}+2y}\\right)^{2/3}\\!\\!\\cdot\\! (${sdw(s / 100)})^{ 1/2 } 
							\\end{aligned}`)}
							<div style='width: 85%; margin-left: 7.5%; '>The expression above cannot be solved directly (analytically) for {ki(
				`y`
			)}. It may be solved using trial-and-error methods but it is generally more convenient to find {ki(
				'y'
			)} using a numerical solver on a scientific calculator or in a spreadsheet app.<br/><br/> (This calculator uses an automated type of trial-and-error called a binary search, probably similar to how your calculator does it.)</div>
							{kd(`
							y=${y}\\, \\mathsf{m}
							`)}"
		/>
		<Card
			answer="Flow Area: {ki(`${sds(A)}\\, \\mathsf{m^2}`)} "
			solution={kd(`
						\\begin{aligned}
							A &= by \\\\
							&= ${bs}\\, \\mathsf{m}\\times ${ys}\\, \\mathsf{m} \\\\							
							&= ${A} \\, \\mathsf{m^2}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Average Flow Velocity: {ki(`${sds(v)}\\, \\mathsf{m/s} `)}"
			solution={kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${Qs}\\, \\mathsf{m^3\\!/s}}{${A}\\, \\mathsf{m^2}} \\\\					
							&= ${v} \\, \\mathsf{m/s}
						\\end{aligned}`)}
		/>
		<Card
			answer="Specific Energy: {ki(`E=${sds(E)}\\, \\mathsf{m} `)}"
			solution={kd(`
						\\begin{aligned} 
							E &= y+\\frac{v^2}{g} \\\\
						 	&= ${y}\\, \\mathsf{m}+\\frac{(${v}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\					
							&= ${E} \\, \\mathsf{m}
						\\end{aligned}`)}
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
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
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
			answer="For {ki(`Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`)}, the critical depth {ki(
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
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${Qs}\\, \\mathsf{m^3\\!/s})^2}{(${sds(
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
								&= ${sds(bs)}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${Qs}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
								&= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	`)}
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
		/>
	</section>
</article>

<!-- {y} -->

<style lang="scss">
	.inputs-row {
		display: flex;
		gap: 0.5em;
		justify-content: center;
		margin: 0 auto;
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
		width: 6em;
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
		border: 0.125em solid #088;
		outline: none;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	article {
		margin-inline: auto;
		width: 38em;
	}
	.results {
		margin-inline: auto;
		width: 80%;
		// border: 1px solid black;
	}
	.heading {
		color: #088;
		font-size: 120%;
		font-weight: bold;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
</style>
