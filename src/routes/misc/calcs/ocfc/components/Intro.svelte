<script>
	import { fly } from 'svelte/transition';
	import { ki, sd } from '$lib/utils';

	const defaultSdigs = 3;
	const defaultWdigs = 5;
	const defaultExtraDig = true;
	const defaultExtraWorkingDig = true;

	let channelType = $state('rectangular');
	let isVisible = $state(true);
	let sD = $state(defaultSdigs);
	// let sdigs = $derived(sD);
	// let sdigs = $state(defaultSdigs);
	let wD = $state(defaultWdigs);
	wD = wD < sD ? sD : wD;
	let extraDig = $state(defaultExtraDig);
	let extraWorkingDig = $state(defaultExtraWorkingDig);

	const toggle = () => {
		isVisible = !isVisible;
	};
</script>

{#if isVisible}
	<section>
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
			and answers (or {@html ki(`${sD + 1}`)} significant digits if the first non-zero digit is a one,
			e.g. {@html ki(`${sd(0.23456789, defaultSdigs)}`)} but {@html ki(
				`${sd(0.123456789, defaultSdigs)}`
			)}). Interim calculations are to {@html ki(`${defaultWdigs}`)} significant digits (or
			{@html ki(`${wD + 1}`)} in the case of a leading one) to avoid the accumulation of rounding errors.
			You can modify these default values below:
		</p>
		<div class="digs">
			<p class="bold">Digits for inputs and results:</p>
			<div class="sdigs">
				<!-- <label> -->
				<label>
					(2-6)
					<input type="number" bind:value={sD} min="2" max="6" />
					<input type="range" bind:value={sD} min="2" max="6" />
					<span>{@html ki(`${sd(0.023456789, sD)}`)}</span>
				</label>
				<label>
					Extra digit for leading one:
					<input type="checkbox" bind:checked={extraDig} />
					{#if extraDig}
						e.g., <span>{@html ki(`${sd(0.123456789, sD)}`)}</span>
					{:else}
						e.g., <span>{@html ki(`${sd(0.123456789, sD, false)}`)}</span>
					{/if}
				</label>
			</div>
			<p class="bold">Digits for interim calculations:</p>
			<div class="wdigs">
				<!-- <label> -->
				<label>
					({sD}-8)
					<input type="number" bind:value={wD} min={sD} max="8" />
					<input type="range" bind:value={wD} min={sD} max="8" />
					<span>{@html ki(`${sd(0.023456789, wD)}`)}</span>
				</label>
				<label>
					Extra digit for leading one:
					<input type="checkbox" bind:checked={extraWorkingDig} />
					{#if extraWorkingDig}
						e.g., <span>{@html ki(`${sd(0.123456789, wD)}`)}</span>
					{:else}
						e.g., <span>{@html ki(`${sd(0.123456789, wD, false)}`)}</span>
					{/if}
				</label>
			</div>
		</div>
	</section>
	<br />bottom
{/if}

<style lang="scss">
	section {
		padding-inline: 3em;

		.sdigs,
		.wdigs {
			margin-block-start: -1em;
			// margin-inline: auto;
			margin-inline-start: 0;
			padding-block: 0;
			width: 100%;

			label {
				display: block;
				font-size: 120%;
				margin-inline: auto;
				// border: 1px solid var black;
				// background: yellow;
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
				// margin-inline: 1em;
				// vertical-align: top;
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
</style>
