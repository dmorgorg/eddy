// @ts-nocheck
import { forces } from './state.svelte';

export default function updateCanvas() {
	const canvas = document.getElementById('force-canvas');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	ctx.scale(dpr, dpr);

	const width = rect.width;
	const height = rect.height;
	const centerX = width / 2;
	const centerY = height / 2;
	const originRadius = 5;

	ctx.clearRect(0, 0, width, height);

	// Draw center point
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(centerX, centerY, 2 * originRadius, 0, Math.PI * 2);
	ctx.fill();

	forces.forEach((force) => {
		const angleRad = (force.direction * Math.PI) / 180;
		const length = width / 3;
		const startX = centerX + length * 0.125 * Math.cos(angleRad);
		const startY = centerY - length * 0.125 * Math.sin(angleRad);
		const endX = centerX + length * Math.cos(angleRad);
		const endY = centerY - length * Math.sin(angleRad);

		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.strokeStyle = force.magnitude > 0 ? 'green' : 'red';

		const arrowSize = 20;
		const arrowAngle = 0.3;
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();

		if (force.magnitude > 0) {
			// draw force line segment
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.closePath();
			ctx.stroke();
			// draw direction arrow
			ctx.moveTo(endX, endY);
			ctx.lineTo(
				endX - arrowSize * Math.cos(angleRad - arrowAngle),
				endY + arrowSize * Math.sin(angleRad - arrowAngle)
			);
			ctx.lineTo(
				endX - arrowSize * Math.cos(angleRad + arrowAngle),
				endY + arrowSize * Math.sin(angleRad + arrowAngle)
			);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
			// draw label
			const labelOffset = 25;
			const labelX = centerX + (length + labelOffset) * Math.cos(angleRad);
			const labelY = centerY - (length + labelOffset) * Math.sin(angleRad);

			ctx.fillStyle = ctx.strokeStyle;
			ctx.font = '25px monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(`${force.label}`, labelX, labelY);
		} else if (force.magnitude < 0) {
			const startX = centerX + length * 0.1625 * Math.cos(angleRad);
			const startY = centerY - length * 0.1625 * Math.sin(angleRad);

			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.closePath();
			ctx.stroke();

			ctx.moveTo(startX, startY);
			ctx.lineTo(
				startX - arrowSize * Math.cos(angleRad - Math.PI - arrowAngle),
				startY + arrowSize * Math.sin(angleRad - Math.PI - arrowAngle)
			);
			// ctx.lineTo(
			// 	startX - arrowSize * Math.cos(angleRad - Math.PI + arrowAngle),
			// 	startY + arrowSize * Math.sin(angleRad - Math.PI + arrowAngle)
			// );
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			// draw label
			const labelOffset = 25;
			const labelX = centerX + (length + labelOffset) * Math.cos(angleRad);
			const labelY = centerY - (length + labelOffset) * Math.sin(angleRad);

			ctx.fillStyle = ctx.strokeStyle;
			ctx.font = '25px monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(`${force.label}`, labelX, labelY);
		} else {
			ctx.strokeStyle = 'darkcyan';
			ctx.fillStyle = 'darkcyan';
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.closePath();
			ctx.stroke();

			ctx.moveTo(endX, endY);
			ctx.lineTo(
				endX - arrowSize * Math.cos(angleRad - arrowAngle),
				endY + arrowSize * Math.sin(angleRad - arrowAngle)
			);
			ctx.lineTo(
				endX - arrowSize * Math.cos(angleRad + arrowAngle),
				endY + arrowSize * Math.sin(angleRad + arrowAngle)
			);

			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			// Draw label
			const labelOffset = 25;
			const labelX = centerX + (length + labelOffset) * Math.cos(angleRad);
			const labelY = centerY - (length + labelOffset) * Math.sin(angleRad);
			ctx.fillStyle = ctx.strokeStyle;
			ctx.font = '25px monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(`${force.label}`, labelX, labelY);

			const labX = (startX + endX) / 2;
			const labY = (startY + endY) / 2;
			ctx.fillStyle = 'lightcyan';
			ctx.lineWidth = 8;
			ctx.font = 'bold 40px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.shadowColor = 'black';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 10;
			ctx.fillText(`?`, labX, labY);
			// ctx.fillText(`?`, labX, labY);
			ctx.fillText(`?`, labX, labY); // multiply the shadow
			ctx.shadowColor = 'white';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
		}
	});
}
