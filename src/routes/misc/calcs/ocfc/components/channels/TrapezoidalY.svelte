<script>
	// @ts-nocheck

	import TrapCanvas from './TrapCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, trap } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { trapY } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	let noSlopeError = $state(false)
	let zeroDepthError = $state(false)
	let zeroBaseWarning = $state(false)
	let bothVerticalWarning = $state(false)

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	const getNFfromY = (y) => {
		let A = trap.getArea(y, zl, b, zr)
		let T = trap.getT(y, zl, b, zr)
		let v = Q / A
		return v / ((g * A) / T) ** 0.5
	}
	const getYCfromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2
		if (Math.abs(low - high) < delta) {
			return mid
		}
		// search
		if (getNFfromY(mid) > 1) {
			return getYCfromQ(mid, high)
		} else {
			return getYCfromQ(low, mid)
		}
	}

	let zl = $derived(Number(trapY.zl))
	let zr = $derived(Number(trapY.zr))
	let b = $derived(Number(trapY.b))
	let y = $derived(Number(trapY.y))
	let s = $derived(Number(trapY.s))
	let n = $derived(Number(trapY.n))
	let g = $derived(Number(trapY.g))

	// calculations for y specified
	let A = $derived(sdw(trap.getArea(y, zl, b, zr)))
	let P = $derived(sdw(trap.getP(y, zl, b, zr)))
	let R = $derived(sdw(common.getR(A, P)))
	let v = $derived(sdw(common.getV(n, R, s)))
	let Q = $derived(sdw(common.getQfromAandV(A, v)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sdw(trap.getT(y, zl, b, zr)))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(getYCfromQ()))
	let Ac = $derived(sdw(trap.getArea(yc, zl, b, zr)))
	let vc = $derived(sdw(Q / Ac))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(trap.getP(yc, zl, b, zr)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	// Handles s, n, g input changes; stores as numbers, updates input with formatted value
	const processChange = debounce((e) => {
		noSlopeError = false
		bothVerticalWarning = false
		zeroDepthError = false
		zeroBaseWarning = false

		let id = e.target.id
		let value = Math.abs(Number(e.target.value))

		if (id === 's') {
			// no flow with zero slope so don't allow it
			if (value == 0) {
				noSlopeError = true
				e.target.value = Math.pow(10, -sdigs)
			}
			trapY.s = value
			e.target.value = sds(trapY.s)
		} else if (id === 'n') {
			trapY.n = value
			e.target.value = sds(trapY.n)
		} else if (id === 'g') {
			// need e.target.value as a string to measure length
			let value = e.target.value
			if (value[0] == '-') {
				value = value.slice(1)
			}
			if (value.length > 4) {
				trapY.g = value
				e.target.value = sd(trapY.g, 4)
			} else {
				trapY.g = value
				e.target.value = sds(trapY.g)
			}
		} else if (id === 'zl') {
			// let prev = trapY.zl
			// toFixed in sd chokes on 0 so deal with it here
			if (value == 0) {
				// if zr is already 0, don't change zl to 0 but keep at previous value
				if (trapY.zr === 0) {
					bothVerticalWarning = true
					// console.log('true')
					trapY.zl = value
					e.target.value = trapY.zl
				} else {
					e.target.value = trapY.zl = 0
				}
			} else {
				trapY.zl = value
				e.target.value = sds(trapY.zl)
			}
		} else if (id === 'zr') {
			// let prev = trapY.zr
			if (value == 0) {
				if (trapY.zl === 0) {
					bothVerticalWarning = true
					trapY.zr = value
					e.target.value = trapY.zr
				} else {
					e.target.value = trapY.zr = 0
				}
			} else {
				trapY.zr = value
				e.target.value = sds(trapY.zr)
			}
		} else if (id === 'b') {
			let prev = trapY.b
			if (value == 0) {
				zeroBaseWarning = true
				trapY.b = Number(value)
				e.target.value = sds(value)
			} else {
				trapY.b = value
				e.target.value = sds(trapY.b)
			}
		} else if (id === 'y') {
			let prev = trapY.y
			if (value == 0) {
				zeroDepthError = true
				trapY.y = Number(prev)
				e.target.value = sds(prev)
			} else {
				trapY.y = value
				e.target.value = sds(trapY.y)
			}
		}
	}, 1000)
</script>

<section class="canvas">
	<TrapCanvas bind:zl={trapY.zl} bind:zr={trapY.zr} bind:b={trapY.b} bind:y={trapY.y} />
</section>
<article>
	<!-- <section> -->

	<!-- </section> -->
	<!-- {trap.zl}, {trap.b}, {trap.zr}, {trap.y} -->
	<section>
		<div class="inputs-row single">
			<label class="depth-label">
				<span class="unit">{@html ki(' y=')}</span>
				<input
					type="number"
					value={sds(y)}
					step="any"
					min="0"
					id="y"
					oninput={processChange}
					onkeydown={processChange}
				/>
				<span class="unit">{@html ki('\\mathsf{ m}')}</span>
			</label>
		</div>

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

			<label class="depth-label">
				<span class="unit">{@html ki(' b=')}</span>
				<input
					type="number"
					value={sds(b)}
					step="any"
					min="0"
					id="b"
					oninput={processChange}
					onkeydown={processChange}
				/>
				<span class="unit">{@html ki('\\mathsf{ m}')}</span>
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

	<!-- {#if verticalError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			No, a triangular channel with two vertical walls is just too weird for this calculator. Just
			sayin'
		</div>
	{/if} -->
	{#if noSlopeError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			No slope, no flow. That's just how it is.
		</div>
	{/if}
	{#if zeroDepthError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			Zero depth, no water, no flow. Nothing for me here.
		</div>
	{/if}
	{#if zeroBaseWarning}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			With a zero base value, you have a simpler triangular channel. You really should use that
			option...but whatever.
		</div>
	{/if}
	{#if bothVerticalWarning}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			With both slopes vertical, you have a simpler rectangular channel. You should use that
			option...but it's up to you really.
		</div>
	{/if}

	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Card>
			{#snippet answer()}
				Flow Area: {@html ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							A &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
							&= \\left(\\!${sds(b)}\\, \\mathsf{m}+\\!\\left(\\frac{\\!${sds(zl)}\\, \\mathsf{m}+${sds(zr)}\\, \\mathsf{m}}{2}\\!\\right)\\!\\cdot\\! ${sds(y)}\\, \\mathsf{m}\\!\\right)\\!\\cdot\\! ${sds(y)}\\, \\mathsf{m} \\\\ \\\\
							&= ${sdw(A)}\\, \\mathsf{m^2}
					\\end{aligned}
			`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Wetted Perimeter: {@html ki(`P = ${sds(P)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							P &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right)\\cdot y \\\\
							 &= ${sds(b)}\\, \\mathsf{m} \\quad+\\\\ &\\quad \\left(\\! \\sqrt{1\\!+\\!\\left(${sds(zl)}\\, \\mathsf{m}\\right)^2}+\\sqrt{1\\!+\\!\\left(${sds(zr)} \\, \\mathsf{m}\\right)^2}\\right)\\!\\cdot\\! ${sds(y)}\\, \\mathsf{m} \\\\ \\\\                               
							&= ${sdw(P)}\\, \\mathsf{m}
					\\end{aligned}
			`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Hydraulic Radius: {@html ki(`R = ${sds(R)}\\, \\mathsf m`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							R &= A/P \\\\
							&= ${sdw(A)}\\, \\mathsf{m^2} / ${sdw(P)}\\, \\mathsf{m} \\\\ \\\\
							&= ${sdw(R)}\\, \\mathsf{m}
					\\end{aligned}
			`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Average Flow Velocity: {@html ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							&= \\frac{1}{${sds(n)}} \\left(${sdw(R)}\\right)^{2/3} \\left(${sds(s / 100)}\\right)^{1/2} \\\\ \\\\
							&= ${sdw(v)} \\, \\mathsf{m/s}
					\\end{aligned}
			`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Flow Rate: {@html ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							Q &= Av \\\\
							&= ${sdw(A)}\\, \\mathsf{m^2}\\times ${sdw(v)}\\, \\mathsf{m/s} \\\\ \\\\
							&= ${sdw(Q)} \\, \\mathsf{m^3/s}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Free Surface: {@html ki(`T = ${sds(T)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							T &= b + \\left(z_L+z_R\\right)\\cdot y \\\\
							&= ${sds(b)}\\, \\mathsf{m} + \\left( ${sds(zl)}+${sds(zr)} \\right)\\cdot ${sds(y)}	\\, \\mathsf{m}	\\\\ \\\\
							T &= ${sdw(T)} \\, \\mathsf{m}	   
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
							&=  \\frac{${sdw(v)}\\, \\mathsf{m/s}}{\\sqrt{(${sds(g)}\\, \\mathsf{m/s^2})\\cdot(${sdw(
								A
							)}\\, \\mathsf{m^2}/${sdw(T)}\\, \\mathsf{m})}} \\\\ \\\\
							&= ${sdw(NF)}
					\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<div class="heading">Critical Flow</div>

		<Card>
			{#snippet answer()}
				For {@html ki(`Q=${Q} \\, \\mathsf{m^3\\!/s}`)}, Critical Depth {@html ki(
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
							&= \\frac{\\left(\\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y_c\\right)\\cdot y_c\\right)^3}{b + \\left(z_L+z_R\\right)\\cdot y_c} \\\\
							\\Rightarrow \\frac{\\left(${sdw(Q)} \\, \\mathsf{m^3\\!/s}\\right)^2}{${sds(g)} \\, \\mathsf{m/s^2}}&= \\frac{\\left(\\left(${sds(b)}\\, \\mathsf{m}+\\left(\\large\\frac{${sds(zl + zr)}}{2}\\right)\\cdot y_c \\, \\mathsf{m}\\right)\\cdot y_c \\, \\mathsf{m}\\right)^3}{${sds(b)}\\, \\mathsf{m} + \\left(${sds(zl + zr)}\\right)\\cdot y_c\\, \\mathsf{m}} 									
					\\end{aligned}`)}
				The expression above cannot be solved directly (analytically) for {@html ki(`y_c`)}. It may
				be solved using trial-and-error or iterative methods but it is generally more convenient to
				solve it, without further simplification, using a numerical solver on a scientific
				calculator or in a spreadsheet app.
				{@html kd(`y_c=${yc}\\, \\mathsf{m}`)}
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Critical Velocity: {@html ki(`v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
						A_c &= \\left(${sds(b)}\\, \\mathsf{m}+\\left(\\frac{${sds(zl + zr)}}{2}\\right)\\cdot ${sdw(yc)}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
						&= ${sdw(Ac)}\\, \\mathsf{m^2}\\\\\\\\
						v_c &= Q/A_c \\\\
						&= \\frac{${sdw(Q)}\\, \\mathsf{m^3\\!/s}}{${sdw(Ac)}\\, \\mathsf{m^2}} \\\\ \\\\
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
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
								&= ${Emin} \\,\\mathsf{m}
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
						A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
						&= \\left(${sds(b)}\\, \\mathsf{m}+\\left(\\frac{${sds(
							+zl + +zr
						)}}{2}\\right)\\cdot ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
						&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

						P_c &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right)\\cdot y_c \\\\
						&= ${sds(b)}\\, \\mathsf{m}\\quad+ \\\\ 
						&\\qquad\\left(\\! \\sqrt{1\\!+\\!\\left(${sds(zl)}\\, \\mathsf{m}\\right)^2}+\\sqrt{1\\!+\\!\\left(${sds(zr)} \\, \\mathsf{m}\\right)^2}\\right)\\!\\cdot\\! ${sds(y)}\\, \\mathsf{m} \\\\ 
						&= ${sdw(Pc)}\\, \\mathsf{m}\\\\\\\\

						R_c &= A_c/P_c \\\\
						&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
						&= ${Rc}\\,\\mathsf{m}\\\\\\\\

						S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
						&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
						&= ${sdw(Sc / 100)} \\\\
						&= ${Sc}\\% 								
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
		</Card> -->
	</section>
</article>

<style lang="scss">
	article {
		// border: 2px solid green;
		margin-inline: auto;
		// padding-bottom: 0;
		// padding-inline: 0;
		width: 32em;
		// width: fit-content;
	}
	.canvas {
		margin-inline: auto;
		width: 40em;
		// border: 1px solid blue;
		// background: #eee;
	}
	.inputs-row {
		// font-size: 80%;
		display: flex;
		gap: 0.5em;
		justify-content: space-between;
		margin: 0.625em auto;
		// border: 1px solid red;
		// width: 90%;
		// width: 32em;
		width: 100%;

		&.single {
			justify-content: space-around;
		}
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

	// section {
	// }
	// .results {
	// 	// margin-bottom: 0;
	// 	// margin-inline: auto;
	// 	// background: pink;

	// 	// width: 90%;
	// }
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
		padding: 1em;
		text-align: center;
		width: 90%;
	}
</style>
