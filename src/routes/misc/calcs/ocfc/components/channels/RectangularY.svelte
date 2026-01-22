<script>
	import RectangularCanvas from './RectangularCanvas.svelte';
	import { ki, kd, sd } from '$lib/utilities/utils.js';

	let base = $state(4);
	let depth = $state(3);
	let slope = $state(0.1);
	let n = $state(0.013);
	let g = $state(9.81);

	let baseLabelPos = $state({ x: 0, y: 0 });
	let depthLabelPos = $state({ x: 0, y: 0 });
</script>

<article>
	<section>
		<RectangularCanvas bind:base bind:depth yOrQ="y" bind:baseLabelPos bind:depthLabelPos>
			<label
				class="input-label base-label"
				style="left: {baseLabelPos.x}px; top: {baseLabelPos.y}px;"
			>
				<span class="var-name">{@html ki('b =')}</span>
				<input type="number" bind:value={base} min="0.01" step="any" />
				<span class="unit">{@html ki('\\mathsf{m}')}</span>
			</label>
			<label
				class="input-label depth-label"
				style="left: {depthLabelPos.x}px; top: {depthLabelPos.y}px;"
			>
				<span class="var-name">{@html ki('y =')}</span>
				<input type="number" bind:value={depth} min="0.01" step="any" />
				<span class="unit">{@html ki('\\mathsf{m}')}</span>
			</label>
		</RectangularCanvas>
		<div class="params-row">
			<label class="param-input">
				<span class="var-name">{@html ki('S =')}</span>
				<input type="number" bind:value={slope} min="0.001" step="0.01" />
				<span class="unit">{@html ki('\\%')}</span>
			</label>
			<label class="param-input">
				<span class="var-name">{@html ki('n =')}</span>
				<input type="number" bind:value={n} min="0.001" step="0.001" />
			</label>
			<label class="param-input">
				<span class="var-name">{@html ki('g =')}</span>
				<input type="number" bind:value={g} min="0.1" step="0.01" />
				<span class="unit">{@html ki('\\mathsf{m/s}^2')}</span>
			</label>
		</div>
	</section>
</article>

<style>
	.params-row {
		display: flex;
		justify-content: space-around;
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		gap: 1rem;
	}

	.param-input {
		display: flex;
		align-items: center;
		gap: 4px;
		white-space: nowrap;
		background: white;
		border: 1px solid black;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.param-input input[type='number'] {
		width: 5em;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}
	.param-input input[type='number']:focus {
		border: 2px solid black;
		outline: none;
	}

	.param-input input[type='number']::-webkit-outer-spin-button,
	.param-input input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.input-label {
		position: absolute;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 4px;
		background: white;
		border: 1px solid black;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.input-label input[type='number'] {
		width: 80px;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.input-label input[type='number']::-webkit-outer-spin-button,
	.input-label input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.input-label input[type='number']:focus {
		outline: none;
		border: 2px solid black;
	}

	.base-label {
		transform: translateX(-50%);
	}

	.depth-label {
		transform: translate(-50%, -50%);
	}
</style>
