<script>
	import Card from '$lib/components/Card.svelte';
</script>

<div class="container pt-4">
	<Card header="Statics" theme="#800" secondary="#c00">
		<div class="flex">
			<a href="statics/sxs/">Step-through Statics Examples</a>
			<a href="statics/lectures/">Lectures and Handouts</a>
			<a href="bridge/index.html">Bridge Simulation</a>
		</div>
	</Card>
	<Card header="Calcul8rs" theme="orange" secondary="#CB6015">
		<div class="flex">
			<a href="/misc/calcs/alcohol">UK Alcohol Units Calcul8r</a>
			<a href="/misc/calcs/vaccine">Vaccine Efficacy Calcul8r</a>
			<a href="/misc/calcs/fuelConverter">Metric/Imperial Fuel Converter</a>
		</div>
	</Card>
	<Card header="Geometry" theme="#BC8F8F" secondary="#8F5656">
		<div class="flex">
			<a href="/misc/nerdery">Belt-Length Calculation</a>
		</div>
	</Card>
	<Card header="Head Scratchers" theme="Khaki" secondary="DarkKhaki">
		<div class="flex">
			<a href="/misc/montyHall">Monty Hall Simul8r</a>
		</div>
	</Card>
	<Card header="Just for fun" theme="#bada55" secondary="#87a744">
		<div class="flex">
			<a href="/misc/wordle8r">Wordle8r</a>
		</div>
	</Card>

	<Card header="Utilities" theme="CornflowerBlue" secondary="SteelBlue">
		<div class="flex">
			<a href="/utils/ccc">Color codes, shader and blender</a>
		</div>
	</Card>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
	}
	.flex {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	a {
		display: block;
		font-size: 1.25rem;
		color: inherit;
		text-align: center;

		&:hover {
			text-decoration: none;
			text-shadow: 0.05vw 0.05vw 0.05vw black;
		}
	}
</style>
