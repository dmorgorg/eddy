// https://svelte.dev/docs/svelte/stores
export const rectY = $state({
	base: 2.25,
	depth: 2.25,
	slope: 0.1,
	n: 0.013,
	g: 9.81
})
export const rectQ = $state({
	base: 4,
	Q: 1.25,
	slope: 0.1,
	n: 0.013,
	g: 9.81
})
