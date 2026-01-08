<script>
	// @ts-nocheck

	import HomeLink from '$lib/components/HomeLink.svelte';
	import { slide } from 'svelte/transition';

	let viewCalc = $state(false);
	let selectedOption = $state('popnNumbers');
	let pv = $state('87');
	let dv = $state('33');
	let popnSize = $state('100000');
	let deathsSize = $state('100');
	let numberVaccinated = $state();
	let numberUnvaccinated = $state();
	let vaccinatedDeaths = $state();
	let unvaccinatedDeaths = $state();
	let precision = $state(5);
	let result = $derived(sd(((100 - dv) * pv) / ((100 - pv) * dv), 3));

	const options = [
		{ value: 'percentages', label: 'Percentages only...' },
		{ value: 'popnNumbers', label: '...or with population numbers.' }
	];

	function toggleCalcView() {
		viewCalc = !viewCalc;
		scrollToBottom(document.body);
	}

	const scrollToBottom = (node) => {
		const scroll = () =>
			node.scroll({
				top: node.scrollHeight,
				behavior: 'smooth'
			});
		scroll();

		return { update: scroll };
	};

	function sd(num, prec = precision) {
		return Number(num).toPrecision(prec);
	}

	function setValues() {
		if (selectedOption === 'popnNumbers') {
			popnSize = Math.round(Number(popnSize));
			numberVaccinated = Math.round((pv / 100) * popnSize);
			numberUnvaccinated = popnSize - numberVaccinated;

			deathsSize = Math.round(Number(deathsSize));
			vaccinatedDeaths = Math.round((dv / 100) * deathsSize);
			unvaccinatedDeaths = Number(deathsSize) - vaccinatedDeaths;
		}
	}
	setValues();
</script>

