<script>
	// @ts-nocheck

	import TriQCanvas from './TriQCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, tri } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { triQ } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'
	// import { isTypeQueryNode } from 'typescript'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	let verticalError = $state(false)
	let noSlopeError = $state(false)
	let noFlowError = $state(false)

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	const getYFromQ = (Q, zl, zr, s, n) => {
		let numerator = Q * n * 2 ** (5 / 3) * ((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5) ** (2 / 3)
		let denominator = (s / 100) ** 0.5 * (zl + zr) ** (5 / 3)
		return (numerator / denominator) ** (3 / 8)
	}

	const getYCfromQ = (Q, zl, xr, g) => {
		return ((8 * Q ** 2) / g / (Number(zl) + Number(zr))) ** 0.2
	}

	let zl = $derived(Number(triQ.zl))
	let zr = $derived(Number(triQ.zr))
	let Q = $derived(Number(triQ.Q))
	let s = $derived(Number(triQ.s))
	let n = $derived(Number(triQ.n))
	let g = $derived(Number(triQ.g))

	// calculations for Q specified
	let y = $derived(sdw(getYFromQ(Q, zl, zr, s, n)))
	let A = $derived(sdw(tri.getArea(y, zl, zr)))
	let v = $derived(sdw(tri.getV(Q, A)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sdw(tri.getT(y, zl, zr)))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(tri.getYc(Q, zl, zr, g)))
	let Ac = $derived(sdw(tri.getArea(yc, zl, zr)))
	let vc = $derived(sdw(Q / Ac))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(tri.getP(yc, zl, zr)))
	let Rc = $derived(sdw(Ac / Pc))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	// Handles s, n, g input changes; stores as numbers, updates input with formatted value
	const processChange = debounce((e) => {
		noSlopeError = false
		verticalError = false
		noFlowError = false

		let id = e.target.id
		let value = Math.abs(Number(e.target.value))

		if (id === 's') {
			// no flow with zero slope so don't allow it
			if (value == 0) {
				noSlopeError = true
				e.target.value = Math.pow(10, -sdigs)
			}
			triQ.s = value
			e.target.value = sds(triQ.s)
		} else if (id === 'n') {
			triQ.n = value
			e.target.value = sds(triQ.n)
		} else if (id === 'g') {
			// need e.target.value as a string to measure length
			let value = e.target.value
			if (value[0] == '-') {
				value = value.slice(1)
			}
			if (value.length > 4) {
				triQ.g = value
				e.target.value = sd(triQ.g, 4)
			} else {
				triQ.g = value
				e.target.value = sds(triQ.g)
			}
		} else if (id === 'zl') {
			let prev = triQ.zl
			// toFixed in sd chokes on 0 so deal with it here
			if (value == 0) {
				// if zr is already 0, don't change zl to 0 but keep at previous value
				if (triQ.zr === 0) {
					verticalError = true
					// console.log('true')
					e.target.value = sds(prev)
				} else {
					e.target.value = triQ.zl = 0
				}
			} else {
				triQ.zl = value
				e.target.value = sds(triQ.zl)
			}
		} else if (id === 'zr') {
			let prev = triQ.zr
			if (value == 0) {
				if (triQ.zl === 0) {
					verticalError = true
					e.target.value = sds(prev)
				} else {
					e.target.value = triQ.zr = 0
				}
			} else {
				triQ.zr = value
				e.target.value = sds(triQ.zr)
			}
		} else if (id === 'Q') {
			let prev = triQ.Q
			// === doesn't work
			if (value == 0) {
				noFlowError = true
				e.target.value = sds(prev)
			} else {
				triQ.Q = value
				e.target.value = sds(triQ.Q)
			}
		}
	}, 1000)
</script>

