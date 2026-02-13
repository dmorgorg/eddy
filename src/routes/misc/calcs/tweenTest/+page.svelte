<!-- https://www.youtube.com/watch?v=O_RWL02wgTs -->
<script>
	// @ts-nocheck

	import { RectangleBTween } from './RectangleBTween.svelte.js'
	const progress = new RectangleBTween({ x: 0, y: 100 })
</script>

<button onclick={() => progress.to({ x: 100, y: 200 })}>
	x: {progress.value.x.toFixed()}
	y: {progress.value.y.toFixed()}
</button>
