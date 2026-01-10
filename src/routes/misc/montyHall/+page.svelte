<script>
	import HomeLink from '$lib/components/HomeLink.svelte';
	import { tick } from 'svelte';

	let car = $state(0);
	let guess = $state(0);
	let open = $state(0);
	let switchedGuess = $state(0);
	let buttonsIndex = $state(1);
	let gameComplete = $state(false);
	let stickWins = $derived(car === guess && gameComplete);
	let switchWins = $derived(car === switchedGuess && gameComplete);
	let stickTotal = $state(0);
	let switchTotal = $state(0);
	let totalGames = $derived(stickTotal + switchTotal);
	let runningSim = $state(false);
	// running various repeated simulations
	let busy100 = $state(false);
	let busy250 = $state(false);
	let busy1000 = $state(false);
	let busy = $state(false);
	let stepThrough = $state(true);

	let prefersReducedMotion = $state(false);

	if (typeof localStorage !== 'undefined') {
		prefersReducedMotion = localStorage.getItem('prefersReducedMotion') === 'true';
	}

	const toggleReducedMotion = () => {
		prefersReducedMotion = !prefersReducedMotion;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('prefersReducedMotion', prefersReducedMotion.toString());
		}
	};

	const placeVehicle = () => {
		car = Math.floor(Math.random() * 3) + 1;
		buttonsIndex = 2;
		// if (!busy) {
		// 	stepThrough = true;
		// }
		stepThrough = busy ? false : true;
	};
	const chooseDoor = () => {
		switchedGuess = guess = Math.floor(Math.random() * 3) + 1;
		buttonsIndex = 3;
	};
	const openDoor = () => {
		if (car === 1) {
			if (guess === 1) {
				// car === 1 and guess === 1 so open 2 or 3
				open = Math.round(Math.random()) === 0 ? 2 : 3;
			} else if (guess === 2) {
				open = 3;
			} else {
				open = 2;
			}
		} else if (car === 2) {
			if (guess === 1) {
				open = 3;
			} else if (guess === 2) {
				// car === 2 and guess === 2 so open 1 or 3
				open = Math.round(Math.random()) === 0 ? 1 : 3;
			} else {
				open = 1;
			}
		} else {
			if (guess === 1) {
				open = 2;
			} else if (guess === 2) {
				open = 1;
			} else {
				// car === 3, guess === 3 so open 1 or 2
				open = Math.round(Math.random()) === 0 ? 1 : 2;
			}
		}
		buttonsIndex = 4;
	};
	const switchGuess = () => {
		if (switchedGuess === 1) {
			switchedGuess = open === 2 ? 3 : 2;
		} else if (switchedGuess === 2) {
			switchedGuess = open === 1 ? 3 : 1;
		} else {
			switchedGuess = open === 1 ? 2 : 1;
		}
		buttonsIndex = 5;
	};
	const isWinner = () => {
		if (car === guess) {
			stickTotal += 1;
		} else if (car === switchedGuess) {
			switchTotal += 1;
		}
		gameComplete = true;
		buttonsIndex = 6;
	};
	const reset = () => {
		car = 0;
		guess = 0;
		open = 0;
		switchedGuess = 0;
		buttonsIndex = 1;
		gameComplete = false;
	};
	const zero = () => {
		reset();
		stickTotal = 0;
		switchTotal = 0;
	};

	const easeInOutQuad = (/** @type {number} */ t) => {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	};

	const runSimulation = async (/** @type {number} */ times) => {
		// runningSim = true;
		let delay = 5;
		busy = true;
		if (times === 100) {
			busy100 = true;
			delay = 37;
		} else if (times === 250) {
			busy250 = true;
			delay = 20;
		} else if (times === 1000) {
			busy1000 = true;
			delay = 5;
		}
		for (let i = 0; i < times; i++) {
			placeVehicle();
			chooseDoor();
			openDoor();
			switchGuess();
			isWinner();

			if (!prefersReducedMotion) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
		// runningSim = false;
		if (times === 100) {
			busy100 = false;
		} else if (times === 250) {
			busy250 = false;
		} else if (times === 1000) {
			busy1000 = false;
		}
		busy = false;
	};
</script>

<div class="outer">
	<HomeLink color="black" />
	<div class="wrapper">
		<header class="title">Monty Hall Paradox &ndash; A Simul8r</header>
		<a href="/misc/montyHall/intro"><button>What is the Monty Hall Paradox?</button></a>

		<div class="simWrap">
			<div class="title">
				<div class="stick">Strategy: Stick</div>
				<div class="switch">Strategy: Switch</div>
			</div>

			<section class="simul8r">
				<div class="dontSwitch">
					<div id="oneOne">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 1 && runningSim}
							class:hide={car !== 1 && runningSim}
							class:showTrans={car === 1 && !runningSim}
							class:hideTrans={car !== 1 && !runningSim}
						/>
					</div>
					<div id="oneTwo">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 2 && runningSim}
							class:hide={car !== 2 && runningSim}
							class:showTrans={car === 2 && !runningSim}
							class:hideTrans={car !== 2 && !runningSim}
						/>
					</div>
					<div id="oneThree">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 3 && runningSim}
							class:hide={car !== 3 && runningSim}
							class:showTrans={car === 3 && !runningSim}
							class:hideTrans={car !== 3 && !runningSim}
						/>
					</div>
					<div id="twoOne" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 1 && runningSim}
							class:show={open !== 1 && runningSim}
							class:hideTrans={open === 1 && !runningSim}
							class:showTrans={open !== 1 && !runningSim}
						/>
					</div>
					<div id="twoTwo" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 2 && runningSim}
							class:show={open !== 2 && runningSim}
							class:hideTrans={open === 2 && !runningSim}
							class:showTrans={open !== 2 && !runningSim}
						/>
					</div>
					<div id="twoThree" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 3 && runningSim}
							class:show={open !== 3 && runningSim}
							class:hideTrans={open === 3 && !runningSim}
							class:showTrans={open !== 3 && !runningSim}
						/>
					</div>
					<div id="threeOne">
						<img
							src="/montyHall/upTerra.png"
							alt="upArrow"
							class="scale50"
							class:show={guess === 1 && runningSim}
							class:hide={guess !== 1 && runningSim}
							class:showTrans={guess === 1 && !runningSim}
							class:hideTrans={guess !== 1 && !runningSim}
						/>
					</div>
					<div id="threeTwo">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50"
							class:show={guess === 2 && runningSim}
							class:hide={guess !== 2 && runningSim}
							class:showTrans={guess === 2 && !runningSim}
							class:hideTrans={guess !== 2 && !runningSim}
						/>
					</div>
					<div id="threeThree">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50"
							class:show={guess === 3 && runningSim}
							class:hide={guess !== 3 && runningSim}
							class:showTrans={guess === 3 && !runningSim}
							class:hideTrans={guess !== 3 && !runningSim}
						/>
					</div>
					<div id="fourOne"></div>
					<div id="fourTwo"><img src="/montyHall/user2.png" alt="" /></div>
					<div id="fourThree"></div>
				</div>

				<div class="switch">
					<div id="oneOne">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 1 && runningSim}
							class:hide={car !== 1 && runningSim}
							class:showTrans={car === 1 && !runningSim}
							class:hideTrans={car !== 1 && !runningSim}
						/>
					</div>
					<div id="sOneTwo">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 2 && runningSim}
							class:hide={car !== 2 && runningSim}
							class:showTrans={car === 2 && !runningSim}
							class:hideTrans={car !== 2 && !runningSim}
						/>
					</div>
					<div id="sOneThree">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 3 && runningSim}
							class:hide={car !== 3 && runningSim}
							class:showTrans={car === 3 && !runningSim}
							class:hideTrans={car !== 3 && !runningSim}
						/>
					</div>
					<div id="sTwoOne" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 1 && runningSim}
							class:show={open !== 1 && runningSim}
							class:hideTrans={open === 1 && !runningSim}
							class:showTrans={open !== 1 && !runningSim}
						/>
					</div>
					<div id="sTwoTwo" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 2 && runningSim}
							class:show={open !== 2 && runningSim}
							class:hideTrans={open === 2 && !runningSim}
							class:showTrans={open !== 2 && !runningSim}
						/>
					</div>
					<div id="sTwoThree" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img
							src="/montyHall/door.png"
							alt=""
							class:hide={open === 3 && runningSim}
							class:show={open !== 3 && runningSim}
							class:hideTrans={open === 3 && !runningSim}
							class:showTrans={open !== 3 && !runningSim}
						/>
					</div>
					<div id="sThreeOne">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50"
							class:show={switchedGuess === 1 && runningSim}
							class:hide={switchedGuess !== 1 && runningSim}
							class:showTrans={switchedGuess === 1 && !runningSim}
							class:hideTrans={switchedGuess !== 1 && !runningSim}
						/>
					</div>
					<div id="sThreeTwo">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50"
							class:show={switchedGuess === 2 && runningSim}
							class:hide={switchedGuess !== 2 && runningSim}
							class:showTrans={switchedGuess === 2 && !runningSim}
							class:hideTrans={switchedGuess !== 2 && !runningSim}
						/>
					</div>
					<div id="sThreeThree">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50"
							class:show={switchedGuess === 3 && runningSim}
							class:hide={switchedGuess !== 3 && runningSim}
							class:showTrans={switchedGuess === 3 && !runningSim}
							class:hideTrans={switchedGuess !== 3 && !runningSim}
						/>
					</div>
					<div id="s41"></div>
					<div id="s42"><img src="/montyHall/user2.png" alt="" /></div>
					<div id="s43"></div>
				</div>
			</section>
			<section>
				<div class="result">
					{#if gameComplete}
						<!-- svelte-ignore a11y_missing_content -->
						<div class="stick">
							<h1 class:win={stickWins && (busy || stepThrough)} class:lose={!stickWins}>&nbsp;</h1>
						</div>
						<!-- svelte-ignore a11y_missing_content -->
						<div class="switch">
							<h1 class:win={switchWins && (busy || stepThrough)} class:lose={!switchWins}></h1>
						</div>
					{/if}
				</div>
			</section>
			<div class="totals">
				{#if stickTotal > 0 || switchTotal > 0}
					<div class="stick">
						Stick Wins: {stickTotal}/{totalGames}={Math.round((stickTotal / totalGames) * 100)}%
					</div>
					<div class="switch">
						Switch Wins: {switchTotal}/{totalGames}={Math.round((switchTotal / totalGames) * 100)}%
					</div>
				{/if}
			</div>
		</div>

		<section class="buttonList">
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 1}
				/><button onclick={placeVehicle} disabled={buttonsIndex !== 1}>Monty: Places Vehicle</button
				>
			</div>
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 2}
				/><button onclick={chooseDoor} disabled={buttonsIndex !== 2}
					>Contestant: Makes Their Guess</button
				>
			</div>
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 3}
				/><button onclick={openDoor} disabled={buttonsIndex !== 3}>Monty: Opens A Door</button>
			</div>
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 4}
				/><button onclick={switchGuess} disabled={buttonsIndex !== 4}
					>Contestant: Makes Their Choice</button
				>
			</div>
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 5}
				/><button onclick={isWinner} disabled={buttonsIndex !== 5}>And The Winner Is...</button>
			</div>
			<div>
				<img
					src="/montyHall/rightTransMed.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 6}
				/><button onclick={reset} disabled={buttonsIndex !== 6}>Step Through Again?</button>
			</div>

			<div class="runSim mt-4">
				<button onclick={() => runSimulation(100)} disabled={busy100}
					>Run Simulator<br />100&times; more</button
				>
				<button onclick={() => runSimulation(250)} disabled={busy250}
					>Run Simulator<br /> 250&times; more</button
				>
				<button onclick={() => runSimulation(1000)} disabled={busy1000}
					>Run Simulator<br /> 1000&times; more</button
				>
				<!-- <button onclick={zero} class="mt-4" disabled={totalGames === 0}>Reset All To 0?</button> -->
			</div>
			<div class="mt-2 ml-4">
				<button onclick={zero} class="mt-4" disabled={totalGames === 0}>Reset All To 0</button>
				<button onclick={toggleReducedMotion} class="mt-4">
					{prefersReducedMotion ? 'Enable Motion' : 'Disable Motion'}
				</button>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	// :root {
	// 	scrollbar-color: unset;

	// 	/* Handle */
	// 	::-webkit-scrollbar-thumb {
	// 		background: purple;
	// 		border-radius: 10px;
	// 		border: 4px solid #f8f9fa;
	// 	}
	// 	::-webkit-scrollbar-thumb:hover {
	// 		background: blue;
	// 		/* border-radius: 10px; */
	// 		/* border: 4px solid var(--main-bg-color); */
	// 	}
	// 	::-webkit-scrollbar {
	// 		width: 15px;
	// 	}
	// 	::-webkit-scrollbar-track {
	// 		/* background-color: var(--scrollbar-track); */
	// 		background-color: inherit;
	// 	}
	// }
	.outer {
		// background-color: var(--terracotta);
		// background-color: red;
		min-height: 100vh;
		max-width: 100%;
		overflow-x: hidden; // disable overflow-x scrollbar
		overflow-y: auto; // ensure vertical scrolling is still enabled
		padding-bottom: 1rem;
		font-size: 0.75em;

		button {
			color: black;
		}
		.wrapper {
			align-items: center;
			background-color: var(--lightBeige-3);
			background-color: #8fbc8f;
			// background-color: red;
			// border: 0.5vw solid var(--mutedTeal-6);
			border-radius: 0.5vw;
			display: flex;
			flex-direction: column;
			font-size: clamp(10px, 1.5vw, 24px);
			width: min(95%, 40rem);
			margin-inline: auto;
			padding-inline: 1.5vw;
			padding-block: 1.5rem;

			.title {
				// border: 1px solid white;
				color: var(--mutedTeal-6);
				color: #437043;
				color: black;
				display: inline-block;
				font-family: 'AlkesRgIt';
				font-weight: bold;
				font-size: 2.5em;
				line-height: 1;
				margin-inline: auto;
				padding-block-start: 0.5em;
				padding-block-end: 0.5em;
				// padding-inline: 0;
				text-align: center;
				text-shadow: 0.05vw 0.1vw 0 #000;
				// width: 100vw;
				// border: 1px solid white;
			}

			.simWrap {
				// border: 2px solid red;
				width: 70%;
				// margin-bottom: -3em;

				.title,
				.result,
				.totals {
					// color: var(--mutedTeal-7);
					// border: 2px solid black;
					color: black;
					display: flex;
					font-family: var(--font-sans);
					font-size: 16px;
					font-weight: 700;
					line-height: 1;
					margin: 0;
					margin-top: 0.75rem;
					margin-bottom: -0.75rem;
					padding: 0;
					text-align: center;
					text-shadow: none;
					width: 100%;

					.stick {
						margin-inline-end: 5%;
						// margin-top: -1em;
						width: 45%;
						// border: 1px solid yellow;
					}
					.switch {
						margin-inline-start: 5%;
						// margin-top: -1em;
						width: 45%;
					}
				}
				.title {
					justify-content: space-between;
				}

				.totals {
					min-height: 1.75rem;
					margin-top: -4rem;
					margin-bottom: 0.5rem;
					text-align: center;
				}

				.result {
					height: 3rem;
					margin-bottom: 7rem;
					margin-top: -7.5rem;
					text-align: center;
					text-shadow: 0.05vw 0.05vw 0.1vw white;
					.stick {
						animation: wiggle 0.5s 4;
						margin-inline: 0;
						width: 60%;
					}
					.switch {
						animation: wiggle 0.5s 4;
						margin-inline: 0;
						width: 55%;
					}
				}

				.simul8r {
					display: flex;
					gap: 10%;
					justify-content: space-between;
					margin-block-end: 2rem;
					// margin-inline: 0.75vw;
					// padding-inline: 3rem;
					padding-block: 0;

					.switch,
					.dontSwitch {
						background: white;
						// border: 0.2vw solid var(--mutedTeal-6);
						border: 0.29vw solid black;
						border-radius: var(--radius-2);
						box-shadow: var(--shadow-4);
						column-gap: calc(0.75vw + 0.125rem);
						display: grid;
						grid-template-columns: 1fr 1fr 1fr;
						grid-template-rows: 20% 30% 25% 25%;
						margin-block-start: 1rem;
						padding-inline: 0.2vw;
						padding-block-start: 0.5vw;

						div {
							margin-inline: auto;
							text-align: center;
						}
					}
				}
			}
		}
	}

	// #threeOne,
	// #sThreeOne,
	// #threeTwo,
	// #sThreeTwo,
	// #threeThree,
	// #sThreeThree {
	// 	border: 3px solid blue;
	// 	// margin-top: -5.5rem;
	// 	z-index: 0;
	// 	.img {
	// 		// border: 3px solid red;
	// 	}
	// }

	.buttonList {
		width: 100%;
		div {
			display: flex;
			align-items: center;
			img {
				width: 6%;
				margin-left: 1rem;
			}
			button {
				text-align: center;
				margin-right: 1rem;
				// color: pink;
			}
		}
	}
	.win {
		color: #437043;
		font-family: 'awesome';
		font-size: 3em;
		font-weight: bold;
		letter-spacing: 0.4rem;
		margin-top: 1.5rem;
		text-shadow: 2px 2px 4px #000;
		vertical-align: bottom;
		z-index: 1000;
		&::before {
			content: 'Win!';
		}
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}

	img {
		height: 100%;
		width: 100%;
		// z-index: 1000;
		&.raise {
			margin-top: -3vw;
		}

		// &.scale50 {
		// 	transform: scale(0.5);
		// }
	}

	.hideTrans {
		opacity: 0;
		transition: opacity 0.5s;
	}
	.showTrans {
		opacity: 1;
		transition: opacity 0.5s;
	}
	.hide {
		opacity: 0;
	}
	.show {
		opacity: 1;
	}

	button {
		border: 0.2vw solid black;
		background-color: #437043;
		background-color: white;
		box-shadow: var(--shadow-4);
		font-weight: normal;
		// font-weight: bold;
		font-size: 16px;
		color: var(--mutedTeal-7);
		padding: 0.125rem;
		padding-inline: 1rem;
		margin-block: 0.25rem;
		text-align: right;
		// text-shadow: none;
		text-shadow: 0.07vw 0.07vw 0.1vw var(--mutedTeal-9);
		width: 100%;

		&:disabled {
			background-color: var(--lightBeige-6);
			background-color: #437043;
			border: none;
			box-shadow: none;
			color: #8fbc8f;
			cursor: default;
			font-weight: normal;
		}
	}

	.runSim {
		clear: both;
		display: flex;
		justify-content: space-between;
		margin-inline-start: 1rem;

		button {
			width: 30%;
			padding-inline: 0.25em;
			margin-bottom: 0;
			margin-top: 1rem;
		}
	}

	.parent {
		position: relative;
		top: 0;
		left: 0;
		& img {
			position: relative;
			top: 0;
			left: 0;

			&.abs {
				position: absolute;
				top: 0;
				left: 0;
				// z-index: 1000;
			}
		}
	}
	@media (min-width: 600px) {
		.outer {
			background-color: DarkSeaGreen;

			header {
				margin-top: 0.5rem;
			}

			.wrapper {
				// border: none;
				width: 60%;
				// background-color: inherit;
			}
		}
		// .win {
		// 	margin-top: -1rem;

		// 	padding-top: 2rem;
		// 	font-size: 7vw;
		// 	border: 1px solid black;
		// }

		.buttonList {
			div {
				button {
					width: 100%;
				}
			}
		}
	}
</style>
