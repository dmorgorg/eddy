/**
 * Snap coordinates to pixel boundaries for crisp lines
 * For odd line widths, snap to half-pixel (x.5)
 * For even line widths, snap to whole pixel
 * @param {number} value - The coordinate value to snap
 * @param {number} lineWidth - The width of the line being drawn
 * @returns {number} The snapped coordinate
 */
export function snap(value, lineWidth) {
	if (lineWidth % 2 === 1) {
		// Odd width: snap to half-pixel
		return Math.round(value) + 0.5;
	} else {
		// Even width: snap to whole pixel
		return Math.round(value);
	}
}

/**
 * Draw an arrowhead at a specific point with a given angle
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - X coordinate of the arrow tip
 * @param {number} y - Y coordinate of the arrow tip
 * @param {number} angle - Angle of the arrow in radians
 * @param {number} size - Size of the arrowhead
 */
export function drawArrowHead(ctx, x, y, angle, size = 8) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(-size, -size / 2);
	ctx.lineTo(-size, size / 2);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

/**
 * Draw a line segment with arrow heads at one or both ends
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x1 - Starting X coordinate
 * @param {number} y1 - Starting Y coordinate
 * @param {number} x2 - Ending X coordinate
 * @param {number} y2 - Ending Y coordinate
 * @param {boolean} arrowStart - Whether to draw an arrow at the start
 * @param {boolean} arrowEnd - Whether to draw an arrow at the end
 * @param {number} arrowSize - Size of the arrowheads
 * @param {number} lineWidth - Width of the line (default: 2)
 */
export function drawDirectedLineSegment(
	ctx,
	x1,
	y1,
	x2,
	y2,
	arrowStart = true,
	arrowEnd = true,
	arrowSize = 8,
	lineWidth = 2
) {
	// Calculate angle of the line
	const angle = Math.atan2(y2 - y1, x2 - x1);

	// Calculate start and end points accounting for arrow sizes
	const dx = x2 - x1;
	const dy = y2 - y1;
	const length = Math.sqrt(dx * dx + dy * dy);
	const unitX = dx / length;
	const unitY = dy / length;

	const startX = x1 + (arrowStart ? unitX * arrowSize : 0);
	const startY = y1 + (arrowStart ? unitY * arrowSize : 0);
	const endX = x2 - (arrowEnd ? unitX * arrowSize : 0);
	const endY = y2 - (arrowEnd ? unitY * arrowSize : 0);

	// Draw the line
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();

	// Draw arrowheads
	if (arrowStart) {
		const startAngle = angle + Math.PI;
		drawArrowHead(ctx, x1, y1, startAngle, arrowSize);
	}
	if (arrowEnd) {
		drawArrowHead(ctx, x2, y2, angle, arrowSize);
	}
}
