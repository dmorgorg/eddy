<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [header]
	 * @property {string} [theme]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { header = '', theme = 'grey', children } = $props();
</script>

<div class="card">
	<header style:background-color={theme}>{header}</header>
	<div class="mt-4 pb-4">
		{@render children?.()}
	</div>
</div>

<style>
	.card {
		background: white;
		box-shadow: var(--shadow-6);
		flex-direction: column;
		/* font-family: 'AlkesLightIt'; */
		margin-inline: auto;
		margin-top: 1rem;
		/* width: min(95%, 50rem); */

		header {
			font-size: 200%;
			font-weight: bold;
			padding-block: 0.5rem;
			text-align: center;
			width: 100%;
		}
	}
</style>
