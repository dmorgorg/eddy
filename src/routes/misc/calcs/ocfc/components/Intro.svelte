<script>
	import { slide } from 'svelte/transition';
	import { ki, sd } from '$lib/utils';
	// global 'store' for precision
	import { digits } from '../digits.svelte.js';

	let { channelType } = $props();

	const defaultSdigsMin = 2;
	const defaultSdigsMax = 6;
	const defaultWdigsMax = 8;
	const defaultSdigs = 3;
	const defaultWdigs = 5;
	// let isIntroVisible = $state(false);

	const toggle = () => {
		digits.isIntroVisible = !digits.isIntroVisible;
	};
	const handleChange = () => {
		if (digits.wdigs < digits.sdigs) {
			digits.wdigs = digits.sdigs;
		}
	};
</script>

{#if digits.isIntroVisible}
	<section transition:slide>
		<p>
			The calculator on this page is for <span>normal</span> (uniform) flow and for
			<span>critical</span>
			flow in an open channel having a <span>{channelType}</span> cross-section.
		</p>
		<p>
			Clicking on a result panel will display the associated calculations for each result. Clicking
			again will close the panel.
		</p>
		<p>
			Either flow depth, {@html ki(`y`)}, in metres ({@html ki(`\\mathsf{m}`)}) or volume flow,
			{@html ki(`Q`)}, in cubic metres per second ({@html ki(`\\mathsf{m^3\\!/s}`)}) must be
			specified. But not both.
		</p>
		<p>
			If {@html ki(`y`)} is specified, then the corresponding flow rate {@html ki(`Q`)} will be calculated.
			If {@html ki(`Q`)} is specified, then the corresponding flow depth {@html ki(`y`)} will be calculated.
		</p>
		<p>
			{#if channelType !== 'triangular'}
				<span>Note</span> that, for a {channelType}
				channel, {@html ki(`y`)} cannot be determined analytically from {@html ki(`Q`)} and is found
				using an iterative method.
			{/if}
		</p>
		<p>
			By default, this calculator uses {@html ki(`${defaultSdigs}`)} significant digits for input values
			and answers (or {@html ki(`${digits.sdigs + 1}`)} significant digits if the first non-zero digit
			is a one, e.g. {@html ki(`${sd(0.23456789, defaultSdigs)}`)} but {@html ki(
				`${sd(0.123456789, defaultSdigs)}`
			)}). Interim working calculations default to {@html ki(`${defaultWdigs}`)} significant digits (or
			{@html ki(`${defaultWdigs + 1}`)} in the case of a leading one) to avoid the accumulation of rounding
			errors. Interim working precision may not be less than that for inputs and results. You can modify
			these default values below:
		</p>
		<div class="digs">
			<p class="bold">Digits for inputs and results:</p>
			<div class="sdigs">
				<!-- <label> -->
				<label>
					(2-6)
					<input
						type="number"
						bind:value={digits.sdigs}
						min={defaultSdigsMin}
						max={defaultSdigsMax}
						onchange={handleChange}
					/>
					<input
						type="range"
						bind:value={digits.sdigs}
						min={defaultSdigsMin}
						max={defaultSdigsMax}
						onchange={handleChange}
					/>
					e.g.,<span> {@html ki(`${sd(0.023456789, digits.sdigs)}`)} </span>
				</label>
				<label>
					Extra digit for leading one:
					<input type="checkbox" bind:checked={digits.extraForSdigs} />
					{#if digits.extraForSdigs}
						e.g., <span>{@html ki(`${sd(0.123456789, digits.sdigs)}`)}</span>
					{:else}
						e.g., <span>{@html ki(`${sd(0.123456789, digits.sdigs, false)}`)}</span>
					{/if}
				</label>
			</div>
			<p class="bold">Digits for interim calculations:</p>
			<div class="wdigs">
				<!-- <label> -->
				<label>
					({digits.sdigs}-8)
					<input type="number" bind:value={digits.wdigs} min={digits.sdigs} max={defaultWdigsMax} />
					<input type="range" bind:value={digits.wdigs} min={digits.sdigs} max={defaultWdigsMax} />
					e.g.,<span>{@html ki(`${sd(0.023456789, digits.wdigs)}`)}</span>
				</label>
				<label>
					Extra digit for leading one:
					<input type="checkbox" bind:checked={digits.extraForWdigs} />
					{#if digits.extraForWdigs}
						e.g., <span>{@html ki(`${sd(0.123456789, digits.wdigs)}`)}</span>
					{:else}
						e.g., <span>{@html ki(`${sd(0.123456789, digits.wdigs, false)}`)}</span>
					{/if}
				</label>
			</div>
		</div>
	</section>
{/if}

<div class="toggle-btn">
	<button onclick={toggle}>
		{#if digits.isIntroVisible}
			Hide Information &nbsp; &nbsp; &#9650;
		{:else}
			Show Information &nbsp; &nbsp; &#9660;
		{/if}
	</button>
</div>
<br />

<br />

<style lang="scss">
	section {
		padding-inline: 3em;

		.sdigs,
		.wdigs {
			margin-block-start: -0.5em;
			// margin-inline: auto;
			margin-inline-start: 0;
			padding-block: 0;
			width: 100%;

			label {
				display: block;
				font-size: 120%;
				margin-inline: auto;
				width: fit-content;
			}

			input {
				display: inline;
				margin-inline: 1em;
			}
			input[type='number'] {
				width: 3em;
			}
			input[type='range'] {
				vertical-align: middle;
				width: 7em;
			}
			input[type='checkbox'] {
				vertical-align: middle;
				// width: 8em;
			}

			span {
				font-size: 120%;
			}
		}
		.bold {
			font-weight: bold;
		}

		p {
			font-size: 120%;
			line-height: 1.4em;
			margin-block: 1em;
			span {
				font-weight: bold;
				letter-spacing: -0.03em;
			}
		}
	}
	div.toggle-btn {
		// border: 2px solid yellowgreen;
		display: flex;
		justify-content: center;
		margin-top: 1em;
		width: 100%;
		button {
			background-color: var(--primaryColor);
			border: none;
			color: white;
			cursor: pointer;
			outline: none;
			text-shadow: none;
			font-size: 110%;
			padding: 0.5em 1em;

			&:hover {
				color: black;
			}
		}
	}
</style>
