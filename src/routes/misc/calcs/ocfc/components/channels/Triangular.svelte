<script>
	import { digits } from '../../digits.svelte.js'
	import Intro from '../Intro.svelte'
	import YorQ from '../YorQ.svelte'
	import TriangularQ from './TriangularQ.svelte'
	import TriangularY from './TriangularY.svelte'
	// let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits;
	let yorq = 'rectangularQ'
	let channelType = 'rectangular'
</script>

<Intro {channelType} />

{#if !digits.isIntroVisible}
	<YorQ bind:yorq {channelType} />
	<div class:hide={yorq !== 'rectangularY'}>
		<TriangularY />
	</div>
	<div class:hide={yorq !== 'rectangularQ'}>
		<TriangularQ />
	</div>
{/if}

<style>
	.hide {
		display: none !important;
	}
</style>
