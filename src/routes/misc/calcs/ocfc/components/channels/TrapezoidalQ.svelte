<script>
	// @ts-nocheck

	import TrapCanvas from './TrapCanvas.svelte'
	import Card from '../Card.svelte'
	import { ki, kd, sd, debounce } from '$lib/utilities/utils.js'
	import { common, trap } from '$lib/fluids/openChannel/utils'
	import { digits } from '../../digits.svelte.js'
	import { trapQ } from '../../store.svelte.js'
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

	const getQfromY = (y) => {
		var A = trap.getArea(y, zl, b, zr)
		let v = common.getV(n, common.getR(A, trap.getP(y, zl, b, zr)), s)
		return A * v
	}
	const getYfromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2
		if (Math.abs(low - high) < delta) {
			return (low + high) * 0.5
		}
		// search
		if (getQfromY(mid) < Q) {
			return getYfromQ(mid, high)
		} else {
			return getYfromQ(low, mid)
		}
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

	let zl = $derived(Number(trapQ.zl))
	let zr = $derived(Number(trapQ.zr))
	let b = $derived(Number(trapQ.b))
	let Q = $derived(Number(trapQ.Q))
	let s = $derived(Number(trapQ.s))
	let n = $derived(Number(trapQ.n))
	let g = $derived(Number(trapQ.g))

	let y = $derived(sdw(getYfromQ()))
	let A = $derived(sdw(trap.getArea(y, zl, b, zr)))
	let v = $derived(sdw(common.getVfromQandA(Q, A)))
	let E = $derived(sdw(common.getE(y, v, g)))
	let T = $derived(sdw(trap.getT(y, zl, b, zr)))
	let NF = $derived(sdw(common.getNF(v, A, T, g)))
	let yc = $derived(sdw(getYCfromQ()))
	let Ac = $derived(sdw(trap.getArea(yc, zl, b, zr)))
	let vc = $derived(sdw(common.getVfromQandA(Q, Ac)))
	let Emin = $derived(sdw(common.getE(yc, vc, g)))
	let Pc = $derived(sdw(trap.getP(yc, zl, b, zr)))
	let Rc = $derived(sdw(common.getR(Ac, Pc)))
	let Sc = $derived(sdw(common.getCriticalSlope(n, vc, Rc)))

	let initGuessY = $state(1)
	let initGuessYc = $state(1)
	const setInitGuessY = debounce((val) => {
		initGuessY = Number(val)
	}, 800)
	const setInitGuessYc = debounce((val) => {
		initGuessYc = Number(val)
	}, 800)
	let iteratedYPoints = $derived([])
	let iteratedYcPoints = $derived([])
	let coeffY = $derived(sdw(Math.pow((Q * n) / Math.pow(s / 100, 0.5), 0.6)))
	let coeffYc = $derived(sdw(Math.pow((Q * Q) / g, 1 / 3)))

	const setYIterationPoints = () => {
		let next = Number(initGuessY)
		// iteratedYPoints.push(Number(initGuessY))
		let current = next + 1
		let iterations = 0
		const points = [next]
		while (current != next) {
			++iterations
			current = next
			next = Number(
				sdw(
					(coeffY *
						Math.pow(
							b + Math.pow(1 + zl * zl, 0.5) * current + Math.pow(1 + zr * zr, 0.5) * current,
							0.4
						)) /
						(b + (zl / 2 + zr / 2) * current)
				)
			)
			points.push(next)
			// in case of non convergence
			if (iterations > 20) break
		}
		iteratedYPoints = points
	}
	const setYcIterationPoints = () => {
		let next = Number(initGuessYc)
		// iteratedYPoints.push(Number(initGuessY))
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
			// in case of non convergence
			if (iterations > 20) break
		}
		iteratedYcPoints = points
	}

	$effect(() => {
		void trapQ.b
		void trapQ.Q
		void trapQ.zl
		void trapQ.zr
		void trapQ.s
		void trapQ.n
		void trapQ.g
		// void initGuessYc
		setYIterationPoints()
		setYcIterationPoints()
	})

	let displayedYPoints = $state([])
	let displayedYcPoints = $state([])
	let colorY = $state([]) // current hex color per point index (null = black)
	let colorYc = $state([])

	const fadeSteps = 4

	const makeHex = (age) => {
		if (age >= fadeSteps) return null
		const ch = Math.round((1 - age / fadeSteps) * 0xff)
		const toHex = (n) => n.toString(16).padStart(2, '0')
		return `${toHex(0)}${toHex(ch)}${toHex(ch)}`
	}

	const colorize = (color, tex) => (color ? `\\textcolor{#${color}}{${tex}}` : tex)

	// complicated AI code to let updated initial values in iterations ripple through the iteration rather than show updated values instantly. Seems to work well.
	$effect(() => {
		const newPoints = iteratedYPoints.slice()
		const timers = []
		for (let i = 0; i < newPoints.length; i++) {
			const idx = i
			timers.push(
				setTimeout(() => {
					displayedYPoints[idx] = newPoints[idx]
					if (idx === newPoints.length - 1) displayedYPoints.length = newPoints.length
					for (let j = 0; j <= idx; j++) colorY[j] = makeHex(idx - j)
					if (idx === newPoints.length - 1) colorY.length = newPoints.length
				}, idx * 300)
			)
		}
		for (let e = 1; e <= fadeSteps; e++) {
			const ee = e
			timers.push(
				setTimeout(
					() => {
						for (let j = 0; j < colorY.length; j++)
							colorY[j] = makeHex(newPoints.length - 1 - j + ee)
					},
					(newPoints.length - 1 + ee) * 300
				)
			)
		}
		return () => timers.forEach(clearTimeout)
	})

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

		let id = e.target.id
		let value = Math.abs(Number(e.target.value))

		if (id === 's') {
			// no flow with zero slope so don't allow it
			if (value == 0) {
				noSlopeError = true
				e.target.value = sds(trapQ.s)
			} else {
				trapQ.s = value
				e.target.value = sds(trapQ.s)
			}
		} else if (id === 'n') {
			trapQ.n = value
			e.target.value = sds(trapQ.n)
		} else if (id === 'g') {
			// need e.target.value as a string to measure length
			let value = e.target.value
			if (value[0] == '-') {
				value = value.slice(1)
			}
			if (value.length > 4) {
				trapQ.g = value
				e.target.value = sd(trapQ.g, 4)
			} else {
				trapQ.g = value
				e.target.value = sds(trapQ.g)
			}
		} else if (id === 'zl') {
			// let prev = trapQ.zl
			// toFixed in sd chokes on 0 so deal with it here
			if (value == 0) {
				// if zr is already 0, don't change zl to 0 but keep at previous value
				if (trapQ.zr === 0) {
					bothVerticalWarning = true
					// console.log('true')
					trapQ.zl = value
					e.target.value = trapQ.zl
				} else {
					e.target.value = trapQ.zl = 0
				}
			} else {
				trapQ.zl = value
				e.target.value = sds(trapQ.zl)
			}
		} else if (id === 'zr') {
			// let prev = trapQ.zr
			if (value == 0) {
				if (trapQ.zl === 0) {
					bothVerticalWarning = true
					trapQ.zr = value
					e.target.value = trapQ.zr
				} else {
					e.target.value = trapQ.zr = 0
				}
			} else {
				trapQ.zr = value
				e.target.value = sds(trapQ.zr)
			}
		} else if (id === 'b') {
			let prev = trapQ.b
			if (value == 0) {
				zeroBaseWarning = true
				trapQ.b = Number(value)
				e.target.value = sds(value)
			} else {
				trapQ.b = value
				e.target.value = sds(trapQ.b)
			}
		} else if (id === 'Q') {
			let prev = trapQ.Q
			if (value == 0) {
				zeroDepthError = true
				trapQ.Q = Number(prev)
				e.target.value = sds(prev)
			} else {
				trapQ.Q = value
				e.target.value = sds(trapQ.Q)
			}
		}
		// setIterationPoints()
	}, 1000)
