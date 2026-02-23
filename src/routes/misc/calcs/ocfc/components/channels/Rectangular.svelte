<script>
	import { digits } from '../../digits.svelte.js'
	import Intro from '../Intro.svelte'
	import YorQ from '../YorQ.svelte'
	import RectangularQ from './RectangularQ.svelte'
	import RectangularY from './RectangularY.svelte'
	// let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits;
	let yorq = 'rectangularQ'
	let channelType = 'rectangular'
</script>

<Intro {channelType} />

{#if !digits.isIntroVisible}
	<YorQ bind:yorq {channelType} />
	<div class:hide={yorq !== 'rectangularY'}>
		<RectangularY />
	</div>
	<div class:hide={yorq !== 'rectangularQ'}>
		<RectangularQ />
	</div>
{/if}

<style>
	.hide {
		display: none !important;
	}
</style>
