<!-- https://www.youtube.com/watch?v=O_RWL02wgTs -->
<script>
	// @ts-nocheck

	import { RectangleBTween } from './RectangleBTweenX.svelte.js'
	const progress = new RectangleBTween(0)
</script>

<button onclick={animate}>
	{progress.value.toFixed()}
</button>
