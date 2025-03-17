<script>
	import HomeLink from '$lib/components/HomeLink.svelte';

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
</script>

<div class="outer">
	<HomeLink color="purple" />
	<div class="title">Monty Hall Paradox &ndash; A Simul8r</div>
	<div class="wrapper">
		<button>What is the Monty Hall Paradox?</button>

		<div class="simWrap">
			<div class="title">
				<div class="stick">Strategy: Stick</div>
				<div class="switch">Strategy: Switch</div>
			</div>

			<section class="simul8r">
				<div class="dontSwitch">
					<div id="11">
						<img src="/montyHall/car4.png" alt="" class:show={car === 1} class:hide={car !== 1} />
					</div>
					<div id="12">
						<img src="/montyHall/car4.png" alt="" class:show={car === 2} class:hide={car !== 2} />
					</div>
					<div id="13">
						<img src="/montyHall/car4.png" alt="" class:show={car === 3} class:hide={car !== 3} />
					</div>
					<div id="21" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 1} class:show={open !== 1} />
					</div>
					<div id="22" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 2} class:show={open !== 2} />
					</div>
					<div id="23" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 3} class:show={open !== 3} />
					</div>
					<div id="31">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={guess === 1}
							class:hide={guess !== 1}
						/>
					</div>
					<div id="32">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={guess === 2}
							class:hide={guess !== 2}
						/>
					</div>
					<div id="33">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={guess === 3}
							class:hide={guess !== 3}
						/>
					</div>
					<div id="41"></div>
					<div id="42"><img src="/montyHall/user2.png" alt="" class="raise" /></div>
					<div id="43"></div>
				</div>

				<div class="switch">
					<div id="11">
						<img src="/montyHall/car4.png" alt="" class:show={car === 1} class:hide={car !== 1} />
					</div>
					<div id="s12">
						<img src="/montyHall/car4.png" alt="" class:show={car === 2} class:hide={car !== 2} />
					</div>
					<div id="s13">
						<img src="/montyHall/car4.png" alt="" class:show={car === 3} class:hide={car !== 3} />
					</div>
					<div id="s21" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 1} class:show={open !== 1} />
					</div>
					<div id="s22" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 2} class:show={open !== 2} />
					</div>
					<div id="s23" class="parent">
						<img src="/montyHall/doorOpen.png" alt="" class="abs" />
						<img src="/montyHall/door.png" alt="" class:hide={open === 3} class:show={open !== 3} />
					</div>
					<div id="s31">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 1}
							class:hide={switchedGuess !== 1}
						/>
					</div>
					<div id="s32">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 2}
							class:hide={switchedGuess !== 2}
						/>
					</div>
					<div id="s33">
						<img
							src="/montyHall/up.png"
							alt=""
							class="scale50 raise"
							class:show={switchedGuess === 3}
							class:hide={switchedGuess !== 3}
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
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 1}
				/><button onclick={placeVehice} disabled={buttonsIndex !== 1}>Monty: Places Vehicle</button>
			</div>
			<div>
				<img
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 2}
				/><button onclick={chooseDoor} disabled={buttonsIndex !== 2}
					>Contestant: Makes Their Guess</button
				>
			</div>
			<div>
				<img
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 3}
				/><button onclick={openDoor} disabled={buttonsIndex !== 3}>Monty: Opens A Door</button>
			</div>
			<div>
				<img
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 4}
				/><button onclick={switchGuess} disabled={buttonsIndex !== 4}
					>Contestant: Make The Switch</button
				>
			</div>
			<div>
				<img
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 5}
				/><button onclick={isWinner} disabled={buttonsIndex !== 5}>And The Winner Is...</button>
			</div>
			<div>
				<img
					src="/montyHall/rightTrans.png"
					alt="rightTrans"
					class="hide"
					class:show={buttonsIndex === 6}
				/><button onclick={reset} disabled={buttonsIndex !== 6}>Step Through Again?</button>
			</div>
			<button onclick={zero} class="fifty">Reset All To 0?</button>
		</section>
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: black;
		background-color: orange;
		min-height: 100vh;
		overflow-x: none;

		.title {
			color: green;
			color: purple;
			// color: yellow
			display: inline-block;
			font-family: 'AlkesRgIt';
			font-weight: bold;
			font-size: clamp(12px, 6vw, 48px);
			line-height: 1;
			margin-inline: auto;
			padding-block-start: 4vw;
			padding-block-end: 2vw;
			text-align: center;
			text-shadow: 0.05vw 0.1vw 0 white;
			width: 100vw;
			// border: 1px solid white;
		}

		.wrapper {
			align-items: center;
			background-color: #f8f0ff;
			border: 0.25vw solid purple;
			border-radius: 0.5vw;
			display: flex;
			flex-direction: column;
			font-size: clamp(10px, 1.5vw, 24px);
			width: min(95%, 40rem);
			margin-inline: auto;
			// padding-inline: 3rem;
			padding-inline: 1.5vw;
			padding-block: 1.5rem;
			// border: 2px solid orange;

			.simWrap {
				.title,
				.result,
				.totals {
					display: flex;
					font-family: var(--font-sans);
					font-size: clamp(12px, 2.25vw, 24px);
					font-weight: 600;
					line-height: 1;
					margin: 0;
					margin-top: 1.5rem;
					margin-bottom: -0.5rem;
					padding: 0;
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
					height: 2.5rem;
					margin-top: -2.25rem;
					margin-bottom: 0.5rem;
					text-align: center;
					color: purple;
				}

				.result {
					height: 3rem;
					margin-bottom: 7rem;
					margin-top: -7.5rem;
					text-align: center;
					text-shadow: 0.05vw 0.05vw 0.1vw white;
					.stick {
						animation: wiggle 0.5s 4;
						// animation-iteration-count: 4;
						width: 47.5%;
						margin-inline-end: 2.5%;
					}
					.switch {
						animation: wiggle 0.5s 4;
						// animation-iteration-count: 4;
						width: 47.5%;
						margin-inline-start: 2.5%;
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
						border: 0.2vw solid purple;
						border-radius: var(--radius-2);
						box-shadow: var(--shadow-4);
						row-gap: calc(0.5vw + 0.125rem);
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
				width: 10%;
			}
			button {
				text-align: center;
				width: 89.9%;
			}
		}
	}
	.win {
		color: #32cd32;
		color: purple;
		// color: #8db600;
		font-family: 'awesome';
		font-weight: bold;
		letter-spacing: 0.4rem;
		margin-top: -0.75rem;
		text-shadow: 0.1vw 0.1vw 0.2vw white;
		&::before {
			content: 'Win!';
		}
	}
	.lose {
		color: red;
		font-family: 'domestic';
		text-shadow: 0.1vw 0.1vw 0.2vw black;
		&::before {
			content: '';
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
		// border: 1px solid black;
		height: 100%;
		width: 100%;
		&.raise {
			margin-top: -1.9vw;
		}

		&.scale50 {
			transform: scale(0.5);
		}
	}

	.hide {
		opacity: 0;
	}
	.show {
		opacity: 1;
	}

	button {
		border: 0.2vw solid purple;
		background-color: #e7c7ff;
		box-shadow: var(--shadow-4);
		font-weight: 500;
		// font-weight: bold;
		font-size: clamp(12px, 1.5vw, 24px);
		color: purple;
		padding: 0.125rem;
		padding-inline: 1rem;
		margin-block: 0.25rem;
		text-align: right;
		width: 100%;

		&:hover:enabled {
			// text-shadow: 0.025vw 0.025vw 0.05vw purple;
			color: white;
			background-color: purple;
		}

		&:disabled {
			background-color: white;
			color: #d59eff;
			cursor: default;
			font-weight: 400;
			// font-weight: normal;
		}
		&.fifty {
			margin-top: 1rem;
			width: 50%;
			float: right;
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
</style>
