<script>
	import { fly } from 'svelte/transition';
	import { ki } from '$lib/utils';

	const defaultSdigs = 3;
	const defaultWdigs = 5;
	const defaultExtraDig = true;
	const defaultExtraWorkingDig = true;

	let channelType = $state('rectangular');
	let isVisible = $state(true);
	let sd = $state(defaultSdigs);
	let sdigs = $derived(sd);
	// let sdigs = $state(defaultSdigs);
	let wd = $state(defaultWdigs);
	let wdigs = $derived(wd < sdigs ? sdigs : wd);
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
			and answers (or {@html ki(`${sd + 1}`)} significant digits if the first non-zero digit is a {@html ki(
				`1`
			)}, e.g. {@html ki(`0.234`)} but {@html ki(`0.1234`)}). Interim calculations are to {@html ki(
				`${defaultWdigs}`
			)} significant digits (or
			{@html ki(`${wd + 1}`)} in the case of a leading
			{@html ki(`1`)}) to avoid the accumulation of rounding errors. You can modify these default
			values here:
		</p>
	</section>
{/if}

<style lang="scss">
	section {
		padding-inline: 3em;
		p {
			font-size: 110%;
			margin-block: 1em;
			span {
				font-weight: bold;
				letter-spacing: -0.03em;
			}
		}
	}
</style>
