<script>
	import RQC from './RQC.svelte'
	import Card from '../Card.svelte'
	import Carrd from '../Carrd.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, rect } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { rectQ } from '../../store.svelte.js'

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
		// console.log(delta + ', ' + low + ', ' + high)
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

	let b = $derived(Number(rectQ.base))
	let Q = $derived(Number(rectQ.Q))
	let s = $derived(Number(rectQ.slope))
	let n = $derived(Number(rectQ.n))
	let g = $derived(Number(rectQ.g))

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

	let coeff = $derived(Math.pow((n * Q) / b / Math.pow(s / 100, 0.5), 3 / 5))
	/** @type {Array<Number> | null} */
	let iteratedY = $state([1])

	// $effect(() => {
	// 	b = rectQ.base
	// 	console.log(rectQ.base + ', ' + b)
	// })

	const setIterationPoints = () => {
		let current = 1,
			next = 0,
			it = 0
		iteratedY.length = 0

		while (current != next) {
			it++
			current = next
			next = Number(sdw(coeff * Math.pow(1 + (2 * current) / b, 0.4)))
			iteratedY.push(next)
			console.log(
				'n=' +
					n +
					', Q=' +
					Q +
					', b=' +
					b +
					', b2=' +
					rectQ.base +
					', s=' +
					s +
					', y=' +
					y +
					', g=' +
					g
			)
			// console.log(coeff)
			// if (current === next) break
			if (it > 20) break
		}
	}

	setIterationPoints()

	const processChange = debounce((e) => {
		if (e.target.id === 'slope') {
			// let slope = e.target.value
			rectQ.slope = Number(sds(e.target.value))
			// force binding back to input when backspacing/delete of trailing decimal zeros don't update
			e.target.value = rectQ.slope
		}
		if (e.target.id === 'n') {
			rectQ.n = Number(sds(e.target.value))
			e.target.value = rectQ.n
		}
		if (e.target.id === 'g') {
			let value = e.target.value
			// n.b. the string length counts the decimal point!
			if (value.length > 4) {
				console.log(value.length)
				// allow g=9.806
				rectQ.g = Number(sd(value, 4))
			} else {
				rectQ.g = Number(sds(value))
			}
			e.target.value = rectQ.g
		}
		setIterationPoints()
	})
</script>

<article>
	<section><RQC bind:base={rectQ.base} bind:Qflow={rectQ.Q} bind:depth={y} /></section>

	{coeff}<br />{iteratedY.length}<br />
	{iteratedY[0]}, {iteratedY[1]}, {iteratedY[2]}, {iteratedY[3]}, {iteratedY[4]}, {iteratedY[5]},

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input
					type="number"
					value={s}
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
					value={n}
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
					value={g}
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
		<Carrd>
			{#snippet answer()}
				Depth of flow: {@html ki(`${sds(y)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
								\\begin{aligned}
									Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\
									&= \\frac 1n \\cdot by\\cdot\\left(\\frac{by}{b+2y}\\right)^{2/3}\\!\\!\\cdot S^{ 1/2 } \\\\
									\\Rightarrow ${sds(Q)} &= \\frac 1{${sds(n)}} \\cdot ${sds(b)}y\\\\
									&\\qquad\\times\\left(\\frac{${sds(b)}y}{${sds(b)}y+2y}\\right)^{2/3}\\!\\!\\cdot\\! (${sdw(s / 100)})^{ 1/2 } 
								\\end{aligned}`)}
				<p>
					The expression above cannot be solved directly (analytically) for {@html ki(`y`)} but may be
					found using iterative methods. (Or, more conveniently, by using the numerical solver available
					on a scientific calculator)
				</p>

				<p>This calculator uses an automated iterative method called a binary search.</p>

				{@html kd(`
							y=${sdw(y)}\\, \\mathsf{m}
							`)}
				<Carrd>
					{#snippet answer()}
						<strong>Fixed-Point Iterative Solution</strong>
					{/snippet}
					{#snippet solution()}
						{@html kd(`										
								Q = \\frac 1n \\cdot by\\cdot\\left(\\frac{by}{b+2y}\\right)^{2/3}\\!\\!\\cdot \\sqrt{S} `)}
						Isolate a single {@html ki(`y`)} on the left hand side of the equation:
						{@html kd(`
							\\begin{aligned}
							Q &= \\frac 1n \\cdot by\\cdot\\left(\\frac{by}{b+2y}\\right)^{2/3}\\!\\!\\cdot \\sqrt{S}	\\\\
								\\Rightarrow y^{5/3} &= \\frac{nQ}{b\\sqrt{S}}\\cdot\\left(\\frac{b+2y}{b}\\right)^{2/3}\\\\
								&= \\frac{nQ}{b\\sqrt{S}}\\cdot\\left(1+\\frac{2y}{b}\\right)^{2/3} \\\\
								\\Rightarrow y &= \\left(\\frac{nQ}{b\\sqrt{S}}\\right)^{3/5}\\cdot\\left(1+\\frac{2y}{b}\\right)^{2/5}  \\\\
								 &= \\left(\\frac{${n}\\cdot${Q}}{${sds(b)}\\sqrt{${s / 100}}}\\right)^{3/5}\\cdot\\left(1+\\frac{2y}{${sds(b)}}\\right)^{2/5}  \\\\
								y &= ${sdw(coeff)}\\cdot\\left(1+\\frac{2y}{${sds(b)}}\\right)^{2/5}  \\\\
							\\end{aligned}
								 `)}
						Now, the fixed-point iterative process is to guess a starting value for the depth {@html ki(
							'y_0'
						)}, evaluate the function for input {@html ki('y_0')} and get {@html ki('y_1')} on the left.
						Then repeat, evaluating at {@html ki('y_1')} to get {@html ki('y_2')} on the left,... Then
						{@html ki('y_n')} will converge on {@html ki('y_{n+1}')}. Continue the iteration until
						you have the desired accuracy, i.e. until the value of {@html ki(
							'\\left|y_{n+1}-y_n\\right|'
						)} is sufficiently small.
						<p class="green">
							<br />
							[More precisely, fixed-point iteration theory states that the function will converge if
							the absolute value of its derivative is less than {@html ki('1')}. In our case, it is
							easier just to perform the iteration and note that it does converge than to prove that
							the derivative satisfies {@html ki(`\\left|f'(y)\\right|<1`)} for all values of {@html ki(
								`y,\\,b,\\,S`
							)} and {@html ki(`n`)}]
						</p>
					{/snippet}
				</Carrd>
			{/snippet}
		</Carrd>

		<Card
			answer="Flow Area: {ki(`${sds(A)}\\, \\mathsf{m^2}`)} "
			solution={kd(`
						\\begin{aligned}
							A &= by \\\\
							&= ${sds(b)}\\, \\mathsf{m}\\times ${sdw(y)}\\, \\mathsf{m} \\\\							
							&= ${A} \\, \\mathsf{m^2}
						\\end{aligned}
					`)}
		/>
		<Card
			answer="Average Flow Velocity: {ki(`${sds(v)}\\, \\mathsf{m/s} `)}"
			solution={kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${A}\\, \\mathsf{m^2}} \\\\					
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
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${sds(Q)}\\, \\mathsf{m^3\\!/s})^2}{(${sds(
									b
								)}\\, \\mathsf{m} )^2(${g}\\, \\mathsf{m/s^2})}}\\\\
								&= ${yc}\\, \\mathsf{m}

                            \\end{aligned}
                        `)}
		/>
		<Card
			answer="Critical Velocity: {ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}  "
			solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${sds(b)}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
								&= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	`)}
		/>
		<Card
			answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}"
			solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
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
