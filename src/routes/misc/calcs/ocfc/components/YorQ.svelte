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
		<input type="radio" name="Yorq" bind:group={yorq} value={y} />
		<span class="radio__label">Specify {@html ki(`y`)}</span>
	</label>
	<label for="" class="yQLayout">
		<input type="radio" name="yorQ" bind:group={yorq} value={q} />
		<span class="radio__label">Specify {@html ki(`Q`)}</span>
	</label>
</section>

<style lang="scss">
	.radios {
		// border: 1px solid black;
		display: flex;
		font-size: 120;
		gap: 3em;
		margin-bottom: 1rem;
		margin-inline: auto;
		margin-top: -1.5rem;
		width: fit-content;
		// .radio__label {
		// 	font-weight: bold;
		// }
		.yQLayout {
			display: flex;
			// align-items: flex-end;
			gap: 0.25rem;
			// background: green;
			margin-bottom: -1em;
		}

		input[type='radio'] {
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			border: none;
			background-color: inherit;
			// box-shadow: 2px 2px 4px #c1cdcd;
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
			// border-color: var(--primaryColor);
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
