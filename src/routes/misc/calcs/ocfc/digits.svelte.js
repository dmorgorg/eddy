// https://svelte.dev/docs/svelte/stores
export const digits = $state({
	sdigs: 3,
	wdigs: 5,
	extraForSdigs: true,
	extraForWdigs: false,
	isIntroVisible: false
});
