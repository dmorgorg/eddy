<script>
	// @ts-nocheck

	import TriYCanvas from './TriYCanvas.svelte'
	import Carrd from '../Carrd.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, tri } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { triY } from '../../store.svelte.js'
	import { slide } from 'svelte/transition'
	// import { isTypeQueryNode } from 'typescript'

	let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits

	let verticalError = $state(false)
	let noSlopeError = $state(false)
	let zeroDepthError = $state(false)

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	let zl = $derived(Number(triY.zl))
	let zr = $derived(Number(triY.zr))
	let y = $derived(Number(triY.y))
	let s = $derived(Number(triY.s))
	let n = $derived(Number(triY.n))
	let g = $derived(Number(triY.g))

	// calculations for y specified
	let A = $derived(sdw(tri.getArea(y, zl, zr)))
	let P = $derived(sdw(tri.getP(y, zl, zr)))
	let R = $derived(sdw(common.getR(A, P)))
	let v = $derived(sdw(common.getV(n, R, s)))
	let Q = $derived(sdw(common.getQfromAandV(A, v)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sdw(tri.getT(y, zl, zr)))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(tri.getYc(Q, zl, zr, g)))
	let Ac = $derived(sdw(tri.getArea(yc, zl, zr)))
	let vc = $derived(sdw(common.getVfromQandA(Q, Ac)))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(tri.getP(yc, zl, zr)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	// Handles s, n, g input changes; stores as numbers, updates input with formatted value
	const processChange = debounce((e) => {
		noSlopeError = false
		verticalError = false
		zeroDepthError = false
		if (e.target.id === 's') {
			// no flow with zero slope so don't allow it
			if (Number(e.target.value) == 0) {
				noSlopeError = true
				e.target.value = Math.pow(10, -sdigs)
			}
			triY.s = Math.abs(Number(e.target.value))
			e.target.value = sds(triY.s)
		}
		if (e.target.id === 'n') {
			triY.n = Math.abs(Number(e.target.value))
			e.target.value = sds(triY.n)
		}
		if (e.target.id === 'g') {
			let value = e.target.value
			if (value[0] === '-') {
				value = value.slice(1)
			}
			if (value.length > 4) {
				triY.g = Math.abs(Number(value))
				e.target.value = sd(triY.g, 4)
			} else {
				triY.g = Math.abs(Number(value))
				e.target.value = sds(triY.g)
			}
		}

		if (e.target.id === 'zl') {
			let prev = triY.zl
			// toFixed in sd chokes on 0 so deal with it here
			if (Number(e.target.value) == 0) {
				// if zr is already 0, don't change zl to 0 but keep at previous value
				if (triY.zr === 0) {
					verticalError = true
					// console.log('true')
					e.target.value = sds(prev)
				} else {
					e.target.value = triY.zl = 0
				}
			} else {
				triY.zl = Number(sds(e.target.value))
				e.target.value = sds(e.target.value)
			}
		}
		if (e.target.id === 'zr') {
			let prev = triY.zr
			if (Number(e.target.value) == 0) {
				if (triY.zl === 0) {
					verticalError = true
					e.target.value = sds(prev)
				} else {
					e.target.value = triY.zr = 0
				}
			} else {
				triY.zr = Number(sds(e.target.value))
				e.target.value = sds(e.target.value)
			}
		}
		if (e.target.id === 'y') {
			let prev = triY.y
			if (Number(e.target.value) == 0) {
				zeroDepthError = true
				triY.y = Number(prev)
				e.target.value = prev
			} else {
				triY.y = Number(sds(e.target.value))
				e.target.value = triY.y
			}
		}
	}, 1000)
</script>

<article>
	<section><TriYCanvas bind:zl={triY.zl} bind:zr={triY.zr} bind:y={triY.y} /></section>
	<!-- {triY.zl}, {triY.y}, {triY.zr} -->
	<section>
		<div class="inputs-row">
			<label class="zl-label">
				<span class="unit">{@html ki(' z_L=')}</span>
				<input type="number" value={sds(zl)} step="any" min="0" id="zl" oninput={processChange} />
			</label>
			<label class="depth-label">
				<span class="unit">{@html ki(' y=')}</span>
				<input type="number" value={sds(y)} step="any" min="0" id="y" oninput={processChange} />
				<span class="unit">{@html ki('\\mathsf{ m}')}</span>
			</label>

			<label class="zr-label">
				<span class="unit">{@html ki(' z_R=')}</span>
				<input type="number" value={sds(zr)} step="any" min="0" id="zr" oninput={processChange} />
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
	{#if zeroDepthError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			Zero depth, no water, no flow. Nothing for me here.
		</div>
	{/if}

	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Carrd>
			{#snippet answer()}
				Flow Area: {@html ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
							A &= \\frac{\\left(z_L\\cdot y\\right) y}{2} + \\frac{\\left(z_R \\cdot y\\right)\\cdot y}{2} \\\\
							&= \\frac{\\left(z_L+z_R\\right)y^2}{2} \\\\
							&= \\frac{\\left(${sds(zl)}+${sds(zr)}\\right)\\left(${sds(y)}\\, \\mathsf{m}\\right)^2}{2} \\\\\\\\
							A &= ${A}\\, \\mathsf{m^2}
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
							P &= \\sqrt{y^2+(z_L\\!\\cdot\\!y)^2} + \\sqrt{y^2+(z_R\\!\\cdot\\!y)^2} \\\\
								&= \\left(\\sqrt{(1+z_L^2)} + \\sqrt{(1+z_R^2)}\\right)\\cdot y \\\\
								&= \\left(\\sqrt{1+(${sds(zl)})^2} + \\sqrt{1+(${sds(zr)})^2}\\right)\\cdot ${sds(y)}\\, \\mathsf{m} \\\\\\\\
							
							P &= ${P}\\, \\mathsf{m}
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
							&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
							R&= ${R} \\mathsf{m}
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
          &= \\frac{1}{${sds(n)}} \\left(${R}\\right)^{2/3} \\left(${sds(s / 100)}\\right)^{1/2} \\\\\\\\
          v &= ${v} \\, \\mathsf{m/s}
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
          &= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\\\\\
          Q &= ${Q} \\, \\mathsf{m^3/s}
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
                {2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
            E &= ${E}\\,\\mathsf{m}
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
            T &= z_L\\!\\cdot\\!y + z_R\\!\\cdot\\!y \\\\
            &= (z_L + z_R)\\!\\cdot\\!y \\\\
            &= (${sds(zl)}\\, \\mathsf{m} + ${sds(zr)}\\, \\mathsf{m})\\!\\cdot\\!${sds(y)}\\, \\mathsf{m} \\\\\\\\
            T &= ${T}\\, \\mathsf{m}  							   
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
          &=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${A}\\, \\mathsf{m^2}/${T}\\, \\mathsf{m})}} \\\\\\\\
          N_F &= ${NF}
        \\end{aligned}
      `)}
			{/snippet}
		</Carrd>

		<div class="heading">Critical Flow</div>

		<Carrd>
			{#snippet answer()}
				For {@html ki(`Q=${Q} \\, \\mathsf{m^3\\!/s}`)}, Critical Depth {@html ki(
					`y_c=${sds(yc)} \\, \\mathsf{m}`
				)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
        \\begin{aligned}
          A &=  \\frac{(z_L+z_R)y^2}{2} \\\\
          T &= (z_L+z_R)y \\\\

          N_F &= 1 \\\\
          \\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
          \\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
          \\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
          \\Rightarrow \\frac{Q^2}{g} &= \\frac{(\\frac{(z_L+z_R)y_c^2}{2})^3}{(z_L+z_R)\\cdot y_c} \\\\
          &= \\frac{(z_L+z_R)^2}{2^3}\\cdot y_c^5 \\\\

          y_c^5 &= \\frac{Q^2}{g}\\cdot \\frac{8}{(z_L+z_R)^2} \\\\
          y_c^5 &= \\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}}\\cdot \\frac{8}{(${sds(zl)}+${sds(zr)})^2} \\\\
          y_c &= \\left[\\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}}\\cdot \\frac{8}{(${sds(zl)}+${sds(zr)})^2}\\right]^{0.2}	\\\\\\\\								
          y_c &= ${yc}\\, \\mathsf{m}
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
          A_c &= \\frac{\\left(z_L+z_R\\right)y_c^2}{2} \\\\
          &= \\frac{\\left(${sds(zl)}+${sds(zr)}\\right)(${yc}\\, \\mathsf{m})^2}{2} \\\\
          &= ${Ac}\\, \\mathsf{m^2} \\\\\\\\          
          v_c &= Q/A_c \\\\
          &= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\\\\\
          v_c &= ${vc}\\, \\mathsf{m/s}          
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
          &= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
          E_{min} &= ${Emin} \\,\\mathsf{m}
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
          A_c &= \\frac{\\left(z_L+z_R\\right)y_c^2}{2} \\\\
          &= \\frac{\\left(${sds(zl)}+${sds(zr)}\\right)(${yc}\\, \\mathsf{m})^2}{2} \\\\
          &= ${Ac}\\, \\mathsf{m^2} \\\\

          P_c &= \\left(\\sqrt{1+z_L^2}+\\sqrt{1+z_R^2} \\right)y_c \\\\
          &= \\left(\\sqrt{1+(${sds(zl)})^2}+\\sqrt{1+(${sds(zr)})^2} \\right)(${yc}\\, \\mathsf{m}) \\\\								
          &= ${Pc}\\, \\mathsf{m}\\\\\\\\

          R_c &= A_c/P_c \\\\
          &= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
          &= ${Rc}\\,\\mathsf{m}\\\\\\\\

          \\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
          &= \\left(\\frac{${sds(n)}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
          &= ${sdw(Sc / 100)} \\\\
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
		padding: 1em;
		text-align: center;
		width: 90%;
	}
</style>
