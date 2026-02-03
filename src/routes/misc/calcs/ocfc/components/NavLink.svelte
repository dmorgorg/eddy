<script>
	import { digits } from '../digits.svelte.js';
	let { name, channelType = $bindable() } = $props();
</script>

<button
	onclick={() => {
		// shut intro on change of component
		digits.isIntroVisible = false;
		setTimeout(() => {
			channelType = name;
		}, 500);
	}}
	class:active={channelType === name}
	class="nav-link"
>
	{name}
</button>

<style lang="scss">
	button {
		background: none;
		border: none;
		box-shadow: none;
		color: var(--bg);
		cursor: pointer;
		font-size: 1.25em;
		font-weight: normal;
		outline: none;
		// padding-inline: 2em;
		padding-inline: 0;
		text-shadow: none;
		text-transform: capitalize;

		&:hover {
			color: black;
		}

		&.active {
			color: black;
			// font-weight: bold;
			text-shadow: 0.0625em 0.0625em 0 black;
		}
	}
</style>
