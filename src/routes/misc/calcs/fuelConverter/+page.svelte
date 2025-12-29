<script>
	/**
	 * @type {any}
	 */
	let mpgImp = $state();
	/**
	 * @type {any}
	 */
	let mpgUS = $state();
	/**
	 * @type {any}
	 */
	let kpl = $state();
	/**
	 * @type {any}
	 */
	let lp100k = $state();

	function reset() {
		mpgImp = '';
		mpgUS = '';
		kpl = '';
		lp100k = '';
	}
	function mpgImpChange() {
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		kpl = ((mpgImp * 1.609344) / 4.54609).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function mpgUSChange() {
		mpgImp = (mpgUS * 1.20095).toFixed(2);
		kpl = ((mpgUS * 1.20095 * 1.609344) / 4.54609).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function kplChange() {
		mpgImp = ((kpl / 1.609344) * 4.54609).toFixed(2);
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function lp100kChange() {
		kpl = (100 / lp100k).toFixed(2);
		mpgImp = ((100 / lp100k / 1.609344) * 4.54609).toFixed(2);
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		// lp100k = lp100k.toFixed(2)
	}
</script>

<div class="outer">
	<div class="wrapper">
		<h1 class="card">Metric/Imperial Fuel Converter</h1>

		<div class="card">
			<section class="form">
				<div class="label">Miles per Imperial gallon</div>
				<div class="input">
					<input type="number" id="mpgImp" onkeyup={mpgImpChange} bind:value={mpgImp} />
					<span>mpg</span>
				</div>

				<div class="label">Miles per US gallon</div>
				<div class="input">
					<input type="number" id="mpgUS" onkeyup={mpgUSChange} bind:value={mpgUS} />
					<span>mpg</span>
				</div>

				<div class="label">Kilometres per litre</div>
				<div class="input">
					<input type="number" id="kpl" onkeyup={kplChange} bind:value={kpl} />
					<span>km/l</span>
				</div>

				<div class="label">Litres per 100 kilometres</div>
				<div class="input">
					<input type="number" id="lp100k" onkeyup={lp100kChange} bind:value={lp100k} />
					<span>l/100km</span>
				</div>
			</section>
		</div>
		<!-- <button class="card" onclick={reset}>Clear</button> -->
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: #cfe2cf;
		min-height: 100vh;
	}

	.wrapper {
		// border: 1px solid black;
		font-size: 16px;
		margin-inline: auto;
		max-width: 450px;
	}

	section.form {
		column-gap: 1rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 0.5rem;
	}
	// .form .input {
	// 	justify-self: start;
	// 	align-self: center;
	// }
	.form .label {
		text-align: right;
		align-self: center;
	}
	.form input {
		font-size: 1.125rem;
		font-style: italic;
	}

	h1.card {
		background-color: inherit;
		border: none;
		box-shadow: none;
		color: #70a970;
		font-family: 'Kaushan', cursive;
		font-size: 10vw;
		font-weight: bold;
		letter-spacing: 0.125rem;
		// padding-inline: 2rem;
		padding-block: 1rem;
		margin: 0 auto;
		text-align: center;
		-webkit-text-stroke: #437043 0.5px;
		word-spacing: 0;
	}
	.input span {
		// font-size: 85%;
		margin-left: 0.25rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #70a970;
		border: 0.5vw solid black;
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-6);
		margin-inline: 0.5rem;
		padding: 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-style: italic;
	}

	input[type='number'] {
		width: 5rem;
		background-color: #eff5ef;
		border: 0.5vw solid black;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}

	// @media screen and (max-width: 600px) {
	// 	.card {
	// 		border-width: 0.5vw;
	// 		// font-size: 100%;
	// 		margin-inline: auto;
	// 		padding: 1rem;
	// 		// 	padding-inline: 2rem;
	// 	}
	// }
</style>