</script>

<article>
	<section class="canvas">
		<TrapCanvas bind:zl={trapQ.zl} bind:zr={trapQ.zr} bind:b={trapQ.b} bind:y />
	</section>
	<section>
		<div class="inputs-row single">
			<label class="depth-label">
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
			No slope, no flow, no can do. That's just how it is.
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

	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Card>
			{#snippet answer()}
				Depth of flow: {@html ki(`${sds(y)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
				\\begin{aligned}
					Q &= \\frac{1}{n}AR^{2/3}S^{1/2} \\\\[0.75em]

					\\Rightarrow \\frac{Qn}{S^{1/2}} &=  A(A/P)^{2/3} \\\\[0.75em]

					 &=  \\frac{A^{5/3}}{P^{2/3}} \\\\[0.75em]

						

					&= \\frac{((b+\\frac{zl+zr}{2}\\cdot y)y)^{5/3}}{\\left(b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right) y\\right)^{2/3} }    \\\\[0.75em]
					
					\\Rightarrow \\frac{${sds(Q)}\\times${sds(n)}}{(${sds(s / 100)})^{1/2}} &=  \\frac{\\left(\\left(${sds(b)}+${sdw(
						zl / 2 + zr / 2
					)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}\\\\[0.75em]

						\\Rightarrow ${sdw(Q / ((s / 100) ** 0.5 / n))}	&= \\frac{\\left(\\left(${sds(b)}+${sdw(
							zl / 2 + zr / 2
						)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}
							
				\\end{aligned}
				`)}

				<div>
					...where the depth {@html ki('y')} is in metres. This expression cannot be solved directly (analytically)
					for {@html ki(`y`)} but may be found using iterative methods. (Or, more conveniently, by using
					the numerical solver available on a scientific calculator.)
				</div>
				{@html kd(`
						y=${sdw(y)}\\, \\mathsf{m}
						`)}

				<Card>
					{#snippet answer()}
						<strong>Fixed Point Iterative Solution</strong>
					{/snippet}
					{#snippet solution()}
						{@html kd(`
							\\begin{aligned}

								${sdw(Q / ((s / 100) ** 0.5 / n))}	&= \\frac{\\left(\\left(${sds(b)}+${sdw(
									zl / 2 + zr / 2
								)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}\\\\[1em]	

								\\Rightarrow\\left(\\left(${sds(b)}+${sdw(zl / 2 + zr / 2)} y\\right) y\\right)^{5/3} &= ${sdw(Q / ((s / 100) ** 0.5 / n))}\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}\\\\[1em]

								\\Rightarrow\\left(${sds(b)}+${sdw(zl / 2 + zr / 2)} y\\right) y &= ${sdw(Q / ((s / 100) ** 0.5 / n))}^{3/5}\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/5}\\\\[1em]

								\\Rightarrow y &= \\frac{${sdw(Math.pow(Q / ((s / 100) ** 0.5 / n), 0.6))}\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/5}}{${sds(b)}+${sdw(zl / 2 + zr / 2)}y}\\\\[1em]
								

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
							style="padding: 5em; padding-inline: 2em; margin-inline: -2em; cursor: auto; position: relative;  z-index: 100"
							onclick={(e) => e.stopPropagation()}
						>
							<input
								type="number"
								value={sds(initGuessY)}
								min="0"
								step="any"
								style="width: 4em"
								oninput={(e) => setInitGuessY(e.currentTarget.value)}
							/>
						</span>:

						{#each displayedYPoints as pt, i}
							<!-- don't print out an equation with the last element as independent variable with calculated value not defined -->
							{#if !isNaN(displayedYPoints[i + 1])}
								{@html kd(
									(() => {
										const val = colorize(colorY[i + 1], `\\bm{${sdw(displayedYPoints[i + 1])}}`)
										const ptVal = colorize(colorY[i], `\\bm{${i == 0 ? sds(pt) : sdw(pt)}}`)
										return `y_{${i + 1}}=${val}= \\frac{${sdw(coeffY)}\\cdot(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}\\cdot${ptVal})^{2/5}}{\\left(${sds(b)}+ ${sdw(zl / 2 + zr / 2)}\\cdot${ptVal})^{2/5}\\right)^{2/3}}`
									})()
								)}
							{/if}
						{/each}
						Notice that now {@html ki(
							`y_{${iteratedYPoints.length - 1}}=f(y_{${iteratedYPoints.length - 2}})`
						)}, that is {@html ki(`f(${y})=${y}`)}, and {@html ki(`\\bm{y=${y}\\,\\mathsf{m}}`)} is the
						fixed-point solution to the depth of flow equation derived above.
					{/snippet}
				</Card>
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Flow Area: {@html ki(`${sds(A)}\\, \\mathsf{m^2}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
						\\begin{aligned}
							A &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y\\right)y \\\\
							&= \\left(${sds(b)}\\, \\mathsf{m}+${sds(
								zl / 2 + zr / 2
							)}\\times ${sdw(y)}\\, \\mathsf{m}\\right)\\cdot ${sdw(y)}\\, \\mathsf{m} \\\\							
							&= ${sdw(A)} \\, \\mathsf{m^2}
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
						 	&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${sdw(A)}\\, \\mathsf{m^2}} \\\\					
							&= ${sdw(v)} \\, \\mathsf{m/s}
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
						 	&= ${sdw(y)}\\, \\mathsf{m}+\\frac{(${sdw(v)}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\					
							&= ${sdw(E)} \\, \\mathsf{m}
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
							T &=  b+ \\left(z_L+z_R\\right)y \\\\
							&=  ${sds(b)}\\, \\mathsf{m} + \\left(${sds(zl)}+${sds(zr)}\\right)\\cdot${sdw(y)}\\, \\mathsf{m} \\\\
							&= ${sdw(T)}\\, \\mathsf{m} \\\\							
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
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
								A
							)}\\, \\mathsf{m^2}/${sdw(T)}\\, \\mathsf{m})}} \\\\
							&= ${sdw(NF)}
						\\end{aligned}
				`)}
			{/snippet}
		</Card>

		<div class="heading">Critical Flow</div>

		<Card>
			{#snippet answer()}
				For the {@html ki(`Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {@html ki(
					`yc=${sds(yc)} \\, \\mathsf{m}`
				)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						N_F &= 1 \\\\
						\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
						\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
						\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\								
						&= \\frac{\\left(\\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c\\right)^3}{b+ \\left(z_L+z_R\\right)y_c}	\\\\
						\\Rightarrow \\frac{\\left(${sds(Q)}\\right)^2}{${g}}&= \\frac{\\left(\\left(${sds(b)}+${sdw(
							zl / 2 + zr / 2
						)} y_c\\right)y_c\\right)^3}{${sds(b)}+ ${sdw(zl / 1 + zr / 1)}y_c}
					\\end{aligned}`)}
				<div>
					...where the critical depth, {@html ki(`y_c`)}, is in metres. This expression cannot be
					solved directly (analytically) for {@html ki(`y_c`)}. It may be found using iterative
					methods or, more conveniently, by using a numerical solver on a scientific calculator.
				</div>
				{@html kd(`y_c=${sdw(yc)}\\, \\mathsf{m}`)}
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

								\\Rightarrow y_c^3 &= \\frac{\\left(${sds(Q)}\\right)^2}{${g}}\\cdot\\frac{${sds(b)}+ ${sdw(
									zl / 1 + zr / 1
								)}y_c}{\\left(${sds(b)}\\, +${sdw(zl / 2 + zr / 2)} y_c\\right)^3} \\\\
								\\Rightarrow y_c &= \\left[\\frac{\\left(${sds(Q)}\\right)^2}{${g}}\\right]^{1/3}\\cdot\\frac{\\left(${sds(b)}+ ${sdw(
									zl / 1 + zr / 1
								)}y_c\\right)^{1/3}}{${sds(b)}\\, +${sdw(zl / 2 + zr / 2)} y_c} \\\\
								&= ${sdw(Math.pow((Q * Q) / g, 1 / 3))}\\cdot\\frac{\\left(${sds(b)}+ ${sdw(
									zl / 1 + zr / 1
								)}y_c\\right)^{1/3}}{${sds(b)}\\, +${sdw(zl / 2 + zr / 2)} y_c} \\\\
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
							style="padding: 5em; padding-inline: 2em; margin-inline: -2em; cursor: auto; position: relative;  z-index: 100"
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
							<!-- don't print out an equation with the last element as independent variable with calculated value not defined -->
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
					{/snippet}
				</Card>
			{/snippet}
		</Card>

		<Card>
			{#snippet answer()}
				Critical Velocity: {@html ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`
					\\begin{aligned}
						A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c \\\\
					&= \\left(${sds(b)}\\, \\mathsf{m}+${sdw(
						zl / 2 + zr / 2
					)} \\times ${sdw(yc)}\\, \\mathsf{m}\\right)\\cdot ${sdw(yc)}\\, \\mathsf{m} \\\\
					&= ${sdw(Ac)}\\, \\mathsf{m^2}\\\\\\\\

					v_c &= Q/A_c \\\\
					&= \\frac{${sds(Q)}\\, \\mathsf{m^3\\!/s}}{${sdw(Ac)}\\, \\mathsf{m^2}} \\\\\\\\
					&= ${sdw(vc)} \\,\\mathsf{m/s}
				\\end{aligned}	`)}
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
						&= ${sdw(yc)}\\, \\mathsf{m}+\\frac{ (${sdw(vc)}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
						&= ${sdw(Emin)} \\,\\mathsf{m}
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
						A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c \\\\
						&= \\left(${sds(b)}\\, \\mathsf{m}+${sdw(
							zl / 2 + zr / 2
						)} \\times ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
						&= ${sdw(Ac)}\\, \\mathsf{m^2}\\\\\\\\

						P_c &= b + \\left( \\sqrt{1+z_L^2} + \\sqrt{1+z_R^2} \\right)\\cdot y_c \\\\
						P_c &= ${sds(b)}\\, \\mathsf{m} + \\left( \\sqrt{1+(${sds(zl)})^2} + \\sqrt{1+(${sds(zr)})^2} \\right)\\cdot y_c \\\\
						
						&= ${Pc}\\, \\mathsf{m}\\\\\\\\

						R_c &= A_c/P_c \\\\
						&= \\frac{${sdw(Ac)}\\, \\mathsf{m^2}}{${sdw(Pc)}\\, \\mathsf{m}} \\\\
						&= ${Rc}\\,\\mathsf{m}\\\\\\\\

						\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
						&= \\left(\\frac{${sds(n)}\\times ${sdw(vc)}\\, \\mathsf{m/s} }{ (${sdw(Rc)}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
						&= ${sdw(Sc / 100)} \\\\\\\\
						&= ${sdw(Sc)}\\% 								
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
		margin-inline: auto;
		width: 32em;
	}

	.inputs-row {
		display: flex;
		gap: 0.5em;
		justify-content: space-between;
		margin: 0.625em auto;
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
