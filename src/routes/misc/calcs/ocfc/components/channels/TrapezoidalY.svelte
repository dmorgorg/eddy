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
	let noFlowAreaError = $state(false)
	// let ySoHighError = $state(false)

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	// const getNFfromY = (y) => {
	// 	let A = trap.getArea(y, zl, b, zr)
	// 	let T = trap.getT(y, zl, b, zr)
	// 	let v = Q / A
	// 	return v / ((g * A) / T) ** 0.5
	// }
	// const getYCfromQ = (low = 0, high = 100) => {
	// 	let delta = 1 / 10 ** (wdigs + 1),
	// 		mid = (low + high) / 2
	// 	if (Math.abs(low - high) < delta) {
	// 		return mid
	// 	}
	// 	// search
	// 	if (getNFfromY(mid) > 1) {
	// 		return getYCfromQ(mid, high)
	// 	} else {
	// 		return getYCfromQ(low, mid)
	// 	}
	// }

	const setYcIterationPoints = () => {
		let next = Number(initGuessYc)
		let current = next + 1
		let iterations = 0
		const points = [next]
		while (current != next) {
			++iterations
			current = next
			next = Number(
				sdw((coeffYc * Math.pow(b + (zl + zr) * current, 1 / 3)) / (b + ((zl + zr) / 2) * current))
			)
			points.push(next)
			if (iterations > 40) break
		}
		iteratedYcPoints = points
	}

	let initGuessYc = $state(1)
	const setInitGuessYc = debounce((val) => {
		initGuessYc = Number(val)
	}, 800)
	let iteratedYcPoints = $state([])

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

	// we need Q before we can call this
	let coeffYc = $derived(sdw(Math.pow((Q * Q) / g, 1 / 3)))
	setYcIterationPoints()

	let yc = $derived(sdw(iteratedYcPoints[iteratedYcPoints.length - 1]))
	let Ac = $derived(sdw(trap.getArea(yc, zl, b, zr)))
	let vc = $derived(sdw(Q / Ac))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(trap.getP(yc, zl, b, zr)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	$effect(() => {
		void trapY.b
		void trapY.y
		void trapY.zl
		void trapY.zr
		void trapY.s
		void trapY.n
		void trapY.g
		setYcIterationPoints()
	})

	let displayedYcPoints = $state([])
	let colorYc = $state([])

	const fadeSteps = 4

	const makeHex = (age) => {
		if (age >= fadeSteps) return null
		const ch = Math.round((1 - age / fadeSteps) * 0x88)
		const toHex = (n) => n.toString(16).padStart(2, '0')
		return `${toHex(0)}${toHex(ch)}${toHex(ch)}`
	}

	const colorize = (color, tex) => (color ? `\\textcolor{#${color}}{${tex}}` : tex)

	$effect(() => {
		const newPoints = iteratedYcPoints.slice()
		const timers = []
		for (let i = 0; i < newPoints.length; i++) {
			const idx = i
			timers.push(
				setTimeout(() => {
					displayedYcPoints[idx] = newPoints[idx]
					if (idx === newPoints.length - 1) displayedYcPoints.length = newPoints.length
					for (let j = 0; j <= idx; j++) colorYc[j] = makeHex(idx - j)
					if (idx === newPoints.length - 1) colorYc.length = newPoints.length
				}, idx * 300)
			)
		}
		for (let e = 1; e <= fadeSteps; e++) {
			const ee = e
			timers.push(
				setTimeout(
					() => {
						for (let j = 0; j < colorYc.length; j++)
							colorYc[j] = makeHex(newPoints.length - 1 - j + ee)
					},
					(newPoints.length - 1 + ee) * 300
				)
			)
		}
		return () => timers.forEach(clearTimeout)
	})

	// Handles s, n, g input changes; stores as numbers, updates input with formatted value
	const processChange = debounce((e) => {
		noSlopeError = false
		bothVerticalWarning = false
		zeroDepthError = false
		zeroBaseWarning = false
		noFlowAreaError = false

		let id = e.target.id
		let value = Math.abs(Number(e.target.value))

		// slope change
		if (id === 's') {
			let prev = trapY.s
			// no flow with zero slope so don't allow it
			if (value == 0) {
				noSlopeError = true
				// trapY.s = prev
				e.target.value = prev
			} else {
				trapY.s = value
				e.target.value = sds(trapY.s)
			}

			// n change
		} else if (id === 'n') {
			trapY.n = value
			e.target.value = sds(trapY.n)

			// g change
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

			// left slope change
		} else if (id === 'zl') {
			let prev = trapY.zl
			// toFixed in sd chokes on 0 so deal with it here
			if (value == 0) {
				// if zr is 0 AND b is 0 don't change zl to 0 but keep at previous value and issue warning
				if (trapY.zr === 0) {
					if (trapY.b === 0) {
						noFlowAreaError = true
						// trapY.zl = value
						e.target.value = trapY.zl = sds(prev)
					} else {
						bothVerticalWarning = true
						// trapY.zl = value
						e.target.value = trapY.zl = value
					}
				} else {
					e.target.value = trapY.zl = value
				}
				// non-zero value for left slope
			} else {
				trapY.zl = value
				e.target.value = sds(trapY.zl)
			}

			// right slope change
		} else if (id === 'zr') {
			let prev = trapY.zr
			if (value == 0) {
				if (trapY.zl === 0) {
					if (trapY.b === 0) {
						noFlowAreaError = true
						// trapY.zr = value
						e.target.value = trapY.zr = sds(prev)
					} else {
						bothVerticalWarning = true
						// trapY.zr = value
						e.target.value = trapY.zr = value
					}
				} else {
					e.target.value = trapY.zr = value
				}
			} else {
				trapY.zr = value
				e.target.value = sds(trapY.zr)
			}

			// base width change
		} else if (id === 'b') {
			let prev = trapY.b
			if (value == 0) {
				if (trapY.zl === 0 && trapY.zr === 0) {
					noFlowAreaError = true
					e.target.value = sds(prev)
				} else {
					zeroBaseWarning = true
					trapY.b = value
					e.target.value = value
				}
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

<article>
	<section class="canvas">
		<TrapCanvas bind:zl={trapY.zl} bind:zr={trapY.zr} bind:b={trapY.b} bind:y={trapY.y} />
	</section>
	<!-- dPx: {dPx} -->

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
			With both slopes vertical, you have a rectangular channel. You should use that simpler
			calculator option...but it's up to you really.
		</div>
	{/if}
	{#if noFlowAreaError}
		<div class="error" transition:slide={{ duration: 1000, axis: 'y' }}>
			With both slopes vertical and a zero base width value, there is no flow area and nothing to
			calculate. You need at least one of the base or side slope values to be a non-zero positive
			value.
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

							\\Rightarrow \\frac{${sdw(Q)}^2}{${sds(g)}} &= \\frac{\\left(\\left(${sds(b)}+${sdw(zl / 2 + zr / 2)}y_c\\right)y_c\\right)^3}{${sds(b)} + ${sdw(zl + zr)}y_c} 									
					\\end{aligned}`)}
				<div>
					...where the depth {@html ki('y_c')} is in metres. This expression cannot be solved directly
					(analytically) for {@html ki(`y_c`)} but may be found using iterative methods or, more conveniently,
					by using a numerical solver available on a scientific calculator.)
				</div>
				{@html kd(`
						y_c=${sdw(yc)}\\, \\mathsf{m}
						`)}
				<Card>
					{#snippet answer()}
						<strong>Fixed Point Iterative Solution</strong>
					{/snippet}
					{#snippet solution()}
						{@html kd(`
							\\begin{aligned}
								\\frac{\\left(${sds(Q)}\\right)^2}{${g}}&= \\frac{\\left(\\left(${sds(b)}\\, +${sdw(
									zl / 2 + zr / 2
								)} y_c\\right)y_c\\right)^3}{${sds(b)}+ ${sdw(zl / 1 + zr / 1)}y_c} \\\\
								\\Rightarrow y_c^3 &= \\frac{\\left(${sdw(Q)}\\right)^2}{${g}}\\cdot\\frac{${sds(b)}+ ${sdw(zl + zr)}y_c}{\\left(${sds(b)}+ ${sdw(zl / 2 + zr / 2)} y_c\\right)^3} \\\\
								\\Rightarrow y_c &= \\left[\\frac{\\left(${sdw(Q)}\\right)^2}{${g}}\\right]^{1/3}\\cdot\\frac{\\left(${sds(b)}+ ${sdw(zl + zr)}y_c\\right)^{1/3}}{${sds(b)}+ ${sdw(zl / 2 + zr / 2)} y_c} \\\\
								&= ${sdw(Math.pow((Q * Q) / g, 1 / 3))}\\cdot\\frac{\\left(${sds(b)}+ ${sdw(zl + zr)}y_c\\right)^{1/3}}{${sds(b)}+ ${sdw(zl / 2 + zr / 2)} y_c} \\\\
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
						<br /><br />
						Start with an (editable) initial guess of {@html ki('y_0 =')}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							style="padding: 5em; padding-inline: 2em; margin-inline: -2em; cursor: auto; position: relative; z-index: 100"
							onclick={(e) => e.stopPropagation()}
						>
							<input
								type="number"
								value={sds(initGuessYc)}
								min="0"
								step="any"
								style="width: 4em"
								oninput={(e) => setInitGuessYc(e.currentTarget.value)}
							/>
						</span>:
						{#each displayedYcPoints as pt, i}
							{#if !isNaN(displayedYcPoints[i + 1])}
								{@html kd(
									(() => {
										const val = colorize(colorYc[i + 1], `\\bm{${sdw(displayedYcPoints[i + 1])}}`)
										const ptVal = colorize(colorYc[i], `\\bm{${i == 0 ? sds(pt) : sdw(pt)}}`)
										return `y_{${i + 1}}=${val}= \\frac{${sdw(coeffYc)}\\cdot(${sds(b)}+ ${sdw(zl + zr)}\\cdot${ptVal})^{1/3}}{${sds(b)}+ ${sdw(zl / 2 + zr / 2)}\\cdot${ptVal}}`
									})()
								)}
							{/if}
						{/each}
						Notice that now {@html ki(
							`y_{${iteratedYcPoints.length - 1}}=f(y_{${iteratedYcPoints.length - 2}})`
						)}, that is {@html ki(`f(${yc})=${yc}`)}, and {@html ki(`\\bm{y=${yc}\\,\\mathsf{m}}`)} is
						the fixed-point solution to the depth of flow equation derived above.
						{iteratedYcPoints[iteratedYcPoints.length - 1]}
					{/snippet}
				</Card>
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
	// .canvas {
	// 	margin-inline: auto;
	// 	width: 40em;
	// 	// border: 1px solid blue;
	// 	// background: #eee;
	// }
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
	// .error {
	// 	align-items: center;
	// 	border: 2px solid red;
	// 	// border: 2px solid #088;
	// 	box-shadow: 2px 2px 4px red;
	// 	// box-shadow: 2px 2px 4px #088;
	// 	color: red;
	// 	display: flex;
	// 	font-weight: bold;
	// 	justify-content: center;
	// 	margin: 2em auto;
	// 	padding: 1em;
	// 	text-align: center;
	// 	width: 90%;
	// }
</style>
