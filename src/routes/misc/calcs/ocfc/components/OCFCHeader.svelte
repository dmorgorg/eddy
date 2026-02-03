<script>
	import NavLink from './NavLink.svelte'
	// import { digits } from '../digits.svelte.js';
	let { channelType = $bindable('rectangular') } = $props()
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
			// border-bottom: 2px solid black;
			box-shadow: 0px 2px 2px #c1cdcd;
			color: var(--bg);
			margin-bottom: 0.5em; // provide room for box-shadow below
			padding-block-end: 1em;
			padding-block-start: 2em;
			text-align: center;
			width: 100%;
			// box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.5);
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
			width: 30em;
		}
	}

	@media screen and (min-width: 600px) {
		nav.nav {
			padding-block-start: 1em;
			.nav-links {
				// border: 2px solid red;
				width: min(40em, 90%);
			}
		}
	}
</style>
