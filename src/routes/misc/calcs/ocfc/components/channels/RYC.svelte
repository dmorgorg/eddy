<script>
	// @ts-nocheck

	import { browser } from '$app/environment'
	import { ki, debounce, sd } from '$lib/utilities/utils.js'
	import { digits } from '../../digits.svelte.js'

	let { base = $bindable(), depth = $bindable() } = $props()
	let canvas = $state()
	let divWidth = $state(0)
	let divHeight = $state(0)
	let widthInPixels = $state()

	let aR = $derived(
		Math.round(Math.min(Math.max(Number(base) / Number(depth), 1 / 6), 8) * 100) / 100
	)

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

<!-- {aR}
<input type="range" bind:value={aR} min="0.167" max="8" step="any" /> -->
<div class="tempLabels">
	<label class="base-input">
		<!-- Base: -->
		<span class="unit">{@html ki('b=')}</span>
		<input type="number" bind:value={base} step="any" min="0" id="base" oninput={processChange} />
		<span class="unit">{@html ki('\\mathsf{m}')}</span>
	</label>
	<label class="depth-input">
		<!-- Depth: -->
		<span class="unit">{@html ki('y=')}</span>
		<input type="number" bind:value={depth} step="any" min="0" id="depth" oninput={processChange} />
		<span class="unit">{@html ki('\\mathsf{ m}')}</span>
	</label>
</div>

<style>
	.tempLabels {
		border: 2px solid red;
		display: flex;
		justify-content: center;
		gap: 1em;
	}
	.base-input,
	.depth-input {
		align-items: center;
		background: white;
		border: 1px solid black;
		border-radius: 3px;
		box-shadow: 2px 2px 4px #c1cdcd;
		/* position: absolute; */
		/* transform: translate(-50%, -50%); */
		display: flex;
		font-size: 1em;
		gap: 0.125em;
		padding: 0.25em 0.625em;
		white-space: nowrap;
		z-index: 10;
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
</style>