<div class="outer">
	<HomeLink color="#4682B4" />
	<div class="wrapper">
		<h1 class="title">Vaccine Efficacy Calculator</h1>
		<div class="card">
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
					Note that population numbers are not required to calculate the result but they help
					simplify the calculation below, removing the need for algebra for those who have been out
					of school for a while!
				</blockquote>
				<p></p>
			{/if}
			<section class="form">
				{#if selectedOption === 'percentages'}
					<div class="label">Percentage of population vaccinated:</div>
					<div class="input">
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
					</div>
					<div>%</div>

					<div class="label">Percentage of deaths vaccinated:</div>
					<div class="input">
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
					</div>
					<div>%</div>
				{:else}
					<div class="label">Size of the population:</div>
					<input type="number" id="popVaccinated" bind:value={popnSize} onkeyup={setValues} />
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
						onkeyup={setValues}
					/>
					<div>%</div>
					<div class="label">Number of deaths:</div>
					<input type="number" id="popVaccinated" bind:value={deathsSize} onkeyup={setValues} />
					<div>&nbsp;</div>
					<div class="label">Percentage of deaths vaccinated:</div>
					<input
						type="number"
						id="popVaccinated"
						bind:value={dv}
						oninput={() => {
							if (Number(dv) >= 100) {
								dv = '99';
							}
						}}
						onkeyup={setValues}
					/>
					<div>%</div>
				{/if}
			</section>
			<div class="resultbox">
				{#if pv && dv && Number(pv) < 100 && Number(dv) < 100}Death for the unvaccinated is <span
						class="result"
					>
						{result}
					</span>
					times as likely as for the vaccinated.
				{/if}
			</div>
		</div>

		{#if !viewCalc}
			<button class="toggle" onclick={toggleCalcView}
				>Show Calculations (using population numbers)</button
			>
		{:else}
			<button class="toggle" onclick={toggleCalcView}>Hide Calculations</button>
		{/if}
		<!-- <div class="card calc">
			
		</div> -->
		{#if selectedOption === 'popnNumbers' && viewCalc}
			<div class="card calc" transition:slide use:scrollToBottom={this}>
				<ul>
					<li>
						{Number(Number(pv).toFixed(2))}% of the population of {popnSize} are vaccinated.<br />
						That is,
						<strong>
							{numberVaccinated} are vaccinated.
						</strong>
					</li>
					<li>
						The rest, {popnSize} - {numberVaccinated}, are not vaccinated.<br />
						That is,
						<strong>
							{numberUnvaccinated}
							{numberUnvaccinated === 1 ? 'is' : 'are'} NOT vaccinated.
						</strong>
					</li>
					<li>
						{Number(Number(dv).toFixed(2))}% of the {deathsSize} deaths were vaccinated.<br />
						That is,
						<strong>
							{vaccinatedDeaths} who died
							{vaccinatedDeaths === 1 ? 'was' : 'were'} vaccinated.
						</strong>
					</li>
					<li>
						The rest, {deathsSize} - {vaccinatedDeaths}, of the deaths were not vaccinated.<br />
						That is,
						<strong>
							{unvaccinatedDeaths} who died
							{unvaccinatedDeaths === 1 ? 'was' : 'were'} NOT vaccinated.
						</strong>
					</li>
					<li>
						{unvaccinatedDeaths} of the {numberUnvaccinated} unvaccinated died.<br /> That is,
						<strong>
							1 in {Number((numberUnvaccinated / unvaccinatedDeaths).toFixed(2))} of the unvaccinated
							died.
						</strong>
					</li>
					<li>
						{vaccinatedDeaths} of the {numberVaccinated} vaccinated died.<br /> That is,
						<strong>
							1 in {Number((numberVaccinated / vaccinatedDeaths).toFixed(2))} of the vaccinated died.
						</strong>
					</li>
					<!-- <li> -->

					<!-- </li> -->
				</ul>
				<div class="resultbox">
					Therefore, the unvaccinated are <br />{Number(
						numberVaccinated / vaccinatedDeaths
					).toFixed(2)}/{Number(numberUnvaccinated / unvaccinatedDeaths).toFixed(2)} =
					<span class="result">{result} times</span><br /> more likely to die than are the
					vaccinated <br />(for these inputs).
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: #e9f0f6;
		font-size: 0.875rem; // this governs the homelink size
		min-height: 100vh;
	}
	.wrapper {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: start;
		padding-block-end: 2em;
		margin-inline: auto;
		max-width: 450px;
		// min-width: 250px;
		text-align: center;
		width: 90%;
	}

	h1.title {
		background-color: inherit;
		// border: 1px solid red;
		color: #4682b4;
		font-family: 'Shitake', cursive;
		font-size: 2.5em;
		font-weight: bold;
		letter-spacing: 0.175em;
		line-height: 1;
		padding-inline: 2em;
		margin: 0;
		margin-top: 1em;
		text-shadow: 2px 2px 2px black;
	}

	.card {
		align-items: center;
		background: white;
		border: 4px solid #38688f;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		font-size: 1em;
		justify-content: center;
		margin: 1em;
		padding: 1em;
		width: 100%;

		& h6 {
			font-size: 1.125em;
			// font-weight: bold;
			font-weight: 700;
			margin-block-end: 0.25em;
		}

		.radioGroup {
			display: flex;
			margin-block-end: 1em;
			padding-block: 1em;

			label.radio {
				cursor: pointer;
				margin-inline: 1em;
				font-size: inherit;
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
			border: 1px solid #4682b4;
			border-radius: 5px;
			font-size: 90%;
			line-height: 1.25;
			margin-bottom: 1.5rem;
			padding-inline: 1rem;
			text-align: left;
			width: 100%;
		}

		section.form {
			align-items: center;
			// background: yellow;
			column-gap: 0.25rem;
			display: grid;
			grid-template-columns: 3fr 1fr 0.125fr;
			margin-block-end: 2rem;
			row-gap: 0.5rem;

			input[type='number'] {
				background-color: #e9f0f6;
				border: 1px solid #4682b4;
				// box-shadow: var(--shadow-3);
				width: 5rem;
				outline: none;
				padding-inline-start: 0.5rem;
				padding-inline-end: 0.125rem;
			}
		}

		.resultbox {
			font-size: 1.125em;
			font-weight: bold;
			margin-top: 1rem;
			text-align: center;
			// border: 1px solid black;

			.result {
				color: white;
				background: #4682b4;
				border-radius: var(--radius-2);
				padding-inline: 0.5rem;
				padding-block: 0.25rem;
			}
		}
	}

	.form .label {
		justify-self: end;
		align-self: center;
	}

	.calc {
		padding: 0;
		ul {
			font-size: 0.95em;
			list-style-type: none;
			margin-inline: auto;
			margin-block-start: -1em;
			padding-block-start: 0;
			padding-inline-start: 0;
			text-align: left;
			width: 75%;

			li {
				margin-block-end: 1rem;
			}
		}
	}

	button.toggle {
		font-size: 0.875em;
		font-weight: bold;
		text-align: center;
		width: 100%;
		border: 4px solid #38688f;
		border-radius: 10px;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}

	@media (min-width: 600px) {
		.outer {
			font-size: 1.5em;
		}
		.wrapper {
			font-size: 1em;
			max-width: 550px;
			h1 {
				font-size: 2em;
			}
		}

		.card {
			font-size: 1.125rem;
			margin-inline: auto;
			margin-block-start: 1em;
			min-width: 0;
			padding-block: 2em;
		}
	}
</style>
