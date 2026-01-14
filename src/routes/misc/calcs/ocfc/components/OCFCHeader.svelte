<script>
	import NavLink from './NavLink.svelte';
	let { channelType = $bindable('rectangular') } = $props();
</script>

<nav class="nav">
	<div class="nav-title">open channel flow calculator</div>
	<div class="nav-links">
		<!-- changes to channelType by clicking a NavLink component will be reflected here in the parent -->
		<NavLink name={'rectangular'} bind:channelType />
		<NavLink name={'triangular'} bind:channelType />
		<NavLink name={'trapezoidal'} bind:channelType />
		<NavLink name={'circular'} bind:channelType />
	</div>
</nav>

<style lang="scss">
	nav {
		&.nav {
			background-color: var(--primaryColor);
			color: var(--bg);
			margin-bottom: 0.5em; // provide room for box-shadow below
			padding-block-end: 1em;
			padding-block-start: 2.5em;
			text-align: center;
			width: 100%;
			box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.5);
		}
		.nav-title {
			// border: 1px solid black;
			font-size: 2em;
			font-weight: bold;
			margin-inline: auto;
			padding-inline: 0.25em;
			text-shadow: 0.125em 0.125em 0.125em black;
			text-transform: capitalize;
			width: fit-content;
			word-spacing: 0.125em;
		}
		.nav-links {
			// border: 2px solid yellow;
			display: flex;
			font-size: 1.0625em;
			justify-content: space-between;
			margin-inline: auto;
			margin-block-end: -0.5em;
			padding-block-end: 0;
			width: 80%;
		}
	}
</style>
