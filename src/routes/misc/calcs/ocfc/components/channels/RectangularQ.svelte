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

	let initQuess = sdw(1)

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
	// let ys = $derived(sdw(y))
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
	/** @type {Array<Number>} */
	let iteratedY = $state([Number(initQuess)])

	$effect(() => {
		b = rectQ.base
		Q = rectQ.Q
		// console.log(b + ', ' + Q + ', ' + sdw(coeff))
		setIterationPoints()
		// console.log(iteratedY.length)
	})

	const setIterationPoints = () => {
		let next = Number(initQuess),
			// make current different from current to guarantee that the loop is entered initially
			current = next + 1,
			iterations = 0
		// when the $effect sees iteratedY change it refires each time, causing a loop. Store the		results in points and assign it once outside the loop
		const points = []

		while (current != next) {
			++iterations
			current = next
			next = Number(sdw(coeff * Math.pow(1 + (2 * current) / b, 0.4)))
			points.push(next)

			// in case of non convergence
			if (iterations > 20) break
		}
		iteratedY = points || []
	}

	// setIterationPoints()

	const processChange = debounce((e) => {
		if (e.target.id === 'slope') {
			// let slope = e.target.value
			rectQ.slope = e.target.value
			// force binding back to input when backspacing/delete of trailing decimal zeros don't update
			e.target.value = sds(rectQ.slope)
		}
		if (e.target.id === 'n') {
			rectQ.n = Number(sds(e.target.value))
			e.target.value = rectQ.n
		}
		if (e.target.id === 'g') {
			let value = e.target.value
			// n.b. the string length counts the decimal point!
			if (value.length > 4) {
				// console.log(value.length)
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

	<section>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input
					type="number"
					value={sds(s)}
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
					value={sds(n)}
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
					value={sd(g, 4)}
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
					on a scientific calculator). This calculator uses an automated iterative method called a binary
					search.
				</p>

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
						We need to solve this equation for {@html ki('y')}, for the given values of {@html ki(
							'Q'
						)}, {@html ki('n')}, {@html ki('b')} and {@html ki('S')}. Isolate a single {@html ki(
							`y`
						)} on the left hand side of the equation:
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
						)}, evaluate the function for input {@html ki('y_0')} to get {@html ki('y_1')} on the left.
						Then repeat, evaluating at {@html ki('y_1')} to get {@html ki('y_2')} on the left,... Then
						{@html ki('y_n')} will converge on {@html ki('y_{n+1}')}. Continue the iteration until
						you have the desired accuracy, i.e. until the value of {@html ki(
							'\\left|y_{n+1}-y_n\\right|'
						)} is sufficiently small.
						<p>
							<br />
							[More precisely, fixed-point iteration theory states that the function will converge if
							the absolute value of its derivative is less than {@html ki('1')}. In our case, it is
							easier just to perform the iteration and note that it does converge than to prove that
							the derivative satisfies {@html ki(`\\left|f'(y)\\right|<1`)} for all values of {@html ki(
								`y,\\,b,\\,S`
							)} and {@html ki(`n`)}]
						</p>
						<p>
							<br />
							Start with a guess of {@html ki(`y_0=${initQuess}`)}:
						</p>
						<!-- {iteratedY.length} -->
						{#each iteratedY as pt, i}
							<!-- don't print out an equation with the last element as independent variable with calculated value not defined -->
							{#if !isNaN(iteratedY[i + 1])}
								{@html kd(
									`y_${i + 1}=${sdw(iteratedY[i + 1])}= ${sdw(coeff)}\\cdot\\left(1+\\frac{2\\times ${sdw(iteratedY[i])}}{${sds(b)}}\\right)^{2/5} `
								)}
							{/if}
						{/each}
						Notice that now {@html ki(`y=f(y)`)}, that is {@html ki(`f(${y})=${y}`)}, and {@html ki(
							`\\bm{y=${y}\\,\\mathsf{m}}`
						)} is the fixed-point solution to the depth of flow equation derived above.
					{/snippet}
				</Carrd>
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				Flow Area: {@html ki(`${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
						\\begin{aligned}
							A &= by \\\\
							&= ${sds(b)}\\, \\mathsf{m}\\times ${sdw(y)}\\, \\mathsf{m} \\\\							
							&= ${A} \\, \\mathsf{m^2}
						\\end{aligned}
					`)}
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				Average Flow Velocity: {@html ki(`${sds(v)}\\, \\mathsf{m/s} `)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${A}\\, \\mathsf{m^2}} \\\\					
							&= ${v} \\, \\mathsf{m/s}
						\\end{aligned}`)}
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				Specific Energy: {@html ki(`E=${sds(E)}\\, \\mathsf{m} `)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
						\\begin{aligned} 
							E &= y+\\frac{v^2}{g} \\\\
						 	&= ${y}\\, \\mathsf{m}+\\frac{(${v}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\					
							&= ${E} \\, \\mathsf{m}
						\\end{aligned}`)}
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
							&= ${sds(b)}\\, \\mathsf{m} \\\\							
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
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
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
				For {@html ki(`Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`)}, the critical depth {@html ki(
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
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${sds(Q)}\\, \\mathsf{m^3\\!/s})^2}{(${sds(
									b
								)}\\, \\mathsf{m} )^2(${g}\\, \\mathsf{m/s^2})}}\\\\
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
						&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
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
						&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
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
	p {
		font-size: inherit;
	}
</style>
