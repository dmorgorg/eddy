<script>
	// @ts-nocheck

	import TrapCanvas from './TrapCanvas.svelte'
	import Carrd from '../Carrd.svelte'
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
	let iteratedYforQ

	const sds = (num) => {
		return sd(num, sdigs, extraForSdigs)
	}
	const sdw = (num) => {
		return sd(num, wdigs, extraForWdigs)
	}

	let y = $derived(sdw(getYfromQ()))

	const initGuessQ = sdw(0.5)

	const getQfromY = (y) => {
		var A = trap.getArea(y, zl, b, zr)
		let v = common.getV(n, common.getR(A, trap.getP(y, zl, b, zr)), s)
		return A * v
	}
	const getYfromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2
		// console.log(delta+', '+low+', '+high);
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

	// calculations for y specified
	// let y = $derived(Q)

	const setIterationPointsQ = () => {
		let next = Number(initGuessQ),
			// make current different from current to guarantee that the loop is entered initially
			current = next + 1,
			iterations = 0
		// when the $effect sees iteratedY change it refires each time, causing a loop. Store the		results in points and assign it once outside the loop
		const points = []

		while (current != next) {
			++iterations
			current = next
			next = Number(
				sdw(
					((b + ((zl + zr) / 2) * current) ** (5 / 3) * current ** (8 / 3)) /
						(b + ((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5) * current) ** (2 / 3) /
						((Q * n) / Math.pow(s / 100, 0.5))
				)
			)
			// console.log(next)
			points.push(next)

			// in case of non convergence
			if (iterations > 20) break
		}
		iteratedYforQ = points || []
		console.log(iteratedYforQ)
	}

	let next = initGuessQ
	let current = next
	// console.log(
	// 	sdw(
	// 		(((b + ((zl + zr) / 2) * current) ** (5 / 3) * current ** (8 / 3)) /
	// 			(b + ((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5) * current) ** (2 / 3) /
	// 			((Q * n) / (s / 100))) ^
	// 			0.5
	// 	)
	// )
	// console.log(sdw((b + ((zl + zr) / 2) * current) ** (5 / 3) * current ** (8 / 3)))
	// console.log(sdw((b + ((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5) * current) ** (2 / 3)))
	// console.log(sdw((Q * n) / Math.pow(s / 100, 0.5)))
	// console.log(sdw((Q * n) / ((s / 100) ^ 0.5)))

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

	$effect(() => {
		void trapQ.b
		void trapQ.Q
		void trapQ.zl
		void trapQ.zr
		void trapQ.s
		void trapQ.n
		void trapQ.g
		// setIterationPointsQ()
	})
</script>

<section class="canvas">
	<TrapCanvas bind:zl={trapQ.zl} bind:zr={trapQ.zr} bind:b={trapQ.b} bind:y />
</section>
<article>
	<!-- <section> -->

	<!-- </section> -->
	<!-- {trap.zl}, {trap.b}, {trap.zr}, {trap.y} -->
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
			With both slopes vertical, you have a simpler rectangular channel. You should use that
			option...but it's up to you really.
		</div>
	{/if}

	<section class="results">
		<div class="heading">Normal (Uniform) Flow</div>

		<Carrd>
			{#snippet answer()}
				Depth of flow: {@html ki(`${sds(y)}\\, \\mathsf{m}`)}
			{/snippet}
			{#snippet solution()}
				{@html kd(`\\normalsize
						\\begin{aligned}
							A &= \\left(b+\\frac{z_L+z_R}{2}\\cdot y\\right)y \\\\
							&= \\left(${sds(b)}\\, \\mathsf{m}+\\frac{${sds(zl)}\\,\\mathsf{m} + ${sds(zr)}\\,\\mathsf{m}}{2}\\cdot y\\right) y \\\\
							&= \\left(${sds(b)}\\, \\mathsf{m}+${sdw(zl / 2 + zr / 2)} y\\right) y \\\\\\\\

							P &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right) y \\\\
							&= ${sds(b)}\\, \\mathsf{m}\\!+\\!\\left(\\! \\sqrt{1\\!+\\!(${sds(zl)}\\,\\mathsf{m})^2}+\\sqrt{1\\!+\\!(${sds(zr)}\\,\\mathsf{m})^2}\\!\\right)\\! y 
							\\\\\\\\
							
							Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\							
							&= \\frac 1n A(A/P)^{2/3}S^{1/2} \\\\
							 &= \\frac 1n \\cdot\\frac{A^{5/3}}{P^{2/3}}\\cdot S^{1/2} \\\\\\\\

							\\Rightarrow ${sds(Q)}&= \\frac{1}{${sds(n)}}   \\\\

							&\\qquad{\\large\\times}\\,\\frac{\\left(\\left(${sds(b)}\\!+\\!${sdw(
								zl / 2 + zr / 2
							)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+\\!\\left( \\sqrt{1\\!+\\!${sds(zl)}^2}\\!+\\!\\sqrt{1\\!+\\!${sds(zr)}^2}\\right) y\\right)^{2/3}}\\! \\\\

							&\\qquad{\\large\\times}(${sds(s / 100)})^{1/2} \\\\\\\\

							\\Rightarrow ${sds(Q)} &= \\frac{(${sds(s / 100)})^{1/2}}{${sds(n)}} {\\large \\times} \\frac{\\left(\\left(${sds(b)}+${sdw(
								zl / 2 + zr / 2
							)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}\\\\\\\\
						\\Rightarrow ${sdw(Q / ((s / 100) ** 0.5 / n))}	&= \\frac{\\left(\\left(${sds(b)}+${sdw(
							zl / 2 + zr / 2
						)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}
							
						\\end{aligned}`)}
				<div>
					...where {@html ki('y')} is in metres. This expression cannot be solved directly (analytically)
					for {@html ki(`y`)} but may be found using iterative methods. (Or, more conveniently, by using
					the numerical solver available on a scientific calculator.)
				</div>
				{@html kd(`
						y=${y}\\, \\mathsf{m}
						`)}

				<Carrd>
					{#snippet answer()}
						<strong>Fixed Point Iterative Solution</strong>
					{/snippet}
					{#snippet solution()}
						{@html kd(
							`${sdw(Q / ((s / 100) ** 0.5 / n))}	= \\frac{\\left(\\left(${sds(b)}+${sdw(
								zl / 2 + zr / 2
							)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}`
						)}
						Rearrange the equation to get a single power of {@html ki('y')} on the left:
						{@html kd(`
							\\begin{aligned}
								${sdw(Q / ((s / 100) ** 0.5 / n))}	&= \\frac{\\left(\\left(${sds(b)}+${sdw(
									zl / 2 + zr / 2
								)} y\\right) y\\right)^{5/3}}{\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}\\cdot\\frac yy \\\\

								\\Rightarrow y	&= \\frac{\\left(${sds(b)}+${sdw(
									zl / 2 + zr / 2
								)} y\\right)^{5/3} y^{8/3}}{${sdw(Q / ((s / 100) ** 0.5 / n))}\\left(${sds(b)}+ ${sdw((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5)}y\\right)^{2/3}}\\\\
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
						Start with a guess of {@html ki(`y_0=${initGuessQ}`)}:
					{/snippet}
				</Carrd>
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<Carrd>
			{#snippet answer()}
				stuff
			{/snippet}
			{#snippet solution()}
				more
			{/snippet}
		</Carrd>

		<div class="heading">Critical Flow</div>

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
