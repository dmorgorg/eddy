<script>
	import { digits } from '../digits.svelte.js';
</script>

hello testy
{digits.sdigs}
<!-- {++digits.sdigs} -->
<input type="number" bind:value={digits.sdigs} />
{digits.sdigs}
<!-- {++digits.sdigs} -->
