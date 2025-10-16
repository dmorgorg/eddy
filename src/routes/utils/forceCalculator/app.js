// @ts-nocheck
import { forces, maxForces, minForces, errors } from './state.svelte';
import updateCanvas from './canvas';

export const addForce = () => {
	if (forces.length >= maxForces) {
		return;
	}
	// randomise the initial direction, away from existing forces for better optics
	let max = { angle: 0, dir: 0 };
	/**
	 * @type {number[]}
	 */
	let directions = [];
	let index = 0;
	// load directions into an array, normalizing negative values
	forces.forEach(() => {
		directions.push(
			forces[index].direction >= 0 ? forces[index].direction : 360 + forces[index].direction
		);
		index++;
	});
	// don't sort numbers alphabetically, i.e., 1, 1000, 2, 3, ...
	directions.sort(function (a, b) {
		return a - b;
	});

	// edge case where max spacing might cross, or reach, the positive x-axis
	max.angle = 360 - directions[directions.length - 1] + directions[0];
	max.dir = (directions[directions.length - 1] + max.angle / 2) % 360;
	index = 0;
	directions.forEach(() => {
		if (directions[index + 1] - directions[index] > max.angle) {
			max.angle = directions[index + 1] - directions[index];
			max.dir = directions[index] + max.angle / 2;
		}
		// console.log(max);
		index++;
	});

	// console.log(directions);
	// console.log(max);

	forces.push({ label: '', direction: max.dir, magnitude: 0 });
	updateCanvas();
};

// @ts-ignore
export const handleRowDelete = (i) => {
	if (forces.length <= minForces - 1) {
		forces[i].label = '';
		forces[i].direction = 0;
		forces[i].magnitude = 0;
	} else {
		forces.splice(i, 1);
		updateCanvas();
	}
};

export const calculateEquilibrium = () => {
	let index = 0;
	let unknownIndices = [];
	let knownForces = [];
	forces.forEach((f) => {
		if (f.magnitude === 0) {
			unknownIndices.push(index);
		} else {
			knownForces.push({ direction: f.direction, magnitude: f.magnitude, index });
		}
		index++;
	});

	if (unknownIndices.length === 0 || unknownIndices.length > 2) {
		errors.wrongNumberOfUnknownsError[1] = true;
		return;
	} else {
		errors.wrongNumberOfUnknownsError[1] = false;
	}

	let sumFx = 0;
	let sumFy = 0;

	knownForces.forEach((f) => {
		const rad = (f.direction * Math.PI) / 180;
		sumFx += f.magnitude * Math.cos(rad);
		sumFy += f.magnitude * Math.sin(rad);
	});

	if (unknownIndices.length === 1) {
		const unknownIndex = unknownIndices[0];
		let unknownFx = -sumFx;
		let unknownFy = -sumFy;
		let unknownMagnitude = Math.sqrt(unknownFx * unknownFx + unknownFy * unknownFy);
		console.log(unknownMagnitude);
	}
};
