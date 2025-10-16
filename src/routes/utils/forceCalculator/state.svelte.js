// State

export const forces = $state([
	{ label: 'AB', direction: 0, magnitude: 10 },
	{ label: 'AC', direction: 240, magnitude: -10 },
	{ label: 'BC', direction: 60, magnitude: 20 },
	{ label: 'XY', direction: -75, magnitude: -10 },
	{ label: 'RS', direction: 300, magnitude: -10 }
]);

export const errors = $state({
	wrongNumberOfUnknownsError: ['Wrong number of unknown magnitudes specified!', false]
});

export const maxForces = 7;
export const minForces = 3;
