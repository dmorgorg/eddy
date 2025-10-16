<script>
	import HomeLink from '$lib/components/HomeLink.svelte';
	import updateCanvas from './canvas';
	import { errors, forces, maxForces } from './state.svelte';
	import { addForce, handleRowDelete, calculateEquilibrium } from './app';
	import { onMount } from 'svelte';

	// const maxForces = 7;
	const minForces = 3;
	const delta = 0.01;

	onMount(() => updateCanvas());
</script>

<div class="outer">
	<HomeLink color="DarkCyan" />
	<div class="container">
		<h3 class="title">Truss Joint Calcul<span class="eight">8</span>r</h3>
		<div class="main-grid">
			<div class="input-panel">
				<h3>Force Inputs</h3>
				<div class="description">
					<p>Enter {minForces}-{maxForces} forces.</p>
					<p>Enter a 0 magnitude for the 1 or 2 magnitudes that should be calculated.</p>
					<p>
						Directions should be specified for all forces: in degrees, between -360&deg; and
						360&deg;. (Positive degree values are measured counter-clockwise from the positive <span
							class="italic">x</span
						>-axis, negative values are clockwise.)
					</p>
					<p>Use negative magnitudes for compression.</p>
				</div>
				<div class="force-table">
					<div class="table-header">
						<div>LABEL</div>
						<div>DIRECTION</div>
						<div>MAGNITUDE</div>
					</div>
					<div id="force-list">
						{#each forces as force, i (i)}
							<div class="force-row">
								<input type="text" bind:value={force.label} onchange={updateCanvas} />
								<input type="number" bind:value={force.direction} onchange={updateCanvas} />
								{#if force.magnitude === 0 || force.magnitude == undefined}
									<input type="number" placeholder="To Be Calculated" onchange={updateCanvas} />
								{:else}
									<input type="number" bind:value={force.magnitude} onchange={updateCanvas} />
								{/if}
								<button onclick={() => handleRowDelete(i)}>x</button>
							</div>
						{/each}
					</div>
					<!-- <div id="force-list" class="force-rows"></div> -->
				</div>
				{#if errors.wrongNumberOfUnknownsError[1]}
					<div class="error">{errors.wrongNumberOfUnknownsError[0]}</div>
				{/if}
				<button id="add-force" onclick={addForce} disabled={forces.length >= maxForces}>
					+ Add Force
				</button>
				<button id="calculate" onclick={calculateEquilibrium}> Calculate Unknowns </button>
			</div>
			<div class="canvas-panel">
				<div class="card canvas-card">
					<h3>Force Diagram</h3>
					<canvas id="force-canvas" width="300" height="300"></canvas>
					{#each forces as { label, direction, magnitude }, i}
						{label}&nbsp;{direction}&nbsp;{magnitude}<br />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	button {
		transition: all 0.5s;
	}
	canvas {
		// border: 2px solid red;
		margin: 0 auto;
		width: 100%;
		height: auto;
	}
	.container {
		align-items: center;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-inline: auto;
		width: 40rem;
	}
	.error {
		border: 5px solid red;
		background-color: pink;
		border-radius: 5px;
		margin-block-start: 0.25rem;
		padding: 0.125rem 0.5rem;
		text-align: center;
	}
	.eight {
		font-family: Valittey;
		padding-bottom: 1rem;
		font-style: bold;
		font-size: 102.5%;
	}
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: #008b8b;
		font-family: okaluera;
		letter-spacing: 0.1em;
	}
	h3.title,
	h4.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 0;
		border-bottom: 3px solid #008b8b;
		font-size: 3rem;
	}
	.description p {
		font-size: 0.875rem;
		margin-bottom: 1rem;
		margin-block: 0.5rem;
		line-height: 1.2em;
		// text-wrap: pretty;
		// white-space: nowrap;
	}
	.italic {
		font-style: italic;
	}
	/* Layout Grid */
	.main-grid {
		display: grid;
		grid-template-columns: 45% 55%;
		gap: 1.5rem;
		// border: 1px solid green;
	}

	.input-panel {
		box-shadow: rgba(0, 139, 139, 0.2) 0px 7px 29px 0px;
		min-width: 20rem;
		padding: 0.5rem 1rem;
		padding-bottom: 1.5rem;
		// border: 1px solid darkcyan;

		button {
			float: right;
			padding: 0.25rem 0.5rem;
			margin: 0;
			margin-top: 0.75em;
			margin-left: 1.5rem;
			background-color: darkcyan;
			border-radius: 0;
			border: none;
			color: white;
			// text-decoration: none;
			text-shadow: none;

			&:disabled {
				background-color: #ced4da;
			}
		}

		.force-row {
			display: grid;
			grid-template-columns: 0.5fr 0.75fr 1.125fr 0.25fr;
			gap: 0.1rem;
			align-items: center;
			padding: 0.25rem 0;

			button {
				padding-block: 0;
				margin-left: 0.1rem;
				margin-block: 0;
				height: 100%;
				border: none;
				border-radius: 0;
				vertical-align: middle;
			}
		}
		.table-header {
			display: grid;
			grid-template-columns: 0.5fr 0.875fr 1fr 0.25fr;
			// gap: 0.75rem;
			padding: 0;
			font-size: 0.875rem;
			font-weight: 600;
			text-transform: uppercase;
			text-align: center;
			letter-spacing: 0.025em;
			// border: 2px solid black;
		}
	}
	.canvas-panel {
		padding: 0.5rem 1rem;
		min-width: 400px;
		// border: 1px solid darkcyan;
		box-shadow: rgba(0, 139, 139, 0.2) 0px 7px 29px 0px;
	}
	// .canvas {
	// 	background: white;
	// 	border: 1px solid black;
	// }
	/* Input */
	input {
		border-radius: 0;
		border: 2px solid darkcyan;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		width: 100%;
		transition: all 0.2s;
		height: 36px;
		background: #f0ffff;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}
	input[type='number'] {
		-appearance: textfield; /* Firefox */
	}
</style>
