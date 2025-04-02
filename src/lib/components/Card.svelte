<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [header]
	 * @property {string} [theme]
	 * @property {string} [secondary]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { header = '', theme = 'grey', secondary = 'pink', children } = $props();
</script>

<div class="card" style:border-color={secondary}>
	<header style:background-color={theme} style:color={secondary}>{header}</header>
	<div class="content" style:color={secondary}>
		{@render children?.()}
	</div>
</div>

<style>
	.card {
		background: white;
		box-shadow: var(--shadow-6);
		/* border: 0.1vw solid black; */
		border-radius: 0.25rem;
		flex-direction: column;
		/* font-family: 'AlkesLightIt'; */
		margin-inline: auto;
		margin-top: 1rem;

		header {
			border-top-left-radius: 0.25rem;
			border-top-right-radius: 0.25rem;
			font-size: 150%;
			font-weight: bold;
			padding-block: 0.5rem;
			padding-inline: 1rem;
			text-align: center;
			text-shadow: 0.1vw 0.1vw 0.2vw black;
			width: 100%;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
