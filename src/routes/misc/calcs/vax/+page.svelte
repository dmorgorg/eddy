<script>
	// @ts-nocheck

	import HomeLink from '$lib/components/HomeLink.svelte';

	let viewCalc = $state(true);
	let selectedOption = $state('numbers');
	let pv = $state('87');
	let dv = $state('33');
	let popnSize = $state('100000');
	let deathsSize = $state('100');
	let numberVaccinated = $state();
	let numberUnvaccinated = $state();
	let vaccinatedDeaths = $state();
	let unvaccinatedDeaths = $state();
	let precision = $state(5);
	let result;

	const options = [
		{ value: 'percentages', label: 'Percentages only.' },
		{ value: 'numbers', label: '...with population numbers' }
	];
</script>

<div class="outer">
	<HomeLink color="#4682B4" fontSize="20" />
	<div class="wrapper">
		<h1 class="title">Vaccine Efficacy Calculator</h1>
		<div class="card">
			<h4>Percentages only? Or percentages with population numbers?</h4>
			<div class="radioGroup">
				{#each options as option}
					<label class="radio">
						<input
							type="radio"
							name="radioGroup"
							bind:group={selectedOption}
							value={option.value}
							checked={selectedOption === option.value}
						/>
						<div>{option.label}</div>
					</label>
				{/each}
			</div>
			{#if selectedOption !== 'percentages'}
				<blockquote>
					Note that population numbers are not required to calculate the result below but they are
					useful to simplify the calculation &mdash; and to remove the need for algebra for those
					who have been out of school for a while!
				</blockquote>
				<p></p>
			{/if}
			<section class="form">
				{#if selectedOption === 'percentages'}
					<div class="label">Percentage of population vaccinated:</div>

					<div class="input">
						<input type="number" id="popVaccinated" bind:value={pv} />
					</div>
					<div>%</div>
					<div class="label">Percentage of deaths vaccinated:</div>
					<input type="number" id="deathsVaccinated" bind:value={dv} />
					<div>%</div>
				{:else}
					<div class="label">Size of the population:</div>
					<!-- <div class="input"> -->
					<input type="number" id="popVaccinated" bind:value={popnSize} />
					<div>&nbsp;</div>
					<div class="label">Percentage of population vaccinated:</div>
					<input
						type="number"
						id="popVaccinated"
						bind:value={pv}
						oninput={() => {
							if (Number(pv) >= 100) {
								pv = '99';
							}
						}}
					/>
					<div>%</div>

					<div class="label">Number of deaths:</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={deathsSize} />
					</div>
					<div>&nbsp;</div>
					<div class="label">Percentage of deaths vaccinated:</div>
					<input
						type="number"
						id="deathsVaccinated"
						bind:value={dv}
						oninput={() => {
							if (Number(dv) >= 100) {
								dv = '99';
							}
						}}
					/>
					<div>%</div>
				{/if}
			</section>
		</div>
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: #e9f0f6;
		min-height: 100vh;
	}
	.wrapper {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		margin-inline: auto;
		text-align: center;
		max-width: 550px;
	}

	h1.title {
		background-color: inherit;
		color: #4682b4;
		font-family: 'Shitake', cursive;
		font-size: 10vw;
		font-weight: bold;
		letter-spacing: 0.375rem;
		line-height: 1;
		padding-inline: 2rem;
		margin: 0;
		margin-top: 2rem;
		text-shadow: 2px 2px 2px black;
		word-spacing: 0;
	}

	.card {
		align-items: center;
		background: white;
		border: 4px solid #38688f;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 1rem;
		padding: 1rem;

		& h4 {
			font-size: 5vw;
			font-weight: bold;
			margin-block-end: 1rem;
		}

		.radioGroup {
			display: flex;
			margin-block-end: 1em;
			padding-block: 1em;

			label.radio {
				cursor: pointer;
				margin-inline: 1rem;
			}

			input[type='radio'] {
				appearance: none;
				background-color: transparent;
				border: 2px solid black;
				border-radius: 50%;
				height: 20px;
				outline: none;
				width: 20px;
			}

			input[type='radio']:checked {
				background-color: #4682b4;
			}
		}

		blockquote {
			background-color: #e9f0f6;
			border-left: none;
			border: 1px solid #333;
			border-radius: 5px;
			margin-bottom: 1.5rem;
			padding-inline: 1rem;
			text-align: left;
		}

		section.form {
			align-items: center;
			column-gap: 0.25rem;
			display: grid;
			grid-template-columns: 3fr 1fr 0.125fr;
			margin-block-end: 2rem;
			row-gap: 0.5rem;

			input[type='number'] {
				background-color: #e9f0f6;
				border: 1px solid #333;
				width: 5rem;
				padding-inline-start: 0.5rem;
				padding-inline-end: 0.125rem;
			}
		}

		.resultbox {
			font-size: 1.25rem;
			font-weight: bold;

			.result {
				color: white;
				background: #4682b4;
				border-radius: var(--radius-2);
				padding-inline: 0.5rem;
				padding-block: 0.25rem;
			}
		}

		box-shadow: var(--shadow-6);
	}

	.form .label {
		justify-self: end;
		align-self: center;
	}

	.calc {
		ul {
			font-size: 1.125rem;
			list-style-type: none;
			margin-inline: auto;
			padding-inline-start: 0;
			text-align: left;
			width: 95%;

			li {
				margin-block: 1rem;
			}
		}
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}

	// // @media (max-width: 600px) {
	// // 	.outer {
	// // 		padding: 0.5rem;
	// // 		padding-inline: 0;
	// // 	}
	// // 	.wrapper {
	// // 		padding: var(--size-1);
	// // 	}
	// // 	.wrapper h1 {
	// // 		font-family: 'Shitake';
	// // 		font-size: var(--font-size-5);
	// // 	}

	// // 	.card {
	// // 		border-width: var(--border-size-3);
	// // 		font-size: 1.25rem;
	// // 		margin-inline: auto;
	// // 		margin-block-start: 1rem;
	// // 		padding-block: 1rem;
	// // 		min-width: 0;
	// // 		padding-inline: 0.5rem;
	// // 	}
	// // 	.calc {
	// // 		width: 85%;
	// // 		margin-inline: auto;
	// // 	}
	// // 	/* .resultbox {
	// // 		font-size: 120%;
	// // 	} */
	// // 	.radioGroup {
	// // 		padding-block-start: 0;
	// // 	}

	// // 	.result {
	// // 		font-size: 1.25rem;
	// // 		padding: 0.5rem;
	// // 		padding-block: 0.25rem;
	// // 	}
	// // }

	// label.radio,
	// h4 {
	// 	font-size: 1.125rem;
	// 	font-style: normal;
	// }
</style>
