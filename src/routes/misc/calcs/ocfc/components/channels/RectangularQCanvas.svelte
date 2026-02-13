<script>
	import { browser } from '$app/environment'
	import { Stage, Layer, Rect, Line, Arrow } from 'svelte-konva'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'

	let { aspectRatio, base = $bindable(), depth = $bindable() } = $props()
	let stage

	const paddingTopEm = 1
	// more space below for the Base input
	const paddingBottomEm = 3
	const paddingInlineEm = 1

	let emToPx = $state(16)
	let paddingTop = $derived(paddingTopEm * emToPx)
	let paddingBottom = $derived(paddingBottomEm * emToPx)
	let paddingInline = $derived(paddingInlineEm * emToPx)
	let divWidth = $state(0)
	let divHeight = $state(0)
	let channelBase = $derived.by(() => {
		if (aspectRatio < 1) {
			// maps aspectRatio of 1/6 to 15% of divWidth, 1 to 50% of divWidth
			let y = 20 / aspectRatio + 130
			return y * aspectRatio
		} else {
			// maps ... todo
			return Math.round(((60 * aspectRatio + 220) / 7) * (divWidth - 2 * paddingInline)) / 100
		}
	})
	let channelDepth = $derived(Math.round(channelBase / aspectRatio))
	let stageWidth = $derived(Math.round(channelBase + 2 * paddingInlineEm * emToPx))
	let stageHeight = $derived(Math.round(channelDepth + paddingTop + paddingBottom))
	let channelLeft = $derived(paddingInline)
	let channelRight = $derived(channelLeft + channelBase)
	let channelTop = $derived(paddingTop)
	let channelBottom = $derived(paddingTop + channelDepth)

	// @ts-ignore
	const sds = (num) => {
		return sd(num, digits.sdigs, digits.extraForSdigs)
	}

	const processChange = debounce((e) => {
		if (e.target.id === 'base') {
			base = sds(e.target.value)
			// force binding back to input when backspacing/delete of trailing decimal zeros don't update
			e.target.value = base
		}
		if (e.target.id === 'depth') {
			depth = sds(e.target.value)
			e.target.value = depth
		}
	})
</script>

{#if browser}
	<div bind:clientWidth={divWidth} bind:clientHeight={divHeight}>
		<div class="stage">
			<Stage width={stageWidth} height={stageHeight} bind:this={stage}>
				<Layer>
					<!-- <Rect x={0} y={0} width={stageWidth} height={stageHeight} stroke="#000" /> -->
					<Rect
						x={channelLeft}
						y={channelTop}
						width={channelBase}
						height={channelDepth}
						fillLinearGradientStartPoint={{ x: channelLeft, y: channelTop }}
						fillLinearGradientEndPoint={{ x: channelLeft, y: channelBottom }}
						fillLinearGradientColorStops={[0, '#0bb', 0.625, '#066']}
					/>
					<Line
						x={0}
						y={0}
						points={[
							channelLeft,
							channelTop - paddingTop / 2,
							channelLeft,
							channelBottom,
							channelRight,
							channelBottom,
							channelRight,
							channelTop - paddingTop / 2
						]}
						stroke="black"
						strokeWidth={3}
						lineCap="round"
					/>
					<Arrow
						x={0}
						y={0}
						points={[
							channelLeft,
							channelBottom + paddingBottom / 2,
							channelRight,
							channelBottom + paddingBottom / 2
						]}
						stroke="black"
						fill="black"
						pointerAtBeginning={true}
						pointerLength={4}
						pointerWidth={3}
						strokeWidth={1.25}
					/>
					<Arrow
						x={0}
						y={0}
						points={[
							channelLeft + channelBase / 2,
							channelTop + 3,
							channelLeft + channelBase / 2,
							channelBottom - 3
						]}
						stroke="black"
						fill="black"
						pointerAtBeginning={true}
						pointerLength={4}
						pointerWidth={3}
						strokeWidth={1.25}
					/>
					<label
						class="base-input"
						style="left: {channelLeft + channelBase / 2}px; top: {channelBottom +
							paddingBottom / 2}px;"
					>
						<!-- Base: -->
						<span class="unit">{@html ki('b=')}</span>
						<input
							type="number"
							value={base}
							step="any"
							min="0"
							id="base"
							oninput={processChange}
						/>
						<span class="unit">{@html ki('\\mathsf{m}')}</span>
					</label>
					<label
						class="depth-input"
						style="left: {channelLeft + channelBase / 2}px; top: {channelTop + channelDepth / 2}px;"
					>
						<!-- Q: -->
						<span class="unit">{@html ki('Q=')}</span>
						<input
							type="number"
							value={depth}
							step="any"
							min="0"
							id="depth"
							oninput={processChange}
						/>
						<span class="unit">{@html ki('\\mathsf{ m^3/s}')}</span>
					</label>
				</Layer>
			</Stage>
		</div>
	</div>
	<!-- [{channelLeft}, {channelTop}], [{channelRight}, {channelBottom}] -->
{/if}

<style>
	.stage {
		/* background: pink; */
		margin-inline: auto;
		width: fit-content;
		position: relative;
	}

	.base-input,
	.depth-input {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 0.125em;
		z-index: 10;
		white-space: nowrap;
		background: white;
		border: 1px solid black;
		/* box-shadow: 2px 2px 4px #c1cdcd; */
		padding: 0.25em 0.625em;
		border-radius: 3px;
		font-size: 1em;
	}

	.base-input {
		box-shadow: 2px 2px 4px #c1cdcd;
	}

	.base-input .unit,
	.depth-input .unit {
		font-size: 0.925em;
	}

	.base-input input,
	.depth-input input {
		width: 4em;
		padding: 0;
		border: 0.125em solid #c1cdcd;
		border-radius: 3px;
		/* font-size: 0.875em; */
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.base-input input:focus,
	.depth-input input:focus {
		border: 0.125em solid #088;
		outline: none;
	}

	.base-input input::-webkit-outer-spin-button,
	.base-input input::-webkit-inner-spin-button,
	.depth-input input::-webkit-outer-spin-button,
	.depth-input input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* .unit {
		vertical-align: middle;
	} */
</style>
