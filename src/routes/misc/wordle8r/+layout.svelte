<script>
	import 'open-props/style';
	import 'open-props/normalize';
	import 'open-props/buttons';
	import '$lib/css/app.css';
	// import '$lib/css/fonts.css'
	let { children } = $props();
</script>

{@render children()}
