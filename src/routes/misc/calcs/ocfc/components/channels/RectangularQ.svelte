<script>
	import RectangularCanvas from './RectangularCanvas.svelte';
	import { ki } from '$lib/utilities';

	let base = $state(4);
	let depth = $state(3);
	let slope = $state(0.1);
	let n = $state(0.013);
	let g = $state(9.81);
</script>

<article>
	<section>
		<RectangularCanvas bind:base bind:depth yOrQ="Q" />
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
		width: 60px;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9rem;
		text-align: center;
	}

	.param-input input[type='number']:focus {
		outline: none;
		border-color: var(--primaryColor, #008d8a);
	}
</style>
