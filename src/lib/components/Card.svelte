<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [header]
	 * @property {string} [color]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { header = '', color = 'grey', children } = $props();
</script>

<div class="card">
	<header style:background-color={color}>{header}</header>
	<div class="mt-4 pb-4">
		{@render children?.()}
	</div>
</div>

<style>
	.card {
		background: white;
		box-shadow: var(--shadow-6);
		flex-direction: column;
		margin-inline: auto;
		margin-top: 1rem;
		border: 1px solid #a00;
		width: min(95%, 50rem);

		header {
			background-color: #a00;
			color: white;
			font-size: 200%;
			font-weight: bold;
			padding-block: 0.5rem;
			text-align: center;
			width: 100%;
		}
	}
</style>
