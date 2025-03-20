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

	const placeVehice = () => {
		car = Math.floor(Math.random() * 3) + 1;
		buttonsIndex = 2;
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
		runningSim = true;
		for (let i = 0; i < times; i++) {
			placeVehice();
			chooseDoor();
			openDoor();
			switchGuess();
			isWinner();

			if (!prefersReducedMotion) {
				let delay = 5;
				// if (i < times * 0.05) {
				// 	delay = 100 - easeInOutQuad(i / (times * 0.05)) * 90; // smooth acceleration
				// } else if (i > times * 0.95) {
				// 	delay = 10 + easeInOutQuad((i - times * 0.95) / (times * 0.05)) * 95; // smooth deceleration
				// } else {
				// 	delay = 10; // fast middle
				// }
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
		// tick().then(() => {
		runningSim = false;
		// });
	};
</script>

<div class="outer">
	<HomeLink color="#A7BEAE" shadow="black" />
	<header class="title">Monty Hall Paradox &ndash; A Simul8r</header>
	<div class="wrapper">
		<a href="/misc/montyHall/intro"><button>What is the Monty Hall Paradox?</button></a>

		<div class="simWrap">
			<div class="title">
				<div class="stick">Strategy: Stick</div>
				<div class="switch">Strategy: Switch</div>
			</div>

			<section class="simul8r">
				<div class="dontSwitch">
					<div id="11">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 1 && runningSim}
							class:hide={car !== 1 && runningSim}
							class:showTrans={car === 1 && !runningSim}
							class:hideTrans={car !== 1 && !runningSim}
						/>
					</div>
					<div id="12">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 2 && runningSim}
							class:hide={car !== 2 && runningSim}
							class:showTrans={car === 2 && !runningSim}
							class:hideTrans={car !== 2 && !runningSim}
						/>
					</div>
					<div id="13">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 3 && runningSim}
							class:hide={car !== 3 && runningSim}
							class:showTrans={car === 3 && !runningSim}
							class:hideTrans={car !== 3 && !runningSim}
						/>
					</div>
					<div id="21" class="parent">
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
					<div id="22" class="parent">
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
					<div id="23" class="parent">
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
					<div id="31">
						<img
							src="/montyHall/upTerra.png"
							alt="upArrow"
							class="scale50 raise"
							class:show={guess === 1 && runningSim}
							class:hide={guess !== 1 && runningSim}
							class:showTrans={guess === 1 && !runningSim}
							class:hideTrans={guess !== 1 && !runningSim}
						/>
					</div>
					<div id="32">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50 raise"
							class:show={guess === 2 && runningSim}
							class:hide={guess !== 2 && runningSim}
							class:showTrans={guess === 2 && !runningSim}
							class:hideTrans={guess !== 2 && !runningSim}
						/>
					</div>
					<div id="33">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50 raise"
							class:show={guess === 3 && runningSim}
							class:hide={guess !== 3 && runningSim}
							class:showTrans={guess === 3 && !runningSim}
							class:hideTrans={guess !== 3 && !runningSim}
						/>
					</div>
					<div id="41"></div>
					<div id="42"><img src="/montyHall/user2.png" alt="" class="raise" /></div>
					<div id="43"></div>
				</div>

				<div class="switch">
					<div id="11">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 1 && runningSim}
							class:hide={car !== 1 && runningSim}
							class:showTrans={car === 1 && !runningSim}
							class:hideTrans={car !== 1 && !runningSim}
						/>
					</div>
					<div id="s12">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 2 && runningSim}
							class:hide={car !== 2 && runningSim}
							class:showTrans={car === 2 && !runningSim}
							class:hideTrans={car !== 2 && !runningSim}
						/>
					</div>
					<div id="s13">
						<img
							src="/montyHall/carTerra.png"
							alt=""
							class:show={car === 3 && runningSim}
							class:hide={car !== 3 && runningSim}
							class:showTrans={car === 3 && !runningSim}
							class:hideTrans={car !== 3 && !runningSim}
						/>
					</div>
					<div id="s21" class="parent">
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
					<div id="s22" class="parent">
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
					<div id="s23" class="parent">
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
					<div id="s31">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 1 && runningSim}
							class:hide={switchedGuess !== 1 && runningSim}
							class:showTrans={switchedGuess === 1 && !runningSim}
							class:hideTrans={switchedGuess !== 1 && !runningSim}
						/>
					</div>
					<div id="s32">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 2 && runningSim}
							class:hide={switchedGuess !== 2 && runningSim}
							class:showTrans={switchedGuess === 2 && !runningSim}
							class:hideTrans={switchedGuess !== 2 && !runningSim}
						/>
					</div>
					<div id="s33">
						<img
							src="/montyHall/upTerra.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 3 && runningSim}
							class:hide={switchedGuess !== 3 && runningSim}
							class:showTrans={switchedGuess === 3 && !runningSim}
							class:hideTrans={switchedGuess !== 3 && !runningSim}
						/>
					</div>
					<div id="s41"></div>
					<div id="s42"><img src="/montyHall/user2.png" alt="" class="raise" /></div>
					<div id="s43"></div>
				</div>
			</section>
			<section>
				<div class="result">
					{#if gameComplete}
						<!-- svelte-ignore a11y_missing_content -->
						<div class="stick"><h1 class:win={stickWins} class:lose={!stickWins}>&nbsp;</h1></div>
						<!-- svelte-ignore a11y_missing_content -->
						<div class="switch"><h1 class:win={switchWins} class:lose={!switchWins}></h1></div>
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
				/><button onclick={placeVehice} disabled={buttonsIndex !== 1}>Monty: Places Vehicle</button>
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
					>Contestant: Make The Switch</button
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
				<button onclick={() => runSimulation(100)}>Run Simulation<br />100&times; more</button>
				<button onclick={() => runSimulation(250)}>Run Simulation<br /> 250&times; more</button>
				<button onclick={() => runSimulation(1000)}>Run Simulation<br /> 1000&times; more</button>
				<!-- <button onclick={zero} class="mt-4" disabled={totalGames === 0}>Reset All To 0?</button> -->
			</div>
			<div class="mt-2 ml-4">
				<button onclick={zero} class="mt-4" disabled={totalGames === 0}>Reset All To 0?</button>
				<button onclick={toggleReducedMotion} class="mt-4">
					{prefersReducedMotion ? 'Enable Motion' : 'Disable Motion'}
				</button>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	:root {
		scrollbar-color: unset;

		/* Handle */
		::-webkit-scrollbar-thumb {
			background: purple;
			border-radius: 10px;
			border: 4px solid #f8f9fa;
		}
		::-webkit-scrollbar-thumb:hover {
			background: blue;
			/* border-radius: 10px; */
			/* border: 4px solid var(--main-bg-color); */
		}
		::-webkit-scrollbar {
			width: 15px;
		}
		::-webkit-scrollbar-track {
			/* background-color: var(--scrollbar-track); */
			background-color: inherit;
		}
	}
	.outer {
		background-color: var(--terracotta);
		min-height: 100vh;
		max-width: 100%;
		overflow-x: hidden; // disable overflow-x scrollbar
		overflow-y: auto; // ensure vertical scrolling is still enabled
		padding-bottom: 1rem;

		.title {
			color: var(--mutedTeal-6);
			display: inline-block;
			font-family: 'AlkesRgIt';
			font-weight: bold;
			font-size: clamp(12px, 6vw, 48px);
			line-height: 1;
			margin-inline: auto;
			padding-block-start: 4vw;
			padding-block-end: 2vw;
			text-align: center;
			text-shadow: 0.05vw 0.1vw 0 var(--mutedTeal-9);
			width: 100vw;
			// border: 1px solid white;
		}

		.wrapper {
			align-items: center;
			background-color: var(--lightBeige-3);
			border: 0.5vw solid var(--mutedTeal-6);
			border-radius: 0.5vw;
			display: flex;
			flex-direction: column;
			font-size: clamp(10px, 1.5vw, 24px);
			width: min(95%, 40rem);
			margin-inline: auto;
			padding-inline: 1.5vw;
			padding-block: 1.5rem;

			.simWrap {
				.title,
				.result,
				.totals {
					color: var(--mutedTeal-7);
					display: flex;
					font-family: var(--font-sans);
					font-size: clamp(16px, 1.75vw, 24px);
					font-weight: 700;
					line-height: 1;
					margin: 0;
					margin-top: 1.5rem;
					margin-bottom: -0.5rem;
					padding: 0;
					text-shadow: none;
					width: 100%;

					.stick {
						width: 47.5%;
						margin-inline-end: 2.5%;
					}
					.switch {
						width: 47.5%;
						margin-inline-start: 2.5%;
					}
				}

				.totals {
					height: 1.75rem;
					margin-top: -3rem;
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
					gap: 0.5rem;
					justify-content: space-between;
					margin-block-end: 1rem;
					// margin-inline: 0.75vw;
					// padding-inline: 3rem;
					padding-block: 0;

					.switch,
					.dontSwitch {
						background: white;
						border: 0.2vw solid var(--mutedTeal-6);
						border-radius: var(--radius-2);
						box-shadow: var(--shadow-4);
						column-gap: calc(0.75vw + 0.125rem);
						display: grid;
						grid-template-columns: 1fr 1fr 1fr;
						grid-template-rows: repeat(4, min-content);
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
			}
		}
	}
	.win {
		color: var(--lightBeige-6);
		font-family: 'awesome';
		// font-size: ;
		font-weight: bold;
		letter-spacing: 0.4rem;
		margin-top: 0.5rem;
		text-shadow: 0.1vw 0.1vw 0.2vw var(--mutedTeal-9);
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
		&.raise {
			margin-top: -3vw;
		}

		&.scale50 {
			transform: scale(0.5);
		}
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
		border: 0.2vw solid var(--mutedTeal-7);
		background-color: var(--lightBeige-3);
		background-color: white;
		box-shadow: var(--shadow-4);
		font-weight: 700;
		// font-weight: bold;
		font-size: clamp(16px, 1.75vw, 24px);
		color: var(--mutedTeal-7);
		padding: 0.125rem;
		padding-inline: 1rem;
		margin-block: 0.25rem;
		text-align: right;
		// text-shadow: none;
		text-shadow: 0.07vw 0.07vw 0.1vw var(--mutedTeal-9);
		width: 100%;

		&:hover:enabled {
			// text-shadow: 0.025vw 0.025vw 0.05vw purple;
			color: white;
			background-color: var(--mutedTeal-7);
			border-color: var(--mutedTeal-8);
		}

		&:disabled {
			background-color: var(--lightBeige-6);
			border: none;
			box-shadow: none;
			// border-color: white;
			color: white;
			cursor: default;
			font-weight: 700;
			text-shadow: 0.1vw 0.1vw 0.2vw var(--mutedTeal-9);
		}
	}

	.runSim {
		clear: both;
		display: flex;
		margin-inline-start: 1rem;

		// margin-block-start: 1rem;
		justify-content: space-between;
		button {
			width: 30%;
			padding-inline: 0;
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
			}
		}
	}
	@media (max-width: 600px) {
		.outer {
			background-color: var(--lightBeige-1);

			header {
				margin-top: 0.5rem;
			}

			.wrapper {
				border: none;
				width: 100%;
				background-color: inherit;
			}
		}
		.win {
			margin-top: -1rem;

			padding-top: 2rem;
			font-size: 7vw;
			// border: 1px solid black;
		}

		.buttonList {
			div {
				button {
					width: 100%;
				}
			}
		}
	}
</style>
