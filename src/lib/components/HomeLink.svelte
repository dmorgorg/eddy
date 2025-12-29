<script>
	export let color = 'black';
	// export let shadow = 'red';
	// var
</script>

<a class="homelink" href="/" style="color: {color}; ">eduk8r.org</a>

<style lang="scss">
	a.homelink:link,
	a.homelink:visited {
		font-family: 'Rocksoldier', sans-serif;
		font-weight: bold;
		font-size: 3.5vw;
		// font-size: clamp(1em, 3vw, 5em);
		letter-spacing: 0.25rem;
		padding-left: 1rem;
		margin: 0;
		margin-top: -0.25em;
		// position: absolute;
		text-decoration: none;
		position: absolute;
		text-shadow: 0.5px 0.5px 0.5px black;
		top: 0;
	}
	a:hover {
		color: yellow;
	}
</style>
