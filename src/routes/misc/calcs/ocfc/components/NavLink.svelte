<script>
	let { name, channelType } = $props();
</script>

<button
	onclick={() => {
		channelType = name;
	}}
>
	{name}
</button>

<style lang="scss">
	button {
		background: none;
		border: none;
		box-shadow: none;
		color: var(--bg);
		font-size: 1.25em;
		font-weight: normal;
		outline: none;
		// padding-inline: 2em;
		padding-inline: 0;
		text-shadow: none;
		text-transform: capitalize;
	}
</style>
