<script>
	import Card from '$lib/components/Card.svelte';
</script>

<div class="container pt-4">
	<Card header="Calcul8rs" theme="orange" secondary="#CB6015">
		<div class="flex">
			<a href="/misc/calcs/alcohol">UK Alcohol Units Calcul8r</a>
			<a href="/misc/calcs/vaccine">Vaccine Efficacy Calcul8r</a>
			<a href="/misc/calcs/fuelConverter">Metric/Imperial Fuel Converter</a>
		</div>
	</Card>
	<Card header="Just for fun" theme="#bada55" secondary="#87a744">
		<div class="flex">
			<a href="/misc/wordle8r">Wordle8r</a>
		</div>
	</Card>
	<Card header="Head Scratchers" theme="var(--terracotta)" secondary="#70393f">
		<div class="flex">
			<a href="/misc/montyHall">Monty Hall Simul8r</a>
		</div>
	</Card>
	<Card header="Utilities" theme="var(--terracotta)" secondary="#70393f">
		<div class="flex">
			<a href="/utils/colorCodeStepper">Color codes and stepper</a>
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
