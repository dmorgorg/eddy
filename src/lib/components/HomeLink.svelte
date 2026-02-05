<script>
	let { color = 'green' } = $props()
</script>

<a class="homelink" href="/" style="color: {color};">eduk8r.org</a>

<style lang="scss">
	a.homelink:link,
	a.homelink:visited {
		font-family: 'Rocksoldier', sans-serif;
		font-weight: bold;
		// font-size: 3.5vw;
		font-size: 2em;
		letter-spacing: 0.25rem;
		padding-left: 0.375em;
		padding-top: 0;
		margin: 0;
		margin-top: -0.25em;
		text-decoration: none;
		position: absolute;
		text-shadow: 0.025em 0.025em 0.025em black;
		top: 0;
	}
	a.homelink:hover {
		// color: yellow;
		// background: green;
		text-shadow: 0.05em 0.05em 0.05em black;
	}
</style>
