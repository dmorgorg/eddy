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
export const triY = $state({
	zl: 1.5,
	zr: 0.75,
	y: 1.75,
	s: 0.1,
	n: 0.013,
	g: 9.81
})
export const triQ = $state({
	zl: 0.85,
	zr: 1.25,
	Q: 1.5,
	s: 0.1,
	n: 0.013,
	g: 9.81
})
