<script>
	import { fly } from 'svelte/transition';
	import { ki } from '$lib/utils';
</script>

Either flow depth, {@html ki(`y`)}, in metres ({@html ki(`\\mathsf{m}`)}) or volume flow,
{@html ki(`Q`)}, in cubic metres per second ({@html ki(`\\mathsf{m^3\\!/s}`)}) must be specified.
<br />But not both.
