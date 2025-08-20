<script>
	import HomeLink from './HomeLink.svelte';
	let { theme = 'black' } = $props();
</script>

<div><HomeLink color={theme} /></div>

<style lang="css">
	div {
		padding-bottom: 1rem;
		/* background-color: pink; */
		background: transparent;
	}
</style>
