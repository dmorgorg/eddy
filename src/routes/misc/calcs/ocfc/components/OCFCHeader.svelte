<script>
	import NavLink from './NavLink.svelte';
	let { channelType = 'Rectangular' } = $props();
</script>

<nav class="nav">
	<div class="nav-title">open channel flow calculator</div>
	<div class="nav-links">
		<NavLink name={'rectangular'} {channelType} />
		<NavLink name={'triangular'} {channelType} />
		<NavLink name={'trapezoidal'} {channelType} />
		<NavLink name={'circular'} {channelType} />
	</div>
</nav>

<style lang="scss">
	nav {
		&.nav {
			background-color: var(--primaryColor);
			color: var(--bg);
			padding-block-end: 1em;
			padding-block-start: 2.5em;
			text-align: center;
			width: 100%;
		}
		.nav-title {
			// border: 1px solid black;
			font-size: 1.75em;
			font-weight: bold;
			margin-inline: auto;
			padding: 0.25em;
			text-shadow: 0.125em 0.125em 0.125em black;
			text-transform: capitalize;
			width: fit-content;
		}
		.nav-links {
			border: 2px solid yellow;
			display: flex;
			justify-content: space-between;
			margin-inline: auto;
			// margin-top: 1em;

			// wrap: wrap;
			width: 90%;
		}
	}
</style>
