<script>
	import HomeLink from '$lib/components/HomeLink.svelte';

	let viewCalc = true;
	let selectedOption = 'numbers';
	let pv = '87';
	let dv = '33';
	let popnSize = '100000';
	let deathsSize = '100';
	let numberVaccinated;
	let numberUnvaccinated;
	let vaccinatedDeaths;
	let unvaccinatedDeaths;
	let precision = 5;

	let result;

	const options = [
		{ value: 'percentages', label: 'Percentages' },
		{ value: 'numbers', label: 'Percentages (with population numbers)' }
	];

	// function percentageResult()) {
	// 	let result = ((100 - dv)/(100-pv)*pv/dv).toFixed(2)
	// 	return result
	// }
</script>

<div class="outer">
	<HomeLink color="#4682B4" />
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
							class="input"
						/>
						{option.label}
					</label>
				{/each}
			</div>

			{#if selectedOption !== 'percentages'}
				<blockquote>
					Note that population numbers are not required for the result but are useful to simplify
					the manual calculation below &mdash; and to avoid the use of algebra for those who have
					been out of school for a while!
				</blockquote>
				<p></p>
			{/if}

			<section class="form">
				{#if selectedOption === 'percentages'}
					<div class="label">Percentage of the population vaccinated</div>

					<div class="input">
						<input type="number" id="popVaccinated" bind:value={pv} />
					</div>
					<div>%</div>
					<div class="label">Percentage of deaths that were vaccinated</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={dv} />
					</div>
					<div>%</div>
				{:else}
					<div class="label">Size of the population:</div>
					<div class="input">
						<input type="number" id="popVaccinated" bind:value={popnSize} />
					</div>
					<div>&nbsp;</div>
					<div class="label">Percentage vaccinated:</div>
					<div class="input">
						<input
							type="number"
							id="popVaccinated"
							bind:value={pv}
							on:input={() => {
								if (Number(pv) >= 100) {
									pv = '99';
								}
							}}
						/>
					</div>
					<div>%</div>

					<div class="label">Number of deaths:</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={deathsSize} />
					</div>
					<div>&nbsp;</div>
					<div class="label">Percentage of vaccinated deaths:</div>
					<div class="input">
						<input
							type="number"
							id="deathsVaccinated"
							bind:value={dv}
							on:input={() => {
								if (Number(dv) >= 100) {
									dv = '99';
								}
							}}
						/>
					</div>
					<div>%</div>
				{/if}
			</section>

			{#if selectedOption === 'percentages'}
				<div class="resultbox">
					{#if pv && dv && Number(pv) < 100 && Number(dv) < 100}Death for the unvaccinated is <span
							class="result"
						>
							{Number(
								(((100 - Number(dv)) * Number(pv)) / (100 - Number(pv)) / Number(dv)).toFixed(2)
							)}
						</span>
						times as likely as for the vaccinated.
					{/if}
				</div>
			{:else}
				<div class="resultbox">
					{#if pv && dv && Number(pv) < 100 && Number(dv) < 100}Death for the unvaccinated is <span
							class="result"
						>
							{Number(
								(((100 - Number(dv)) * Number(pv)) / (100 - Number(pv)) / Number(dv)).toPrecision(
									precision - 1
								)
							)}
						</span>
						times more likely than for the vaccinated.
					{/if}
				</div>
			{/if}
		</div>

		{#if selectedOption === 'percentages' && pv && dv && Number(pv) < 100 && Number(dv) < 100}
			<!-- <div class="card">percentages</div> -->
			<div>&nbsp;</div>
		{:else if pv && dv && Number(pv) < 100 && Number(dv) < 100 && popnSize && deathsSize}
			<div class="card calc">
				<h4>Calculations</h4>
				<ul>
					<li>
						{Number(Number(pv).toPrecision(precision))}% of the population of {popnSize} are vaccinated.
						<!-- <br /> -->
						That is,
						<strong>
							{(numberVaccinated = (Number(pv) / 100) * Number(popnSize)).toPrecision(precision)} are
							vaccinated.
						</strong>
					</li>
					<li>
						100% - {Number(Number(pv).toPrecision(precision))}% = {Number(
							(numberUnvaccinated = 100 - Number(pv)).toPrecision(precision)
						)}% of the population of {popnSize}
						are not vaccinated.
						<!-- <br /> -->
						That is,
						<strong>
							{(numberUnvaccinated = Number(
								(((100 - Number(pv)) / 100) * Number(popnSize)).toPrecision(precision)
							))}
							{numberUnvaccinated === 1 ? 'is' : 'are'} NOT vaccinated.
						</strong>
					</li>
					<li>
						{dv}% of the {deathsSize} deaths were vaccinated.
						<!-- <br /> -->
						That is,
						<strong>
							{(vaccinatedDeaths = (Number(dv) / 100) * Number(deathsSize))} who died were vaccinated.
						</strong>
					</li>
					<li>
						100% - {Number(Number(dv).toPrecision(precision))}% = {(unvaccinatedDeaths =
							100 - Number(dv))}% of the {Number(deathsSize)} deaths were not vaccinated.
						<!-- <br /> -->
						That is,
						<strong>
							{((100 - Number(dv)) / 100) * Number(deathsSize)} who died were NOT vaccinated.
						</strong>
					</li>
					<li>
						{unvaccinatedDeaths} unvaccinated died out of the unvaccinated {numberUnvaccinated}.
						<!-- <br /> -->
						That is,
						<strong>
							1 in {Number((numberUnvaccinated / unvaccinatedDeaths).toPrecision(precision))} unvaccinated
							died.
						</strong>
					</li>
					<li>
						{vaccinatedDeaths} vaccinated died out of the vaccinated {numberVaccinated}.
						<!-- <br /> -->
						That is,
						<strong>
							1 in {Number((numberVaccinated / vaccinatedDeaths).toPrecision(precision))} vaccinated
							died.
						</strong>
					</li>
				</ul>
				<div class="resultbox">
					So, unvaccinated are {Number(numberVaccinated / vaccinatedDeaths).toPrecision(
						precision
					)}/{Number(numberUnvaccinated / unvaccinatedDeaths).toPrecision(precision)} =
					<span class="result"
						>{(
							(numberVaccinated / vaccinatedDeaths / numberUnvaccinated) *
							unvaccinatedDeaths
						).toPrecision(precision - 1)}</span
					> times more likely to die than are vaccinated for these inputs.
				</div>
			</div>
		{/if}
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
		margin-top: 1rem;
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
			align-items: top;
			display: flex;
			justify-content: center;
			// display: inline-block;
			margin-block-end: 1rem;

			input[type='radio'] {
				appearance: none; // remove default styling
				background-color: #e9f0f6;
				border: 2px solid #333;
				border-radius: 50%;
				height: 20px;
				width: 20px;

				label.radio input:checked {
					background: red;
				}

				label.radio {
					// background-color:
					cursor: pointer;
					// font-size: 16px;
					// font-weight: bold;
					margin: 1rem;
				}

				input:checked {
					background: #4682b4;
					background: red;
					// vertical-align: middle;
				}
			}

			// input[type='radio']:before {
			// 	content: '';
			// 	display: block;
			// 	width: 60%;
			// 	border-radius: 5%;
			// 	background: gray;
			// }
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
	//
	// 	padding-block-end: 2rem;
	// 	font-family: 'AlkesRgIt', sans-serif;
	// 	font-size: 5vw;
	// 	font-style: normal;

	// 			input {
	//

	// 				font-style: normal;
	// 				// &:hover {
	// 				// 	background: #aaa;
	// 				// 	// color: white;
	// 				// }
	// 				&:checked {
	// 					background: #689bc4;
	// 					// color: white;
	// 				}
	// 			}
	// }
	// 	}

	// 		outline: none;
	// 	}

	// 	// input[type='radio']:before {
	// 	// 	content: '';
	// 	// 	display: block;
	// 	// 	width: 60%;
	// 	// 	border-radius: 5%;
	// 	// }

	// input[type='radio']:checked:before {
	// 	background: #4682b4;
	// 	border-width: 14px;
	// }

	// .form .input {
	// 	justify-self: start;
	// 	align-self: center;
	// }
	.form .label {
		justify-self: end;
		align-self: center;
	}

	// 	& + .calc {
	// 		// width: 100%;
	// 		ul {
	// 			font-size: 1.125rem;
	// 			list-style-type: none;
	// 			margin-inline: auto;
	// 			padding-inline-start: 0;
	// 			text-align: left;
	// 			width: 95%;

	// 			li {
	// 				margin-block: 1rem;
	// 			}
	// 		}
	// 	}
	// }

	// input[type='number']::-webkit-outer-spin-button,
	// input[type='number']::-webkit-inner-spin-button {
	// 	-webkit-appearance: none;
	// 	display: none;

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
