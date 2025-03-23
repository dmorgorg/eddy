<script>
	import Card from '$lib/components/Card.svelte';
</script>

<div class="container pt-4">
	<!-- <Card header="Calcul8rs" theme="orange">
		<div class="mt-4">
			<a href="/misc/calcs/alcohol">UK Alcohol Units Calcul8r</a>
			<a href="/misc/calcs/vaccine">Vaccine Efficacy Calcul8r</a>
			<a href="/misc/calcs/fuelConverter">Metric/Imperial Fuel Converter</a>
		</div>
	</Card> -->
	<div class="card">
		<header>What are you looking for?</header>
		<div class="mt-4 pb-4">
			<a href="/misc/calcs/alcohol">UK Alcohol Units Calcul8r</a>
			<a href="/misc/calcs/vaccine">Vaccine Efficacy Calcul8r</a>
			<a href="/misc/calcs/fuelConverter">Metric/Imperial Fuel Converter</a>
			<a href="/misc/wordle8r">Wordle8r</a>
			<a href="/misc/montyHall">Monty Hall Simul8r</a>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
	}
	.card {
		background: white;
		box-shadow: var(--shadow-6);
		flex-direction: column;
		margin-inline: auto;
		margin-top: 1rem;
		border: 1px solid #a00;
		width: min(95%, 50rem);

		header {
			background-color: #a00;
			color: white;
			font-size: 200%;
			font-weight: bold;
			padding-block: 0.5rem;
			text-align: center;
			width: 100%;
		}

		a {
			display: block;
			font-size: 1.25rem;
			color: #a00;
			text-align: center;
		}
	}
</style>
