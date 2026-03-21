<script>
	import { ki } from '$lib/utilities'
	let { yorq = $bindable(), channelType } = $props()
	// svelte-ignore state_referenced_locally
	let y = channelType + 'Y'
	// svelte-ignore state_referenced_locally
	let q = channelType + 'Q'
</script>

<section class="radios">
	<label for="" class="yQLayout">
		<input type="radio" name="yorq" bind:group={yorq} value={y} />
		<span class="radio__label">Specify {@html ki(`y`)}</span>
	</label>
	<label for="" class="yQLayout">
		<input type="radio" name="yorq" bind:group={yorq} value={q} />
		<span class="radio__label">Specify {@html ki(`Q`)}</span>
	</label>
</section>

<style lang="scss">
	.radios {
		display: flex;
		font-size: 120;
		gap: 3em;
		margin-bottom: 1rem;
		margin-inline: auto;
		margin-top: -1.5rem;
		width: fit-content;

		.yQLayout {
			display: flex;
			gap: 0.25rem;
			margin-bottom: -1em;
		}

		input[type='radio'] {
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			border: none;
			background-color: inherit;
			position: absolute;
		}

		label input[type='radio'] + *::before {
			content: '';
			color: white;
			display: inline-block;
			vertical-align: middle;
			width: 1.5em;
			height: 1.5em;
			margin-right: 0.4em;
			border-radius: 3px;
			margin-bottom: 0.25em;
			border-style: solid;
			border-width: 1px;
			border-color: black;
			box-shadow: 1px 1px 2px #c1cdcd;
		}

		label input[type='radio']:checked + *::before {
			border-color: black;
			background: var(--primaryColor);
			border-width: 1px;
		}
	}
</style>
