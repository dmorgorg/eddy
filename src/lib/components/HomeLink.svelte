<script>
	export let color = 'black';
	// export let shadow = 'red';
	// var
</script>

<a href="/" style="color: {color}; ">eduk8r.org</a>

<style lang="scss">
	a:link,
	a:visited {
		font-family: 'Rocksoldier', sans-serif;
		font-weight: bold;
		font-size: 3.5vw;
		// font-size: clamp(20px, 6vw, 25px);
		letter-spacing: 0.25rem;
		padding-left: 1rem;
		margin: 0;
		margin-top: -0.25em;
		// position: absolute;
		text-decoration: none;
		position: absolute;
		top: 0;

		&:hover {
			// text-decoration: none;
			// text-shadow: 5px 5px var(shadow);
			// font-size: 300%;
			color: red;
		}
	}
</style>