<article>
	<section><TriQCanvas bind:zl={triQ.zl} bind:zr={triQ.zr} bind:y /></section>
	<!-- {triQ.zl}, {triQ.y}, {triQ.zr} -->
	<section>
		<div class="inputs-row">
			<label class="zl-label">
				<span class="unit">{@html ki(' z_L=')}</span>
				<input
					type="number"
					value={sds(zl)}
					step="any"
					min="0"
					id="zl"
					oninput={processChange}
					onkeydown={processChange}
				/>
			</label>
			<label class="volume-label">
				<span class="unit">{@html ki(' Q=')}</span>
				<input
					type="number"
					value={sds(Q)}
					step="any"
					min="0"
					id="Q"
					oninput={processChange}
					onkeydown={processChange}
				/>
				<span class="unit">{@html ki('\\mathsf{ m^3/s}')}</span>
			</label>

			<label class="zr-label">
				<span class="unit">{@html ki(' z_R=')}</span>
				<input
					type="number"
					value={sds(zr)}
					step="any"
					min="0"
					id="zr"
					oninput={processChange}
					onkeydown={processChange}
				/>
			</label>
		</div>
		<div class="inputs-row">
			<label>
				<span class="var-name">{@html ki('S =')}</span>
				<input
					type="number"
					value={sds(s)}
					id="s"
					oninput={processChange}
					onkeydown={processChange}
					min="0.001"
					step="any"
					style="width: {digits.sdigs > 3 ? '7em' : '6em'}"
				/>
				<!-- s input: always formatted -->
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label>
				<span class="var-name">{@html ki('n =')}</span>
				<input
					type="number"
					value={sds(n)}
					id="n"
					oninput={processChange}
					onkeydown={processChange}
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
					onkeydown={processChange}
					min="0"
					step="any"
					style="width: 4em"
				/>
				<!-- g input: always formatted -->
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>

	{#if verticalError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			No, a triangular channel with two vertical walls is just too weird for this calculator. Just
			sayin'
		</div>
	{/if}
	{#if noSlopeError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			No slope, no flow. That's just how it is.
		</div>
	{/if}
	{#if noFlowError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			Without flow, there's nothing for me to do...
		</div>
	{/if}

	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Card>
			{#snippet answer()}
				Depth of flow: {@html ki(`y=${sds(y)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				<p>
					<strong>Note:</strong> A triangular channel is the only cross-section that can be solved directly
					(if somewhat laboriously) for depth from the volume flow rate.
				</p>
				{@html kd(`
					\\begin{aligned}
						Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\
						&= \\frac 1n A(A/P)^{ 2/3 }S^{ 1/2 }  \\\\
						&= \\frac 1n \\cdot \\frac{A^{5/3}}{P^{2/3}}\\cdot S^{ 1/2 } \\\\
						&= \\frac 1n \\cdot \\frac{\\left(\\left( z_L+z_R \\right)\\cdot y^2/2 \\right) ^{5/3}}{\\left(\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)\\cdot y\\right)^{2/3}}\\cdot S^{ 1/2 } \\\\
						&= \\frac{S^{1/2}}{n} \\cdot \\frac{\\left(z_L+z_R \\right)^{5/3}\\cdot y^{10/3}}{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}\\cdot y^{2/3}} \\\\
						\\Rightarrow y^{8/3} &= \\frac{Qn}{S^{1/2}} \\cdot \\frac{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}}{\\left(z_L+z_R \\right)^{5/3}} \\\\
						\\Rightarrow y &= \\left[\\frac{Qn}{S^{1/2}} \\times \\frac{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}}{\\left(z_L+z_R \\right)^{5/3}}\\right]^{3/8} \\\\\\\\
						\\Rightarrow y &= \\Biggl[\\frac{${sds(Q)}\\times${sds(n)}}{${sds(s / 100)}^{1/2}} \\qquad\\times \\\\
						&\\qquad \\frac{2^{5/3}\\left(\\sqrt { 1+(${sds(zl)})^2 } + \\sqrt { 1+(${sds(zr)})^2 }\\right)^{2/3}}{\\left(${sds(zl)}+${sds(zr)} \\right)^{5/3}}\\Biggr]^{3/8} \\\\
					\\end{aligned}`)}
				<br />
				{@html kd(`\\large y=${sdw(y)}\\, \\mathsf{m}
						`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Flow Area: {@html ki(`${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A &= \\left( z_L+z_R \\right)\\cdot y^2/2 \\\\						
						&= \\left(${sds(zl)}+${sds(zr)} \\right)\\cdot (${sdw(y)}\\, \\mathsf{m})^2/2 \\\\\\\\						
						A &= ${sdw(A)} \\, \\mathsf{m^2}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Average Flow Velocity: {@html ki(`${sds(v)}\\, \\mathsf{m/s} `)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned} 
						v &= Q/A \\\\
						&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${sdw(A)}\\, \\mathsf{m^2}} \\\\\\\\					
						v &= ${sdw(v)} \\, \\mathsf{m/s}
					\\end{aligned}`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Specific Energy: {@html ki(`E=${sds(E)}\\, \\mathsf{m} `)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned} 
						E &= y+\\frac{v^2}{g} \\\\
						&= ${sdw(y)}\\, \\mathsf{m}+\\frac{(${sdw(v)}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\\\\\					
						E &= ${sdw(E)} \\, \\mathsf{m}
					\\end{aligned}`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Free Surface: {@html ki(`T = ${sds(T)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						T &= \\left(z_L+z_R\\right)y \\\\
							&= \\left(${sds(zl)}+${sds(zr)}\\right)(${sdw(y)}\\, \\mathsf{m})\\\\\\\\
						T &= ${sdw(T)}\\, \\mathsf{m} \\\\							
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Froude Number: {@html ki(`N_F = ${sds(NF)}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
						&=  \\frac{${sdw(v)}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
							A
						)}\\, \\mathsf{m^2}/${sdw(T)}\\, \\mathsf{m})}} \\\\\\\\
					N_F	&= ${sdw(NF)}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<div class="heading">Critical Flow</div>

		<Card>
			{#snippet answer()}
				For the {@html ki(`Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {@html ki(
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

						&= \\frac{\\left(\\left( z_L+z_R \\right)\\cdot y_c^2/2\\right) ^3}{(z_L+z_R)y_c} \\\\
						&= \\frac{\\left( z_L+z_R \\right) ^2}{2^3}\\cdot y^5 \\\\
						y^5 &= \\frac{8Q^2}{g(z_L+z_R)^2}	\\\\
						y &= \\left[\\frac{8Q^2}{g(z_L+z_R)^2}\\right]^{0.2}	\\\\
						&= \\left[\\frac{8(${sds(Q)}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}(${sds(zl)}+${sds(zr)})^2}\\right]^{0.2}	\\\\\\\\
						y_c &= ${sdw(yc)}\\, \\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Critical Velocity: {@html ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= \\left( z_L+z_R \\right)\\cdot y_c^2/2 \\\\						
						&= \\left(${sds(zl)}+${sds(zr)} \\right)\\cdot (${sdw(yc)}\\, \\mathsf{m})^2/2 \\\\						
						A_c &= ${sdw(Ac)} \\, \\mathsf{m^2} \\\\\\\\
						v_c &= Q/A_c \\\\
						&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${sdw(Ac)}\\, \\mathsf{m^2}} \\\\\\\\
						v_c &= ${sdw(vc)} \\,\\mathsf{m/s}
					\\end{aligned}	
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Minimum Specific Energy: {@html ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
						&= ${sdw(yc)}\\, \\mathsf{m}+\\frac{ (${sdw(vc)}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
						E_{min} &= ${sdw(Emin)} \\,\\mathsf{m}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Slope for Critical Flow: {@html ki(`S_c = ${sds(Sc)}\\%`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= \\left( z_L+z_R \\right)\\cdot y_c^2/2 \\\\						
						&= \\left(${sds(zl)}+${sds(zr)} \\right)\\cdot (${sdw(yc)}\\, \\mathsf{m})^2/2 \\\\						
						&= ${sdw(Ac)} \\, \\mathsf{m^2} \\\\
						W\\!\\!P_c &= y\\cdot\\left( \\sqrt{1+z_L^2} + \\sqrt{1+z_L^2} \\right) \\\\
						&= ${sdw(y)}\\mathsf{m}\\cdot\\left( \\sqrt{1+(${sds(zl)})^2} + \\sqrt{1+(${sds(zr)})^2} \\right) \\\\								
						&= ${sdw(Pc)}\\, \\mathsf{m}\\\\
						R_c &= A_c/W\\!\\!P_c \\\\
						&= \\frac{${sdw(Ac)}\\, \\mathsf{m^2}}{${sdw(Pc)}\\, \\mathsf{m}} \\\\
						&= ${sdw(Rc)}\\,\\mathsf{m}\\\\\\\\

						\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
						&= \\left(\\frac{${n}\\times ${sdw(vc)}\\, \\mathsf{m/s} }{ (${sdw(Rc)}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
						&= ${sdw(Sc / 100)} \\\\\\\\
						S_c &= ${sdw(Sc)}\\% 								
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<!-- <Card>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Card>

	 -->
	</section>
</article>

<style lang="scss">
	.inputs-row {
		// font-size: 80%;
		display: flex;
		gap: 0.5em;
		justify-content: space-between;
		margin: 0.625em auto;
		// border: 1px solid black;
		width: 90%;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.25em;
		justify-content: center;
		white-space: nowrap;
		background: white;
		border: 1px solid black;
		box-shadow: 2px 2px 4px #c1cdcd;
		padding: 0.25em 0.625em;
		border-radius: 3px;
		width: 32%;
	}

	// input {
	// 	width: 4em;
	// 	padding: 0;
	// 	border: 1px solid #ccc;
	// 	border: 0.125em solid #c1cdcd;
	// 	border-radius: 3px;
	// 	font-size: 0.9em;
	// 	text-align: center;
	// 	-moz-appearance: textfield;
	// 	appearance: textfield;

	// 	&:hover {
	// 		border: 0.125em solid #088;
	// 	}
	// }

	// input[type='number']:focus {
	// 	// box-shadow: 1px 1px black;
	// 	// background: #088;
	// 	border: 0.125em solid #088;
	// 	// box-sizing: border-box;
	// 	outline: none;
	// 	// outline: 1px #000 solid;
	// 	// color: white;
	// 	// border-color: #088;
	// }

	input {
		width: 4em;
		padding: 0;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		/* font-size: 0.875em; */
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;

		&:focus,
		&:hover {
			border: 0.125em solid #088;
			outline: none;
		}
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
	.error {
		align-items: center;
		border: 2px solid red;
		box-shadow: 2px 2px 4px red;
		color: red;
		display: flex;
		font-weight: bold;
		justify-content: center;
		margin: 2em auto;
		// overflow-y: hidden;
		padding: 1em;
		text-align: center;
		width: 90%;
	}
	p {
		font-size: inherit;
	}
</style>
