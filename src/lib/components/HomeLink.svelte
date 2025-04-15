<script>
	export let color = 'black';
	export let shadow = 'white';
</script>

<a href="/" style="color: {color}; text-shadow: 0 1px 0 {shadow};">eduk8r.org</a>

<style lang="scss">
	a:link,
	a:visited {
		font-family: 'Rocksoldier', sans-serif;
		font-weight: bold;
		font-size: clamp(10px, 4vw, 25px);
		letter-spacing: 0.25rem;
		padding-left: 1rem;
		margin: 0;
		// position: absolute;
		text-decoration: none;
		// border: 1px solid black;
	}
</style>
