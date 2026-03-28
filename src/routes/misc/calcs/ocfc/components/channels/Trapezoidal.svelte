<script>
	import { digits } from '../../digits.svelte.js'
	import Intro from '../Intro.svelte'
	import YorQ from '../YorQ.svelte'
	import TrapezoidalQ from './TrapezoidalQ.svelte'
	import TrapezoidalY from './TrapezoidalY.svelte'
	// let { sdigs, wdigs, extraForSdigs, extraForWdigs } = digits;
	let yorq = 'trapezoidalQ'
	let channelType = 'trapezoidal'
</script>

<Intro {channelType} />

{#if !digits.isIntroVisible}
	<YorQ bind:yorq {channelType} />
	<div class:hide={yorq !== 'trapezoidalY'}>
		<TrapezoidalY />
	</div>
	<div class:hide={yorq !== 'trapezoidalQ'}>
		<TrapezoidalQ />
	</div>
{/if}
